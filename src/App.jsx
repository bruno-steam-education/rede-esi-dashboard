import { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Clock3,
  GraduationCap,
  MapPin,
  MousePointer2,
  Play,
  RotateCcw,
  School,
  Sparkles,
  Users,
} from 'lucide-react';

const schools = [
  {
    name: 'S. Carlos (SVP)',
    short: 'SVP',
    state: 'RS',
    visits: 53,
    hours: 43.8,
    remote: 34,
    presencial: 19,
    participants: 18,
    responsible: 'Claudio Amorim',
    segments: 'Fund. I e Fund. II',
    actions: { plantao: 23, planejamento: 8, formacao: 2, diagnostico: 3, devolutiva: 8, evento: 0, apropriacao: 3, acompanhamento: 0, estudo: 6 },
    highlight: 'Maior volume de atendimentos da rede, professores seguros e engajados.',
    attention: 'Tempo de aula e infraestrutura de internet pedem acompanhamento constante.',
  },
  {
    name: 'Sao Jose',
    short: 'SJ',
    state: 'SP',
    visits: 22,
    hours: 27.4,
    remote: 12,
    presencial: 10,
    participants: 11,
    responsible: 'Time ZOOM',
    segments: 'Fund. I e Fund. II',
    actions: { plantao: 5, planejamento: 5, formacao: 6, diagnostico: 0, devolutiva: 2, evento: 0, apropriacao: 0, acompanhamento: 4, estudo: 0 },
    highlight: 'Boa distribuicao entre planejamento, formacao e acompanhamento.',
    attention: 'Manter devolutivas objetivas para consolidar rotina pedagogica.',
  },
  {
    name: 'S. Carlos (Caxias)',
    short: 'CAX',
    state: 'RS',
    visits: 17,
    hours: 21,
    remote: 11,
    presencial: 6,
    participants: 8,
    responsible: 'Claudio Amorim',
    segments: 'Fund. I e Fund. II',
    actions: { plantao: 3, planejamento: 5, formacao: 0, diagnostico: 3, devolutiva: 3, evento: 0, apropriacao: 3, acompanhamento: 0, estudo: 0 },
    highlight: 'Boa adaptacao a metodologia, com professores testando atividades.',
    attention: 'Firmware dos HUBs depende de rede aberta e tempo de aula limitado.',
  },
  {
    name: 'Santa Teresa',
    short: 'ST',
    state: 'RS',
    visits: 16,
    hours: 22.2,
    remote: 8,
    presencial: 8,
    participants: 9,
    responsible: 'Rafael Zanetoni',
    segments: 'Fund. I e Fund. II',
    actions: { plantao: 1, planejamento: 2, formacao: 0, diagnostico: 0, devolutiva: 1, evento: 8, apropriacao: 2, acompanhamento: 0, estudo: 2 },
    highlight: 'Forte presenca em eventos e boa receptividade de novos professores.',
    attention: 'Planejamento previo para participacao da ZOOM nos eventos escolares.',
  },
  {
    name: 'Scalabriano S.J.',
    short: 'SSJ',
    state: 'PR',
    visits: 13,
    hours: 16.5,
    remote: 8,
    presencial: 5,
    participants: 6,
    responsible: 'Time ZOOM',
    segments: 'Fund. I e Fund. II',
    actions: { plantao: 3, planejamento: 4, formacao: 0, diagnostico: 2, devolutiva: 2, evento: 0, apropriacao: 2, acompanhamento: 0, estudo: 0 },
    highlight: 'Ciclo consistente de planejamento e devolutivas.',
    attention: 'Aprofundar diagnosticos por turma para acelerar proximas acoes.',
  },
  {
    name: 'Outras unidades',
    short: 'OUT',
    state: 'RS/PR/SP',
    visits: 43,
    hours: 55.6,
    remote: 29,
    presencial: 14,
    participants: 17,
    responsible: 'Equipe ZOOM',
    segments: 'Rede ESI',
    actions: { plantao: 9, planejamento: 18, formacao: 2, diagnostico: 8, devolutiva: 4, evento: 0, apropriacao: 3, acompanhamento: 1, estudo: 1 },
    highlight: 'Atendimentos distribuidos ampliam capilaridade da rede.',
    attention: 'Priorizar escolas com baixo volume para equilibrar impacto.',
  },
];

const monthly = [
  { month: 'Jan', remote: 6, presencial: 3 },
  { month: 'Fev', remote: 12, presencial: 6 },
  { month: 'Mar', remote: 19, presencial: 11 },
  { month: 'Abr', remote: 26, presencial: 18 },
  { month: 'Mai', remote: 23, presencial: 14 },
  { month: 'Jun', remote: 16, presencial: 10 },
];

const topActions = [
  { label: 'Plantao de duvidas', value: 44, share: 27, color: '#007ec3' },
  { label: 'Planejamento', value: 22, share: 13, color: '#b8cf00' },
  { label: 'Devolutivas e relat.', value: 20, share: 12, color: '#ffd500' },
  { label: 'Eventos escolares', value: 8, share: 5, color: '#ea5b0c' },
];

const formatHours = (value) => value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });

function ZoomMark() {
  return (
    <div className="zoom-mark" aria-label="ZOOM education for life">
      <span className="z">Z</span><span className="o-one">O</span><span className="o-two">O</span><span className="m">M</span>
      <small>education for life</small>
    </div>
  );
}

function KpiCard({ icon: Icon, value, label, accent, suffix = '', delay = 0 }) {
  return (
    <article className="kpi-card" style={{ '--accent': accent, '--delay': `${delay}ms` }}>
      <div className="kpi-icon"><Icon size={22} /></div>
      <strong>{value}{suffix}</strong>
      <span>{label}</span>
    </article>
  );
}

function Donut({ remote, presencial }) {
  const total = remote + presencial;
  const remoteShare = Math.round((remote / total) * 100);
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ '--remote': `${remoteShare * 3.6}deg` }}>
        <span>{remoteShare}%</span>
        <small>Remoto</small>
      </div>
      <div className="donut-legend">
        <p><i className="blue" /> {remote} remotos</p>
        <p><i className="orange" /> {presencial} presenciais</p>
      </div>
    </div>
  );
}

function MonthlyChart({ mode }) {
  const max = Math.max(...monthly.map((item) => item.remote + item.presencial));
  return (
    <div className="chart monthly-chart">
      {monthly.map((item) => {
        const remoteHeight = mode === 'presencial' ? 0 : (item.remote / max) * 100;
        const presHeight = mode === 'remoto' ? 0 : (item.presencial / max) * 100;
        return (
          <div className="month" key={item.month}>
            <div className="bars">
              <span className="bar remote" style={{ height: `${remoteHeight}%` }} />
              <span className="bar presencial" style={{ height: `${presHeight}%` }} />
            </div>
            <small>{item.month}</small>
          </div>
        );
      })}
    </div>
  );
}

function ActionList() {
  return (
    <div className="action-list">
      {topActions.map((action, index) => (
        <button className="action-row" key={action.label} style={{ '--row-color': action.color, '--row-delay': `${index * 120}ms` }}>
          <span>{action.label}</span>
          <strong>{action.share}%</strong>
          <i style={{ width: `${action.share * 2.5}%` }} />
        </button>
      ))}
    </div>
  );
}

function SchoolBars({ selected, onSelect }) {
  const max = Math.max(...schools.map((school) => school.visits));
  return (
    <div className="school-bars">
      {schools.map((school) => (
        <button
          className={selected.name === school.name ? 'school-bar active' : 'school-bar'}
          key={school.name}
          onClick={() => onSelect(school)}
          style={{ '--size': `${(school.visits / max) * 100}%` }}
        >
          <span>{school.short}</span>
          <i />
          <strong>{school.visits}</strong>
        </button>
      ))}
    </div>
  );
}

function DetailPanel({ school }) {
  const actionEntries = Object.entries(school.actions).sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <aside className="detail-panel">
      <div className="detail-top">
        <div>
          <p>Unidade selecionada</p>
          <h2>{school.name}</h2>
        </div>
        <span>{school.state}</span>
      </div>
      <div className="detail-grid">
        <b>{school.visits}<small>atendimentos</small></b>
        <b>{formatHours(school.hours)}h<small>horas</small></b>
        <b>{school.participants}<small>participantes</small></b>
      </div>
      <div className="meta-line"><GraduationCap size={16} /> {school.segments}</div>
      <div className="meta-line"><Users size={16} /> {school.responsible}</div>
      <div className="mini-actions">
        {actionEntries.map(([key, value]) => (
          <p key={key}><span>{key}</span><strong>{value}</strong></p>
        ))}
      </div>
      <section>
        <h3>Destaque</h3>
        <p>{school.highlight}</p>
      </section>
      <section>
        <h3>Ponto de atencao</h3>
        <p>{school.attention}</p>
      </section>
    </aside>
  );
}

export default function App() {
  const [mode, setMode] = useState('todos');
  const [selected, setSelected] = useState(schools[0]);
  const totals = useMemo(() => {
    const base = schools.reduce((acc, school) => {
      acc.visits += school.visits;
      acc.hours += school.hours;
      acc.remote += school.remote;
      acc.presencial += school.presencial;
      acc.participants += school.participants;
      return acc;
    }, { visits: 0, hours: 0, remote: 0, presencial: 0, participants: 0 });
    return { ...base, units: 12 };
  }, []);

  return (
    <main className="app-shell">
      <div className="brand-orbits" aria-hidden="true">
        <i className="orbit orbit-a" />
        <i className="orbit orbit-b" />
        <i className="orbit orbit-c" />
        <i className="dot dot-a" />
        <i className="dot dot-b" />
        <i className="dot dot-c" />
      </div>

      <header className="topbar">
        <ZoomMark />
        <nav>
          <a href="#impacto">Impacto</a>
          <a href="#acoes">Acoes</a>
          <a href="#unidades">Unidades</a>
        </nav>
        <button className="play-button"><Play size={16} fill="currentColor" /> Animacao ativa</button>
      </header>

      <section className="hero-grid">
        <div className="hero-copy">
          <div className="title-lockup">
            <MousePointer2 size={30} />
            <h1>REDE ESI</h1>
          </div>
          <p>Resultados de Atendimento 2026</p>
          <div className="mode-switch" aria-label="Filtro por modalidade">
            {['todos', 'remoto', 'presencial'].map((item) => (
              <button key={item} className={mode === item ? 'active' : ''} onClick={() => setMode(item)}>
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="pulse-card">
          <Sparkles size={20} />
          <strong>3 estados</strong>
          <span>RS, PR e SP conectados pela assessoria ZOOM</span>
        </div>
      </section>

      <section className="kpi-grid" id="impacto">
        <KpiCard icon={Activity} value={164} label="Atendimentos realizados" accent="#007ec3" />
        <KpiCard icon={Clock3} value="186,5" suffix="h" label="Horas de atendimento" accent="#ffd500" delay={80} />
        <KpiCard icon={School} value={12} label="Unidades atendidas" accent="#b8cf00" delay={160} />
        <KpiCard icon={Users} value={69} label="Participantes impactados" accent="#ea5b0c" delay={240} />
      </section>

      <section className="dashboard-grid">
        <article className="panel split-panel">
          <div className="panel-heading">
            <div>
              <p>Modalidade</p>
              <h2>Remoto vs presencial</h2>
            </div>
            <MapPin size={20} />
          </div>
          <Donut remote={totals.remote} presencial={totals.presencial} />
        </article>

        <article className="panel wide-panel">
          <div className="panel-heading">
            <div>
              <p>Ritmo mensal</p>
              <h2>Evolucao dos atendimentos</h2>
            </div>
            <BarChart3 size={20} />
          </div>
          <MonthlyChart mode={mode} />
        </article>

        <article className="panel" id="acoes">
          <div className="panel-heading">
            <div>
              <p>Top 3 + eventos</p>
              <h2>Distribuicao por acao</h2>
            </div>
            <RotateCcw size={20} />
          </div>
          <ActionList />
        </article>

        <article className="panel wide-panel rank-panel" id="unidades">
          <div className="panel-heading">
            <div>
              <p>Ranking</p>
              <h2>Atendimentos por escola</h2>
            </div>
            <School size={20} />
          </div>
          <SchoolBars selected={selected} onSelect={setSelected} />
        </article>

        <DetailPanel school={selected} />
      </section>
    </main>
  );
}
