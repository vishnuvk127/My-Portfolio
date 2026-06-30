'use client';

/**
 * DataProductProcess — "How I Ship Data Products"
 * An interactive, premium dark analytics-dashboard section for a
 * Data Analyst / AI-ML Engineer portfolio.
 *
 * Layout: interactive vertical workflow journey on the LEFT, and a live
 * dashboard "box" on the RIGHT (with the Recruiter / Technical toggle docked
 * at its top-right). Selecting a stage on the left updates the right panel,
 * the chart, the animated metrics and KPI chips in real time.
 *
 * Styling lives in DataProductProcess.module.css (a CSS Module).
 * Requires: framer-motion, recharts, lucide-react
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target, Database, Brain, BarChart3, Rocket,
  Play, Square, Sparkles, CheckCircle2, ChevronDown,
  ArrowUpRight, Briefcase, Code2, Activity,
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import styles from './DataProductProcess.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');

/* ──────────────────────────────────────────────────────────────────────────
   DATA — single source of truth. Cards/dashboard/chart all map from here.
   ────────────────────────────────────────────────────────────────────────── */
const STAGES = [
  {
    number: '01',
    title: 'Understand',
    Icon: Target,
    tagline: 'Frame the problem',
    descRecruiter:
      'Clarify the business problem, define KPIs, success metrics, users, and the expected decision impact — before a single line of code.',
    descTechnical:
      'Run discovery, translate ambiguous asks into measurable KPIs, define data contracts, success criteria and acceptance metrics, and map metric trees to source grain.',
    skills: ['Business Analysis', 'KPI Definition', 'Requirement Gathering'],
    tech: ['Metric Trees', 'Stakeholder Mapping', 'Jira', 'Confluence'],
    impact: 'Improved project clarity before development.',
    metricLabel: 'Requirements clarity',
    metricValue: '+35%',
    detailsRecruiter: [
      'Partnered with stakeholders to turn vague requests into clearly defined, measurable success metrics.',
      'Aligned teams on what "done" means up front, heading off rework and scope creep.',
      'Tied every deliverable back to a business KPI so impact was provable from day one.',
    ],
    detailsTechnical: [
      'Built KPI / metric trees mapping each business question to source tables and grain.',
      'Defined data contracts and acceptance criteria that downstream pipelines were validated against.',
      'Documented assumptions and edge cases early to de-risk delivery.',
    ],
    chart: [
      { name: 'W1', value: 18 }, { name: 'W2', value: 26 }, { name: 'W3', value: 33 },
      { name: 'W4', value: 41 }, { name: 'W5', value: 47 }, { name: 'W6', value: 54 },
    ],
  },
  {
    number: '02',
    title: 'Engineer',
    Icon: Database,
    tagline: 'Build the pipeline',
    descRecruiter:
      'Build reliable data pipelines, clean raw data, validate quality, and prepare structured datasets the rest of the workflow can trust.',
    descTechnical:
      'Engineer ETL/ELT pipelines in SQL & Python, enforce data-quality checks, model structured datasets in Snowflake, and orchestrate ingestion with AWS Glue.',
    skills: ['SQL', 'Python', 'ETL', 'Data Validation', 'Snowflake', 'AWS Glue'],
    tech: ['Snowflake', 'AWS Glue', 'Airflow', 'dbt'],
    impact: 'Accelerated dashboard and reporting data readiness.',
    metricLabel: 'Faster dashboards',
    metricValue: '30%',
    detailsRecruiter: [
      'Built SQL/Python data-preparation workflows that clean and validate raw business datasets.',
      'Automated repeatable ETL steps to cut manual reporting delays and improve data reliability.',
      'Delivered structured datasets that powered faster dashboard refreshes and downstream analytics.',
    ],
    detailsTechnical: [
      'Implemented modular ETL in Python with parameterized SQL and idempotent loads into Snowflake.',
      'Added schema + null/row-count validation gates that fail fast on bad upstream data.',
      'Orchestrated ingestion with AWS Glue so curated tables refreshed on a reliable schedule.',
    ],
    chart: [
      { name: 'W1', value: 30 }, { name: 'W2', value: 38 }, { name: 'W3', value: 49 },
      { name: 'W4', value: 58 }, { name: 'W5', value: 66 }, { name: 'W6', value: 72 },
    ],
  },
  {
    number: '03',
    title: 'Model',
    Icon: Brain,
    tagline: 'Predict & uncover',
    descRecruiter:
      'Apply forecasting, segmentation, anomaly detection, and risk scoring to uncover patterns and predict outcomes leaders can act on.',
    descTechnical:
      'Train and evaluate forecasting, clustering, anomaly-detection and risk-scoring models; tune features, validate with proper backtests, and quantify uncertainty.',
    skills: ['Machine Learning', 'Forecasting', 'Risk Scoring', 'Statistical Analysis'],
    tech: ['scikit-learn', 'Prophet', 'XGBoost', 'pandas'],
    impact: 'Improved forecast accuracy and analytical confidence.',
    metricLabel: 'Better forecast accuracy',
    metricValue: '+22%',
    detailsRecruiter: [
      'Built predictive models that surfaced patterns the business could not see in raw reports.',
      'Improved forecast accuracy so planning decisions rested on reliable numbers.',
      'Added risk scoring that flagged issues earlier and raised analytical confidence.',
    ],
    detailsTechnical: [
      'Engineered features and trained forecasting/risk models, benchmarked against naive baselines.',
      'Validated with time-aware backtesting and tracked MAPE/AUC to prevent overfitting.',
      'Packaged models with reproducible pipelines so results were auditable and re-runnable.',
    ],
    chart: [
      { name: 'W1', value: 40 }, { name: 'W2', value: 44 }, { name: 'W3', value: 53 },
      { name: 'W4', value: 61 }, { name: 'W5', value: 70 }, { name: 'W6', value: 78 },
    ],
  },
  {
    number: '04',
    title: 'Visualize',
    Icon: BarChart3,
    tagline: 'Make it decision-ready',
    descRecruiter:
      'Create dashboards and executive reports that make complex data easy to understand and act on.',
    descTechnical:
      'Model semantic layers and DAX measures, design performant Power BI / Tableau dashboards, and apply data-storytelling principles for executive consumption.',
    skills: ['Power BI', 'Tableau', 'DAX', 'Data Storytelling'],
    tech: ['Power BI', 'Tableau', 'DAX', 'Figma'],
    impact: 'Turned complex data into clear business decisions.',
    metricLabel: 'Leaders supported',
    metricValue: '60+',
    detailsRecruiter: [
      'Designed executive dashboards that turned dense data into clear, confident decisions.',
      'Supported 60+ leaders with self-serve views they could read without an analyst.',
      'Replaced static reporting with interactive storytelling that drove faster action.',
    ],
    detailsTechnical: [
      'Built optimized DAX measures and a clean semantic model for fast, consistent metrics.',
      'Designed drill-through Power BI / Tableau dashboards tuned for load performance.',
      'Applied visual-encoding and storytelling best practices for executive readability.',
    ],
    chart: [
      { name: 'W1', value: 35 }, { name: 'W2', value: 47 }, { name: 'W3', value: 56 },
      { name: 'W4', value: 68 }, { name: 'W5', value: 79 }, { name: 'W6', value: 88 },
    ],
  },
  {
    number: '05',
    title: 'Deliver',
    Icon: Rocket,
    tagline: 'Ship & sustain',
    descRecruiter:
      'Automate reporting, monitor model performance, document workflows, and ship solutions real teams rely on every day.',
    descTechnical:
      'Automate refreshes and CI/CD, add model-performance monitoring and alerting, and document workflows so solutions stay reliable in production.',
    skills: ['Automation', 'CI/CD', 'Model Monitoring', 'Documentation'],
    tech: ['GitHub Actions', 'Airflow', 'Docker', 'Grafana'],
    impact: 'Reduced manual effort and improved delivery speed.',
    metricLabel: 'Runtime',
    metricValue: 'Hours → min',
    detailsRecruiter: [
      'Automated reporting so work that took hours now finishes in minutes, hands-free.',
      'Added monitoring that catches model and data drift before it reaches stakeholders.',
      'Documented and handed off workflows so teams could own them with confidence.',
    ],
    detailsTechnical: [
      'Built CI/CD for data jobs with scheduled, retry-safe automated refreshes.',
      'Instrumented model-performance and freshness monitoring with alerting on drift.',
      'Authored runbooks and docs enabling reliable handoff and on-call ownership.',
    ],
    chart: [
      { name: 'W1', value: 50 }, { name: 'W2', value: 60 }, { name: 'W3', value: 71 },
      { name: 'W4', value: 82 }, { name: 'W5', value: 90 }, { name: 'W6', value: 96 },
    ],
  },
];

/* Metric badges → each maps to the stage index it highlights. */
const BADGES = [
  { label: '30% faster dashboards', stage: 1 },
  { label: '22% better forecast accuracy', stage: 2 },
  { label: '$70K annual savings', stage: 4 },
  { label: 'Hours → Minutes runtime', stage: 4 },
];

const ACCENT = '#ff2b2b';

/* ──────────────────────────────────────────────────────────────────────────
   AnimatedNumber — counts up to the numeric part of a metric string while
   preserving any prefix/suffix (e.g. "+35%", "60+"). Non-numeric values
   (e.g. "Hours → min") render as-is.
   ────────────────────────────────────────────────────────────────────────── */
function splitMetric(str) {
  const m = String(str).match(/^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { pre: '', num: null, post: String(str) };
  return { pre: m[1], num: parseFloat(m[2]), post: m[3] };
}

function AnimatedNumber({ value }) {
  const { pre, num, post } = splitMetric(value);
  const [disp, setDisp] = useState(0);

  useEffect(() => {
    if (num == null) return undefined;
    let raf;
    const start = performance.now();
    const dur = 850;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisp(num * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [num, value]);

  if (num == null) return <>{value}</>;
  const shown = Number.isInteger(num) ? Math.round(disp) : disp.toFixed(1);
  return <>{pre}{shown}{post}</>;
}

/* ──────────────────────────────────────────────────────────────────────────
   SkillPill
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

/* ──────────────────────────────────────────────────────────────────────────
   MetricBadge
   ────────────────────────────────────────────────────────────────────────── */
function MetricBadge({ label, active, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={cx(styles.badge, active && styles.on)}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      animate={active ? { boxShadow: '0 0 24px rgba(255,43,43,0.45)' } : { boxShadow: '0 0 0 rgba(255,43,43,0)' }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
    >
      <Activity size={14} strokeWidth={2.4} />
      {label}
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   StageRow — one workflow stage in the left-hand vertical journey.
   ────────────────────────────────────────────────────────────────────────── */
function StageRow({ stage, isActive, isDone, onSelect }) {
  const { number, title, Icon, tagline, metricValue } = stage;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-label={`Stage ${number}: ${title}`}
      aria-pressed={isActive}
      className={cx(styles.row, isActive && styles.rowActive, isDone && styles.rowDone)}
      variants={{ hidden: { opacity: 0, x: -22 }, show: { opacity: 1, x: 0 } }}
      whileHover={{ x: 5 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
    >
      <span className={styles.rowNode}>
        <Icon size={20} strokeWidth={2.1} />
        {isActive && (
          <motion.span
            className={styles.pulse}
            initial={{ opacity: 0.6, scale: 1 }}
            animate={{ opacity: 0, scale: 1.9 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
            aria-hidden
          />
        )}
      </span>

      <span className={styles.rowBody}>
        <span className={styles.rowTop}>
          <span className={styles.rowNum}>{number}</span>
          <span className={styles.rowTitle}>{title}</span>
        </span>
        <span className={styles.rowTag}>{tagline}</span>
      </span>

      <span className={styles.rowMetric}>{metricValue}</span>
    </motion.button>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Custom tooltip for the mini chart
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
   ViewToggle — Recruiter / Technical, docked top-right of the dashboard box.
   ────────────────────────────────────────────────────────────────────────── */
function ViewToggle({ mode, setMode }) {
  return (
    <div className={styles.toggle} role="tablist" aria-label="View mode">
      <button
        type="button" role="tab" aria-selected={mode === 'recruiter'}
        className={mode === 'recruiter' ? styles.on : undefined}
        onClick={() => setMode('recruiter')}
      >
        <Briefcase size={15} strokeWidth={2.2} /> Recruiter
      </button>
      <button
        type="button" role="tab" aria-selected={mode === 'technical'}
        className={mode === 'technical' ? styles.on : undefined}
        onClick={() => setMode('technical')}
      >
        <Code2 size={15} strokeWidth={2.2} /> Technical
      </button>
      <motion.span
        className={styles.toggleInd}
        animate={{ x: mode === 'recruiter' ? 0 : '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ImpactDashboard — the right-hand "box". Reflects active stage + view mode.
   ────────────────────────────────────────────────────────────────────────── */
function ImpactDashboard({ stage, index, mode, setMode, open, onToggle, shipped }) {
  const description = mode === 'recruiter' ? stage.descRecruiter : stage.descTechnical;
  const details = mode === 'recruiter' ? stage.detailsRecruiter : stage.detailsTechnical;
  const { Icon } = stage;
  const progress = ((index + 1) / STAGES.length) * 100;

  return (
    <div className={styles.panel}>
      {/* top bar: live label + stage counter (left), toggle (right) */}
      <div className={styles.panelTop}>
        <div className={styles.panelId}>
          <span className={styles.liveDot} aria-hidden />
          <div>
            <span className={styles.panelKicker}>Live Dashboard</span>
            <div className={styles.panelStage}>
              Stage <strong>{stage.number}</strong> <span>/ {STAGES.length.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
        <ViewToggle mode={mode} setMode={setMode} />
      </div>

      {/* progress bar tied to active stage */}
      <div className={styles.progress} aria-hidden>
        <motion.span
          className={styles.progressFill}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 22 }}
        />
      </div>

      {/* shipped toast */}
      <AnimatePresence>
        {shipped && (
          <motion.div
            className={styles.shipped}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          >
            <CheckCircle2 size={17} strokeWidth={2.4} />
            Data product shipped successfully.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.number + mode}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={styles.panelBody}
        >
          {/* header */}
          <div className={styles.pHead}>
            <span className={styles.pIcon}><Icon size={20} strokeWidth={2.1} /></span>
            <div>
              <span className={styles.pKicker}>{stage.tagline}</span>
              <h3 className={styles.pTitle}>{stage.title}</h3>
            </div>
          </div>

          <p className={styles.pDesc}>{description}</p>

          {/* big metric + live KPI chips */}
          <div className={styles.metricRow}>
            <div className={styles.metricMain}>
              <span className={styles.metricValue}><AnimatedNumber value={stage.metricValue} /></span>
              <span className={styles.metricLabel}>{stage.metricLabel}</span>
            </div>
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedNumber value={String(stage.skills.length)} /></span>
                <span className={styles.statLbl}>Skills</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedNumber value={String(stage.tech.length)} /></span>
                <span className={styles.statLbl}>Tools</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}><AnimatedNumber value={String(index + 1)} />/{STAGES.length}</span>
                <span className={styles.statLbl}>Stage</span>
              </div>
            </div>
          </div>

          {/* chart */}
          <div className={styles.chartHead}>
            <span>Impact over time</span>
            <Sparkles size={14} strokeWidth={2.2} />
          </div>
          <div className={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={140}>
              <AreaChart data={stage.chart} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                <defs>
                  <linearGradient id="dpsFill" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#dpsFill)"
                  activeDot={{ r: 4, fill: ACCENT, stroke: '#fff', strokeWidth: 1 }}
                  isAnimationActive
                  animationDuration={650}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* impact */}
          <div className={styles.impact}>
            <CheckCircle2 size={16} strokeWidth={2.3} />
            <span>{stage.impact}</span>
          </div>

          {/* skills + tech */}
          <div className={styles.group}>
            <span className={styles.groupLabel}>{mode === 'recruiter' ? 'Capabilities' : 'Skills'}</span>
            <div className={styles.pills}>
              {stage.skills.map((s) => <SkillPill key={s}>{s}</SkillPill>)}
            </div>
          </div>
          <div className={styles.group}>
            <span className={styles.groupLabel}>{mode === 'recruiter' ? 'Tooling' : 'Related technologies'}</span>
            <div className={styles.pills}>
              {stage.tech.map((t) => <SkillPill key={t}>{t}</SkillPill>)}
            </div>
          </div>

          {/* details drawer */}
          <button type="button" className={styles.detailsBtn} onClick={onToggle}>
            <span>{open ? 'Hide details' : 'View details'}</span>
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'inline-flex' }}>
              <ChevronDown size={16} strokeWidth={2.4} />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.ul
                className={styles.drawer}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.32, ease: 'easeInOut' }}
              >
                {details.map((d, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.06 * i + 0.05 }}
                  >
                    <ArrowUpRight size={15} strokeWidth={2.4} />
                    <span>{d}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   DataProductProcess — top-level section
   ────────────────────────────────────────────────────────────────────────── */
export default function DataProductProcess() {
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState('recruiter'); // 'recruiter' | 'technical'
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [shipped, setShipped] = useState(false);
  const simRef = useRef(null);

  const stopSim = () => {
    clearInterval(simRef.current);
    simRef.current = null;
    setSimRunning(false);
  };

  const selectStage = (i) => {
    if (simRef.current) stopSim();
    setShipped(false);
    setActive(i);
  };

  const startSim = () => {
    if (simRef.current) { stopSim(); return; }
    setShipped(false);
    setDrawerOpen(false);
    setActive(0);
    setSimRunning(true);
    let i = 0;
    simRef.current = setInterval(() => {
      i += 1;
      if (i > STAGES.length - 1) {
        stopSim();
        setShipped(true);
        setTimeout(() => setShipped(false), 3600);
        return;
      }
      setActive(i);
    }, 1500);
  };

  useEffect(() => () => clearInterval(simRef.current), []);

  return (
    <motion.section
      id="process"
      className={styles.section}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className={styles.inner}>
        {/* HEADER */}
        <div className={styles.header}>
          <span className={styles.eyebrow}><Sparkles size={14} strokeWidth={2.3} /> Workflow</span>
          <h2 className={styles.title}>How I Ship Data Products</h2>
          <p className={styles.sub}>From raw data to dashboards, models, automation, and measurable business impact.</p>
        </div>

        {/* TWO-COLUMN LAYOUT: workflow journey (left) + dashboard box (right) */}
        <div className={styles.layout}>
          {/* LEFT — interactive vertical workflow */}
          <div className={styles.left}>
            <motion.div
              className={styles.flow}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className={styles.flowTrack} aria-hidden />
              <motion.span
                className={styles.flowFill}
                animate={{ height: `${(active / (STAGES.length - 1)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                aria-hidden
              />
              {STAGES.map((stage, i) => (
                <StageRow
                  key={stage.number}
                  stage={stage}
                  isActive={i === active}
                  isDone={i < active}
                  onSelect={() => selectStage(i)}
                />
              ))}
            </motion.div>

            {/* metric badges */}
            <div className={styles.badges}>
              {BADGES.map((b) => (
                <MetricBadge key={b.label} label={b.label} active={b.stage === active} onClick={() => selectStage(b.stage)} />
              ))}
            </div>

            {/* simulation control */}
            <button type="button" className={cx(styles.sim, simRunning && styles.running)} onClick={startSim}>
              {simRunning ? <Square size={15} strokeWidth={2.4} /> : <Play size={15} strokeWidth={2.4} />}
              {simRunning ? 'Stop simulation' : 'Live Workflow Simulation'}
            </button>
          </div>

          {/* RIGHT — dashboard box */}
          <div className={styles.right}>
            <ImpactDashboard
              stage={STAGES[active]}
              index={active}
              mode={mode}
              setMode={setMode}
              open={drawerOpen}
              onToggle={() => setDrawerOpen((v) => !v)}
              shipped={shipped}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
