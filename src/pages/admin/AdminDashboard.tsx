import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { VoiceButton, Card, Badge, Avatar, ProgressBar } from '@/components/ui/VoiceUI';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

// ─── Colours ─────────────────────────────────────────────────────────────────
const BG       = '#0a1628';
const SIDEBAR  = '#070f1e';
const CARD     = '#0d1829';
const GOLD     = '#C9A84C';
const GOLD_DIM = 'rgba(201,168,76,0.15)';
const GOLD_BD  = 'rgba(201,168,76,0.3)';
const WHITE_06 = 'rgba(255,255,255,0.06)';
const WHITE_08 = 'rgba(255,255,255,0.08)';
const WHITE_04 = 'rgba(255,255,255,0.04)';
const MUTED    = 'rgba(255,255,255,0.45)';

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: '📊', label: 'Overview',        id: 'overview'   },
  { icon: '👥', label: 'Students',        id: 'students'   },
  { icon: '👩‍🏫', label: 'Professors',      id: 'professors' },
  { icon: '🏢', label: 'Companies',       id: 'companies'  },
  { icon: '📚', label: 'Chapters',        id: 'chapters'   },
  { icon: '💰', label: 'Packs & Pricing', id: 'pricing'    },
  { icon: '🤖', label: 'AI & Tools',      id: 'ai-tools'   },
  { icon: '📅', label: 'Bookings',        id: 'bookings'   },
  { icon: '📈', label: 'Analytics',       id: 'analytics'  },
  { icon: '⚙️', label: 'Settings',        id: 'settings'   },
];

// ─── Demo data ────────────────────────────────────────────────────────────────
const demoStudents = [
  { id:'s1', name:'João Silva',    email:'joao@company.pt',  pack:'Pro',             level:'B2', professor:'Ana Ferreira', score:88, sessions:7,  totalSessions:10 },
  { id:'s2', name:'Maria Santos',  email:'maria@company.pt', pack:'Advanced',        level:'C1', professor:'Ana Ferreira', score:92, sessions:12, totalSessions:15 },
  { id:'s3', name:'Pedro Alves',   email:'pedro@tech.pt',    pack:'Starter',         level:'B1', professor:'João Pereira', score:74, sessions:2,  totalSessions:4  },
  { id:'s4', name:'Ana Costa',     email:'ana@corp.pt',      pack:'Business Master', level:'C1', professor:'Ana Ferreira', score:95, sessions:18, totalSessions:20 },
  { id:'s5', name:'Carlos Mendes', email:'carlos@firm.pt',   pack:'Pro',             level:'B2', professor:'João Pereira', score:81, sessions:5,  totalSessions:10 },
];

const demoProfessors = [
  { id:'p1', name:'Ana Ferreira',  email:'ana@voice3.pt',   students:12, status:'active'   },
  { id:'p2', name:'João Pereira',  email:'joao@voice3.pt',  students:8,  status:'active'   },
  { id:'p3', name:'Sofia Martins', email:'sofia@voice3.pt', students:0,  status:'inactive' },
];

const demoCompanies = [
  { id:'c1', name:'TechCorp',       admin:'admin@techcorp.pt',  seats:5,  usedSeats:3,  avgScore:85, expires:'2026-12-31' },
  { id:'c2', name:'Millennium BCP', admin:'rh@millennium.pt',   seats:10, usedSeats:8,  avgScore:79, expires:'2026-06-30' },
  { id:'c3', name:'NOS',            admin:'training@nos.pt',    seats:15, usedSeats:12, avgScore:88, expires:'2027-01-15' },
];

type Session = { id:string; title:string; type:string; duration:number };
type Chapter = { id:string; number:number; title:string; isDiagnostic:boolean; sessions:Session[] };

const demoChapters: Chapter[] = [
  { id:'ch1', number:1, title:'Executive Profile Diagnostic', isDiagnostic:true,  sessions:[{ id:'s1', title:'Executive Profile Diagnostic', type:'diagnostic', duration:30 }] },
  { id:'ch2', number:2, title:'Commanding Presence',          isDiagnostic:false, sessions:[{ id:'s2', title:'Opening Impact', type:'video+exercise', duration:25 }, { id:'s3', title:'Voice Control Drill', type:'audio+exercise', duration:20 }] },
  { id:'ch3', number:3, title:'Negotiation Mastery',          isDiagnostic:false, sessions:[{ id:'s4', title:'Negotiation Scenarios', type:'ai-only', duration:30 }, { id:'s5', title:'Counter-offer Tactics', type:'quiz+exercise', duration:25 }] },
];

const demoPacks = [
  { id:'pk1', name:'Starter',         slug:'starter',         price:149, sessionsIncluded:1,  badge:null,           status:'active' },
  { id:'pk2', name:'Pro',             slug:'pro',             price:349, sessionsIncluded:3,  badge:'Most Popular', status:'active' },
  { id:'pk3', name:'Advanced',        slug:'advanced',        price:499, sessionsIncluded:5,  badge:null,           status:'active' },
  { id:'pk4', name:'Business Master', slug:'business-master', price:799, sessionsIncluded:10, badge:null,           status:'active' },
];

const demoTools = [
  { slug:'rescue-mode', name:'Rescue Mode',  isActive:true,  usesPerMonth:34 },
  { slug:'grammar',     name:'Grammar Tool', isActive:true,  usesPerMonth:56 },
  { slug:'qa-gauntlet', name:'Q&A Gauntlet', isActive:true,  usesPerMonth:12 },
  { slug:'email-tone',  name:'Email Tone',   isActive:true,  usesPerMonth:89 },
  { slug:'debate',      name:'Debate Club',  isActive:false, usesPerMonth:23 },
];

const demoBookings = [
  { id:'bk1', date:'2026-03-15', time:'10:00', student:'João Silva',   professor:'Ana Ferreira', status:'confirmed' },
  { id:'bk2', date:'2026-03-16', time:'14:00', student:'Maria Santos', professor:'Ana Ferreira', status:'completed' },
  { id:'bk3', date:'2026-03-17', time:'09:00', student:'Pedro Alves',  professor:'João Pereira', status:'cancelled' },
  { id:'bk4', date:'2026-03-20', time:'16:00', student:'Ana Costa',    professor:'Ana Ferreira', status:'confirmed' },
];

const activityData = [
  { week:'W1', sessions:42 }, { week:'W2', sessions:58 },
  { week:'W3', sessions:51 }, { week:'W4', sessions:67 },
];

const recentActivity = [
  { time:'Mar 10, 14:32', text:'João Silva completed Session 3 (score: 88%)' },
  { time:'Mar 10, 13:15', text:'Sandra created assignment for João Silva' },
  { time:'Mar 10, 12:00', text:'New student registered: Pedro Alves (Pack Pro)' },
  { time:'Mar 10, 11:30', text:'Company TechCorp requested 5 more seats' },
  { time:'Mar 09, 16:45', text:'Chapter 3 content updated by Admin' },
];

const kpiCards = [
  { icon:'👥', label:'Students',      value:'47',     sub:'+3 this week' },
  { icon:'👩‍🏫', label:'Professors',     value:'3',      sub:'2 active' },
  { icon:'🏢', label:'Companies',     value:'8',      sub:'12 employees' },
  { icon:'📚', label:'Sessions Done', value:'234',    sub:'this month' },
  { icon:'🎯', label:'Avg Score',     value:'87%',    sub:'↑ from 81%' },
  { icon:'💰', label:'Revenue/mo',    value:'€8,420', sub:'+12% MoM' },
];

const PIE_COLORS = ['#C9A84C','#4A90D9','#7B68EE','#52C41A','#FF6B6B','#FFB347'];

// Generate 30-day DAU mock data
const dauData = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  dau: Math.floor(15 + Math.random() * 10 + Math.sin(i / 3) * 4),
}));

const featureUsageData = [
  { name:'AI Chat', value:156 }, { name:'Rescue Mode', value:34 },
  { name:'Grammar', value:56 },  { name:'Q&A', value:12 },
  { name:'Email Tone', value:89 },{ name:'Debate', value:23 },
];

const scoreDistData = [
  { range:'0–59', count:2 }, { range:'60–69', count:5 },
  { range:'70–79', count:12 }, { range:'80–89', count:18 },
  { range:'90–100', count:10 },
];

const chapterCompletionData = Array.from({ length: 10 }, (_, i) => ({
  chapter: `CH${i + 1}`,
  pct: Math.max(10, 100 - i * 10 + Math.floor(Math.random() * 5)),
}));

const revenueData = [
  { pack:'Starter',        revenue:149*8,  students:8  },
  { pack:'Pro',            revenue:349*25, students:25 },
  { pack:'Advanced',       revenue:499*10, students:10 },
  { pack:'Business Master',revenue:799*4,  students:4  },
];

const professorPerfData = [
  { name:'Ana Ferreira', sessions:45, avgScore:88 },
  { name:'João Pereira', sessions:32, avgScore:82 },
];

// ─── Pack badge colours ───────────────────────────────────────────────────────
const packStyle = (pack: string): { bg: string; color: string } => {
  switch (pack) {
    case 'Starter':         return { bg:'rgba(59,130,246,0.15)',  color:'rgba(147,197,253,0.9)' };
    case 'Pro':             return { bg:'rgba(201,168,76,0.15)',  color:'#C9A84C' };
    case 'Advanced':        return { bg:'rgba(139,92,246,0.15)', color:'rgba(196,181,253,0.9)' };
    case 'Business Master': return { bg:'rgba(34,197,94,0.15)',  color:'rgba(134,239,172,0.9)' };
    default:                return { bg:WHITE_08,                 color:'white' };
  }
};

// ─── Shared card style ────────────────────────────────────────────────────────
const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: `1px solid ${WHITE_08}`,
  borderRadius: 12,
  padding: 20,
};

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
interface ConfirmModalProps {
  title: string;
  description: string;
  confirmWord?: string;
  onConfirm: () => void;
  onClose: () => void;
}
function ConfirmModal({ title, description, confirmWord = 'DELETE', onConfirm, onClose }: ConfirmModalProps) {
  const [typed, setTyped] = useState('');
  return (
    <div className="voice-modal-overlay">
      <div className="voice-modal" style={{ maxWidth:420 }}>
        <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:8 }}>{title}</h3>
        <p style={{ color:MUTED, fontSize:14, marginBottom:20 }}>{description}</p>
        <p style={{ color:'rgba(239,68,68,0.8)', fontSize:13, marginBottom:8 }}>
          Type <strong style={{ color:'rgba(239,68,68,1)' }}>{confirmWord}</strong> to confirm:
        </p>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          placeholder={confirmWord}
          style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'8px 12px', color:'white', fontSize:14, outline:'none', boxSizing:'border-box', marginBottom:20 }}
        />
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'8px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.15)', background:'transparent', color:MUTED, cursor:'pointer', fontSize:14 }}>Cancel</button>
          <button
            onClick={() => { if (typed === confirmWord) { onConfirm(); onClose(); } }}
            disabled={typed !== confirmWord}
            style={{ padding:'8px 20px', borderRadius:8, border:'none', background: typed === confirmWord ? 'rgba(239,68,68,0.85)' : 'rgba(239,68,68,0.25)', color: typed === confirmWord ? 'white' : 'rgba(255,255,255,0.4)', cursor: typed === confirmWord ? 'pointer' : 'not-allowed', fontSize:14, fontWeight:600 }}
          >Confirm Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Simple Modal wrapper ─────────────────────────────────────────────────────
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="voice-modal-overlay">
      <div className="voice-modal" style={{ maxWidth:520, maxHeight:'90vh', overflowY:'auto', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, background:'transparent', border:'none', color:MUTED, fontSize:20, cursor:'pointer' }}>✕</button>
        {children}
      </div>
    </div>
  );
}

// ─── Gold button ──────────────────────────────────────────────────────────────
function GoldBtn({ onClick, children, outlined }: { onClick: () => void; children: React.ReactNode; outlined?: boolean }) {
  return (
    <VoiceButton variant={outlined ? 'gold-outline' : 'primary'} size="sm" onClick={onClick}>
      {children}
    </VoiceButton>
  );
}

// ─── Form field helper ────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:16 }}>
      <label style={{ display:'block', color:MUTED, fontSize:12, marginBottom:6, letterSpacing:'0.05em' }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width:'100%', background:'rgba(255,255,255,0.05)', border:`1px solid ${WHITE_08}`,
  borderRadius:8, padding:'9px 12px', color:'white', fontSize:14, outline:'none', boxSizing:'border-box',
};

// ─── Section: OVERVIEW ────────────────────────────────────────────────────────
function SectionOverview() {
  return (
    <div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
        {kpiCards.map(k => (
          <Card key={k.label} hover>
            <div style={{ fontSize:28 }}>{k.icon}</div>
            <div style={{ fontSize:28, fontWeight:700, color:GOLD, margin:'8px 0 2px' }}>{k.value}</div>
            <div style={{ fontSize:13, color:MUTED }}>{k.label}</div>
            <div style={{ fontSize:11, color:MUTED, marginTop:4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <Card style={{ marginBottom:32 }}>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Session Activity (Last 4 Weeks)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={activityData}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={GOLD} stopOpacity={0.3} />
                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
            <Area type="monotone" dataKey="sessions" stroke={GOLD} fill="url(#goldGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Recent Activity</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:GOLD, marginTop:4, flexShrink:0 }} />
              <div>
                <span style={{ color:MUTED, fontSize:12 }}>{a.time} &nbsp;—&nbsp;</span>
                <span style={{ color:'white', fontSize:13 }}>{a.text}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Section: STUDENTS ────────────────────────────────────────────────────────
function SectionStudents() {
  const [search, setSearch] = useState('');
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [students, setStudents] = useState(demoStudents);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    toast.success('Student deleted');
  };

  return (
    <div>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Student"
          description="This action cannot be undone. The student and all their data will be permanently removed."
          onConfirm={() => handleDelete(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search students…"
          style={{ ...inputStyle, width:280 }}
        />
      </div>

      <Card padding={0} style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
              {['Name','Email','Pack','Level','Progress','Professor','Score','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => {
              const ps = packStyle(s.pack);
              const pct = Math.round((s.sessions / s.totalSessions) * 100);
              return (
                <tr key={s.id} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding:'12px 16px', color:'white', fontSize:13, fontWeight:500 }}>{s.name}</td>
                  <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{s.email}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <Badge variant={s.pack === 'Starter' ? 'blue' : s.pack === 'Pro' ? 'gold' : s.pack === 'Advanced' ? 'purple' : s.pack === 'Business Master' ? 'success' : 'muted'} size="xs">{s.pack}</Badge>
                  </td>
                  <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{s.level}</td>
                  <td style={{ padding:'12px 16px' }}>
                    <div style={{ width:80 }}><ProgressBar value={s.sessions} max={s.totalSessions} height={6} /></div>
                    <span style={{ color:MUTED, fontSize:11 }}>{s.sessions}/{s.totalSessions}</span>
                  </td>
                  <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{s.professor}</td>
                  <td style={{ padding:'12px 16px', color: s.score >= 90 ? '#52C41A' : s.score >= 75 ? GOLD : '#FF6B6B', fontSize:13, fontWeight:600 }}>{s.score}%</td>
                  <td style={{ padding:'12px 16px', position:'relative' }}>
                    <VoiceButton variant="ghost" size="sm" onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)}>⋯</VoiceButton>
                    {openMenu === s.id && (
                      <div style={{ position:'absolute', right:16, top:40, background:'#0d1829', border:`1px solid ${WHITE_08}`, borderRadius:10, zIndex:50, minWidth:160, overflow:'hidden' }}>
                        {['View Profile','Edit Pack','Assign Professor','Suspend'].map(action => (
                          <button
                            key={action}
                            onClick={() => { toast.info(action); setOpenMenu(null); }}
                            style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 16px', background:'transparent', border:'none', color:'white', fontSize:13, cursor:'pointer' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                          >{action}</button>
                        ))}
                        <button
                          onClick={() => { setDeleteTarget(s.id); setOpenMenu(null); }}
                          style={{ display:'block', width:'100%', textAlign:'left', padding:'10px 16px', background:'transparent', border:'none', color:'rgba(239,68,68,0.85)', fontSize:13, cursor:'pointer' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Section: PROFESSORS ─────────────────────────────────────────────────────
function SectionProfessors() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', email:'', password:'', bio:'' });

  const handleCreate = () => {
    toast.success(`Professor ${form.name || 'created'} successfully`);
    setShowModal(false);
    setForm({ name:'', email:'', password:'', bio:'' });
  };

  return (
    <div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Create New Professor</h3>
          <Field label="FULL NAME">
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name:e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="EMAIL">
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email:e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="TEMP PASSWORD">
            <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password:e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="BIO">
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio:e.target.value }))} rows={3} style={{ ...inputStyle, resize:'vertical' }} />
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
            <GoldBtn onClick={handleCreate}>Save</GoldBtn>
          </div>
        </Modal>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <GoldBtn onClick={() => setShowModal(true)}>+ Create New Professor</GoldBtn>
      </div>

      <Card padding={0} style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
              {['Name','Email','Students','Status','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demoProfessors.map((p, i) => (
              <tr key={p.id} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13, fontWeight:500 }}>{p.name}</td>
                <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{p.email}</td>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{p.students}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background: p.status === 'active' ? '#52C41A' : 'rgba(255,255,255,0.25)' }} />
                    <span style={{ color: p.status === 'active' ? '#52C41A' : MUTED, fontSize:13 }}>{p.status === 'active' ? 'Active' : 'Inactive'}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    {['Edit','Manage Students','Deactivate'].map(a => (
                      <VoiceButton key={a} variant="ghost" size="sm" onClick={() => toast.info(a)}>{a}</VoiceButton>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Section: COMPANIES ──────────────────────────────────────────────────────
function SectionCompanies() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Add Company</h3>
          <Field label="COMPANY NAME"><input style={inputStyle} /></Field>
          <Field label="ADMIN EMAIL"><input style={inputStyle} /></Field>
          <Field label="SEATS"><input type="number" style={inputStyle} /></Field>
          <Field label="CONTRACT EXPIRES"><input type="date" style={inputStyle} /></Field>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
            <GoldBtn onClick={() => { toast.success('Company added'); setShowModal(false); }}>Add Company</GoldBtn>
          </div>
        </Modal>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <GoldBtn onClick={() => setShowModal(true)}>+ Add Company</GoldBtn>
      </div>

      <Card padding={0} style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
              {['Company','Admin Email','Seats','Avg Score','Expires','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {demoCompanies.map((c, i) => (
              <tr key={c.id} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13, fontWeight:600 }}>{c.name}</td>
                <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{c.admin}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ color:'white', fontSize:13 }}>{c.usedSeats}</span>
                  <span style={{ color:MUTED, fontSize:13 }}>/{c.seats}</span>
                  <div style={{ width:60, marginTop:4 }}><ProgressBar value={c.usedSeats} max={c.seats} height={4} /></div>
                </td>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{c.avgScore}%</td>
                <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{c.expires}</td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    {['View','Edit','Manage Seats'].map(a => (
                      <VoiceButton key={a} variant="ghost" size="sm" onClick={() => toast.info(a)}>{a}</VoiceButton>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Section: CHAPTERS ───────────────────────────────────────────────────────
function SectionChapters() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showChapterModal, setShowChapterModal] = useState(false);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  const [editSession, setEditSession] = useState<Session | null>(null);
  const [chapters, setChapters] = useState(demoChapters);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsDiag, setNewIsDiag] = useState(false);

  return (
    <div>
      {showChapterModal && (
        <Modal onClose={() => setShowChapterModal(false)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Create Chapter</h3>
          <Field label="CHAPTER NUMBER">
            <input style={inputStyle} defaultValue={chapters.length + 1} readOnly />
          </Field>
          <Field label="TITLE">
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="DESCRIPTION">
            <textarea rows={3} value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ ...inputStyle, resize:'vertical' }} />
          </Field>
          <Field label="STATUS">
            <select style={{ ...inputStyle }}>
              <option>Active</option><option>Draft</option><option>Hidden</option>
            </select>
          </Field>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <input type="checkbox" id="isDiag" checked={newIsDiag} onChange={e => setNewIsDiag(e.target.checked)} />
            <label htmlFor="isDiag" style={{ color:'white', fontSize:14 }}>Is Diagnostic Chapter</label>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <GoldBtn onClick={() => {
              setChapters(prev => [...prev, { id:`ch${Date.now()}`, number:prev.length+1, title:newTitle||'New Chapter', isDiagnostic:newIsDiag, sessions:[] }]);
              toast.success('Chapter created');
              setShowChapterModal(false);
              setNewTitle(''); setNewDesc(''); setNewIsDiag(false);
            }}>Create Chapter</GoldBtn>
          </div>
        </Modal>
      )}

      {editChapter && (
        <Modal onClose={() => setEditChapter(null)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Edit Chapter</h3>
          <Field label="TITLE">
            <input defaultValue={editChapter.title} style={inputStyle} />
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <GoldBtn onClick={() => { toast.success('Chapter updated'); setEditChapter(null); }}>Save Changes</GoldBtn>
          </div>
        </Modal>
      )}

      {editSession && (
        <Modal onClose={() => setEditSession(null)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Edit Session</h3>
          <Field label="TITLE">
            <input defaultValue={editSession.title} style={inputStyle} />
          </Field>
          <Field label="TYPE">
            <input defaultValue={editSession.type} style={inputStyle} />
          </Field>
          <Field label="DURATION (min)">
            <input type="number" defaultValue={editSession.duration} style={inputStyle} />
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <GoldBtn onClick={() => { toast.success('Session updated'); setEditSession(null); }}>Save Changes</GoldBtn>
          </div>
        </Modal>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <GoldBtn onClick={() => setShowChapterModal(true)}>+ Create Chapter</GoldBtn>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {chapters.map(ch => (
          <Card key={ch.id} padding={0} style={{ overflow:'hidden' }}>
            <div
              style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 20px', cursor:'pointer' }}
              onClick={() => setExpanded(expanded === ch.id ? null : ch.id)}
            >
              <span style={{ color:MUTED, fontSize:18 }}>≡</span>
              <span style={{ color:GOLD, fontSize:13, fontWeight:700, minWidth:60 }}>CH{ch.number}</span>
              <span style={{ color:'white', fontSize:14, flex:1 }}>{ch.title}</span>
              {ch.isDiagnostic && (
                <Badge variant="blue" size="xs">Diagnostic</Badge>
              )}
              <span onClick={e => e.stopPropagation()}><VoiceButton variant="ghost" size="sm" onClick={() => setEditChapter(ch)}>Edit</VoiceButton></span>
              <span onClick={e => e.stopPropagation()}><VoiceButton variant="danger" size="sm" onClick={() => toast.error('Delete chapter')}>🗑</VoiceButton></span>
            </div>
            {expanded === ch.id && (
              <div style={{ borderTop:`1px solid ${WHITE_06}`, padding:'12px 20px', display:'flex', flexDirection:'column', gap:8 }}>
                {ch.sessions.map((sess, idx) => (
                  <div key={sess.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom: idx < ch.sessions.length-1 ? `1px solid ${WHITE_06}` : 'none' }}>
                    <span style={{ color:MUTED, fontSize:13, minWidth:24 }}>{idx+1}.</span>
                    <span style={{ color:'white', fontSize:13, flex:1 }}>{sess.title}</span>
                    <Badge variant="purple" size="xs">{sess.type}</Badge>
                    <span style={{ color:MUTED, fontSize:12 }}>{sess.duration}m</span>
                    <VoiceButton variant="ghost" size="sm" onClick={() => setEditSession(sess)}>Edit</VoiceButton>
                  </div>
                ))}
                {ch.sessions.length === 0 && <span style={{ color:MUTED, fontSize:13 }}>No sessions yet.</span>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Section: PACKS & PRICING ────────────────────────────────────────────────
function SectionPricing() {
  const [editPack, setEditPack] = useState<typeof demoPacks[0] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [packs, setPacks] = useState(demoPacks);

  const openEdit = (p: typeof demoPacks[0]) => setEditPack({ ...p });

  return (
    <div>
      {(editPack || showAdd) && (
        <Modal onClose={() => { setEditPack(null); setShowAdd(false); }}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>{editPack ? 'Edit Pack' : 'Add New Pack'}</h3>
          <Field label="NAME">
            <input defaultValue={editPack?.name} style={inputStyle} />
          </Field>
          <Field label="PRICE (€)">
            <input type="number" defaultValue={editPack?.price} style={inputStyle} />
          </Field>
          <Field label="PROFESSOR SESSIONS">
            <input type="number" defaultValue={editPack?.sessionsIncluded} style={inputStyle} />
          </Field>
          <Field label="BADGE">
            <select defaultValue={editPack?.badge ?? ''} style={{ ...inputStyle }}>
              <option value="">None</option>
              <option>Most Popular</option>
              <option>Best Value</option>
              <option>Enterprise</option>
            </select>
          </Field>
          <Field label="STATUS">
            <select defaultValue={editPack?.status} style={{ ...inputStyle }}>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
            </select>
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end' }}>
            <GoldBtn onClick={() => {
              toast.success(editPack ? 'Pack updated' : 'Pack created');
              setEditPack(null); setShowAdd(false);
            }}>Save Changes</GoldBtn>
          </div>
        </Modal>
      )}

      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:20 }}>
        <GoldBtn onClick={() => setShowAdd(true)}>+ Add New Pack</GoldBtn>
      </div>

      <Card padding={0} style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
              {['Pack Name','Price','Prof. Sessions','Badge','Status','Actions'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packs.map((pk, i) => (
              <tr key={pk.id} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13, fontWeight:600 }}>{pk.name}</td>
                <td style={{ padding:'12px 16px', color:GOLD, fontSize:13, fontWeight:600 }}>€{pk.price}</td>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{pk.sessionsIncluded}</td>
                <td style={{ padding:'12px 16px' }}>
                  {pk.badge
                    ? <Badge variant="gold" size="xs">{pk.badge}</Badge>
                    : <span style={{ color:MUTED, fontSize:13 }}>—</span>
                  }
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background: pk.status === 'active' ? '#52C41A' : 'rgba(255,255,255,0.2)' }} />
                    <span style={{ color: pk.status === 'active' ? '#52C41A' : MUTED, fontSize:13, textTransform:'capitalize' }}>{pk.status}</span>
                  </div>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <VoiceButton variant="ghost" size="sm" onClick={() => openEdit(pk)}>Edit</VoiceButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Section: AI & TOOLS ─────────────────────────────────────────────────────
function SectionAiTools() {
  const [tools, setTools] = useState(demoTools);

  const toggle = (slug: string) => {
    setTools(prev => prev.map(t => t.slug === slug ? { ...t, isActive: !t.isActive } : t));
  };

  return (
    <div>
      <Card style={{ marginBottom:24 }}>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>AI Coach Status</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { label:'Model', value:'claude-sonnet-4-5-20251001' },
            { label:'Edge Function', value:'ai-coach' },
          ].map(row => (
            <div key={row.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <span style={{ color:MUTED, fontSize:13 }}>{row.label}: </span>
                <span style={{ color:'white', fontSize:13, fontFamily:'monospace' }}>{row.value}</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#52C41A' }} />
                <span style={{ color:'#52C41A', fontSize:12 }}>{row.label === 'Model' ? 'Connected' : 'Deployed'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding={0} style={{ overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
              {['Tool','Status','Uses/Month','Toggle'].map(h => (
                <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tools.map((t, i) => (
              <tr key={t.slug} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13, fontWeight:500 }}>{t.name}</td>
                <td style={{ padding:'12px 16px' }}>
                  <span style={{ color: t.isActive ? '#52C41A' : MUTED, fontSize:13 }}>{t.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{t.usesPerMonth}</td>
                <td style={{ padding:'12px 16px' }}>
                  <button
                    onClick={() => toggle(t.slug)}
                    style={{
                      width:48, height:24, borderRadius:12, border:'none', cursor:'pointer',
                      background: t.isActive ? GOLD : 'rgba(255,255,255,0.15)',
                      position:'relative', transition:'background 0.2s',
                    }}
                  >
                    <div style={{
                      position:'absolute', top:3, left: t.isActive ? 27 : 3,
                      width:18, height:18, borderRadius:'50%', background:'white',
                      transition:'left 0.2s',
                    }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Section: BOOKINGS ───────────────────────────────────────────────────────
function SectionBookings() {
  const statusColor = (s: string) => {
    if (s === 'confirmed') return { bg:'rgba(59,130,246,0.15)', color:'rgba(147,197,253,0.9)' };
    if (s === 'completed') return { bg:'rgba(34,197,94,0.15)', color:'rgba(134,239,172,0.9)' };
    return { bg:'rgba(239,68,68,0.15)', color:'rgba(252,165,165,0.9)' };
  };

  return (
    <Card padding={0} style={{ overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
            {['Date','Time','Student','Professor','Status','Actions'].map(h => (
              <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {demoBookings.map((b, i) => {
            const sc = statusColor(b.status);
            return (
              <tr key={b.id} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{b.date}</td>
                <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{b.time}</td>
                <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{b.student}</td>
                <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{b.professor}</td>
                <td style={{ padding:'12px 16px' }}>
                  <Badge variant={b.status === 'confirmed' ? 'blue' : b.status === 'completed' ? 'success' : 'error'} size="xs">{b.status}</Badge>
                </td>
                <td style={{ padding:'12px 16px' }}>
                  <div style={{ display:'flex', gap:8 }}>
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <>
                        <VoiceButton variant="danger" size="sm" onClick={() => toast.info('Cancel')}>Cancel</VoiceButton>
                        <VoiceButton variant="ghost" size="sm" onClick={() => toast.info('Reschedule')}>Reschedule</VoiceButton>
                      </>
                    )}
                    {(b.status === 'cancelled' || b.status === 'completed') && (
                      <span style={{ color:MUTED, fontSize:12 }}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// ─── Section: ANALYTICS ──────────────────────────────────────────────────────
function SectionAnalytics() {
  const [tab, setTab] = useState<'engagement'|'learning'|'business'|'professors'>('engagement');
  const tabs = ['engagement','learning','business','professors'] as const;

  const totalRevenue = revenueData.reduce((s, r) => s + r.revenue, 0);

  return (
    <div>
      <div style={{ display:'flex', gap:4, marginBottom:24 }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'voice-tab active' : 'voice-tab'}
            style={{ textTransform:'capitalize' }}
          >{t}</button>
        ))}
      </div>

      {tab === 'engagement' && (
        <div>
          <Card style={{ marginBottom:24 }}>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Daily Active Users (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dauData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:10 }} axisLine={false} tickLine={false} interval={4} />
                <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
                <Line type="monotone" dataKey="dau" stroke={GOLD} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Feature Usage</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={featureUsageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {featureUsageData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
                <Legend wrapperStyle={{ color:'white', fontSize:12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === 'learning' && (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          <Card>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Score Distribution</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreDistData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
                <Bar dataKey="count" fill={GOLD} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Chapter Completion %</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chapterCompletionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="chapter" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} domain={[0,100]} />
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
                <Bar dataKey="pct" fill="rgba(74,144,217,0.7)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {tab === 'business' && (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          <Card style={{ display:'flex', alignItems:'center', gap:16 }}>
            <div>
              <div style={{ color:MUTED, fontSize:12, letterSpacing:'0.05em' }}>TOTAL MONTHLY REVENUE</div>
              <div style={{ color:GOLD, fontSize:36, fontWeight:700 }}>€{totalRevenue.toLocaleString()}</div>
            </div>
          </Card>

          <Card>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Revenue by Pack</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="pack" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} formatter={(v: number) => `€${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill={GOLD} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding={0} style={{ overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
                  {['Pack','Students','Revenue'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600, letterSpacing:'0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {revenueData.map((r, i) => (
                  <tr key={r.pack} className="voice-table-row" style={{ borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{r.pack}</td>
                    <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{r.students}</td>
                    <td style={{ padding:'12px 16px', color:GOLD, fontSize:13, fontWeight:600 }}>€{r.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {tab === 'professors' && (
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          <Card>
            <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:16 }}>Sessions per Professor</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={professorPerfData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill:'rgba(255,255,255,0.3)', fontSize:12 }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background:CARD, border:`1px solid ${WHITE_08}`, borderRadius:8, color:'white' }} />
                <Bar dataKey="sessions" fill={GOLD} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card padding={0} style={{ overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid rgba(201,168,76,0.2)` }}>
                  {['Professor','Sessions','Avg Score'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:12, color:GOLD, fontWeight:600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {professorPerfData.map((p, i) => (
                  <tr key={p.name} className="voice-table-row">
                    <td style={{ padding:'12px 16px', color:'white', fontSize:13 }}>{p.name}</td>
                    <td style={{ padding:'12px 16px', color:MUTED, fontSize:13 }}>{p.sessions}</td>
                    <td style={{ padding:'12px 16px', color:GOLD, fontSize:13, fontWeight:600 }}>{p.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Section: SETTINGS ───────────────────────────────────────────────────────
function SectionSettings() {
  const [platformName, setPlatformName] = useState('VOICE³');
  const [contactEmail, setContactEmail] = useState('hello@voice3.pt');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({ name:'', email:'', password:'' });

  const exportCSV = (filename: string, content: string) => {
    const blob = new Blob([content], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportStudents = () => {
    const header = 'Name,Email,Pack,Level,Professor,Score,Sessions';
    const rows = demoStudents.map(s => `${s.name},${s.email},${s.pack},${s.level},${s.professor},${s.score},${s.sessions}`);
    exportCSV('students.csv', [header, ...rows].join('\n'));
    toast.success('Students CSV downloaded');
  };

  const exportSessions = () => {
    const header = 'Student,Sessions,TotalSessions,Score';
    const rows = demoStudents.map(s => `${s.name},${s.sessions},${s.totalSessions},${s.score}`);
    exportCSV('sessions.csv', [header, ...rows].join('\n'));
    toast.success('Sessions CSV downloaded');
  };

  const exportBookings = () => {
    const header = 'Date,Time,Student,Professor,Status';
    const rows = demoBookings.map(b => `${b.date},${b.time},${b.student},${b.professor},${b.status}`);
    exportCSV('bookings.csv', [header, ...rows].join('\n'));
    toast.success('Bookings CSV downloaded');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {showAdminModal && (
        <Modal onClose={() => setShowAdminModal(false)}>
          <h3 style={{ color:'white', fontSize:18, fontWeight:700, marginBottom:24 }}>Add Admin Account</h3>
          <Field label="FULL NAME">
            <input value={adminForm.name} onChange={e => setAdminForm(p => ({ ...p, name:e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="EMAIL">
            <input value={adminForm.email} onChange={e => setAdminForm(p => ({ ...p, email:e.target.value }))} style={inputStyle} />
          </Field>
          <Field label="PASSWORD">
            <input type="password" value={adminForm.password} onChange={e => setAdminForm(p => ({ ...p, password:e.target.value }))} style={inputStyle} />
          </Field>
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:8 }}>
            <GoldBtn onClick={() => { toast.success(`Admin ${adminForm.email || 'created'} successfully`); setShowAdminModal(false); setAdminForm({ name:'', email:'', password:'' }); }}>Add Admin</GoldBtn>
          </div>
        </Modal>
      )}

      {/* Platform block */}
      <Card>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:20 }}>Platform</h3>
        <Field label="PLATFORM NAME">
          <input value={platformName} onChange={e => setPlatformName(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="CONTACT EMAIL">
          <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} style={inputStyle} />
        </Field>
        <GoldBtn onClick={() => toast.success('Settings saved')}>Save Changes</GoldBtn>
      </Card>

      {/* Admin accounts block */}
      <Card>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:20 }}>Admin Accounts</h3>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:`1px solid ${WHITE_06}`, marginBottom:16 }}>
          <span style={{ color:'white', fontSize:13 }}>admin@voice3.pt</span>
          <Badge variant="gold" size="xs">You</Badge>
        </div>
        <GoldBtn outlined onClick={() => setShowAdminModal(true)}>Add Another Admin →</GoldBtn>
      </Card>

      {/* Data export block */}
      <Card>
        <h3 style={{ color:'white', fontSize:15, fontWeight:600, marginBottom:20 }}>Data Export</h3>
        <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
          <VoiceButton variant="ghost" size="sm" onClick={exportStudents}>Export Students CSV</VoiceButton>
          <VoiceButton variant="ghost" size="sm" onClick={exportSessions}>Export Sessions CSV</VoiceButton>
          <VoiceButton variant="ghost" size="sm" onClick={exportBookings}>Export Bookings CSV</VoiceButton>
        </div>
      </Card>
    </div>
  );
}

// ─── Page heading ─────────────────────────────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  overview: 'Overview',
  students: 'Students',
  professors: 'Professors',
  companies: 'Companies',
  chapters: 'Chapters',
  pricing: 'Packs & Pricing',
  'ai-tools': 'AI & Tools',
  bookings: 'Bookings',
  analytics: 'Analytics',
  settings: 'Settings',
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const { section: urlSection } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(urlSection || 'overview');
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    if (urlSection && urlSection !== activeSection) {
      setActiveSection(urlSection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSection]);

  const goTo = (id: string) => {
    setActiveSection(id);
    navigate(`/admin/${id}`);
  };

  const adminName = currentUser?.name || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:BG, color:'white', fontFamily:'"Inter","Helvetica Neue",sans-serif' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside style={{ width:240, minWidth:240, background:SIDEBAR, display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, height:'100vh', zIndex:100, borderRight:`1px solid ${WHITE_06}` }}>
        {/* Logo */}
        <div style={{ padding:'24px 20px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <span style={{ fontFamily:'Georgia,serif', fontSize:22, color:GOLD, fontWeight:700, letterSpacing:'0.02em' }}>VOICE³</span>
            <span style={{ background:GOLD_DIM, border:`1px solid ${GOLD_BD}`, color:GOLD, fontSize:9, letterSpacing:'0.1em', padding:'2px 8px', borderRadius:20, fontWeight:700 }}>ADMIN</span>
          </div>
        </div>
        <div style={{ height:1, background:WHITE_06, marginBottom:8 }} />

        {/* Nav */}
        <nav style={{ flex:1, overflowY:'auto', padding:'8px 0' }}>
          {NAV_ITEMS.map(item => {
            const isActive = activeSection === item.id;
            const isHovered = hoveredNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                onMouseEnter={() => setHoveredNav(item.id)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  display:'flex', alignItems:'center', gap:12,
                  width:'100%', padding:'10px 20px',
                  background: isActive ? 'rgba(201,168,76,0.08)' : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderLeft: isActive ? `3px solid ${GOLD}` : '3px solid transparent',
                  border:'none',
                  borderLeftWidth:3, borderLeftStyle:'solid',
                  borderLeftColor: isActive ? GOLD : 'transparent',
                  color: isActive ? GOLD : isHovered ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor:'pointer', fontSize:13, fontWeight: isActive ? 600 : 400,
                  textAlign:'left', transition:'all 0.15s',
                }}
              >
                <span style={{ fontSize:16 }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding:'16px 20px', borderTop:`1px solid ${WHITE_06}` }}>
          <button
            onClick={logout}
            style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:8, border:`1px solid rgba(239,68,68,0.2)`, background:'rgba(239,68,68,0.06)', color:'rgba(239,68,68,0.8)', cursor:'pointer', fontSize:13, fontWeight:500 }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────── */}
      <div style={{ marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Header */}
        <header style={{ position:'sticky', top:0, zIndex:90, height:64, background:SIDEBAR, borderBottom:`1px solid ${WHITE_06}`, display:'flex', alignItems:'center', paddingLeft:32, paddingRight:32, gap:24 }}>
          <span style={{ color:GOLD, fontSize:13, letterSpacing:'0.15em', fontWeight:600, whiteSpace:'nowrap' }}>VOICE³ ADMIN PANEL</span>

          <div style={{ flex:1, display:'flex', justifyContent:'center' }}>
            <input
              placeholder="Search…"
              style={{ width:320, background:'rgba(255,255,255,0.04)', border:`1px solid ${WHITE_08}`, borderRadius:8, padding:'7px 14px', color:'white', fontSize:13, outline:'none' }}
            />
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button style={{ background:'transparent', border:'none', color:MUTED, fontSize:20, cursor:'pointer', padding:'0 4px' }}>🔔</button>
            <Avatar name={adminName} size={36} />
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, padding:'32px 36px', overflowY:'auto' }}>
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:'white', margin:0 }}>{PAGE_TITLES[activeSection] || activeSection}</h1>
          </div>

          {activeSection === 'overview'   && <SectionOverview />}
          {activeSection === 'students'   && <SectionStudents />}
          {activeSection === 'professors' && <SectionProfessors />}
          {activeSection === 'companies'  && <SectionCompanies />}
          {activeSection === 'chapters'   && <SectionChapters />}
          {activeSection === 'pricing'    && <SectionPricing />}
          {activeSection === 'ai-tools'   && <SectionAiTools />}
          {activeSection === 'bookings'   && <SectionBookings />}
          {activeSection === 'analytics'  && <SectionAnalytics />}
          {activeSection === 'settings'   && <SectionSettings />}
        </main>
      </div>
    </div>
  );
}
