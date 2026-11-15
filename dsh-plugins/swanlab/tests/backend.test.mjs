import test from 'node:test';
import assert from 'node:assert/strict';
import { apply, createQuery, defaults, inject } from '../src/index.js';

function response() { return { status: 0, headers: {}, setHeader(k,v) { this.headers[k]=v; }, writeHead(s,h) { this.status=s; Object.assign(this.headers,h); }, end(body) { this.raw=body; this.body=this.headers['Content-Type']?.startsWith('application/json') ? JSON.parse(body) : body; } }; }
async function harness(admission) {
  const routes=[], cleanup=[];
  const ctx={ connection:{admit:()=>admission}, webServer:{register:r=>{routes.push(r);return ()=>{};}}, effect(fn){const dispose=fn();if(dispose)cleanup.push(dispose);} };
  await apply(ctx);
  assert.equal(routes[0].path,'/swanlab-panel/api');
  return {handler:routes[0].handler,close(){cleanup.forEach(f=>f());}};
}
test('plugin exports exact required services',()=>assert.deepEqual(inject,['webServer','connection']));
test('visualization plugin never registers Agent tools or prompts', async()=>{
 const disposers=[];
 const ctx={connection:{admit:()=>({rejection:401})},webServer:{register:()=>()=>{}},tools:{register(){assert.fail('Agent tool registration is forbidden');}},systemPrompt:{add(){assert.fail('Prompt injection is forbidden');}},effect(fn){const dispose=fn();if(dispose)disposers.push(dispose);}};
 await apply(ctx);disposers.forEach(fn=>fn());
});
test('HTTP authentication owner gate precedes all route processing',async()=>{
  for (const [admission,status] of [[{rejection:401},401],[{peer:{principal:{kind:'guest'}}},403]]) {
    const h=await harness(admission),res=response();
    await h.handler({method:'GET',url:'/swanlab-panel/api/asset?project=demo%2Fexample&run=example-run&key=analysis%2Ffull_report&step=1000'},res);
    assert.equal(res.status,status);assert.equal(res.body.ok,false);h.close();
  }
});
test('owner gets method, endpoint and parameter validation without upstream access',async()=>{
 const h=await harness({peer:{principal:{kind:'owner'}}});
 for(const [method,url,status] of [['POST','/swanlab-panel/api/projects',405],['GET','/swanlab-panel/api/delete',404],['GET','/swanlab-panel/api/projects?host=http://evil',400],['GET','/swanlab-panel/api/projects?action=run',400],['GET','/swanlab-panel/api/projects?limit=10&limit=20',400]]) {
  const res=response();await h.handler({method,url},res);assert.equal(res.status,status,url);assert.equal(res.headers['Cache-Control'],'no-store');
 }
 h.close();
});
test('Python bridge rejects unsafe inputs and keeps errors generic',async()=>{
 const q=createQuery();
 for(const args of [{action:'runs',project:'../../etc'},{action:'series',project:'demo/example',run:'../x',key:'loss'},{action:'projects',limit:2}]) {
  const value=await q(args);assert.equal(value.ok,false);assert.equal(value.status,400);assert.ok(!JSON.stringify(value).includes('Traceback'));
 }
 q.close();
});
test('unavailable Python process returns safe error',async()=>{
 const q=createQuery({pythonPath:'/does-not-exist'});const r=await q({action:'projects'});assert.equal(r.error.code,'BRIDGE_ERROR');assert.equal(r.status,503);q.close();
});
test('asset parameters reject arbitrary URLs, paths, missing steps and item bounds', async()=>{
 const h=await harness({peer:{principal:{kind:'owner'}}});
 const base='/swanlab-panel/api/asset?project=demo%2Fexample&run=example-run&key=analysis%2Ffull_report';
 try { for(const tail of ['', '&step=1000&url=http://evil', '&step=1000&item=-1', '&step=1000&item=2000', '&step=1000&item=0&item=1', '&step=oops', '&step=1000&envFile=/etc/passwd']) {const res=response();await h.handler({method:'GET',url:base+tail},res);assert.equal(res.status,400,tail);} } finally {h.close();}
});
test('optional report fixture and safe media contract', {skip:process.env.SWANLAB_LIVE_TEST!=='1'}, async()=>{
 const h=await harness({peer:{principal:{kind:'owner'}}}), q=createQuery();
 const ids={project:process.env.SWANLAB_LIVE_PROJECT || 'demo/example',run:process.env.SWANLAB_LIVE_RUN || 'example-run',key:'analysis/full_report',step:1000};
 try {
  const media=await q({action:'media',...ids});assert.equal(media.ok,true);assert.equal(media.data.step,1000);assert.equal(media.data.items[0].type,'html');assert.equal(media.data.items[0].item,0);assert.ok(!JSON.stringify(media).includes('url'));
  const res=response();await h.handler({method:'GET',url:'/swanlab-panel/api/asset?'+new URLSearchParams({...ids,item:0})},res);
  assert.equal(res.status,200);assert.equal(res.headers['Content-Type'],'text/html; charset=utf-8');assert.ok(res.raw.length>24000);assert.match(res.raw.toString(),/<html/i);assert.match(res.raw.toString().trim(),/<\/html>$/i);
  for (const [key,item,type] of [['analysis/representative_cases',6,'html'],['analysis/choice_accuracy',0,'image'],['analysis/provenance',0,'text']]) {
   const asset=await q({action:'asset',...ids,key,item});assert.equal(asset.ok,true);assert.equal(asset.data.type,type);assert.ok(asset.data.bytes>0);assert.equal(Buffer.from(asset.data.bodyBase64,'base64').length,asset.data.bytes);
  }
  const missing=await q({action:'asset',...ids,item:1999});assert.equal(missing.status,404);
  assert.match(res.headers['Content-Security-Policy'],/sandbox allow-scripts allow-downloads;/);assert.ok(!res.headers['Content-Security-Policy'].includes('allow-same-origin'));assert.match(res.headers['Content-Security-Policy'],/connect-src 'none'/);assert.equal(res.headers['Cache-Control'],'no-store');
 } finally {h.close();q.close();}
});
test('real projects and metrics read-only integration', {skip:process.env.SWANLAB_LIVE_TEST!=='1'}, async()=>{
 const q=createQuery();
 try {
  const p=await q({action:'projects',limit:10});assert.equal(p.ok,true);assert.ok(p.data.items.some(x=>x.path===(process.env.SWANLAB_LIVE_PROJECT || 'demo/example')));
  const cached=await q({action:'projects',limit:10});assert.equal(cached.meta.cached,true);
  for(const project of [process.env.SWANLAB_LIVE_PROJECT || 'demo/example']) {
   const runs=await q({action:'runs',project,limit:10});assert.equal(runs.ok,true);assert.ok(runs.data.items.length);
   const run=runs.data.items[0].id;
   const detail=await q({action:'run',project,run});assert.equal(detail.ok,true);assert.ok('config' in detail.data);
   const columns=await q({action:'columns',project,run,limit:10});assert.equal(columns.ok,true);assert.ok(columns.data.items.length);
   assert.ok(columns.meta.hasMore);assert.ok(columns.meta.nextCursor);
   const next=await q({action:'columns',project,run,limit:10,cursor:columns.meta.nextCursor});assert.equal(next.ok,true);assert.notEqual(next.data.items[0].key,columns.data.items[0].key);
   const s=await q({action:'series',project,run,key:columns.data.items[0].key,limit:100});assert.equal(s.ok,true);assert.ok(s.data.points.length>0);assert.ok(s.data.points.every(x=>typeof x.value==='number'));assert.equal(s.meta.fullHistory,false);
   const logs=await q({action:'logs',project,run,limit:10});assert.equal(logs.ok,true);
   const allKeys=await q({action:'columns',project,run,limit:100});assert.equal(allKeys.ok,true);
   const training=allKeys.data.items.find(x=>!x.key.startsWith('__swanlab__'));assert.ok(training);
   const trainingSeries=await q({action:'series',project,run,key:training.key,limit:100});assert.equal(trainingSeries.ok,true);assert.ok(trainingSeries.data.points.length);
   const media=await q({action:'columns',project,run,metricType:'MEDIA',limit:10});assert.equal(media.ok,true);
   if(media.data.items.length) { const asset=await q({action:'media',project,run,key:media.data.items[0].key,limit:10});assert.equal(asset.ok,true);assert.ok(Array.isArray(asset.data.items)); }
  }
 } finally {q.close();}
});
