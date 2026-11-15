import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

test('browser plugin registers native sidebar after its slot declaration, with disposable UI only',()=>{
 let definition;const slots=[],tabs=[],effects=[],styles=[];
 const sandbox={window:{__ModuleLoader__:{load:d=>{definition=d;}}},document:{createElement:()=>({remove(){this.removed=true;}}),head:{appendChild:s=>styles.push(s)}}};
 vm.runInNewContext(fs.readFileSync(new URL('../client/index.js',import.meta.url),'utf8'),sandbox);
 const plugin=definition.factory(name=>{assert.equal(name,'react');return {createElement:(type,props,...children)=>({type,props,children})};});
 const opened=[];
 plugin.apply({effect(fn){const cleanup=fn();if(cleanup)effects.push(cleanup);},slots:{inject:(name,fn)=>{assert.equal(name,'sidebar.right.pane.tab');effects.push(fn());},register:(seat,component)=>{slots.push({seat,component});return()=>{};}},sidebarRightTabs:{register:tab=>{tabs.push(tab);return()=>{};}},sidebarRight:{openTab:id=>opened.push(id)},tools:{register(){assert.fail('No Agent tools');}}});
 assert.equal(tabs[0].kind,'swanlab');assert.equal(tabs[0].guide[0].title(),'SwanLab 实验');
 assert.equal(slots.length,1);
 assert.ok(slots.some(x=>x.seat.name==='sidebar.right.pane.tab'));
 effects.reverse().forEach(fn=>fn());assert.equal(styles[0].removed,true);
});

test('browser dependencies refer to installed DSH modules',()=>{
 const pkg=JSON.parse(fs.readFileSync(new URL('../package.json',import.meta.url),'utf8'));
 for(const name of pkg.dsh.client.inject)assert.ok(fs.existsSync('/usr/lib/node_modules/@deepseek-ai/dsh/node_modules/'+name+'/package.json'),name);
});
