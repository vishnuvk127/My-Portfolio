'use client';

/**
 * DataProductProcessSection — "How I Ship Data Products"
 * Premium interactive dark analytics-dashboard section.
 *
 * Stack: Next.js (App Router) · JavaScript · CSS Modules ·
 *        Framer Motion · Recharts · Lucide React · React Icons (Simple Icons)
 * Install: npm install framer-motion recharts lucide-react react-icons
 *
 * Behaviour:
 *  - Stat boxes are hidden by default and reveal only for the clicked stage,
 *    positioned under that stage's card with a glowing connector wire
 *    (Stage 2 uses a branching connector for its two stats).
 *  - Clicking a stage runs a timed flow: show stats (5s) → hide → the
 *    dashboard auto-switches Recruiter → Technical (unless the user switches
 *    manually). All timers are ref-managed and cleaned up.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Target, Database, Brain, BarChart3, Rocket,
  Play, Square, Sparkles, CheckCircle2,
  Briefcase, BriefcaseBusiness, Code2, Activity, Gauge, ClipboardList,
  FileCheck, Users, Workflow, Filter, ShieldCheck, LineChart, Settings,
  Sigma, Presentation, PieChart, GitBranch, Cog, TrendingUp, Cloud,
  FileSpreadsheet, Boxes, Layers,
} from 'lucide-react';
import {
  SiPython, SiSnowflake, SiApacheairflow, SiScikitlearn, SiPandas, SiNumpy,
  SiGit, SiJira, SiConfluence, SiPostgresql, SiMysql,
} from 'react-icons/si';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import styles from './DataProductProcessSection.module.css';

const cx = (...c) => c.filter(Boolean).join(' ');
const ACCENT = '#ff2b2b';

/* Timing for the click / simulation flow (ms) — tweak freely. */
const METRIC_VISIBLE_MS = 5000; // metric stays visible before the pulse
const PULSE_MS = 1000;          // magnetic pulse flow duration (metric → dashboard)
const RECRUITER_MS = 5000;      // Recruiter View shown before auto-switch to Technical
const DASH_GLOW_MS = 1500;      // dashboard focus glow duration
const TECH_PULSE_MS = 1200;     // Technical-view arrival pulse duration
const SIM_STEP_GAP_MS = 1500;   // pause on Technical before the next simulation stage

/* ──────────────────────────────────────────────────────────────────────────
   ICON MAPS — Skills (Lucide) / Technologies (Simple Icons + Lucide fallbacks)
   ────────────────────────────────────────────────────────────────────────── */
const skillIconMap = {
  'Business Analysis': BriefcaseBusiness,
  'KPI Definition': Gauge,
  'Requirement Gathering': ClipboardList,
  'Data Validation': FileCheck,
  'Stakeholder Communication': Users,
  'SQL Development': Database,
  'Python Automation': Code2,
  'ETL Pipeline Design': Workflow,
  'Data Cleaning': Filter,
  'Data Quality Control': ShieldCheck,
  'Workflow Automation': Workflow,
  'Machine Learning': Brain,
  'Forecasting': LineChart,
  'Risk Scoring': ShieldCheck,
  'Feature Engineering': Settings,
  'Model Validation': FileCheck,
  'Statistical Analysis': Sigma,
  'Dashboard Design': BarChart3,
  'KPI Reporting': Gauge,
  'Data Storytelling': Presentation,
  'DAX': Sigma,
  'Executive Reporting': ClipboardList,
  'Data Visualization': PieChart,
  'Automation': Workflow,
  'CI/CD': GitBranch,
  'Model Monitoring': Activity,
  'Documentation': FileCheck,
  'Workflow Scheduling': Cog,
  'Production Handoff': Rocket,
};

const techIconMap = {
  JIRA: SiJira,
  Confluence: SiConfluence,
  Excel: FileSpreadsheet,        // Simple Icons dropped the Excel logo
  SQL: Database,
  Python: SiPython,
  'AWS Glue': Cloud,             // Simple Icons dropped the AWS logo
  Snowflake: SiSnowflake,
  Airflow: SiApacheairflow,
  'Scikit-learn': SiScikitlearn,
  Pandas: SiPandas,
  NumPy: SiNumpy,
  XGBoost: Boxes,
  LightGBM: Boxes,
  ARIMA: LineChart,
  'Power BI': BarChart3,         // Simple Icons dropped the Power BI logo
  Tableau: PieChart,            // Simple Icons dropped the Tableau logo
  DAX: Sigma,
  Git: SiGit,
  'CI/CD': GitBranch,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
};

const SKILL_FALLBACK = Layers;
const TECH_FALLBACK = Code2;

/* ──────────────────────────────────────────────────────────────────────────
   DATA — 5 stages, distinct recruiter + technical content, plus per-stage stats
   ────────────────────────────────────────────────────────────────────────── */
const stages = [
  {
    number: '01',
    title: 'Understand',
    Icon: Target,
    tagline: 'Frame the problem',
    description: 'Clarify the business problem, define KPIs, success metrics, users, and expected decision impact.',
    skills: ['Business Analysis', 'KPI Definition', 'Requirement Gathering', 'Data Validation', 'Stakeholder Communication'],
    technologies: ['JIRA', 'Confluence', 'Excel', 'SQL'],
    stats: [{ value: '+35%', label: 'Requirements clarity', Icon: Gauge }],
    recruiter: {
      headline: 'Turning unclear business needs into a clear analytics roadmap.',
      summary: 'I start by understanding the business problem, the people who will use the solution, and the decisions the work needs to support. This helps avoid building dashboards or models that look good but do not solve the real problem.',
      role: 'I translated stakeholder needs into clear KPIs, success measures, and project requirements before development started.',
      businessImpact: 'Improved project clarity by 35% and reduced the risk of rework by aligning data work with business goals from the beginning.',
      points: [
        'Built a clear requirement structure before any dashboard or model development.',
        'Defined KPIs and success metrics so the final output had measurable value.',
        'Reduced confusion between business users and technical implementation by documenting the workflow clearly.',
      ],
    },
    technical: {
      headline: 'Requirement mapping, KPI design, and source-system discovery.',
      summary: 'I converted business questions into measurable analytical requirements, identified source systems, defined data validation rules, and documented how each KPI should be calculated.',
      contribution: 'Mapped business requirements to data fields, created KPI definitions, reviewed source availability, and prepared documentation in JIRA and Confluence.',
      implementation: 'Used SQL checks, Excel validation, requirement documentation, and stakeholder feedback loops to confirm that the analysis had a reliable foundation.',
      points: [
        'Mapped business requirements to source data fields and defined precise KPI calculation logic.',
        'Reviewed source-system availability and set data validation rules before development.',
        'Documented requirements and feedback loops in JIRA and Confluence with SQL / Excel validation checks.',
      ],
    },
  },
  {
    number: '02',
    title: 'Engineer',
    Icon: Database,
    tagline: 'Build the pipeline',
    description: 'Build reliable data pipelines, clean raw data, validate quality, and prepare structured datasets for analysis.',
    skills: ['SQL Development', 'Python Automation', 'ETL Pipeline Design', 'Data Cleaning', 'Data Quality Control', 'Workflow Automation'],
    technologies: ['SQL', 'Python', 'AWS Glue', 'Snowflake', 'Airflow'],
    stats: [
      { value: '30%', label: 'Faster dashboards', Icon: Database },
      { value: '$70K', label: 'Annual savings', Icon: TrendingUp },
    ],
    recruiter: {
      headline: 'Building reliable data foundations for faster reporting.',
      summary: 'I focused on making raw business data clean, trusted, and ready for decision-making. Instead of relying on manual reporting steps, I helped create repeatable workflows that made dashboards faster and more reliable.',
      role: 'I played a key role in preparing structured datasets, improving data quality, and reducing delays in dashboard refresh cycles.',
      businessImpact: 'Improved dashboard readiness by 30% and helped business teams access cleaner insights faster.',
      points: [
        'Built repeatable data preparation workflows instead of relying on manual cleanup.',
        'Added validation checks to improve trust in dashboard and reporting data.',
        'Helped reduce dashboard delays by preparing cleaner and faster datasets.',
      ],
    },
    technical: {
      headline: 'ETL automation, validation logic, and analytics-ready data modeling.',
      summary: 'I built SQL and Python-based data preparation workflows to clean, transform, validate, and structure data for reporting and downstream analytics.',
      contribution: 'Created ETL workflows, added validation checks, handled missing or inconsistent values, and optimized transformations for faster dashboard performance.',
      implementation: 'Used SQL, Python, AWS Glue, Snowflake, and Airflow-style workflow logic to automate repeatable data preparation steps.',
      points: [
        'Built SQL + Python ETL workflows to clean, transform, and structure raw data.',
        'Added validation checks and handled missing / inconsistent values for trusted datasets.',
        'Automated repeatable preparation using AWS Glue, Snowflake, and Airflow-style scheduling.',
      ],
    },
  },
  {
    number: '03',
    title: 'Model',
    Icon: Brain,
    tagline: 'Predict & uncover',
    description: 'Apply forecasting, segmentation, anomaly detection, and risk scoring models to uncover patterns and predict outcomes.',
    skills: ['Machine Learning', 'Forecasting', 'Risk Scoring', 'Feature Engineering', 'Model Validation', 'Statistical Analysis'],
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'XGBoost', 'LightGBM', 'ARIMA'],
    stats: [{ value: '+22%', label: 'Better forecast accuracy', Icon: Brain }],
    recruiter: {
      headline: 'Using models to turn data patterns into business predictions.',
      summary: 'I used analytical and machine learning methods to help teams understand trends, predict outcomes, and identify risk earlier. This made the work more valuable than basic reporting because it supported forward-looking decisions.',
      role: 'I contributed to building forecasting, segmentation, anomaly detection, and risk-scoring logic that improved decision confidence.',
      businessImpact: 'Improved forecast accuracy by 22% and helped teams make faster, more confident planning decisions.',
      points: [
        'Prepared model-ready datasets through feature engineering and validation.',
        'Tested forecasting and risk-scoring approaches to improve prediction quality.',
        'Improved forecast accuracy by 22%, helping teams rely more confidently on model outputs.',
      ],
    },
    technical: {
      headline: 'Feature engineering, model training, validation, and performance improvement.',
      summary: 'I worked on model workflows involving feature preparation, algorithm selection, validation, and performance comparison to improve prediction quality.',
      contribution: 'Applied statistical modeling and machine learning techniques including ARIMA, XGBoost, LightGBM, anomaly detection logic, and risk scoring methods.',
      implementation: 'Used Python, Scikit-learn, Pandas, NumPy, ARIMA, XGBoost, and LightGBM-style workflows to test patterns, validate accuracy, and improve model output.',
      points: [
        'Engineered features and prepared model-ready datasets for training.',
        'Applied ARIMA, XGBoost, LightGBM, anomaly detection, and risk-scoring techniques.',
        'Validated accuracy with Scikit-learn, Pandas, and NumPy workflows and compared model performance.',
      ],
    },
  },
  {
    number: '04',
    title: 'Visualize',
    Icon: BarChart3,
    tagline: 'Make it decision-ready',
    description: 'Create dashboards and executive reports that make complex data easy to understand and act on.',
    skills: ['Dashboard Design', 'KPI Reporting', 'Data Storytelling', 'DAX', 'Executive Reporting', 'Data Visualization'],
    technologies: ['Power BI', 'Tableau', 'DAX', 'SQL', 'Excel'],
    stats: [{ value: '60+', label: 'Leaders supported', Icon: BarChart3 }],
    recruiter: {
      headline: 'Making complex data easy for leaders to act on.',
      summary: 'I designed dashboards that helped business users quickly understand performance, trends, risks, and opportunities without needing to dig through raw data.',
      role: 'I converted complex analytical outputs into clean dashboards, KPI views, and reporting layouts that supported leadership decisions.',
      businessImpact: 'Supported 60+ leaders with dashboards and reports that improved visibility into business performance.',
      points: [
        'Built dashboards that simplified complex business and analytical data.',
        'Created KPI views and filters that helped users explore trends faster.',
        'Supported leadership reporting by making insights easier to understand and act on.',
      ],
    },
    technical: {
      headline: 'Dashboard modeling, DAX logic, KPI design, and reporting optimization.',
      summary: 'I built dashboard layers that connected cleaned datasets with business KPIs, interactive filters, executive summaries, and performance-focused visuals.',
      contribution: 'Created Power BI and Tableau dashboards, wrote DAX measures, optimized SQL queries, and designed KPI layouts for usability and clarity.',
      implementation: 'Used Power BI, Tableau, DAX, SQL, and dashboard design principles to create reporting views for business and leadership teams.',
      points: [
        'Built Power BI and Tableau dashboards connected to cleaned datasets and KPIs.',
        'Wrote DAX measures and optimized SQL queries for reporting performance.',
        'Designed KPI layouts, filters, and executive summaries for usability.',
      ],
    },
  },
  {
    number: '05',
    title: 'Deliver',
    Icon: Rocket,
    tagline: 'Ship & sustain',
    description: 'Automate reporting, monitor model performance, document workflows, and ship solutions used by real teams.',
    skills: ['Automation', 'CI/CD', 'Model Monitoring', 'Documentation', 'Workflow Scheduling', 'Production Handoff'],
    technologies: ['Git', 'CI/CD', 'Confluence', 'Airflow', 'SQL', 'Python'],
    stats: [{ value: 'Hours → min', label: 'Runtime', Icon: Rocket }],
    recruiter: {
      headline: 'Shipping solutions that teams can actually use.',
      summary: 'I focused on delivering work that was not just technically complete, but practical, repeatable, documented, and useful for real business users.',
      role: 'I helped move analytics work from one-time analysis into repeatable dashboards, automated workflows, and documented processes.',
      businessImpact: 'Reduced manual effort and improved delivery speed by turning slow workflows from hours into minutes.',
      points: [
        'Converted manual analytical work into repeatable and documented workflows.',
        'Improved maintainability by organizing logic, assumptions, and handoff notes.',
        'Helped reduce runtime from hours to minutes through automation and workflow optimization.',
      ],
    },
    technical: {
      headline: 'Automation, monitoring, documentation, and production-ready delivery.',
      summary: 'I supported delivery by automating repeatable tasks, documenting workflows, monitoring outputs, and creating handoff-ready analytics solutions.',
      contribution: 'Used Git, CI/CD concepts, Airflow-style scheduling, documentation, and monitoring logic to make solutions easier to maintain.',
      implementation: 'Created reusable workflows, documented assumptions, tracked changes, and improved repeatability across analytics and reporting processes.',
      points: [
        'Automated repeatable tasks with Git, CI/CD concepts, and Airflow-style scheduling.',
        'Added monitoring and documentation for maintainable, handoff-ready solutions.',
        'Tracked changes and organized logic / assumptions to improve repeatability.',
      ],
    },
  },
];

/* Chart series keyed by stage number → "Impact over time". */
const chartDataByStage = {
  '01': [{ name: 'W1', value: 18 }, { name: 'W2', value: 26 }, { name: 'W3', value: 33 }, { name: 'W4', value: 41 }, { name: 'W5', value: 47 }, { name: 'W6', value: 54 }],
  '02': [{ name: 'W1', value: 30 }, { name: 'W2', value: 38 }, { name: 'W3', value: 49 }, { name: 'W4', value: 58 }, { name: 'W5', value: 66 }, { name: 'W6', value: 72 }],
  '03': [{ name: 'W1', value: 40 }, { name: 'W2', value: 44 }, { name: 'W3', value: 53 }, { name: 'W4', value: 61 }, { name: 'W5', value: 70 }, { name: 'W6', value: 78 }],
  '04': [{ name: 'W1', value: 35 }, { name: 'W2', value: 47 }, { name: 'W3', value: 56 }, { name: 'W4', value: 68 }, { name: 'W5', value: 79 }, { name: 'W6', value: 88 }],
  '05': [{ name: 'W1', value: 50 }, { name: 'W2', value: 60 }, { name: 'W3', value: 71 }, { name: 'W4', value: 82 }, { name: 'W5', value: 90 }, { name: 'W6', value: 96 }],
};

/* ──────────────────────────────────────────────────────────────────────────
   Pill — one component for both lists; `kind` picks the icon map, the
   accent class, and the screen-reader prefix.
   ────────────────────────────────────────────────────────────────────────── */
const PILL_KINDS = {
  skill: { iconMap: skillIconMap, fallback: SKILL_FALLBACK, srPrefix: 'Skill', extraClass: null },
  tech: { iconMap: techIconMap, fallback: TECH_FALLBACK, srPrefix: 'Technology', extraClass: 'techPill' },
};

function Pill({ label, kind = 'skill' }) {
  const { iconMap, fallback, srPrefix, extraClass } = PILL_KINDS[kind];
  const Ic = iconMap[label] || fallback;
  return (
    <motion.span
      className={cx(styles.pill, extraClass && styles[extraClass])}
      role="listitem"
      aria-label={`${srPrefix}: ${label}`}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <span className={styles.pillIcon} aria-hidden><Ic size={15} /></span>
      {label}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ProcessCard — clickable workflow stage with mouse-follow glow + 3D tilt
   ────────────────────────────────────────────────────────────────────────── */
function ProcessCard({ stage, isActive, isDone, onSelect }) {
  const { number, title, Icon, description } = stage;
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(px * 100).toFixed(2)}%`);
    el.style.setProperty('--my', `${(py * 100).toFixed(2)}%`);
    el.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((px - 0.5) * 10).toFixed(2)}deg`);
  };
  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onSelect}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      aria-pressed={isActive}
      aria-label={`Stage ${number}: ${title}`}
      className={cx(styles.card, isActive && styles.cardActive, isDone && styles.cardDone)}
      whileHover={{ y: -4 }}
      animate={{ scale: isActive ? 1.03 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      <span className={styles.cardGlow} aria-hidden />
      <span className={styles.cardTilt}>
        <span className={styles.cardTop}>
          <span className={styles.cardNum}>{number}</span>
          <span className={styles.cardIcon} aria-hidden><Icon size={22} strokeWidth={2.1} /></span>
        </span>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardDesc}>{description}</span>
      </span>
    </motion.button>
  );
}

/* Pipeline — glowing horizontal connector under the cards (decorative). */
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

/* StatBox — a single metric card that pops in with a red glow. */
function StatBox({ value, label, Icon, stageLabel }) {
  return (
    <div className={styles.statBox}>
      <span className={styles.statBoxIcon} aria-hidden><Icon size={18} strokeWidth={2.2} /></span>
      <span className={styles.statBoxValue}>{value}</span>
      <span className={styles.statBoxLabel}>{label}</span>
      <span className={styles.statBoxStage}>{stageLabel}</span>
    </div>
  );
}

/* BranchConnector — decorative "{" tree wire that splits to two stat boxes. */
function BranchConnector() {
  return (
    <svg className={styles.branch} viewBox="0 0 240 46" preserveAspectRatio="none" aria-hidden>
      <path className={styles.branchPath} d="M120 0 V14 Q120 26 100 26 H44" />
      <path className={styles.branchPath} d="M120 0 V14 Q120 26 140 26 H196" />
    </svg>
  );
}

/* StatGroup — the reveal for a stage: connector wire(s) + stat box(es). */
function StatGroup({ stage, colIndex, mobile }) {
  const isDouble = stage.stats.length > 1;
  const style = (!mobile && typeof colIndex === 'number')
    ? { gridColumn: isDouble ? '1 / 4' : `${colIndex + 1}` }
    : undefined;
  return (
    <motion.div
      className={cx(styles.statCell, isDouble && styles.statCellDouble, mobile && styles.statCellMobile)}
      style={style}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {isDouble && !mobile ? <BranchConnector /> : <span className={styles.wire} aria-hidden />}
      <div className={styles.statBoxes}>
        {stage.stats.map((s) => <StatBox key={s.label} value={s.value} label={s.label} Icon={s.Icon} stageLabel={stage.title} />)}
      </div>
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.tip}>
      <span className={styles.tipX}>{label}</span>
      <span className={styles.tipV}>{payload[0].value}</span>
    </div>
  );
}

/* InfoBlock — labelled paragraph for role / impact / contribution / etc. */
function InfoBlock({ label, text, accent }) {
  return (
    <div className={cx(styles.info, accent && styles.infoAccent)}>
      <span className={styles.infoLabel}>{label}</span>
      <p className={styles.infoText}>{text}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ImpactDashboard — distinct recruiter vs technical content
   ────────────────────────────────────────────────────────────────────────── */
function ImpactDashboard({ stage, mode }) {
  const { Icon } = stage;
  const view = mode === 'recruiter' ? stage.recruiter : stage.technical;
  const chartData = chartDataByStage[stage.number];
  const BulletIcon = mode === 'recruiter' ? CheckCircle2 : Code2;
  // The headline metric is always the stage's first stat — kept in one place
  // rather than repeated as separate metricValue / metricLabel fields.
  const headlineStat = stage.stats[0];

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
          <div className={styles.panelMain}>
            <div className={styles.panelHead}>
              <span className={styles.panelIcon} aria-hidden><Icon size={22} strokeWidth={2.1} /></span>
              <div>
                <span className={styles.panelKicker}>Stage {stage.number} · {mode === 'recruiter' ? 'Recruiter View' : 'Technical View'}</span>
                <h3 className={styles.panelTitle}>{stage.title}</h3>
              </div>
            </div>

            <p className={styles.panelHeadline}>{view.headline}</p>
            <p className={styles.panelDesc}>{view.summary}</p>

            {mode === 'recruiter' ? (
              <>
                <InfoBlock label="My Role" text={view.role} />
                <InfoBlock label="Business Impact" text={view.businessImpact} accent />
              </>
            ) : (
              <>
                <InfoBlock label="Technical Contribution" text={view.contribution} />
                <InfoBlock label="Implementation Details" text={view.implementation} />
              </>
            )}

            <div className={styles.metricBox}>
              <span className={styles.metricValue}>{headlineStat.value}</span>
              <span className={styles.metricLabel}>{headlineStat.label}</span>
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
                  <Area type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.4} fill="url(#dppFill)" activeDot={{ r: 4, fill: ACCENT, stroke: '#fff', strokeWidth: 1 }} isAnimationActive animationDuration={650} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={styles.panelSide}>
            <div className={styles.group}>
              <span className={styles.groupLabel}>Skills Gained</span>
              <div className={styles.pills} role="list">
                {stage.skills.map((s) => <Pill key={s} kind="skill" label={s} />)}
              </div>
            </div>

            <div className={styles.group}>
              <span className={styles.groupLabel}>Technologies Used</span>
              <div className={styles.pills} role="list">
                {stage.technologies.map((t) => <Pill key={t} kind="tech" label={t} />)}
              </div>
            </div>

            <div className={styles.group}>
              <span className={styles.groupLabel}>Contribution</span>
              <motion.ul className={styles.drawer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
                {view.points.map((p, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.06 * i + 0.05 }}>
                    <span className={styles.drawerIcon} aria-hidden><BulletIcon size={15} strokeWidth={2.3} /></span>
                    <span>{p}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* SuccessToast */
function SuccessToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div className={styles.toast} role="status" initial={{ opacity: 0, y: 24, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.95 }} transition={{ type: 'spring', stiffness: 320, damping: 22 }}>
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
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('recruiter'); // 'recruiter' | 'technical'
  const [visibleMetricStageIndex, setVisibleMetricStageIndex] = useState(null);
  const [isMetricVisible, setIsMetricVisible] = useState(false);
  const [isPulseActive, setIsPulseActive] = useState(false);
  const [isDashboardFocused, setIsDashboardFocused] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [successToastVisible, setSuccessToastVisible] = useState(false);
  const [techPulse, setTechPulse] = useState(false);

  const timersRef = useRef([]);
  const manualRef = useRef(false);
  const simRunningRef = useRef(false);
  const metricAreaRef = useRef(null);
  const dashboardRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const addTimer = (id) => { timersRef.current.push(id); return id; };
  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const scrollTo = (ref) => {
    if (ref.current && typeof ref.current.scrollIntoView === 'function') {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // The full timed flow for one stage — used by both a manual click and the
  // Live Workflow Simulation. See the timing constants above for each step.
  const runStageFlow = (i) => {
    clearTimers();
    manualRef.current = false;
    setActiveStageIndex(i);
    setViewMode('recruiter');
    setVisibleMetricStageIndex(i);
    setIsMetricVisible(true);
    setIsPulseActive(false);
    setTechPulse(false);

    // scroll the metric card into center once it has rendered
    addTimer(setTimeout(() => scrollTo(metricAreaRef), 90));

    // 5s → magnetic pulse flow from metric toward the dashboard
    addTimer(setTimeout(() => setIsPulseActive(true), METRIC_VISIBLE_MS));

    // 6s → hide metric, focus the dashboard (scroll + glow), Recruiter View
    addTimer(setTimeout(() => {
      setIsPulseActive(false);
      setIsMetricVisible(false);
      setVisibleMetricStageIndex(null);
      scrollTo(dashboardRef);
      setIsDashboardFocused(true);
      addTimer(setTimeout(() => setIsDashboardFocused(false), DASH_GLOW_MS));
    }, METRIC_VISIBLE_MS + PULSE_MS));

    // 11s → switch to Technical (unless the user changed the view manually)
    addTimer(setTimeout(() => {
      if (!manualRef.current) {
        setViewMode('technical');
        setTechPulse(true);
        addTimer(setTimeout(() => setTechPulse(false), TECH_PULSE_MS));
      }
      if (simRunningRef.current) {
        if (i < stages.length - 1) {
          addTimer(setTimeout(() => runStageFlow(i + 1), SIM_STEP_GAP_MS));
        } else {
          addTimer(setTimeout(() => {
            simRunningRef.current = false;
            setIsSimulationRunning(false);
            setSuccessToastVisible(true);
            addTimer(setTimeout(() => setSuccessToastVisible(false), 3600));
          }, SIM_STEP_GAP_MS));
        }
      }
    }, METRIC_VISIBLE_MS + PULSE_MS + RECRUITER_MS));
  };

  // Click a stage card → run the flow (as a one-off, not the simulation).
  const selectStage = (i) => {
    simRunningRef.current = false;
    setIsSimulationRunning(false);
    runStageFlow(i);
  };

  // Manual toggle — updates the view immediately and cancels the auto-switch.
  const changeView = (m) => {
    manualRef.current = true;
    setViewMode(m);
  };

  const stopSim = () => {
    simRunningRef.current = false;
    setIsSimulationRunning(false);
    clearTimers();
    setIsPulseActive(false);
  };

  const startSim = () => {
    if (simRunningRef.current) { stopSim(); return; }
    clearTimers();
    setSuccessToastVisible(false);
    simRunningRef.current = true;
    setIsSimulationRunning(true);
    runStageFlow(0);
  };

  // Clean up every timer on unmount.
  useEffect(() => () => { clearTimers(); simRunningRef.current = false; }, []);

  const activeStage = stages[activeStageIndex];
  const showStats = isMetricVisible && visibleMetricStageIndex !== null;
  const fadeIn = reduceMotion
    ? {}
    : { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.12 }, transition: { duration: 0.6, ease: 'easeOut' } };

  return (
    <motion.section id="process" className={styles.section} aria-labelledby="dpp-heading" {...fadeIn}>
      <div className={styles.inner}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headLeft}>
            <span className={styles.eyebrow}><Sparkles size={14} strokeWidth={2.3} aria-hidden /> My Process</span>
            <h2 id="dpp-heading" className={styles.title}>How I Ship <span className={styles.titleAccent}>Data Products</span></h2>
            <p className={styles.sub}>From raw data to dashboards, models, automation, and measurable business impact.</p>
          </div>

          <div className={styles.headRight}>
            <button type="button" className={cx(styles.sim, isSimulationRunning && styles.simRunning)} onClick={startSim}>
              {isSimulationRunning ? <Square size={15} strokeWidth={2.4} aria-hidden /> : <Play size={15} strokeWidth={2.4} aria-hidden />}
              {isSimulationRunning ? 'Stop simulation' : 'Live Workflow Simulation'}
            </button>

            <div className={styles.toggle} role="group" aria-label="View mode">
              <button type="button" aria-pressed={viewMode === 'recruiter'} className={cx(styles.toggleBtn, viewMode === 'recruiter' && styles.toggleOn)} onClick={() => changeView('recruiter')}>
                <Briefcase size={15} strokeWidth={2.2} aria-hidden /> Recruiter View
              </button>
              <button type="button" aria-pressed={viewMode === 'technical'} className={cx(styles.toggleBtn, viewMode === 'technical' && styles.toggleOn)} onClick={() => changeView('technical')}>
                <Code2 size={15} strokeWidth={2.2} aria-hidden /> Technical View
              </button>
            </div>
          </div>
        </div>

        {/* WORKFLOW */}
        <div className={styles.workflow}>
          <motion.div
            className={styles.cards}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
            initial={reduceMotion ? undefined : 'hidden'}
            whileInView={reduceMotion ? undefined : 'show'}
            viewport={{ once: true, amount: 0.2 }}
          >
            {stages.map((stage, i) => (
              <motion.div
                key={stage.number}
                className={styles.cardCell}
                variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                <ProcessCard stage={stage} isActive={i === activeStageIndex} isDone={i < activeStageIndex} onSelect={() => selectStage(i)} />

                {/* MOBILE: stat reveal directly below the clicked card */}
                <div className={styles.statInlineMobile}>
                  <AnimatePresence>
                    {showStats && visibleMetricStageIndex === i && (
                      <StatGroup stage={stage} mobile />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Pipeline active={activeStageIndex} />

          {/* DESKTOP / TABLET: stat reveal aligned under the selected stage.
              Collapses to zero height when no metric is visible (no empty gap). */}
          <div className={styles.statRow} ref={metricAreaRef}>
            <AnimatePresence>
              {showStats && (
                <StatGroup
                  key={visibleMetricStageIndex}
                  stage={stages[visibleMetricStageIndex]}
                  colIndex={visibleMetricStageIndex}
                />
              )}
            </AnimatePresence>
          </div>

          {/* MAGNETIC PULSE FLOW — energy travelling metric → dashboard */}
          <div className={styles.pulseLane} aria-hidden>
            <AnimatePresence>
              {isPulseActive && (
                <motion.div
                  className={styles.pulse}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className={styles.pulseLine} />
                  <span className={styles.pulseDot} />
                  <span className={cx(styles.pulseDot, styles.pulseDotB)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* DASHBOARD PANEL */}
        <div
          ref={dashboardRef}
          className={cx(styles.dashWrap, isDashboardFocused && styles.dashFocused, techPulse && styles.techPulse)}
        >
          <ImpactDashboard stage={activeStage} mode={viewMode} />
        </div>
      </div>

      <SuccessToast show={successToastVisible} />
    </motion.section>
  );
}
