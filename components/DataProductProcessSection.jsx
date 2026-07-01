'use client';

/**
 * DataProductProcessSection — "How I Ship Data Products"
 * A premium, interactive dark analytics-dashboard section for a
 * Data Analyst / AI-ML Engineer portfolio.
 *
 * Stack: Next.js (App Router) · JavaScript · CSS Modules ·
 *        Framer Motion · Recharts · Lucide React
 * Install: npm install framer-motion recharts lucide-react
 *
 * All styling lives in DataProductProcessSection.module.css.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Target, Database, Brain, BarChart3, Rocket,
  Play, Square, Sparkles, CheckCircle2, ChevronDown,
  ArrowUpRight, Briefcase, Code2, Activity, Wrench, Lightbulb,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import styles from './DataProductProcessSection.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const ACCENT = '#ff2b2b';

/* ──────────────────────────────────────────────────────────────────────────
   DATA — single source of truth
   ────────────────────────────────────────────────────────────────────────── */
const stages = [
  {
    number: '01',
    title: 'Understand',
    Icon: Target,
    tagline: 'Frame the problem',
    descRecruiter:
      'Clarify the business problem, define KPIs, success metrics, users, and expected decision impact.',
    descTechnical:
      'Run discovery, translate ambiguous asks into measurable KPIs, define data contracts and acceptance criteria, and map metric trees to source-table grain.',
    skills: ['Business Analysis', 'KPI Definition', 'Requirement Gathering'],
    technologies: ['JIRA', 'Confluence', 'Excel', 'SQL'],
    impact: 'Improved project clarity before development.',
    metricValue: '+35%',
    metricLabel: 'Requirements clarity',
    whatIBuilt:
      'Turned vague stakeholder requests into clearly defined KPIs, success metrics, and a documented scope.',
    howISolved:
      'Ran discovery sessions, built metric trees mapping each question to source data, and set acceptance criteria up front.',
    businessImpact:
      'Improved project clarity ~35% before development, heading off rework and scope creep.',
  },
  {
    number: '02',
    title: 'Engineer',
    Icon: Database,
    tagline: 'Build the pipeline',
    descRecruiter:
      'Build reliable data pipelines, clean raw data, validate quality, and prepare structured datasets for analysis.',
    descTechnical:
      'Engineer modular ETL/ELT in SQL & Python, enforce schema and data-quality gates, model curated tables in Snowflake, and orchestrate ingestion with AWS Glue + Airflow.',
    skills: ['SQL', 'Python', 'ETL', 'Data Validation', 'Snowflake', 'AWS Glue'],
    technologies: ['SQL', 'Python', 'AWS Glue', 'Snowflake', 'Airflow'],
    impact: 'Accelerated dashboard and reporting data readiness.',
    metricValue: '30%',
    metricLabel: 'Faster dashboards',
    whatIBuilt:
      'Built SQL/Python-based data preparation workflows to clean and validate raw business datasets.',
    howISolved:
      'Automated repeatable ETL steps, added data-quality checks, and optimized pipeline performance.',
    businessImpact:
      'Accelerated dashboard readiness by 30%, improved data reliability, and supported faster decisions.',
  },
  {
    number: '03',
    title: 'Model',
    Icon: Brain,
    tagline: 'Predict & uncover',
    descRecruiter:
      'Apply forecasting, segmentation, anomaly detection, and risk scoring models to uncover patterns and predict outcomes.',
    descTechnical:
      'Engineer features and train forecasting, clustering, anomaly-detection and risk-scoring models; validate with time-aware backtests and track MAPE / AUC.',
    skills: ['Machine Learning', 'Forecasting', 'Risk Scoring', 'Statistical Analysis'],
    technologies: ['Python', 'LightGBM', 'XGBoost', 'ARIMA', 'Scikit-learn'],
    impact: 'Improved forecast accuracy and analytical confidence.',
    metricValue: '+22%',
    metricLabel: 'Better forecast accuracy',
    whatIBuilt:
      'Built forecasting, segmentation, anomaly detection, and risk scoring models using Python and ML libraries.',
    howISolved:
      'Engineered features, trained and validated models, handled data-quality issues, and optimized model accuracy.',
    businessImpact:
      'Improved forecast accuracy by 22%, helping teams make faster and more confident business decisions.',
  },
  {
    number: '04',
    title: 'Visualize',
    Icon: BarChart3,
    tagline: 'Make it decision-ready',
    descRecruiter:
      'Create dashboards and executive reports that make complex data easy to understand and act on.',
    descTechnical:
      'Model semantic layers and DAX measures, design performant Power BI / Tableau dashboards with drill-through, and apply data-storytelling for executive consumption.',
    skills: ['Power BI', 'Tableau', 'DAX', 'Data Storytelling'],
    technologies: ['Power BI', 'Tableau', 'DAX', 'SQL'],
    impact: 'Turned complex data into clear business decisions.',
    metricValue: '60+',
    metricLabel: 'Leaders supported',
    whatIBuilt:
      'Designed executive dashboards and reports that turned dense data into clear, self-serve views.',
    howISolved:
      'Built optimized DAX measures and a clean semantic model, tuned for load performance and readability.',
    businessImpact:
      'Supported 60+ leaders with decision-ready dashboards, driving faster and more confident action.',
  },
  {
    number: '05',
    title: 'Deliver',
    Icon: Rocket,
    tagline: 'Ship & sustain',
    descRecruiter:
      'Automate reporting, monitor model performance, document workflows, and ship solutions used by real teams.',
    descTechnical:
      'Automate refreshes and CI/CD, instrument model-performance and freshness monitoring with alerting, and document runbooks for reliable handoff.',
    skills: ['Automation', 'CI/CD', 'Model Monitoring', 'Documentation'],
    technologies: ['Git', 'CI/CD', 'Confluence', 'Airflow'],
    impact: 'Reduced manual effort and improved delivery speed.',
    metricValue: 'Hours → min',
    metricLabel: 'Runtime',
    whatIBuilt:
      'Automated reporting and delivery pipelines, with monitoring and documentation for real teams.',
    howISolved:
      'Built CI/CD for data jobs, added drift and freshness monitoring, and authored runbooks for handoff.',
    businessImpact:
      'Cut runtime from hours to minutes and reduced manual effort across delivery.',
  },
];

/* Clickable metric badges → each maps to the stage index it highlights. */
const metrics = [
  { label: '30% faster dashboards', stage: 1 },
  { label: '22% better forecast accuracy', stage: 2 },
  { label: '$70K annual savings', stage: 4 },
  { label: 'Hours → Minutes runtime', stage: 4 },
];

/* Chart series keyed by stage number → "Impact over time". */
const chartDataByStage = {
  '01': [
    { name: 'W1', value: 18 }, { name: 'W2', value: 26 }, { name: 'W3', value: 33 },
    { name: 'W4', value: 41 }, { name: 'W5', value: 47 }, { name: 'W6', value: 54 },
  ],
  '02': [
    { name: 'W1', value: 30 }, { name: 'W2', value: 38 }, { name: 'W3', value: 49 },
    { name: 'W4', value: 58 }, { name: 'W5', value: 66 }, { name: 'W6', value: 72 },
  ],
  '03': [
    { name: 'W1', value: 40 }, { name: 'W2', value: 44 }, { name: 'W3', value: 53 },
    { name: 'W4', value: 61 }, { name: 'W5', value: 70 }, { name: 'W6', value: 78 },
  ],
  '04': [
    { name: 'W1', value: 35 }, { name: 'W2', value: 47 }, { name: 'W3', value: 56 },
    { name: 'W4', value: 68 }, { name: 'W5', value: 79 }, { name: 'W6', value: 88 },
  ],
  '05': [
    { name: 'W1', value: 50 }, { name: 'W2', value: 60 }, { name: 'W3', value: 71 },
    { name: 'W4', value: 82 }, { name: 'W5', value: 90 }, { name: 'W6', value: 96 },
  ],
};

/* ──────────────────────────────────────────────────────────────────────────
   SkillPill / TechPill
   ────────────────────────────────────────────────────────────────────────── */
function SkillPill({ children }) {
  return (
    <motion.span
      className={styles.pill}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      {children}
    </motion.span>
  );
}

function TechPill({ children }) {
  return (
    <motion.span
      className={cx(styles.pill, styles.techPill)}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <span className={styles.techDot} aria-hidden />
      {children}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ProcessCard — one clickable workflow stage
   ────────────────────────────────────────────────────────────────────────── */
function ProcessCard({ stage, isActive, isDone, onSelect }) {
  const { number, title, Icon, descRecruiter } = stage;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      aria-label={`Stage ${number}: ${title}`}
      className={cx(styles.card, isActive && styles.cardActive, isDone && styles.cardDone)}
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
      animate={{ scale: isActive ? 1.04 : 1 }}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardNum}>{number}</span>
        <span className={styles.cardIcon} aria-hidden>
          <Icon size={22} strokeWidth={2.1} />
        </span>
      </div>
      <span className={styles.cardTitle}>{title}</span>
      <span className={styles.cardDesc}>{descRecruiter}</span>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   MetricBadge
   ────────────────────────────────────────────────────────────────────────── */
function MetricBadge({ label, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cx(styles.badge, active && styles.badgeActive)}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
    >
      <span className={styles.badgeIcon} aria-hidden><Activity size={15} strokeWidth={2.4} /></span>
      {label}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Pipeline — glowing connector under the cards (decorative)
   ────────────────────────────────────────────────────────────────────────── */
function Pipeline({ active }) {
  const fill = `${(active / (stages.length - 1)) * 80}%`;
  return (
    <div className={styles.pipeline} aria-hidden>
      <span className={styles.pipeTrack} />
      <span className={styles.pipeFill} style={{ width: fill }} />
      {stages.map((s, i) => (
        <span key={s.number} className={styles.pipeCell}>
          <span className={cx(styles.pipeDot, (i < active) && styles.pipeDotDone, (i === active) && styles.pipeDotActive)} />
        </span>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Chart tooltip
   ────────────────────────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.tip}>
      <span className={styles.tipX}>{label}</span>
      <span className={styles.tipV}>{payload[0].value}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ImpactDashboard — dynamic panel reflecting active stage + view mode
   ────────────────────────────────────────────────────────────────────────── */
function ImpactDashboard({ stage, mode, drawerOpen, onToggleDrawer }) {
  const { Icon } = stage;
  const description = mode === 'recruiter' ? stage.descRecruiter : stage.descTechnical;
  const chartData = chartDataByStage[stage.number];

  const drawer = [
    { Icon: Wrench, label: 'What I built', text: stage.whatIBuilt },
    { Icon: Lightbulb, label: 'How I solved it', text: stage.howISolved },
    { Icon: ArrowUpRight, label: 'Business impact', text: stage.businessImpact },
  ];

  return (
    <div className={styles.panel}>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.number + mode}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={styles.panelGrid}
        >
          {/* LEFT — identity, description, impact, metric, chart */}
          <div className={styles.panelMain}>
            <div className={styles.panelHead}>
              <span className={styles.panelIcon} aria-hidden><Icon size={22} strokeWidth={2.1} /></span>
              <div>
                <span className={styles.panelKicker}>Stage {stage.number} · {stage.tagline}</span>
                <h3 className={styles.panelTitle}>{stage.title}</h3>
              </div>
            </div>

            <p className={styles.panelDesc}>{description}</p>

            <div className={styles.impact}>
              <CheckCircle2 size={16} strokeWidth={2.3} aria-hidden />
              <span><strong>Impact:</strong> {stage.impact}</span>
            </div>

            <div className={styles.metricBox}>
              <span className={styles.metricValue}>{stage.metricValue}</span>
              <span className={styles.metricLabel}>{stage.metricLabel}</span>
            </div>

            <div className={styles.chartHead}>
              <span>Impact over time</span>
              <Sparkles size={14} strokeWidth={2.2} aria-hidden />
            </div>
            <div className={styles.chartWrap}>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dppFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT} stopOpacity={0.55} />
                      <stop offset="100%" stopColor={ACCENT} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: ACCENT, strokeOpacity: 0.4 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={ACCENT}
                    strokeWidth={2.4}
                    fill="url(#dppFill)"
                    activeDot={{ r: 4, fill: ACCENT, stroke: '#fff', strokeWidth: 1 }}
                    isAnimationActive
                    animationDuration={650}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT — skills, technologies, details drawer */}
          <div className={styles.panelSide}>
            <div className={styles.group}>
              <span className={styles.groupLabel}>{mode === 'recruiter' ? 'Skills gained' : 'Skills'}</span>
              <div className={styles.pills}>
                {stage.skills.map((s) => <SkillPill key={s}>{s}</SkillPill>)}
              </div>
            </div>

            <div className={styles.group}>
              <span className={styles.groupLabel}>Technologies used</span>
              <div className={styles.pills}>
                {stage.technologies.map((t) => <TechPill key={t}>{t}</TechPill>)}
              </div>
            </div>

            <button
              type="button"
              className={styles.detailsBtn}
              onClick={onToggleDrawer}
              aria-expanded={drawerOpen}
            >
              <span>{drawerOpen ? 'Hide details' : 'View details'}</span>
              <motion.span animate={{ rotate: drawerOpen ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'inline-flex' }} aria-hidden>
                <ChevronDown size={16} strokeWidth={2.4} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {drawerOpen && (
                <motion.ul
                  className={styles.drawer}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: 'easeInOut' }}
                >
                  {drawer.map((d, i) => (
                    <motion.li
                      key={d.label}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i + 0.05 }}
                    >
                      <span className={styles.drawerIcon} aria-hidden><d.Icon size={15} strokeWidth={2.4} /></span>
                      <span>
                        <strong className={styles.drawerLabel}>{d.label}</strong>
                        {d.text}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SimulationProgress — bottom status bar with 01…05 markers
   ────────────────────────────────────────────────────────────────────────── */
function SimulationProgress({ active, running }) {
  return (
    <div className={styles.simBar}>
      <div className={styles.simStatus}>
        <span className={cx(styles.simStatusIcon, running && styles.simStatusIconRun)} aria-hidden>
          {running ? <Activity size={16} strokeWidth={2.4} /> : <Play size={16} strokeWidth={2.4} />}
        </span>
        <div>
          <span className={styles.simStatusLabel}>Simulation status</span>
          <span className={cx(styles.simStatusValue, running && styles.simStatusValueRun)}>
            {running ? 'Running' : 'Ready'}
          </span>
        </div>
      </div>

      <div className={styles.simTrack} aria-hidden>
        {stages.map((s, i) => (
          <div key={s.number} className={styles.simStep}>
            {i > 0 && <span className={cx(styles.simLine, (i <= active) && styles.simLineOn)} />}
            <span className={cx(styles.simNode, (i < active) && styles.simNodeDone, (i === active) && styles.simNodeActive)}>
              {s.number}
            </span>
          </div>
        ))}
      </div>

      <p className={styles.simHint}>
        Click <strong>Live Workflow Simulation</strong> to watch the full journey.
        <Rocket size={15} strokeWidth={2.2} aria-hidden />
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   SuccessToast
   ────────────────────────────────────────────────────────────────────────── */
function SuccessToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className={styles.toast}
          role="status"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        >
          <CheckCircle2 size={18} strokeWidth={2.4} aria-hidden />
          Data product shipped successfully.
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DataProductProcessSection — top-level component
   ────────────────────────────────────────────────────────────────────────── */
export default function DataProductProcessSection() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState('recruiter'); // 'recruiter' | 'technical'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [shipped, setShipped] = useState(false);
  const simRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const stopSim = () => {
    if (simRef.current) clearInterval(simRef.current);
    simRef.current = null;
    setRunning(false);
  };

  const selectStage = (i) => {
    stopSim();
    setShipped(false);
    setActive(i);
  };

  const startSim = () => {
    if (simRef.current) { stopSim(); return; }
    setShipped(false);
    setDrawerOpen(false);
    setActive(0);
    setRunning(true);
    let i = 0;
    simRef.current = setInterval(() => {
      i += 1;
      if (i > stages.length - 1) {
        stopSim();
        setShipped(true);
        setTimeout(() => setShipped(false), 3600);
        return;
      }
      setActive(i);
    }, 1500);
  };

  // Clean up the interval on unmount to avoid memory leaks.
  useEffect(() => () => { if (simRef.current) clearInterval(simRef.current); }, []);

  const activeStage = stages[active];
  const fadeIn = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.6, ease: 'easeOut' } };

  return (
    <motion.section
      id="process"
      className={styles.section}
      aria-labelledby="dpp-heading"
      {...fadeIn}
    >
      <div className={styles.inner}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headLeft}>
            <span className={styles.eyebrow}><Sparkles size={14} strokeWidth={2.3} aria-hidden /> My Process</span>
            <h2 id="dpp-heading" className={styles.title}>
              How I Ship <span className={styles.titleAccent}>Data Products</span>
            </h2>
            <p className={styles.sub}>From raw data to dashboards, models, automation, and measurable business impact.</p>
          </div>

          <div className={styles.headRight}>
            <button
              type="button"
              className={cx(styles.sim, running && styles.simRunning)}
              onClick={startSim}
            >
              {running ? <Square size={15} strokeWidth={2.4} aria-hidden /> : <Play size={15} strokeWidth={2.4} aria-hidden />}
              {running ? 'Stop simulation' : 'Live Workflow Simulation'}
            </button>

            <div className={styles.toggle} role="group" aria-label="View mode">
              <button
                type="button"
                aria-pressed={mode === 'recruiter'}
                className={cx(styles.toggleBtn, mode === 'recruiter' && styles.toggleOn)}
                onClick={() => setMode('recruiter')}
              >
                <Briefcase size={15} strokeWidth={2.2} aria-hidden /> Recruiter View
              </button>
              <button
                type="button"
                aria-pressed={mode === 'technical'}
                className={cx(styles.toggleBtn, mode === 'technical' && styles.toggleOn)}
                onClick={() => setMode('technical')}
              >
                <Code2 size={15} strokeWidth={2.2} aria-hidden /> Technical View
              </button>
            </div>
          </div>
        </div>

        {/* WORKFLOW CARDS + PIPELINE */}
        <motion.div
          className={styles.cards}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
          initial={reduceMotion ? undefined : 'hidden'}
          whileInView={reduceMotion ? undefined : 'show'}
          viewport={{ once: true, amount: 0.2 }}
        >
          {stages.map((stage, i) => (
            <ProcessCard
              key={stage.number}
              stage={stage}
              isActive={i === active}
              isDone={i < active}
              onSelect={() => selectStage(i)}
            />
          ))}
        </motion.div>

        <Pipeline active={active} />

        {/* METRIC BADGES */}
        <div className={styles.badges}>
          {metrics.map((m) => (
            <MetricBadge
              key={m.label}
              label={m.label}
              active={m.stage === active}
              onClick={() => selectStage(m.stage)}
            />
          ))}
        </div>

        {/* DASHBOARD PANEL */}
        <ImpactDashboard
          stage={activeStage}
          mode={mode}
          drawerOpen={drawerOpen}
          onToggleDrawer={() => setDrawerOpen((v) => !v)}
        />

        {/* SIMULATION STATUS BAR */}
        <SimulationProgress active={active} running={running} />
      </div>

      {/* SUCCESS TOAST */}
      <SuccessToast show={shipped} />
    </motion.section>
  );
}
