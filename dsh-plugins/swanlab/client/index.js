window.__ModuleLoader__.load({
  id: 'dsh-swanlab',
  factory: require => {
    const R = require('react');
    const { createElement: h, useState, useEffect, useRef } = R;
    const css = `.sw-panel{height:100%;overflow:auto;padding:14px;box-sizing:border-box;font:13px/1.55 system-ui;color:var(--semi-color-text-0,inherit)}.sw-panel *{box-sizing:border-box}.sw-panel select,.sw-panel input,.sw-panel button{font:inherit;color:inherit;border:1px solid var(--semi-color-border,#aaa5);background:var(--semi-color-bg-1,transparent);border-radius:7px;padding:6px 9px;max-width:100%}.sw-panel button{cursor:pointer}.sw-panel button:disabled{opacity:.5;cursor:default}.sw-panel select,.sw-panel input{width:100%}.sw-row{display:flex;align-items:center;gap:8px;margin:8px 0;flex-wrap:wrap}.sw-row>*{min-width:0}.sw-row select{flex:1}.sw-muted{opacity:.65;font-size:12px}.sw-run{display:block;text-align:left;width:100%;margin:6px 0;padding:9px!important}.sw-run[aria-pressed=true]{border-color:#3b82f6!important;background:#3b82f611!important}.sw-state{font-size:11px;float:right}.sw-error{color:#b45309;padding:10px;background:#f59e0b15;border-radius:7px;white-space:pre-wrap}.sw-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:12px 0}.sw-tabs button[aria-pressed=true]{color:#3b82f6;border-color:#3b82f6}.sw-panel pre{font:11px/1.6 ui-monospace,monospace;white-space:pre-wrap;overflow-wrap:anywhere;padding:10px;background:#8881;border-radius:8px;max-height:500px;overflow:auto}.sw-panel table{width:100%;border-collapse:collapse;font-size:12px}.sw-panel td,.sw-panel th{text-align:left;padding:7px 4px;border-bottom:1px solid #8883;overflow-wrap:anywhere}.sw-panel td:last-child{text-align:right;font-variant-numeric:tabular-nums}.sw-chart{border:1px solid #8883;border-radius:8px;padding:8px;margin-top:12px}.sw-chart svg{display:block;width:100%;height:240px;font-family:system-ui}.sw-chart-readout{font-size:13px;line-height:1.6;font-variant-numeric:tabular-nums}.sw-title{font-size:15px;font-weight:650}.sw-panel a{color:#3b82f6}.sw-native{width:100%;height:72vh;border:1px solid #8883;border-radius:8px}.sw-metric{padding:3px 0;overflow-wrap:anywhere}`;
    const list = v => Array.isArray(v) ? v : [];
    const fmt = v => typeof v === 'number' ? Number.isInteger(v) ? String(v) : Number(v.toPrecision(6)).toString() : v == null ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v);
    async function api(action, params = {}, signal) {
      const q = new URLSearchParams(Object.entries(params).filter(([,v]) => v !== '' && v != null));
      const response = await fetch(`/swanlab-panel/api/${action}?${q}`, { credentials: 'same-origin', signal });
      const value = await response.json();
      if (!response.ok || value.error) throw new Error(value.error?.message || value.error || `HTTP ${response.status}`);
      const data = value.data ?? value;
      const meta = value.meta ?? {};
      if (action === 'projects') return { projects: list(data.items ?? data.projects ?? data).map(p => ({ ...p, path: p.path ?? p.project ?? p.name, name: p.name ?? p.path })), meta };
      if (action === 'runs') return { runs: list(data.items ?? data.runs ?? data), meta };
      if (action === 'columns') return { metrics: list(data.items ?? data.columns ?? data), meta };
      if (action === 'series') return { points: list(data.points).map(p => ({ x: p.step, y: p.value })), truncated: meta.truncated || meta.sampled || meta.fullHistory === false, meta };
      if (action === 'logs') return { logs: data.items ?? data.logs ?? data, truncated: meta.truncated, meta };
      return { ...data, meta };
    }
    function axisFmt(value) {
      const abs=Math.abs(value);
      return abs>=1e6||(abs>0&&abs<.001)?value.toExponential(1):String(Number(value.toPrecision(4)));
    }
    function Chart({ points, label }) {
      const [hover,setHover]=useState(null),[width,setWidth]=useState(320),svg=useRef(null);
      const values=list(points).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
      useEffect(()=>{
        if(!svg.current)return;
        const observer=new ResizeObserver(entries=>setWidth(Math.max(1,Math.round(entries[0].contentRect.width))));
        observer.observe(svg.current);return()=>observer.disconnect();
      },[values.length>0]);
      if(!values.length)return h('div',{className:'sw-muted'},'没有可绘制的标量点。');
      const xs=values.map(p=>p.x),ys=values.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),min=Math.min(...ys),max=Math.max(...ys);
      const pad=min===max?(Math.abs(min)*.05||1):(max-min)*.06,y0=min-pad,y1=max+pad;
      const left=76,right=Math.max(left+1,width-16),top=18,bottom=184;
      const px=x=>x0===x1?(left+right)/2:left+(x-x0)/(x1-x0)*(right-left),py=y=>bottom-(y-y0)/(y1-y0)*(bottom-top);
      const picked=values[Math.min(hover??(values.length-1),values.length-1)];
      return h('div',{className:'sw-chart'},h('div',{className:'sw-chart-readout'},`step ${fmt(picked.x)} · ${fmt(picked.y)} · ${values.length} 个点`),
        h('svg',{ref:svg,viewBox:`0 0 ${width} 240`,style:{height:240},role:'img','aria-label':`${label} 指标曲线`,onMouseLeave:()=>setHover(null),onMouseMove:e=>{
          const r=e.currentTarget.getBoundingClientRect(),x=x0+(e.clientX-r.left-left)/(right-left)*(x1-x0);let best=0;
          values.forEach((p,i)=>{if(Math.abs(p.x-x)<Math.abs(values[best].x-x))best=i;});setHover(best);
        }},
          [0,.5,1].map((v,i)=>h('g',{key:i},h('line',{x1:left,x2:right,y1:top+v*(bottom-top),y2:top+v*(bottom-top),stroke:'currentColor',opacity:.18}),h('text',{x:left-10,y:top+v*(bottom-top),dominantBaseline:'middle',textAnchor:'end',fill:'currentColor',fontSize:13},axisFmt(y1-v*(y1-y0))))),
          h('polyline',{points:values.map(p=>`${px(p.x)},${py(p.y)}`).join(' '),fill:'none',stroke:'#3b82f6',strokeWidth:2,'vectorEffect':'non-scaling-stroke'}),
          h('circle',{cx:px(picked.x),cy:py(picked.y),r:4,fill:'#3b82f6'}),
          (x0===x1?[x0]:[x0,(x0+x1)/2,x1]).map((x,i,all)=>h('text',{key:i,x:px(x),y:209,textAnchor:all.length===1?'middle':i===0?'start':i===all.length-1?'end':'middle',fill:'currentColor',fontSize:13},axisFmt(x))),
          h('text',{x:(left+right)/2,y:233,textAnchor:'middle',fill:'currentColor',fontSize:14},'step')));
    }
    const dashboardCSS = `.sw-dashboard-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr));gap:12px;align-items:start}.sw-group{margin:14px 0}.sw-group-head,.sw-card-head{display:flex;align-items:center;gap:8px;width:100%;text-align:left!important}.sw-group-head{font-weight:650!important;margin-bottom:10px}.sw-card{min-width:0;border:1px solid #8883;border-radius:9px;overflow:hidden}.sw-card-head{border:0!important;border-radius:0!important;background:#88808!important}.sw-card-head span:nth-child(2){flex:1;overflow-wrap:anywhere}.sw-card-value{font-size:11px;opacity:.65;white-space:nowrap}.sw-card .sw-chart{margin:0;border:0}.sw-card-body{min-height:110px}.sw-card-body>.sw-muted,.sw-card-body>.sw-error{padding:12px}.sw-dashboard-tools{position:sticky;top:-14px;background:var(--semi-color-bg-0,#fff);z-index:1;padding:8px 0}.sw-empty{padding:16px 0}`;
    const seriesCache = new Map(), seriesQueue = [];
    let activeSeries = 0;
    function loadSeries(params, signal) {
      const id=JSON.stringify(params), cached=seriesCache.get(id);
      if(cached && Date.now()-cached.at<15000)return Promise.resolve(cached.value);
      return new Promise((resolve,reject)=>{
        seriesQueue.push({params,signal,id,resolve,reject});drainSeries();
      });
    }
    function drainSeries() {
      while(activeSeries<2 && seriesQueue.length){
        const item=seriesQueue.shift();
        if(item.signal.aborted){item.reject(new DOMException('Cancelled','AbortError'));continue;}
        activeSeries++;
        // Finish an active server read before starting another, even if its card was collapsed.
        api('series',item.params).then(value=>{
          if(seriesCache.size>=128)seriesCache.delete(seriesCache.keys().next().value);
          seriesCache.set(item.id,{at:Date.now(),value});item.resolve(value);
        },item.reject).finally(()=>{activeSeries--;drainSeries();});
      }
    }
    function MetricCard({project,run,metric,open,onToggle,tick,visible}) {
      const element=useRef(null),[near,setNear]=useState(false),[value,setValue]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false);
      useEffect(()=>{
        if(!element.current)return;
        const observer=new IntersectionObserver(entries=>setNear(entries[0].isIntersecting),{rootMargin:'250px'});
        observer.observe(element.current);return()=>observer.disconnect();
      },[]);
      useEffect(()=>{
        if(!open||!near||!visible)return;
        const c=new AbortController();setLoading(true);setError('');
        loadSeries({project,run,key:metric,limit:1000},c.signal).then(data=>{if(!c.signal.aborted)setValue(data);}).catch(e=>{if(!c.signal.aborted)setError(e.message);}).finally(()=>{if(!c.signal.aborted)setLoading(false);});
        return()=>c.abort();
      },[project,run,metric,tick,visible,near,open]);
      const last=value?.points?.filter(p=>Number.isFinite(p.y)).at(-1);
      return h('section',{className:'sw-card',ref:element,'data-metric':metric},
        h('button',{className:'sw-card-head','aria-expanded':open,'aria-label':`${open?'折叠':'展开'}指标 ${metric}`,onClick:onToggle},h('span',null,open?'▾':'▸'),h('span',null,metric),h('span',{className:'sw-card-value'},last?fmt(last.y):'')),
        open&&h('div',{className:'sw-card-body'},error?h('div',{className:'sw-error',role:'alert'},error):value?h(Chart,{points:value.points,label:metric}):h('p',{className:'sw-muted'},near?'读取曲线…':'滚动至此处加载曲线'),loading&&value&&h('span',{className:'sw-muted'},'更新中…')));
    }
    function metricGroup(key) {
      if(key.startsWith('__swanlab__'))return '系统监控';
      const parts=key.split('/');return parts.length>2?parts.slice(0,2).join('/'):parts.length>1?parts[0]:'其他指标';
    }
    function Dashboard({project,run,metrics,meta,onMore,tick,visible}) {
      const storageKey=`dsh-swanlab-layout:${project}/${run}`;
      const [filter,setFilter]=useState(''),[layout,setLayout]=useState(()=>{try{return JSON.parse(localStorage.getItem(storageKey))||{groups:{},cards:{}};}catch{return {groups:{},cards:{}};}});
      useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(layout));}catch{}},[layout,storageKey]);
      const keys=metrics.map(m=>typeof m==='string'?m:m.key), groups=new Map();
      for(const key of keys.filter(k=>k.toLowerCase().includes(filter.toLowerCase()))){const name=metricGroup(key);if(!groups.has(name))groups.set(name,[]);groups.get(name).push(key);}
      const entries=[...groups].sort(([a],[b])=>a==='系统监控'?1:b==='系统监控'?-1:a.localeCompare(b));
      function all(open){setLayout({groups:Object.fromEntries([...new Set(keys.map(metricGroup))].map(k=>[k,open])),cards:Object.fromEntries(keys.map(k=>[k,open]))});}
      return h('div',{className:'sw-dashboard'},h('div',{className:'sw-dashboard-tools'},
        h('input',{'aria-label':'筛选指标',placeholder:'搜索指标，例如 loss、success、GPU…',value:filter,onChange:e=>setFilter(e.target.value)}),
        h('div',{className:'sw-row'},h('button',{onClick:()=>all(true)},'展开全部'),h('button',{onClick:()=>all(false)},'收起全部'),h('span',{className:'sw-muted'},`${[...groups.values()].flat().length} / ${keys.length} 项指标`)),
        h('div',{className:'sw-muted'},'曲线为服务端采样，每图最多 1000 点；横轴为原始 step。')),
        !entries.length&&h('p',{className:'sw-muted sw-empty'},keys.length?'没有匹配的指标。':'暂无指标。'),
        entries.map(([name,items])=>{const expanded=layout.groups[name]??(name!=='系统监控'||!!filter);return h('section',{className:'sw-group',key:name,'data-metric-group':name},
          h('button',{className:'sw-group-head','aria-expanded':expanded,'aria-label':`${expanded?'折叠':'展开'}分组 ${name}`,onClick:()=>setLayout(v=>({...v,groups:{...v.groups,[name]:!expanded}}))},expanded?'▾':'▸',` ${name}`,h('span',{className:'sw-muted'},`${items.length} 项`)),
          expanded&&h('div',{className:'sw-dashboard-grid'},items.map(metric=>h(MetricCard,{key:metric,project,run,metric,tick,visible,open:layout.cards[metric]??true,onToggle:()=>setLayout(v=>({...v,cards:{...v.cards,[metric]:!(v.cards[metric]??true)}}))}))));}),
        meta?.hasMore&&h('button',{onClick:onMore},'加载更多指标'));
    }
    function MediaFrame({src,title}) {
      const [large,setLarge]=useState(false),dialog=useRef(null);
      useEffect(()=>{if(large)dialog.current?.showModal();else dialog.current?.close();},[large]);
      const frame=()=>h('iframe',{src,title,sandbox:'allow-scripts allow-downloads',referrerPolicy:'no-referrer',className:'sw-media-frame'});
      return h(R.Fragment,null,h('div',{className:'sw-row'},h('button',{onClick:()=>setLarge(true)},'放大阅读'),h('a',{href:src,target:'_blank',rel:'noopener noreferrer'},'独立打开 ↗')),
        !large&&frame(),h('dialog',{ref:dialog,className:'sw-media-dialog',onCancel:()=>setLarge(false)},large&&h('div',{className:'sw-media-dialog-body'},h('div',{className:'sw-row'},h('strong',null,title),h('button',{onClick:()=>setLarge(false)},'关闭放大视图')),frame())));
    }
    function MediaCard({project,run,metric,visible,tick}) {
      const [open,setOpen]=useState(metric==='analysis/full_report'),[step,setStep]=useState(''),[item,setItem]=useState('0'),[data,setData]=useState(null),[error,setError]=useState('');
      useEffect(()=>{
        if(!open||!visible)return;
        const c=new AbortController();setError('');setData(null);
        api('media',{project,run,key:metric,step:step||undefined,limit:100},c.signal).then(setData).catch(e=>{if(!c.signal.aborted)setError(e.message);});return()=>c.abort();
      },[project,run,metric,step,open,visible,tick]);
      const entries=list(data?.items),selected=entries.find(x=>String(x.item)===item)||entries[0],selectedStep=step||data?.step;
      const src=selected?`/swanlab-panel/api/asset?${new URLSearchParams({project,run,key:metric,item:String(selected.item),...(selectedStep==null?{}:{step:String(selectedStep)})})}`:'';
      const type=String(selected?.type||'').toLowerCase();
      return h('section',{className:'sw-card sw-media-card','data-media-key':metric},
        h('button',{className:'sw-card-head','aria-expanded':open,'aria-label':`${open?'折叠':'展开'}媒体 ${metric}`,onClick:()=>setOpen(v=>!v)},open?'▾':'▸',h('span',null,metric)),
        open&&h('div',{className:'sw-media-body'},error?h('div',{className:'sw-error',role:'alert'},error):!data?h('p',null,'读取媒体…'):h(R.Fragment,null,
          h('div',{className:'sw-row'},h('label',null,'step',h('select',{'aria-label':`${metric} step`,value:String(selectedStep??''),onChange:e=>{setStep(e.target.value);setItem('0');}},list(data.steps).map(x=>h('option',{key:x,value:String(x)},String(x))))),entries.length>1&&h('label',null,'内容',h('select',{'aria-label':`${metric} 内容`,value:String(selected?.item??'0'),onChange:e=>setItem(e.target.value)},entries.map(x=>h('option',{key:x.item,value:String(x.item)},x.caption||`第 ${x.item+1} 项`))))),
          selected?.caption&&h('p',{className:'sw-media-caption'},selected.caption),
          !selected?h('p',{className:'sw-muted'},'此 step 没有媒体内容。'):selected.available===false?h('p',{className:'sw-muted'},'此媒体类型暂不支持内嵌，可在完整 SwanLab 中查看。'):(type==='html'||type==='text')?h(MediaFrame,{key:src,src,title:metric}):type==='image'?h('img',{className:'sw-media-image',src,alt:selected.caption||metric}):h('p',{className:'sw-muted'},'此媒体类型可在完整 SwanLab 中查看。'))));
    }
    function MediaBrowser({project,run,visible,tick}) {
      const [data,setData]=useState(null),[filter,setFilter]=useState(''),[error,setError]=useState('');
      useEffect(()=>{if(!visible)return;const c=new AbortController();setData(null);setError('');api('columns',{project,run,metricType:'MEDIA',limit:100},c.signal).then(setData).catch(e=>{if(!c.signal.aborted)setError(e.message);});return()=>c.abort();},[project,run,visible,tick]);
      const keys=list(data?.metrics).map(m=>m.key).filter(k=>k.toLowerCase().includes(filter.toLowerCase()));
      return h('div',{className:'sw-media-browser'},h('input',{'aria-label':'筛选 HTML 和媒体',placeholder:'搜索 analysis、report、task_details…',value:filter,onChange:e=>setFilter(e.target.value)}),
        error&&h('div',{className:'sw-error',role:'alert'},error),!data&&!error&&h('p',null,'读取 HTML / 媒体清单…'),data&&!keys.length&&h('p',{className:'sw-muted'},'没有匹配的 HTML / 媒体内容。'),
        keys.map(metric=>h(MediaCard,{key:metric,project,run,metric,visible,tick})),data?.meta?.hasMore&&h('button',{onClick:async()=>{try{const next=await api('columns',{project,run,metricType:'MEDIA',limit:100,cursor:data.meta.nextCursor});setData(d=>({...next,metrics:[...d.metrics,...next.metrics]}));}catch(e){setError(e.message);}}},'加载更多媒体'));
    }
    function Panel({ useTabInfo }) {
      const info=useTabInfo?.(), visible=info ? info.tab.visible : true;
      const [projects,setProjects]=useState([]), [project,setProject]=useState(''), [runs,setRuns]=useState([]), [run,setRun]=useState('');
      const [detail,setDetail]=useState(null), [tab,setTab]=useState('metrics');
      const [runFilter,setRunFilter]=useState(''), [error,setError]=useState(''), [busy,setBusy]=useState(false), [tick,setTick]=useState(0), [auto,setAuto]=useState(false), [updated,setUpdated]=useState('');
      useEffect(()=>{const c=new AbortController();api('projects',{},c.signal).then(data=>{setProjects(data.projects||[]);setProject(p=>p||(data.projects?.[0]?.path||''));}).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>c.abort();},[]);
      useEffect(()=>{if(!project||!visible)return;const c=new AbortController();setBusy(true);setError('');api('runs',{project,limit:100},c.signal).then(data=>{setRuns(data.runs||[]);setRun(r=>data.runs?.some(x=>x.id===r)?r:(data.runs?.[0]?.id||''));setUpdated(new Date().toLocaleTimeString());}).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!c.signal.aborted)setBusy(false);});return()=>c.abort();},[project,tick,visible]);
      useEffect(()=>{setDetail(null);if(!project||!run||!visible)return;const c=new AbortController();Promise.all([api('run',{project,run},c.signal),api('columns',{project,run,limit:100},c.signal)]).then(([data,columns])=>{data.metrics=columns.metrics;data.columnsMeta=columns.meta;setDetail(data);}).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>c.abort();},[project,run,tick,visible]);
      useEffect(()=>{if(!auto||!visible)return;const id=setInterval(()=>{if(document.visibilityState==='visible')setTick(t=>t+1);},15000);return()=>clearInterval(id);},[auto,visible]);
      const current=runs.find(r=>r.id===run), metrics=list(detail?.metrics);
      const nativeURL=(()=>{try{const u=new URL(current?.url||detail?.url||'http://127.0.0.1:8000/');return u.origin==='http://127.0.0.1:8000'?u.href:'http://127.0.0.1:8000/';}catch{return 'http://127.0.0.1:8000/';}})();
      const local=['127.0.0.1','localhost','[::1]'].includes(location.hostname);
      return h('div',{className:'sw-panel','data-swanlab-panel':true},h('div',{className:'sw-title'},'SwanLab 实验'),
        h('div',{className:'sw-muted'},'读取本地服务 · 不启动模型或评测'),
        h('div',{className:'sw-row'},h('select',{'aria-label':'项目',value:project,onChange:e=>{setRun('');setProject(e.target.value);setError('');}},projects.map(p=>h('option',{key:p.path,value:p.path},p.name||p.path))),h('button',{onClick:()=>setTick(t=>t+1),disabled:busy},busy?'读取中…':'刷新')),
        h('div',{className:'sw-row'},h('label',null,h('input',{type:'checkbox',checked:auto,onChange:e=>setAuto(e.target.checked),style:{width:'auto'} }), ' 每 15 秒刷新'),h('span',{className:'sw-muted'},updated&&`更新于 ${updated}`)),
        error&&h('div',{className:'sw-error',role:'alert'},error),
        h('input',{'aria-label':'筛选实验',placeholder:'筛选实验名称 / ID',value:runFilter,onChange:e=>setRunFilter(e.target.value)}),
        h('div',{style:{maxHeight:210,overflow:'auto'}},runs.filter(r=>`${r.name} ${r.id}`.toLowerCase().includes(runFilter.toLowerCase())).map(r=>h('button',{className:'sw-run',key:r.id,'aria-pressed':run===r.id,onClick:()=>{setRun(r.id);setError('');}},h('span',{className:'sw-state'},r.state||r.status||'未知'),h('strong',null,r.name||r.id),h('div',{className:'sw-muted'},r.id)))),
        !busy&&!runs.length&&h('p',{className:'sw-muted'},'暂无实验，或尚未选择项目。'),
        run&&h(R.Fragment,null,h('div',{className:'sw-tabs'},[['metrics','指标'],['media','HTML / 媒体'],['config','配置'],['logs','日志'],['native','完整 SwanLab']].map(([key,label])=>h('button',{key,'aria-pressed':tab===key,onClick:()=>setTab(key)},label))),
          tab==='metrics'&&h(Dashboard,{key:`${project}/${run}`,project,run,metrics,meta:detail?.columnsMeta,tick,visible,onMore:async()=>{try{const c=await api('columns',{project,run,limit:100,cursor:detail.columnsMeta.nextCursor});setDetail(d=>({...d,metrics:[...d.metrics,...c.metrics],columnsMeta:c.meta}));}catch(e){setError(e.message);}}}),
           tab==='media'&&h(MediaBrowser,{key:`${project}/${run}`,project,run,tick,visible}),
           tab==='config'&&h('pre',null,detail?JSON.stringify(detail.config??detail.profile??{},null,2):'读取中…'),
          tab==='logs'&&h(Logs,{project,run,tick,visible}),
          tab==='native'&&h(R.Fragment,null,h('p',null,h('a',{href:nativeURL,target:'_blank',rel:'noopener noreferrer'},'在新窗口打开完整实验 ↗')),local?h('iframe',{className:'sw-native',src:nativeURL,title:'完整 SwanLab 实验',referrerPolicy:'no-referrer'}):h('p',{className:'sw-muted'},'当前通过远程地址访问 DSH。上面的指标、配置和日志由服务器读取；完整原生页面仅在本机浏览器中打开，未新增公网入口。'))));
    }
    function Logs({project,run,tick,visible}) {
      const [value,setValue]=useState(null),[error,setError]=useState('');
      useEffect(()=>{if(!visible)return;const c=new AbortController();setValue(null);setError('');api('logs',{project,run,limit:100},c.signal).then(setValue).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>c.abort();},[project,run,tick,visible]);
      return h(R.Fragment,null,error&&h('div',{className:'sw-error'},error),h('pre',null,value?(typeof value.logs==='string'?value.logs:JSON.stringify(value.logs??value,null,2)):'读取日志…'),value&&h('p',{className:'sw-muted'},'此处显示首个服务端日志块，最多 100 条；未上传的 stdout 不会出现。'));
    }
    return {name:'dsh-swanlab',inject:['slots','sidebarRightTabs'],apply(ctx){
      try {
      const style=document.createElement('style');style.textContent=css+dashboardCSS+`.sw-media-browser>.sw-card{margin-top:12px}.sw-media-body{padding:12px}.sw-media-body label{flex:1;min-width:100px}.sw-media-frame{display:block;width:100%;height:600px;min-height:360px;resize:vertical;border:1px solid #8884;border-radius:6px;background:white}.sw-media-dialog{width:calc(100vw - 32px);height:calc(100vh - 32px);max-width:none;max-height:none;padding:14px;border:1px solid #8885;border-radius:10px;background:var(--semi-color-bg-0,white);color:inherit}.sw-media-dialog::backdrop{background:#0008}.sw-media-dialog-body{height:100%;display:flex;flex-direction:column}.sw-media-dialog-body>.sw-row{justify-content:space-between}.sw-media-dialog-body>.sw-media-frame{flex:1;min-height:0;resize:none}.sw-media-image{max-width:100%;height:auto}.sw-media-caption{overflow-wrap:anywhere;font-size:14px}`;document.head.appendChild(style);ctx.effect(()=>()=>style.remove());
      ctx.effect(()=>ctx.sidebarRightTabs.register({id:'dsh-swanlab',kind:'swanlab',title:()=> 'SwanLab',priority:'extension',keepMounted:true,guide:[{id:'swanlab',title:()=> 'SwanLab 实验',description:()=> '本地训练曲线、实验配置和日志',order:0}]}));
      ctx.slots.inject('sidebar.right.pane.tab',()=>ctx.slots.register({name:'sidebar.right.pane.tab',key:'dsh-swanlab'},Panel));
      } catch (error) { console.error('[dsh-swanlab] UI registration failed', error); throw error; }
    }};
  }
});
