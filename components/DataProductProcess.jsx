'use client';

/**
 * DataProductProcess — "How I Ship Data Products"
 * An interactive, premium dark analytics-dashboard section for a
 * Data Analyst / AI-ML Engineer portfolio.
 *
 * Self-contained: all data + styles live in this file. Styling uses Next.js'
 * built-in styled-jsx (no Tailwind required), so it drops straight into a
 * CSS-Modules project without any global config.
 *
 * Requires: framer-motion, recharts, lucide-react
 *   npm install framer-motion recharts lucide-react
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
   SkillPill
   ────────────────────────────────────────────────────────────────────────── */
function SkillPill({ children }) {
  return (
    <motion.span
      className="dps-pill"
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
      className={`dps-badge ${active ? 'on' : ''}`}
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
   ProcessCard — one workflow stage (node + card). Renders its own connector
   segment so the timeline stays continuous on mobile regardless of height.
   ────────────────────────────────────────────────────────────────────────── */
function ProcessCard({ stage, index, isActive, isDone, onSelect }) {
  const { number, title, Icon, tagline, metricValue } = stage;
  return (
    <motion.div
      className={`dps-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0 },
      }}
    >
      {/* vertical connector segment (mobile timeline only) */}
      {index > 0 && <span className={`dps-seg ${isDone || isActive ? 'lit' : ''}`} aria-hidden />}

      <button type="button" className="dps-nodeWrap" onClick={onSelect} aria-label={`Stage ${number}: ${title}`}>
        <motion.span
          className="dps-node"
          animate={isActive
            ? { scale: 1.12, boxShadow: '0 0 0 4px rgba(255,43,43,0.18), 0 0 30px rgba(255,43,43,0.55)' }
            : { scale: 1, boxShadow: '0 0 0 0 rgba(255,43,43,0)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <Icon size={22} strokeWidth={2.1} />
        </motion.span>
      </button>

      <motion.button
        type="button"
        onClick={onSelect}
        className="dps-card"
        animate={{
          scale: isActive ? 1.04 : 1,
          opacity: isActive ? 1 : 0.62,
        }}
        whileHover={{ opacity: 1, y: -2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <span className="dps-card-num">{number}</span>
        <span className="dps-card-title">{title}</span>
        <span className="dps-card-tag">{tagline}</span>
        <span className="dps-card-metric">{metricValue}</span>
      </motion.button>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Custom tooltip for the mini chart
   ────────────────────────────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="dps-tip">
      <span className="dps-tip-x">{label}</span>
      <span className="dps-tip-v">{payload[0].value}</span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ImpactDashboard — dynamic panel that reflects the active stage + view mode
   ────────────────────────────────────────────────────────────────────────── */
function ImpactDashboard({ stage, mode, open, onToggle }) {
  const description = mode === 'recruiter' ? stage.descRecruiter : stage.descTechnical;
  const details = mode === 'recruiter' ? stage.detailsRecruiter : stage.detailsTechnical;
  const { Icon } = stage;

  return (
    <div className="dps-dash">
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.number + mode}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
          className="dps-dash-grid"
        >
          {/* LEFT — narrative */}
          <div className="dps-dash-main">
            <div className="dps-dash-head">
              <span className="dps-dash-icon"><Icon size={20} strokeWidth={2.1} /></span>
              <div>
                <span className="dps-dash-kicker">Stage {stage.number}</span>
                <h3 className="dps-dash-title">{stage.title}</h3>
              </div>
            </div>

            <p className="dps-dash-desc">{description}</p>

            <div className="dps-impact">
              <CheckCircle2 size={16} strokeWidth={2.3} />
              <span>{stage.impact}</span>
            </div>

            <div className="dps-group">
              <span className="dps-group-label">{mode === 'recruiter' ? 'Capabilities' : 'Skills'}</span>
              <div className="dps-pills">
                {stage.skills.map((s) => <SkillPill key={s}>{s}</SkillPill>)}
              </div>
            </div>

            <div className="dps-group">
              <span className="dps-group-label">{mode === 'recruiter' ? 'Tooling' : 'Related technologies'}</span>
              <div className="dps-pills">
                {stage.tech.map((t) => <SkillPill key={t}>{t}</SkillPill>)}
              </div>
            </div>

            <button type="button" className="dps-details-btn" onClick={onToggle}>
              <span>{open ? 'Hide details' : 'View details'}</span>
              <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }} style={{ display: 'inline-flex' }}>
                <ChevronDown size={16} strokeWidth={2.4} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  className="dps-drawer"
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
          </div>

          {/* RIGHT — metric + chart */}
          <div className="dps-dash-side">
            <div className="dps-metric">
              <span className="dps-metric-value">{stage.metricValue}</span>
              <span className="dps-metric-label">{stage.metricLabel}</span>
            </div>

            <div className="dps-chart-head">
              <span>Impact over time</span>
              <Sparkles size={14} strokeWidth={2.2} />
            </div>

            <div className="dps-chartWrap">
              <ResponsiveContainer width="100%" height={150}>
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
          </div>
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

  const activeBadge = (b) => b.stage === active;
  const fillWidth = `${(active / (STAGES.length - 1)) * 80}%`;

  return (
    <motion.section
      id="process"
      className="dps"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="dps-inner">
        {/* HEADER */}
        <div className="dps-header">
          <div className="dps-heading">
            <span className="dps-eyebrow"><Sparkles size={14} strokeWidth={2.3} /> Workflow</span>
            <h2 className="dps-title">How I Ship Data Products</h2>
            <p className="dps-sub">From raw data to dashboards, models, automation, and measurable business impact.</p>
          </div>

          <div className="dps-toggle" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'recruiter'}
              className={mode === 'recruiter' ? 'on' : ''}
              onClick={() => setMode('recruiter')}
            >
              <Briefcase size={15} strokeWidth={2.2} /> Recruiter
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'technical'}
              className={mode === 'technical' ? 'on' : ''}
              onClick={() => setMode('technical')}
            >
              <Code2 size={15} strokeWidth={2.2} /> Technical
            </button>
            <motion.span
              className="dps-toggle-ind"
              animate={{ x: mode === 'recruiter' ? 0 : '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          </div>
        </div>

        {/* WORKFLOW */}
        <motion.div
          className="dps-steps"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* horizontal pipeline (desktop/tablet) */}
          <span className="dps-track" aria-hidden />
          <span className="dps-trackFill" style={{ width: fillWidth }} aria-hidden />

          {STAGES.map((stage, i) => (
            <ProcessCard
              key={stage.number}
              stage={stage}
              index={i}
              isActive={i === active}
              isDone={i < active}
              onSelect={() => selectStage(i)}
            />
          ))}
        </motion.div>

        {/* CONTROLS: metric badges + simulation */}
        <div className="dps-controls">
          <div className="dps-badges">
            {BADGES.map((b) => (
              <MetricBadge key={b.label} label={b.label} active={activeBadge(b)} onClick={() => selectStage(b.stage)} />
            ))}
          </div>

          <button type="button" className={`dps-sim ${simRunning ? 'running' : ''}`} onClick={startSim}>
            {simRunning ? <Square size={15} strokeWidth={2.4} /> : <Play size={15} strokeWidth={2.4} />}
            {simRunning ? 'Stop simulation' : 'Live Workflow Simulation'}
          </button>
        </div>

        {/* SUCCESS MESSAGE */}
        <AnimatePresence>
          {shipped && (
            <motion.div
              className="dps-shipped"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <CheckCircle2 size={18} strokeWidth={2.4} />
              Data product shipped successfully.
            </motion.div>
          )}
        </AnimatePresence>

        {/* DASHBOARD PANEL */}
        <ImpactDashboard
          stage={STAGES[active]}
          mode={mode}
          open={drawerOpen}
          onToggle={() => setDrawerOpen((v) => !v)}
        />
      </div>

      {/* ───────────────────────────── STYLES ───────────────────────────── */}
      <style jsx>{`
        .dps {
          position: relative;
          background: #0b0b0f;
          color: #fff;
          padding: 96px 6vw;
          overflow: hidden;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        /* dotted data-grid + soft red glow */
        .dps::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 40%, transparent 100%);
          pointer-events: none;
        }
        .dps::after {
          content: '';
          position: absolute;
          top: -10%;
          left: 50%;
          width: 70vw;
          height: 480px;
          transform: translateX(-50%);
          background: radial-gradient(circle, rgba(255, 43, 43, 0.16), transparent 65%);
          filter: blur(40px);
          pointer-events: none;
        }
        .dps-inner { position: relative; max-width: 1180px; margin: 0 auto; z-index: 1; }

        /* HEADER */
        .dps-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 28px;
          margin-bottom: 56px;
          flex-wrap: wrap;
        }
        .dps-eyebrow {
          display: inline-flex; align-items: center; gap: 7px;
          color: ${ACCENT}; font-size: 12.5px; font-weight: 700;
          letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 14px;
        }
        .dps-title {
          font-size: clamp(28px, 4vw, 46px); font-weight: 800;
          letter-spacing: -0.025em; line-height: 1.05; margin: 0;
          background: linear-gradient(180deg, #fff, #c7c7cf);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .dps-sub {
          margin-top: 14px; max-width: 560px; color: rgba(255, 255, 255, 0.55);
          font-size: 15px; line-height: 1.6;
        }

        /* VIEW TOGGLE */
        .dps-toggle {
          position: relative; display: inline-flex; padding: 5px;
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px; backdrop-filter: blur(10px); flex-shrink: 0;
        }
        .dps-toggle button {
          position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 16px; border: none; background: transparent; cursor: pointer;
          color: rgba(255, 255, 255, 0.55); font-size: 13.5px; font-weight: 600;
          border-radius: 10px; transition: color 0.25s; font-family: inherit;
        }
        .dps-toggle button.on { color: #fff; }
        .dps-toggle-ind {
          position: absolute; top: 5px; left: 5px; width: calc(50% - 5px); height: calc(100% - 10px);
          background: linear-gradient(135deg, rgba(255, 43, 43, 0.9), rgba(255, 90, 90, 0.8));
          border-radius: 10px; box-shadow: 0 0 20px rgba(255, 43, 43, 0.5); z-index: 0;
        }

        /* WORKFLOW STEPS */
        .dps-steps {
          position: relative;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 14px;
          margin-bottom: 30px;
        }
        .dps-track, .dps-trackFill {
          position: absolute; top: 31px; left: 10%; height: 2px; border-radius: 2px;
        }
        .dps-track { right: 10%; background: rgba(255, 255, 255, 0.1); }
        .dps-trackFill {
          background: linear-gradient(90deg, ${ACCENT}, #ff6b6b);
          box-shadow: 0 0 14px rgba(255, 43, 43, 0.7);
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dps-step { position: relative; display: flex; flex-direction: column; align-items: center; }
        .dps-seg { display: none; }

        .dps-nodeWrap {
          position: relative; z-index: 2; height: 64px; display: flex; align-items: center; justify-content: center;
          background: none; border: none; cursor: pointer; padding: 0;
        }
        .dps-node {
          display: flex; align-items: center; justify-content: center;
          width: 54px; height: 54px; border-radius: 50%;
          background: rgba(20, 20, 26, 0.9); border: 1px solid rgba(255, 255, 255, 0.12);
          color: rgba(255, 255, 255, 0.6); backdrop-filter: blur(8px); transition: color 0.3s, border-color 0.3s;
        }
        .dps-step.done .dps-node { color: #fff; border-color: rgba(255, 43, 43, 0.45); }
        .dps-step.active .dps-node {
          color: #fff; border-color: ${ACCENT};
          background: linear-gradient(135deg, rgba(255, 43, 43, 0.28), rgba(255, 43, 43, 0.08));
        }

        .dps-card {
          width: 100%; margin-top: 12px; text-align: center; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          padding: 16px 12px 18px; border-radius: 16px;
          background: rgba(255, 255, 255, 0.035); border: 1px solid rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px); font-family: inherit; transition: border-color 0.3s, background 0.3s;
        }
        .dps-step.active .dps-card {
          border-color: ${ACCENT};
          background: rgba(255, 43, 43, 0.07);
          box-shadow: 0 0 0 1px rgba(255, 43, 43, 0.4), 0 14px 40px rgba(255, 43, 43, 0.16);
        }
        .dps-card-num { font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: rgba(255, 43, 43, 0.85); }
        .dps-card-title { font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.01em; }
        .dps-card-tag { font-size: 12px; color: rgba(255, 255, 255, 0.45); }
        .dps-card-metric {
          margin-top: 6px; font-size: 12.5px; font-weight: 700; color: #fff;
          padding: 4px 10px; border-radius: 999px; background: rgba(255, 43, 43, 0.12);
          border: 1px solid rgba(255, 43, 43, 0.25);
        }

        /* CONTROLS */
        .dps-controls {
          display: flex; align-items: center; justify-content: space-between;
          gap: 18px; flex-wrap: wrap; margin-bottom: 26px;
        }
        .dps-badges { display: flex; flex-wrap: wrap; gap: 10px; }
        .dps-badge {
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
          padding: 9px 15px; border-radius: 999px; font-family: inherit;
          font-size: 13px; font-weight: 600; color: rgba(255, 255, 255, 0.7);
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px); transition: color 0.25s, border-color 0.25s, background 0.25s;
        }
        .dps-badge :global(svg) { color: ${ACCENT}; }
        .dps-badge:hover { color: #fff; border-color: rgba(255, 43, 43, 0.45); }
        .dps-badge.on {
          color: #fff; border-color: ${ACCENT};
          background: linear-gradient(135deg, rgba(255, 43, 43, 0.22), rgba(255, 43, 43, 0.08));
        }

        .dps-sim {
          display: inline-flex; align-items: center; gap: 9px; cursor: pointer; flex-shrink: 0;
          padding: 11px 18px; border-radius: 12px; font-family: inherit;
          font-size: 13.5px; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, ${ACCENT}, #ff5b5b);
          border: 1px solid rgba(255, 43, 43, 0.6); box-shadow: 0 8px 30px rgba(255, 43, 43, 0.32);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .dps-sim:hover { transform: translateY(-2px); box-shadow: 0 12px 38px rgba(255, 43, 43, 0.45); }
        .dps-sim.running {
          background: rgba(255, 255, 255, 0.06); color: #fff;
          border-color: rgba(255, 255, 255, 0.18); box-shadow: none;
        }

        .dps-shipped {
          display: flex; align-items: center; gap: 10px; width: fit-content;
          margin: 0 auto 26px; padding: 12px 20px; border-radius: 12px;
          font-size: 14.5px; font-weight: 700; color: #fff;
          background: linear-gradient(135deg, rgba(255, 43, 43, 0.2), rgba(255, 43, 43, 0.06));
          border: 1px solid ${ACCENT}; box-shadow: 0 0 34px rgba(255, 43, 43, 0.4);
        }
        .dps-shipped :global(svg) { color: ${ACCENT}; }

        /* DASHBOARD PANEL */
        .dps-dash {
          border-radius: 22px; padding: 30px;
          background: rgba(255, 255, 255, 0.035); border: 1px solid rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(16px); box-shadow: 0 0 0 1px rgba(255, 43, 43, 0.12), 0 30px 80px rgba(0, 0, 0, 0.4);
        }
        .dps-dash-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 34px; }
        .dps-dash-head { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
        .dps-dash-icon {
          display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;
          border-radius: 13px; color: ${ACCENT};
          background: linear-gradient(135deg, rgba(255, 43, 43, 0.22), rgba(255, 43, 43, 0.05));
          border: 1px solid rgba(255, 43, 43, 0.3); flex-shrink: 0;
        }
        .dps-dash-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255, 43, 43, 0.85); }
        .dps-dash-title { margin: 2px 0 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #fff; }
        .dps-dash-desc { color: rgba(255, 255, 255, 0.62); font-size: 15px; line-height: 1.65; margin: 0 0 18px; }

        .dps-impact {
          display: flex; align-items: center; gap: 9px; padding: 12px 14px; margin-bottom: 22px;
          border-radius: 12px; background: rgba(255, 43, 43, 0.06); border: 1px solid rgba(255, 43, 43, 0.2);
          color: #fff; font-size: 14px; font-weight: 600;
        }
        .dps-impact :global(svg) { color: ${ACCENT}; flex-shrink: 0; }

        .dps-group { margin-bottom: 18px; }
        .dps-group-label {
          display: block; font-size: 11.5px; font-weight: 700; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 10px;
        }
        .dps-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .dps-pill {
          display: inline-flex; cursor: pointer; padding: 7px 13px; border-radius: 999px;
          font-size: 12.5px; font-weight: 600; color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
          transition: color 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .dps-pill:hover {
          color: #fff; border-color: ${ACCENT}; background: rgba(255, 43, 43, 0.12);
          box-shadow: 0 0 18px rgba(255, 43, 43, 0.35);
        }

        .dps-details-btn {
          display: inline-flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 4px;
          padding: 10px 16px; border-radius: 11px; font-family: inherit; font-size: 13.5px; font-weight: 700;
          color: #fff; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 43, 43, 0.4);
          transition: background 0.2s, box-shadow 0.2s;
        }
        .dps-details-btn:hover { background: rgba(255, 43, 43, 0.12); box-shadow: 0 0 20px rgba(255, 43, 43, 0.3); }
        .dps-details-btn :global(svg) { color: ${ACCENT}; }

        .dps-drawer { list-style: none; margin: 16px 0 0; padding: 0; overflow: hidden; }
        .dps-drawer li {
          display: flex; gap: 10px; padding: 11px 0; color: rgba(255, 255, 255, 0.72);
          font-size: 14px; line-height: 1.55; border-top: 1px solid rgba(255, 255, 255, 0.07);
        }
        .dps-drawer li :global(svg) { color: ${ACCENT}; flex-shrink: 0; margin-top: 3px; }

        /* DASHBOARD SIDE */
        .dps-dash-side {
          border-left: 1px solid rgba(255, 255, 255, 0.08); padding-left: 30px;
          display: flex; flex-direction: column;
        }
        .dps-metric { margin-bottom: 22px; }
        .dps-metric-value {
          display: block; font-size: clamp(34px, 4vw, 46px); font-weight: 800; letter-spacing: -0.03em; line-height: 1;
          background: linear-gradient(135deg, #fff, ${ACCENT});
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .dps-metric-label { display: block; margin-top: 8px; font-size: 13.5px; color: rgba(255, 255, 255, 0.5); font-weight: 500; }
        .dps-chart-head {
          display: flex; align-items: center; justify-content: space-between;
          font-size: 12.5px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55); margin-bottom: 6px;
        }
        .dps-chart-head :global(svg) { color: ${ACCENT}; }
        .dps-chartWrap :global(.recharts-area-curve) { filter: drop-shadow(0 0 6px rgba(255, 43, 43, 0.7)); }

        .dps-tip {
          display: flex; flex-direction: column; gap: 2px; padding: 8px 11px; border-radius: 9px;
          background: rgba(12, 12, 16, 0.92); border: 1px solid rgba(255, 43, 43, 0.4);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }
        .dps-tip-x { font-size: 11px; color: rgba(255, 255, 255, 0.5); }
        .dps-tip-v { font-size: 15px; font-weight: 700; color: ${ACCENT}; }

        /* ───── TABLET: cards wrap to two rows, dashboard full width ───── */
        @media (max-width: 900px) {
          .dps-dash-grid { grid-template-columns: 1fr; gap: 26px; }
          .dps-dash-side { border-left: none; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-left: 0; padding-top: 24px; }
          .dps-steps { grid-template-columns: repeat(3, 1fr); gap: 18px 14px; }
          .dps-track, .dps-trackFill { display: none; }
        }

        /* ───── MOBILE: vertical interactive timeline ───── */
        @media (max-width: 620px) {
          .dps { padding: 72px 5vw; }
          .dps-header { flex-direction: column; align-items: stretch; }
          .dps-toggle { align-self: flex-start; }
          .dps-steps { grid-template-columns: 1fr; gap: 0; }
          .dps-track, .dps-trackFill { display: none; }

          .dps-step { flex-direction: row; align-items: stretch; gap: 16px; padding-bottom: 14px; }
          .dps-seg {
            display: block; position: absolute; left: 31px; top: 0; bottom: 0; width: 2px;
            background: rgba(255, 255, 255, 0.12);
          }
          .dps-seg.lit { background: linear-gradient(180deg, ${ACCENT}, #ff6b6b); box-shadow: 0 0 12px rgba(255, 43, 43, 0.6); }
          .dps-nodeWrap { height: auto; align-items: flex-start; padding-top: 4px; }
          .dps-card {
            margin-top: 0; text-align: left; align-items: flex-start; flex: 1;
            display: grid; grid-template-columns: auto 1fr auto; grid-template-areas: 'num title metric' 'tag tag metric';
            column-gap: 10px; row-gap: 2px;
          }
          .dps-card-num { grid-area: num; }
          .dps-card-title { grid-area: title; }
          .dps-card-tag { grid-area: tag; }
          .dps-card-metric { grid-area: metric; align-self: center; margin-top: 0; }
          .dps-controls { flex-direction: column; align-items: stretch; }
          .dps-sim { justify-content: center; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dps *, .dps::before, .dps::after { animation: none !important; transition: none !important; }
        }
      `}</style>
    </motion.section>
  );
}
