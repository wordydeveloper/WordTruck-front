import { useEffect, useMemo, useState } from 'react';
import { api, ApiError, type Cliente, type Factura, type LoginResponse, type Paquete } from '../config/api';

type Screen = 'dashboard'|'nuevo-paquete'|'consulta'|'seguimiento'|'clientes'|'rutas'|'reportes';
const card: React.CSSProperties = { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:20 };
const input: React.CSSProperties = { width:'100%', boxSizing:'border-box', padding:'10px 12px', border:'1px solid #cbd5e1', borderRadius:8, fontSize:13, outline:'none' };
const btn: React.CSSProperties = { padding:'9px 14px', border:0, borderRadius:8, cursor:'pointer', fontWeight:700 };

export default function BackendApp({ user, onLogout }: { user: LoginResponse; onLogout:()=>void }) {
  const [screen,setScreen]=useState<Screen>('dashboard');
  const [clientes,setClientes]=useState<Cliente[]>([]); const [paquetes,setPaquetes]=useState<Paquete[]>([]); const [facturas,setFacturas]=useState<Factura[]>([]);
  const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const load = async()=>{ setLoading(true); setError(''); try { const [c,p,f]=await Promise.all([api.clientes.all(),api.paquetes.all(),api.facturas.all()]); setClientes(c);setPaquetes(p);setFacturas(f); } catch(e){setError(e instanceof Error?e.message:'No se pudo conectar con la API');} finally{setLoading(false)} };
  useEffect(()=>{load()},[]);
  const label:Record<Screen,string>={dashboard:'Dashboard','nuevo-paquete':'Nuevo Paquete',consulta:'Consulta de Paquetes',seguimiento:'Seguimiento',clientes:'Clientes',rutas:'Rutas de Entrega',reportes:'Reportes'};
  const nav:[Screen,string,string][]=[['dashboard','▦','Dashboard'],['nuevo-paquete','＋','Nuevo paquete'],['consulta','⌕','Consulta de paquetes'],['seguimiento','◉','Seguimiento'],['clientes','♙','Clientes'],['rutas','⌖','Rutas de entrega'],['reportes','▥','Reportes']];
  return <div style={{minHeight:'100vh',background:'#f1f5f9',color:'#0f172a',fontFamily:'Inter,system-ui,sans-serif'}}>
    <aside style={{position:'fixed',inset:'0 auto 0 0',width:235,background:'#0d1b2a',color:'#94a3b8',padding:20,boxSizing:'border-box',display:'flex',flexDirection:'column'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,paddingBottom:22,borderBottom:'1px solid #1e3a5f'}}><div style={{background:'#f59e0b',color:'#0d1b2a',width:36,height:36,borderRadius:8,display:'grid',placeItems:'center',fontWeight:900}}>W</div><div><b style={{color:'#fff'}}>WordTruck</b><small style={{display:'block',fontSize:10,color:'#64748b'}}>GESTIÓN LOGÍSTICA</small></div></div>
      <nav style={{marginTop:20,display:'grid',gap:5}}>{nav.map(([id,icon,text])=><button key={id} onClick={()=>setScreen(id)} style={{...btn,textAlign:'left',background:screen===id?'rgba(245,158,11,.14)':'transparent',color:screen===id?'#f59e0b':'#94a3b8',borderLeft:screen===id?'2px solid #f59e0b':'2px solid transparent'}}>{icon}&nbsp; {text}</button>)}</nav>
      <div style={{marginTop:'auto',borderTop:'1px solid #1e3a5f',paddingTop:16}}><div style={{color:'#fff',fontSize:13}}>{user.nombre} {user.apellido}</div><div style={{fontSize:11,marginBottom:12}}>{user.rolNombre} · {user.correo}</div><button onClick={onLogout} style={{...btn,width:'100%',background:'transparent',border:'1px solid #334155',color:'#cbd5e1'}}>Cerrar sesión</button></div>
    </aside>
    <main style={{marginLeft:235,minHeight:'100vh'}}><header style={{height:64,background:'#fff',borderBottom:'1px solid #e2e8f0',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 28px',boxSizing:'border-box',position:'sticky',top:0,zIndex:2}}><div><b>{label[screen]}</b><div style={{fontSize:11,color:'#94a3b8'}}>{new Date().toLocaleDateString('es-DO',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div></div><div style={{display:'flex',gap:10,alignItems:'center'}}>{loading&&<span style={{fontSize:12,color:'#64748b'}}>Cargando…</span>}<button onClick={load} style={{...btn,background:'#f8fafc',border:'1px solid #e2e8f0'}}>↻ Actualizar</button></div></header><section style={{padding:28}}>{error&&<div style={{...card,background:'#fef2f2',borderColor:'#fecaca',color:'#b91c1c',marginBottom:16}}>{error}</div>}{screen==='dashboard'&&<Dashboard paquetes={paquetes} clientes={clientes} facturas={facturas}/>} {screen==='nuevo-paquete'&&<NewPackage clientes={clientes} onDone={load}/>} {screen==='consulta'&&<Queries paquetes={paquetes} onRefresh={load} userId={user.usuarioId}/>} {screen==='seguimiento'&&<Tracking/>} {screen==='clientes'&&<Clients clientes={clientes} onRefresh={load}/>} {screen==='rutas'&&<Routes paquetes={paquetes}/>} {screen==='reportes'&&<Reports paquetes={paquetes} facturas={facturas} onRefresh={load}/>}</section></main>
  </div>
}

function Dashboard({paquetes,clientes,facturas}:{paquetes:Paquete[];clientes:Cliente[];facturas:Factura[]}){
  const delivered = paquetes.filter(p => (p.estadoNombre || '').toLowerCase().includes('entreg')).length;
  const inTransit = paquetes.filter(p => {
    const n = (p.estadoNombre || '').toLowerCase();
    return n.includes('tránsito') || n.includes('transito') || n.includes('ruta') || n.includes('bodega');
  }).length;

  return <><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:20}}>{[['Paquetes',paquetes.length,'#eff6ff'],['En tránsito / Bodega',inTransit,'#fffbeb'],['Entregados',delivered,'#f0fdf4'],['Clientes',clientes.length,'#f5f3ff']].map(([a,b,c])=><div style={{...card,background:c as string}} key={a as string}><small style={{color:'#64748b'}}>{a}</small><div style={{fontSize:28,fontWeight:800,marginTop:6}}>{b}</div></div>)}</div><div style={{display:'grid',gridTemplateColumns:'2fr 1fr',gap:18}}><div style={card}><h3>Paquetes recientes</h3>{paquetes.slice(0,8).map(p=><div key={p.paqueteId} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'11px 0',borderBottom:'1px solid #f1f5f9',fontSize:12}}><b>{p.tracking}</b><span>{p.origen} → {p.destino}</span><span style={{fontWeight:700,color:'#d97706'}}>{p.estadoNombre}</span></div>)}</div><div style={card}><h3>Facturación</h3><div style={{fontSize:28,fontWeight:800}}>${facturas.reduce((s,f)=>s+Number(f.total),0).toFixed(2)}</div><p style={{fontSize:12,color:'#64748b'}}>{facturas.length} facturas registradas</p></div></div></>
}

function NewPackage({clientes,onDone}:{clientes:Cliente[];onDone:()=>void}){const [f,setF]=useState({clienteId:'',peso:'',largo:'',ancho:'',alto:'',origen:'',destino:'',tarifa:''});const [msg,setMsg]=useState('');const [saving,setSaving]=useState(false);const set=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>setF({...f,[k]:e.target.value});const submit=async(e:React.FormEvent)=>{e.preventDefault();setSaving(true);setMsg('');try{const p=await api.paquetes.create({clienteId:+f.clienteId,peso:+f.peso,largo:+f.largo,ancho:+f.ancho,alto:+f.alto,origen:f.origen,destino:f.destino,tarifa:+f.tarifa});setMsg(`Paquete creado correctamente. Tracking: ${p.tracking}`);setF({clienteId:'',peso:'',largo:'',ancho:'',alto:'',origen:'',destino:'',tarifa:''});onDone()}catch(e){setMsg(e instanceof Error?e.message:'Error al crear')}finally{setSaving(false)}};return <div style={{maxWidth:850,margin:'0 auto'}}><form onSubmit={submit} style={{...card,display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}><h2 style={{gridColumn:'1/-1',margin:0}}>Registrar paquete</h2><label>Cliente<select required value={f.clienteId} onChange={set('clienteId')} style={input}><option value=''>Seleccione…</option>{clientes.map(c=><option key={c.clienteId} value={c.clienteId}>{c.clienteId} · {c.nombre} {c.apellido}</option>)}</select></label><label>Peso (kg)<input required type='number' step='0.01' min='0' value={f.peso} onChange={set('peso')} style={input}/></label>{(['largo','ancho','alto'] as const).map(k=><label key={k}>{k[0].toUpperCase()+k.slice(1)} (cm)<input required type='number' step='0.01' min='0' value={f[k]} onChange={set(k)} style={input}/></label>)}<label>Origen<input required value={f.origen} onChange={set('origen')} style={input}/></label><label>Destino<input required value={f.destino} onChange={set('destino')} style={input}/></label><label>Tarifa<input required type='number' step='0.01' min='0' value={f.tarifa} onChange={set('tarifa')} style={input}/></label><div style={{gridColumn:'1/-1',display:'flex',justifyContent:'flex-end'}}><button disabled={saving} style={{...btn,background:'#f59e0b'}}>{saving?'Guardando…':'Crear paquete'}</button></div>{msg&&<div style={{gridColumn:'1/-1',padding:12,background:'#f0fdf4',color:'#166534',borderRadius:8}}>{msg}</div>}</form></div>}

function Queries({paquetes,onRefresh,userId}:{paquetes:Paquete[];onRefresh:()=>void;userId:number}){
  const [q,setQ]=useState('');
  const [selected,setSelected]=useState<Paquete|null>(null);
  const [updatingId,setUpdatingId]=useState<number|null>(null);

  const filtered=useMemo(()=>paquetes.filter(p=>!q||[p.tracking,p.origen,p.destino,p.estadoNombre,String(p.clienteId)].join(' ').toLowerCase().includes(q.toLowerCase())),[paquetes,q]);

  const getEstadoId = (nombre?: string, actualId?: number): number => {
    if (actualId) return actualId;
    if (!nombre) return 1;
    const n = nombre.toLowerCase();
    if (n.includes('bodega')) return 2;
    if (n.includes('ruta') || n.includes('tránsito') || n.includes('transito')) return 3;
    if (n.includes('entreg')) return 4;
    if (n.includes('cancel')) return 5;
    return 1;
  };

  const handleEstadoChange = async (paqueteId: number, nuevoEstadoId: number) => {
    setUpdatingId(paqueteId);
    try {
      const res = await fetch(`http://localhost:5000/api/paquetes/${paqueteId}/actualizar-estado`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estadoId: nuevoEstadoId,
          usuarioId: userId || 1,
          observacion: 'Cambio de estado desde Consulta de Paquetes'
        })
      });

      if (!res.ok) {
        const text = await res.text();
        let errMsg = 'Error al actualizar estado';
        if (text) {
          try {
            const errData = JSON.parse(text);
            errMsg = errData.mensaje || errData.message || errMsg;
          } catch {}
        }
        throw new Error(errMsg);
      }

      await onRefresh();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'No se pudo cambiar el estado del paquete');
    } finally {
      setUpdatingId(null);
    }
  };

  const remove=async(id:number)=>{if(!confirm('¿Eliminar este paquete?'))return;try{await api.paquetes.remove(id);onRefresh()}catch(e){alert(e instanceof Error?e.message:'No se pudo eliminar')}};

  return <div style={card}>
    <div style={{display:'flex',gap:10,marginBottom:18}}>
      <input style={input} placeholder='Buscar tracking, origen, destino, estado o cliente…' value={q} onChange={e=>setQ(e.target.value)}/>
      <b style={{whiteSpace:'nowrap',padding:10}}>{filtered.length} resultados</b>
    </div>
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
        <thead>
          <tr>{['Tracking','Cliente','Ruta','Estado (Cambiar)','Tarifa','Acciones'].map(x=><th key={x} style={{textAlign:'left',padding:10,borderBottom:'1px solid #e2e8f0'}}>{x}</th>)}</tr>
        </thead>
        <tbody>
          {filtered.map(p=><tr key={p.paqueteId}>
            <td style={{padding:10,fontWeight:700}}>{p.tracking}</td>
            <td style={{padding:10}}>{p.clienteId}</td>
            <td style={{padding:10}}>{p.origen} → {p.destino}</td>
            <td style={{padding:10}}>
              <select
                value={getEstadoId(p.estadoNombre, (p as any).estadoActual)}
                disabled={updatingId === p.paqueteId}
                onChange={(e) => handleEstadoChange(p.paqueteId, Number(e.target.value))}
                style={{
                  padding: '5px 10px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: 12,
                  fontWeight: 700,
                  background: '#fff3dc',
                  color: '#92400e',
                  cursor: 'pointer'
                }}
              >
                <option value={1}>1 - Registrado</option>
                <option value={2}>2 - En Bodega</option>
                <option value={3}>3 - En Ruta / Tránsito</option>
                <option value={4}>4 - Entregado</option>
                <option value={5}>5 - Cancelado</option>
              </select>
            </td>
            <td style={{padding:10}}>${Number(p.tarifa).toFixed(2)}</td>
            <td style={{padding:10,display:'flex',gap:6}}>
              <button style={{...btn,background:'#e0f2fe'}} onClick={()=>setSelected(p)}>Ver</button>
              <button style={{...btn,background:'#fee2e2',color:'#991b1b'}} onClick={()=>remove(p.paqueteId)}>Eliminar</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </div>
    {selected&&<div style={{marginTop:18,padding:16,background:'#f8fafc',borderRadius:10}}>
      <b>{selected.tracking}</b>
      <p>{selected.origen} → {selected.destino} · <span style={{fontWeight:700,color:'#d97706'}}>{selected.estadoNombre}</span></p>
      <small>Dimensiones: {selected.largo} × {selected.ancho} × {selected.alto} cm · Peso: {selected.peso} kg</small>
      <button onClick={()=>setSelected(null)} style={{...btn,float:'right' as const}}>Cerrar</button>
    </div>}
  </div>
}

function Tracking(){const [q,setQ]=useState('');const [p,setP]=useState<Paquete|null>(null);const [loading,setLoading]=useState(false);const [msg,setMsg]=useState('');const search=async()=>{if(!q.trim())return;setLoading(true);setMsg('');try{setP(await api.paquetes.tracking(q.trim()))}catch(e){setP(null);setMsg(e instanceof Error?e.message:'No encontrado')}finally{setLoading(false)}};return <div style={{maxWidth:700,margin:'0 auto'}}><div style={card}><h2>Seguimiento de paquete</h2><div style={{display:'flex',gap:10}}><input style={input} value={q} onChange={e=>setQ(e.target.value)} placeholder='Ej. TRK-000001'/><button onClick={search} style={{...btn,background:'#f59e0b'}}>{loading?'…':'Buscar'}</button></div></div>{msg&&<div style={{...card,marginTop:16,color:'#b91c1c'}}>{msg}</div>}{p&&<div style={{...card,marginTop:16}}><div style={{fontSize:22,fontWeight:800}}>{p.tracking}</div><div style={{margin:'18px 0',fontWeight:700}}>{p.estadoNombre}</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,fontSize:13}}><span><b>Origen:</b> {p.origen}</span><span><b>Destino:</b> {p.destino}</span><span><b>Registro:</b> {new Date(p.fechaRegistro).toLocaleString()}</span><span><b>Tarifa:</b> ${Number(p.tarifa).toFixed(2)}</span></div></div>}</div>}

function Clients({clientes,onRefresh}:{clientes:Cliente[];onRefresh:()=>void}){const [q,setQ]=useState('');const [form,setForm]=useState({usuarioId:'',documento:'',direccion:''});const [editing,setEditing]=useState<number|null>(null);const filtered=clientes.filter(c=>`${c.nombre} ${c.apellido} ${c.correo} ${c.documento||''}`.toLowerCase().includes(q.toLowerCase()));const save=async()=>{try{if(editing)await api.clientes.update(editing,{documento:form.documento,direccion:form.direccion});else await api.clientes.create({usuarioId:+form.usuarioId,documento:form.documento,direccion:form.direccion});setEditing(null);setForm({usuarioId:'',documento:'',direccion:''});onRefresh()}catch(e){alert(e instanceof Error?e.message:'No se pudo guardar')}};const del=async(id:number)=>{if(confirm('¿Eliminar cliente?')){try{await api.clientes.remove(id);onRefresh()}catch(e){alert(e instanceof Error?e.message:'No se pudo eliminar')}}};return <div style={{display:'grid',gridTemplateColumns:'1fr 310px',gap:18}}><div style={card}><input style={{...input,marginBottom:15}} placeholder='Buscar cliente…' value={q} onChange={e=>setQ(e.target.value)}/><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}><thead><tr>{['ID','Cliente','Correo','Documento','Acciones'].map(x=><th key={x} style={{textAlign:'left',padding:9,borderBottom:'1px solid #e2e8f0'}}>{x}</th>)}</tr></thead><tbody>{filtered.map(c=><tr key={c.clienteId}><td style={{padding:9}}>{c.clienteId}</td><td style={{padding:9}}>{c.nombre} {c.apellido}</td><td style={{padding:9}}>{c.correo}</td><td style={{padding:9}}>{c.documento||'—'}</td><td style={{padding:9}}><button style={{...btn,background:'#e0f2fe',marginRight:5}} onClick={()=>{setEditing(c.clienteId);setForm({usuarioId:String(c.usuarioId),documento:c.documento||'',direccion:c.direccion||''})}}>Editar</button><button style={{...btn,background:'#fee2e2'}} onClick={()=>del(c.clienteId)}>Borrar</button></td></tr>)}</tbody></table></div><div style={card}><h3>{editing?'Editar cliente':'Nuevo cliente'}</h3>{!editing&&<label>Usuario ID<input style={input} value={form.usuarioId} onChange={e=>setForm({...form,usuarioId:e.target.value})}/></label>}<label>Documento<input style={input} value={form.documento} onChange={e=>setForm({...form,documento:e.target.value})}/></label><label>Dirección<textarea style={{...input,minHeight:80}} value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})}/></label><button onClick={save} style={{...btn,background:'#f59e0b',marginTop:12}}>{editing?'Guardar cambios':'Crear cliente'}</button>{editing&&<button onClick={()=>setEditing(null)} style={{...btn,marginLeft:8}}>Cancelar</button>}</div></div>}

function Routes({paquetes}:{paquetes:Paquete[]}){const groups=useMemo(()=>Object.entries(paquetes.reduce<Record<string,Paquete[]>>((a,p)=>{(a[p.destino]??=[]).push(p);return a},{})),[paquetes]);return <div style={{...card}}><h2>Rutas de entrega</h2><p style={{color:'#64748b',fontSize:13}}>Vista operativa agrupada por destino. El backend actual no expone CRUD de rutas, por lo que esta pantalla se construye con los paquetes registrados.</p><div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14}}>{groups.map(([dest,list])=><div key={dest} style={{padding:16,border:'1px solid #e2e8f0',borderRadius:10}}><b>{dest}</b><div style={{fontSize:26,fontWeight:800,margin:'8px 0'}}>{list.length}</div><small>paquetes asignados por destino</small></div>)}</div></div>}

function Reports({paquetes,facturas,onRefresh}:{paquetes:Paquete[];facturas:Factura[];onRefresh:()=>void}){
  const states=paquetes.reduce<Record<string,number>>((a,p)=>{a[p.estadoNombre]=(a[p.estadoNombre]||0)+1;return a},{});
  
  const [paqueteId, setPaqueteId] = useState('');
  const [total, setTotal] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSelectPaquete = (idStr: string) => {
    setPaqueteId(idStr);
    const id = Number(idStr);
    const pkg = paquetes.find(p => p.paqueteId === id);
    if (pkg && pkg.tarifa) {
      setTotal(String(pkg.tarifa));
    }
  };

  const handleCreateFactura = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paqueteId) return;
    setSaving(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paqueteId: Number(paqueteId),
          total: Number(total),
          metodoPago: metodoPago
        })
      });

      if (!res.ok) {
        const text = await res.text();
        let errMsg = 'No se pudo emitir la factura';
        if (text) {
          try {
            const errData = JSON.parse(text);
            errMsg = errData.mensaje || errData.message || errMsg;
          } catch {}
        }
        throw new Error(errMsg);
      }

      setMsg('¡Factura emitida exitosamente!');
      setPaqueteId('');
      setTotal('');
      setMetodoPago('Tarjeta');
      await onRefresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Error al emitir factura');
    } finally {
      setSaving(false);
    }
  };

  return <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:18}}>
    <div style={{display:'grid',gap:18}}>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
        <div style={card}>
          <h3>Reporte de paquetes</h3>
          {Object.entries(states).map(([s,n])=><div key={s} style={{display:'flex',justifyContent:'space-between',padding:12,borderBottom:'1px solid #f1f5f9'}}><span>{s}</span><b>{n}</b></div>)}
        </div>
        <div style={card}>
          <h3>Reporte financiero</h3>
          <div style={{fontSize:30,fontWeight:800}}>${facturas.reduce((s,f)=>s+Number(f.total),0).toFixed(2)}</div>
          <p style={{fontSize:13,color:'#64748b',marginTop:4}}>{facturas.length} facturas registradas</p>
        </div>
      </div>

      <div style={card}>
        <h3>Facturas Emitidas</h3>
        {facturas.length === 0 ? (
          <p style={{fontSize:13,color:'#94a3b8'}}>No hay facturas registradas en el sistema.</p>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead>
                <tr style={{background:'#f8fafc'}}>
                  {['Nº Factura', 'Tracking', 'Total', 'Método de Pago', 'Fecha'].map(h => (
                    <th key={h} style={{textAlign:'left',padding:10,borderBottom:'1px solid #e2e8f0'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facturas.map(f => (
                  <tr key={f.facturaId} style={{borderBottom:'1px solid #f1f5f9'}}>
                    <td style={{padding:10,fontWeight:700,color:'#d97706'}}>#{f.facturaId}</td>
                    <td style={{padding:10,fontWeight:700}}>{f.tracking || `Paquete #${f.paqueteId}`}</td>
                    <td style={{padding:10,fontWeight:800}}>${Number(f.total).toFixed(2)}</td>
                    <td style={{padding:10}}>
                      <span style={{background:'#f1f5f9',padding:'3px 8px',borderRadius:6,fontSize:11,fontWeight:600}}>{f.metodoPago}</span>
                    </td>
                    <td style={{padding:10,color:'#64748b'}}>{new Date(f.fecha).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>

    {/* Formulario lateral para emitir factura */}
    <div style={card}>
      <h3>Generar Factura</h3>
      <p style={{fontSize:12,color:'#64748b',marginBottom:16}}>Crear comprobante fiscal para un paquete</p>

      <form onSubmit={handleCreateFactura} style={{display:'flex',flexDirection:'column',gap:12}}>
        <label style={{fontSize:12,fontWeight:600}}>
          Seleccionar Paquete *
          <select
            required
            value={paqueteId}
            onChange={(e) => handleSelectPaquete(e.target.value)}
            style={{...input, marginTop:4}}
          >
            <option value=''>Seleccione paquete…</option>
            {paquetes.map(p => (
              <option key={p.paqueteId} value={p.paqueteId}>
                #{p.paqueteId} - {p.tracking} (${Number(p.tarifa).toFixed(2)})
              </option>
            ))}
          </select>
        </label>

        <label style={{fontSize:12,fontWeight:600}}>
          Monto Total ($) *
          <input
            required
            type='number'
            step='0.01'
            min='0.01'
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            placeholder='0.00'
            style={{...input, marginTop:4}}
          />
        </label>

        <label style={{fontSize:12,fontWeight:600}}>
          Método de Pago *
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            style={{...input, marginTop:4}}
          >
            <option value='Tarjeta'>Tarjeta de Crédito / Débito</option>
            <option value='Efectivo'>Efectivo contra entrega</option>
            <option value='Transferencia'>Transferencia Bancaria</option>
          </select>
        </label>

        <button
          disabled={saving}
          style={{...btn, background:'#f59e0b', color:'#0d1b2a', marginTop:8, opacity: saving ? 0.6 : 1}}
        >
          {saving ? 'Emitiendo…' : 'Emitir Factura'}
        </button>

        {msg && (
          <div style={{
            padding:10,
            borderRadius:8,
            fontSize:12,
            background: msg.includes('exitosamente') ? '#f0fdf4' : '#fef2f2',
            color: msg.includes('exitosamente') ? '#166534' : '#991b1b',
            border: `1px solid ${msg.includes('exitosamente') ? '#bbf7d0' : '#fecaca'}`
          }}>
            {msg}
          </div>
        )}
      </form>
    </div>
  </div>
}