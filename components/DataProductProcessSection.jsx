'use client';

/**
 * DataProductProcessSection — "How I Ship Data Products"
 * Premium interactive dark analytics-dashboard section.
 *
 * Stack: Next.js (App Router) · JavaScript · CSS Modules ·
 *        Framer Motion · Recharts · Lucide React · React Icons (Simple Icons)
 * Install: npm install framer-motion recharts lucide-react react-icons
 *
 * Recruiter View and Technical View render fully distinct content, and every
 * Skills Gained / Technologies Used item shows a matching icon/logo.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Target, Database, Brain, BarChart3, Rocket,
  Play, Square, Sparkles, CheckCircle2, ChevronDown, ArrowUpRight,
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

/* ──────────────────────────────────────────────────────────────────────────
   ICON MAPS
   Skills → Lucide icons (fallback: Layers)
   Technologies → Simple Icons logos where available, else clean Lucide
   semantic icons (fallback: Code2). Everything renders in monochrome and
   inherits the pill's colour (red / white), never brand colours.
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
   DATA — 5 stages, each with fully separate recruiter + technical content
   ────────────────────────────────────────────────────────────────────────── */
const stages = [
  {
    number: '01',
    title: 'Understand',
    Icon: Target,
    tagline: 'Frame the problem',
    metricValue: '+35%',
    metricLabel: 'Requirements clarity',
    description: 'Clarify the business problem, define KPIs, success metrics, users, and expected decision impact.',
    skills: ['Business Analysis', 'KPI Definition', 'Requirement Gathering', 'Data Validation', 'Stakeholder Communication'],
    technologies: ['JIRA', 'Confluence', 'Excel', 'SQL'],
    recruiter: {
      headline: 'Turning unclear business needs into a clear analytics roadmap.',
      summary:
        'I start by understanding the business problem, the people who will use the solution, and the decisions the work needs to support. This helps avoid building dashboards or models that look good but do not solve the real problem.',
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
      summary:
        'I converted business questions into measurable analytical requirements, identified source systems, defined data validation rules, and documented how each KPI should be calculated.',
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
    metricValue: '30%',
    metricLabel: 'Faster dashboards',
    description: 'Build reliable data pipelines, clean raw data, validate quality, and prepare structured datasets for analysis.',
    skills: ['SQL Development', 'Python Automation', 'ETL Pipeline Design', 'Data Cleaning', 'Data Quality Control', 'Workflow Automation'],
    technologies: ['SQL', 'Python', 'AWS Glue', 'Snowflake', 'Airflow'],
    recruiter: {
      headline: 'Building reliable data foundations for faster reporting.',
      summary:
        'I focused on making raw business data clean, trusted, and ready for decision-making. Instead of relying on manual reporting steps, I helped create repeatable workflows that made dashboards faster and more reliable.',
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
      summary:
        'I built SQL and Python-based data preparation workflows to clean, transform, validate, and structure data for reporting and downstream analytics.',
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
    metricValue: '+22%',
    metricLabel: 'Better forecast accuracy',
    description: 'Apply forecasting, segmentation, anomaly detection, and risk scoring models to uncover patterns and predict outcomes.',
    skills: ['Machine Learning', 'Forecasting', 'Risk Scoring', 'Feature Engineering', 'Model Validation', 'Statistical Analysis'],
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'XGBoost', 'LightGBM', 'ARIMA'],
    recruiter: {
      headline: 'Using models to turn data patterns into business predictions.',
      summary:
        'I used analytical and machine learning methods to help teams understand trends, predict outcomes, and identify risk earlier. This made the work more valuable than basic reporting because it supported forward-looking decisions.',
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
      summary:
        'I worked on model workflows involving feature preparation, algorithm selection, validation, and performance comparison to improve prediction quality.',
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
    metricValue: '60+',
    metricLabel: 'Leaders supported',
    description: 'Create dashboards and executive reports that make complex data easy to understand and act on.',
    skills: ['Dashboard Design', 'KPI Reporting', 'Data Storytelling', 'DAX', 'Executive Reporting', 'Data Visualization'],
    technologies: ['Power BI', 'Tableau', 'DAX', 'SQL', 'Excel'],
    recruiter: {
      headline: 'Making complex data easy for leaders to act on.',
      summary:
        'I designed dashboards that helped business users quickly understand performance, trends, risks, and opportunities without needing to dig through raw data.',
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
      summary:
        'I built dashboard layers that connected cleaned datasets with business KPIs, interactive filters, executive summaries, and performance-focused visuals.',
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
    metricValue: 'Hours → min',
    metricLabel: 'Runtime',
    description: 'Automate reporting, monitor model performance, document workflows, and ship solutions used by real teams.',
    skills: ['Automation', 'CI/CD', 'Model Monitoring', 'Documentation', 'Workflow Scheduling', 'Production Handoff'],
    technologies: ['Git', 'CI/CD', 'Confluence', 'Airflow', 'SQL', 'Python'],
    recruiter: {
      headline: 'Shipping solutions that teams can actually use.',
      summary:
        'I focused on delivering work that was not just technically complete, but practical, repeatable, documented, and useful for real business users.',
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
      summary:
        'I supported delivery by automating repeatable tasks, documenting workflows, monitoring outputs, and creating handoff-ready analytics solutions.',
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

/* Clickable metric badges (icon + metric + stage label). */
const metrics = [
  { label: 'Requirements clarity +35%', stageLabel: 'Understand', stage: 0, Icon: Gauge },
  { label: '30% faster dashboards', stageLabel: 'Engineer', stage: 1, Icon: Database },
  { label: '22% better forecast accuracy', stageLabel: 'Model', stage: 2, Icon: Brain },
  { label: '60+ leaders supported', stageLabel: 'Visualize', stage: 3, Icon: BarChart3 },
  { label: 'Hours → minutes runtime', stageLabel: 'Deliver', stage: 4, Icon: Rocket },
  { label: '$70K annual savings', stageLabel: 'Engineer', stage: 1, Icon: TrendingUp },
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
   SkillPill / TechPill — icon + label, monochrome, hover glow, aria-label
   ────────────────────────────────────────────────────────────────────────── */
function SkillPill({ label }) {
  const Ic = skillIconMap[label] || SKILL_FALLBACK;
  return (
    <motion.span
      className={styles.pill}
      role="listitem"
      aria-label={`Skill: ${label}`}
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
    >
      <span className={styles.pillIcon} aria-hidden><Ic size={15} /></span>
      {label}
    </motion.span>
  );
}

function TechPill({ label }) {
  const Ic = techIconMap[label] || TECH_FALLBACK;
  return (
    <motion.span
      className={cx(styles.pill, styles.techPill)}
      role="listitem"
      aria-label={`Technology: ${label}`}
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
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
      animate={{ scale: isActive ? 1.03 : 1 }}
      whileHover={{ y: -4 }}
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

/* ──────────────────────────────────────────────────────────────────────────
   MetricBadge — icon + metric + stage label
   ────────────────────────────────────────────────────────────────────────── */
function MetricBadge({ label, stageLabel, Icon, active, onClick }) {
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
      <span className={styles.badgeIcon} aria-hidden><Icon size={16} strokeWidth={2.2} /></span>
      <span className={styles.badgeText}>
        <span className={styles.badgeMetric}>{label}</span>
        <span className={styles.badgeStage}>{stageLabel}</span>
      </span>
    </motion.button>
  );
}

/* Pipeline — glowing connector under the cards (decorative). */
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

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={styles.tip}>
      <span className={styles.tipX}>{label}</span>
      <span className={styles.tipV}>{payload[0].value}</span>
    </div>
  );
}

/* InfoBlock — labelled paragraph used for role / impact / contribution / etc. */
function InfoBlock({ label, text, accent }) {
  return (
    <div className={cx(styles.info, accent && styles.infoAccent)}>
      <span className={styles.infoLabel}>{label}</span>
      <p className={styles.infoText}>{text}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ImpactDashboard — renders DISTINCT recruiter vs technical content
   ────────────────────────────────────────────────────────────────────────── */
function ImpactDashboard({ stage, mode, drawerOpen, onToggleDrawer }) {
  const { Icon } = stage;
  const view = mode === 'recruiter' ? stage.recruiter : stage.technical;
  const chartData = chartDataByStage[stage.number];
  const BulletIcon = mode === 'recruiter' ? CheckCircle2 : Code2;

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
          {/* LEFT — narrative differs entirely by view */}
          <div className={styles.panelMain}>
            <div className={styles.panelHead}>
              <span className={styles.panelIcon} aria-hidden><Icon size={22} strokeWidth={2.1} /></span>
              <div>
                <span className={styles.panelKicker}>
                  Stage {stage.number} · {mode === 'recruiter' ? 'Recruiter View' : 'Technical View'}
                </span>
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
                  <Area type="monotone" dataKey="value" stroke={ACCENT} strokeWidth={2.4} fill="url(#dppFill)" activeDot={{ r: 4, fill: ACCENT, stroke: '#fff', strokeWidth: 1 }} isAnimationActive animationDuration={650} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT — skills, technologies (with icons), contribution drawer */}
          <div className={styles.panelSide}>
            <div className={styles.group}>
              <span className={styles.groupLabel}>Skills Gained</span>
              <div className={styles.pills} role="list">
                {stage.skills.map((s) => <SkillPill key={s} label={s} />)}
              </div>
            </div>

            <div className={styles.group}>
              <span className={styles.groupLabel}>Technologies Used</span>
              <div className={styles.pills} role="list">
                {stage.technologies.map((t) => <TechPill key={t} label={t} />)}
              </div>
            </div>

            <button
              type="button"
              className={styles.detailsBtn}
              onClick={onToggleDrawer}
              aria-expanded={drawerOpen}
            >
              <span>{drawerOpen ? 'Hide contribution' : `View ${mode === 'recruiter' ? 'business impact' : 'technical'} details`}</span>
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
                  {view.points.map((p, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * i + 0.05 }}
                    >
                      <span className={styles.drawerIcon} aria-hidden><BulletIcon size={15} strokeWidth={2.3} /></span>
                      <span>{p}</span>
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

/* SimulationProgress — bottom status bar with 01…05 markers. */
function SimulationProgress({ active, running }) {
  return (
    <div className={styles.simBar}>
      <div className={styles.simStatus}>
        <span className={cx(styles.simStatusIcon, running && styles.simStatusIconRun)} aria-hidden>
          {running ? <Activity size={16} strokeWidth={2.4} /> : <Play size={16} strokeWidth={2.4} />}
        </span>
        <div>
          <span className={styles.simStatusLabel}>Simulation status</span>
          <span className={cx(styles.simStatusValue, running && styles.simStatusValueRun)}>{running ? 'Running' : 'Ready'}</span>
        </div>
      </div>

      <div className={styles.simTrack} aria-hidden>
        {stages.map((s, i) => (
          <div key={s.number} className={styles.simStep}>
            {i > 0 && <span className={cx(styles.simLine, (i <= active) && styles.simLineOn)} />}
            <span className={cx(styles.simNode, (i < active) && styles.simNodeDone, (i === active) && styles.simNodeActive)}>{s.number}</span>
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

/* SuccessToast */
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

  useEffect(() => () => { if (simRef.current) clearInterval(simRef.current); }, []);

  const activeStage = stages[active];
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
            <button type="button" className={cx(styles.sim, running && styles.simRunning)} onClick={startSim}>
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
            <ProcessCard key={stage.number} stage={stage} isActive={i === active} isDone={i < active} onSelect={() => selectStage(i)} />
          ))}
        </motion.div>

        <Pipeline active={active} />

        {/* METRIC BADGES */}
        <div className={styles.badges}>
          {metrics.map((m) => (
            <MetricBadge key={m.label} label={m.label} stageLabel={m.stageLabel} Icon={m.Icon} active={m.stage === active} onClick={() => selectStage(m.stage)} />
          ))}
        </div>

        {/* DASHBOARD PANEL */}
        <ImpactDashboard stage={activeStage} mode={mode} drawerOpen={drawerOpen} onToggleDrawer={() => setDrawerOpen((v) => !v)} />

        {/* SIMULATION STATUS BAR */}
        <SimulationProgress active={active} running={running} />
      </div>

      <SuccessToast show={shipped} />
    </motion.section>
  );
}
