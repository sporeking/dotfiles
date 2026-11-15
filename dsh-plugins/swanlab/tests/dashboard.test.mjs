import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

function harness(){
 let definition,Panel,states=[],cursor=0;
 const effects=[];
 const react={Fragment:'fragment',createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),useState(initial){const i=cursor++;if(!(i in states))states[i]=typeof initial==='function'?initial():initial;return [states[i],value=>{states[i]=typeof value==='function'?value(states[i]):value;}];},useRef:()=>({current:null}),useEffect:fn=>effects.push(fn)};
 const storage=new Map();
 vm.runInNewContext(fs.readFileSync(new URL('../client/index.js',import.meta.url),'utf8'),{window:{__ModuleLoader__:{load:d=>definition=d}},document:{createElement:()=>({remove(){}}),head:{appendChild(){}}},location:{hostname:'localhost'},URL,URLSearchParams,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)}});
 definition.factory(()=>react).apply({effect:fn=>fn(),slots:{inject:(_,fn)=>fn(),register:(_,fn)=>{Panel=fn;return()=>{};}},sidebarRightTabs:{register:()=>()=>{}}});
 function render(component,props,initial){if(initial)states=initial;cursor=0;return component(props);}
 const metrics=['train/loss','train/accuracy','eval/dev/success_rate','__swanlab__.cpu.pct'].map(key=>({key}));
 const tree=render(Panel,{useTabInfo:()=>({tab:{visible:true}})},[[],'owner/project',[{id:'run'}],'run',{metrics},'metrics','', '',false,0,false,'']);
 const dashboard=walk(tree).find(n=>n.type?.name==='Dashboard');
 states=[];effects.length=0;
 return {render:()=>render(dashboard.type,dashboard.props),renderComponent:render,Panel,storage,effects};
}
function walk(node){return !node||typeof node!=='object'?[]:[node,...(node.children||[]).flatMap(walk)];}
function group(tree,name){return walk(tree).find(n=>n.props?.['data-metric-group']===name);}
function button(tree,text){return walk(tree).find(n=>n.type==='button'&&n.children.includes(text));}

test('chart axes stay at readable pixel size in narrow cards and constant values get distinct ticks',()=>{
 const app=harness(),tree=app.render(),card=walk(tree).find(n=>n.type?.name==='MetricCard');
 const cardTree=app.renderComponent(card.type,card.props,[true,{points:[{x:0,y:2.7}]},'',false]);
 const chart=walk(cardTree).find(n=>n.type?.name==='Chart');
 const chartTree=app.renderComponent(chart.type,chart.props,[null,280]);
 const svg=walk(chartTree).find(n=>n.type==='svg');assert.equal(svg.props.viewBox,'0 0 280 240');assert.equal(svg.props.style.height,240);
 const labels=walk(svg).filter(n=>n.type==='text');assert.ok(labels.every(n=>n.props.fontSize>=13));
 assert.equal(new Set(labels.slice(0,3).map(n=>n.children[0])).size,3);
});

test('HTML media cards use authenticated local asset URL and isolate the embedded document',()=>{
 const app=harness();
 const panel=app.renderComponent(app.Panel,{useTabInfo:()=>({tab:{visible:true}})},[[],'owner/project',[{id:'run'}],'run',{},'media','', '',false,0,false,'']);
 const browser=walk(panel).find(n=>n.type?.name==='MediaBrowser');
 const browserTree=app.renderComponent(browser.type,browser.props,[{metrics:[{key:'analysis/full_report'}],meta:{}},'','']);
 const card=walk(browserTree).find(n=>n.type?.name==='MediaCard');
 const cardTree=app.renderComponent(card.type,card.props,[true,'','0',{step:1000,steps:[1000],items:[{item:0,type:'html',available:true}]},'']);
 const frame=walk(cardTree).find(n=>n.type?.name==='MediaFrame');assert.ok(frame.props.src.startsWith('/swanlab-panel/api/asset?'));assert.ok(frame.props.src.includes('step=1000'));
 const frameTree=app.renderComponent(frame.type,frame.props,[false]);const iframe=walk(frameTree).find(n=>n.type==='iframe');
 assert.equal(iframe.props.sandbox,'allow-scripts allow-downloads');assert.ok(!iframe.props.sandbox.includes('allow-same-origin'));
});

test('dashboard shows simultaneous metric cards in prefix groups, with system group initially folded',()=>{
 const app=harness(),tree=app.render();
 assert.equal(walk(tree).filter(n=>n.type?.name==='MetricCard').length,3);
 assert.equal(group(tree,'train').children[0].props['aria-expanded'],true);
 assert.equal(group(tree,'系统监控').children[0].props['aria-expanded'],false);
 assert.ok(group(tree,'eval/dev'));
});

test('group and card folding, expand all, collapse all, and search work together',()=>{
 const app=harness();let tree=app.render();
 group(tree,'train').children[0].props.onClick();tree=app.render();
 assert.equal(walk(tree).filter(n=>n.type?.name==='MetricCard').length,1);
 button(tree,'展开全部').props.onClick();tree=app.render();
 assert.equal(walk(tree).filter(n=>n.type?.name==='MetricCard').length,4);
 let card=walk(tree).find(n=>n.props?.metric==='train/loss');card.props.onToggle();tree=app.render();
 assert.equal(walk(tree).find(n=>n.props?.metric==='train/loss').props.open,false);
 button(tree,'收起全部').props.onClick();tree=app.render();
 assert.equal(walk(tree).filter(n=>n.type?.name==='MetricCard').length,0);
 button(tree,'展开全部').props.onClick();tree=app.render();
 walk(tree).find(n=>n.props?.['aria-label']==='筛选指标').props.onChange({target:{value:'loss'}});tree=app.render();
 assert.equal(walk(tree).filter(n=>n.type?.name==='MetricCard').length,1);
 assert.equal(walk(tree).find(n=>n.type?.name==='MetricCard').props.metric,'train/loss');
 app.effects.forEach(fn=>fn());assert.ok([...app.storage.keys()].includes('dsh-swanlab-layout:owner/project/run'));
});
