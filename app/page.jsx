import CoverSplash from '@/components/CoverSplash';
import VideoIntro from '@/components/VideoIntro';
import Reveal from '@/components/Reveal';
import AboutStatCard from '@/components/AboutStatCard';
import TiltCard from '@/components/TiltCard';
import AmbientDataField from '@/components/AmbientDataField';
import TimelineFX from '@/components/TimelineFX';
import KineticHeading from '@/components/KineticHeading';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';
import ResumeThanks from '@/components/ResumeThanks';
import SlideIn from '@/components/SlideIn';
import ProjectCarousel from '@/components/ProjectCarousel';
import DataProductProcessSection from '@/components/DataProductProcessSection';
import { MapPin, GraduationCap, CalendarDays, Briefcase, Mail, Cloud, BarChart3, PieChart } from 'lucide-react';
import { SiPython, SiPostgresql, SiSnowflake, SiApacheairflow, SiPandas, SiScikitlearn, SiGit } from 'react-icons/si';
import { FiLinkedin, FiGithub } from 'react-icons/fi';
import styles from './page.module.css';

export const metadata = {
  title: 'Vishnu Vardhan Kaitepalli — Data Analyst',
  description: 'Portfolio of Vishnu Vardhan — ETL automation, risk scoring models, credit risk analytics, and scalable BI architecture.',
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
/* Each tag carries its own proficiency `level` (0-100), shown in a small
   dialog box on hover (see .skillTag::after in page.module.css). Update
   the numbers below any time — no other code needs to change. */
const skills = [
  {
    icon: '📊', title: 'Analysis & Modeling',
    tags: [
      { name: 'EDA', level: 92 },
      { name: 'Time-Series Forecasting', level: 85 },
      { name: 'A/B Testing', level: 88 },
      { name: 'Risk Scoring', level: 90 },
      { name: 'Root Cause Analysis', level: 87 },
      { name: 'CECL / CCAR', level: 80 },
      { name: 'PD / LGD / EAD', level: 82 },
    ],
  },
  {
    icon: '💻', title: 'Programming & Databases',
    tags: [
      { name: 'Python', level: 93 },
      { name: 'SQL', level: 95 },
      { name: 'R', level: 75 },
      { name: 'SAS', level: 78 },
      { name: 'SPSS', level: 76 },
      { name: 'Snowflake', level: 85 },
      { name: 'Amazon Redshift', level: 84 },
      { name: 'Azure Synapse', level: 80 },
      { name: 'PostgreSQL', level: 82 },
      { name: 'Oracle', level: 78 },
    ],
  },
  {
    icon: '☁️', title: 'Cloud, Big Data & ETL',
    tags: [
      { name: 'AWS Glue', level: 86 },
      { name: 'SageMaker', level: 78 },
      { name: 'S3', level: 85 },
      { name: 'Azure Data Factory', level: 83 },
      { name: 'GCP', level: 74 },
      { name: 'Hadoop', level: 76 },
      { name: 'Apache Airflow', level: 82 },
      { name: 'Airbyte', level: 79 },
    ],
  },
  {
    icon: '🤖', title: 'Machine Learning',
    tags: [
      { name: 'LightGBM', level: 88 },
      { name: 'XGBoost', level: 87 },
      { name: 'LSTM', level: 80 },
      { name: 'Deep Neural Networks', level: 78 },
      { name: 'Factorization Machines', level: 75 },
      { name: 'ARIMA', level: 82 },
      { name: 'NLP', level: 77 },
      { name: 'Clustering', level: 84 },
    ],
  },
  {
    icon: '📈', title: 'Visualisation & MLOps',
    tags: [
      { name: 'Power BI', level: 92 },
      { name: 'DAX', level: 85 },
      { name: 'Row-Level Security', level: 80 },
      { name: 'Tableau', level: 86 },
      { name: 'CI/CD', level: 78 },
      { name: 'Git', level: 90 },
      { name: 'Confluence', level: 82 },
    ],
  },
  {
    icon: '📋', title: 'Business & Delivery',
    tags: [
      { name: 'JIRA', level: 88 },
      { name: 'Agile / SDLC', level: 90 },
      { name: 'UAT', level: 84 },
      { name: 'Data Quality Controls', level: 86 },
      { name: 'SR 11-7 Governance', level: 80 },
      { name: 'OPM', level: 76 },
    ],
  },
];

/* Cards show a condensed "skills gained + tech stack" view rather than
   the full resume bullet text — keeps the timeline scannable and avoids
   duplicating the resume verbatim. */
const experience = [
  {
    role: 'Data Analyst',
    company: 'PNC Financial Services · Dallas, Texas (Remote)',
    period: 'Jan 2024 – Present',
    current: true,
    skillsGained: [
      'Credit Risk Analytics',
      'ETL Automation',
      'Fraud Detection',
      'Risk Dashboarding',
      'Model Monitoring',
      'Business Intelligence',
    ],
    technologies: ['SQL', 'Python', 'AWS Glue', 'Snowflake', 'Amazon Redshift', 'Power BI', 'LightGBM', 'LSTM'],
  },
  {
    role: 'Data Analyst',
    company: 'LTI Mindtree · Andhra Pradesh, India',
    period: 'Jan 2021 – Dec 2022',
    current: false,
    skillsGained: [
      'Data Cleaning',
      'ETL Pipeline Development',
      'Sales Forecasting',
      'Customer Segmentation',
      'KPI Reporting',
      'Statistical Analysis',
    ],
    technologies: ['SQL Server', 'Azure SQL', 'Oracle', 'Azure Data Factory', 'Airbyte', 'Azure Synapse', 'Power BI', 'Tableau', 'SAS', 'SPSS'],
  },
];

const pncStats = [
  {
    num: '2+',
    lbl: 'Years at PNC',
    contextTitle: 'Applied finance analytics experience',
    context:
      'This represents hands-on analytics work in financial services, where I contributed to credit risk, fraud analytics, ETL automation, dashboarding, and model monitoring workflows. The focus was moving from raw financial data to decision-ready insights.',
  },
  {
    num: '$15M',
    lbl: 'Credit Losses Mitigated',
    contextTitle: 'Portfolio risk reduction support',
    context:
      'This refers to analytics support for credit-risk workflows where model signals, covenant risk indicators, and portfolio monitoring helped identify accounts that needed earlier review. My contribution focused on preparing risk signals, supporting CECL / CCAR-style analysis, and translating model outputs into portfolio insights.',
  },
  {
    num: '30%',
    lbl: 'Fraud Alert Reduction',
    contextTitle: 'Reducing false-positive investigation noise',
    context:
      'This reflects work on fraud analytics where anomaly-detection logic helped reduce unnecessary alerts. My role involved transaction-pattern analysis, model-ready data preparation, and validation workflows so fraud teams could focus more attention on higher-risk cases.',
  },
  {
    num: '0.89',
    lbl: 'ROC-AUC Achieved',
    contextTitle: 'Model validation improvement',
    context:
      'This represents a credit-risk classification improvement measured through ROC-AUC. I contributed by preparing structured risk datasets, supporting feature validation, comparing model performance, and helping improve separation between higher-risk and lower-risk borrower profiles.',
  },
];

const ltiStats = [
  {
    num: '2',
    lbl: 'Years at LTI Mindtree',
    contextTitle: 'Enterprise analytics delivery experience',
    context:
      'This covers analytics and data delivery experience at LTI Mindtree, where I worked on ETL pipelines, forecasting, customer segmentation, KPI reporting, and dashboard support for business users.',
  },
  {
    num: '500GB+',
    lbl: 'Data Unified',
    contextTitle: 'Multi-source data consolidation',
    context:
      'This represents the scale of data handled across SQL Server, Azure SQL DB, and Oracle sources. My contribution focused on helping unify fragmented datasets through ETL workflows, improving consistency, and preparing cleaner data layers for dashboards and analytics.',
  },
  {
    num: '70%',
    lbl: 'MLOps Rework Reduced',
    contextTitle: 'Cleaner handoffs for analytics workflows',
    context:
      'This refers to reducing repeated cleanup and rework caused by inconsistent data outputs. I helped normalize modular ETL outputs, improve validation steps, and structure data handoffs so downstream analytics and model workflows became more repeatable.',
  },
  {
    num: '60%',
    lbl: 'Campaign Response Lift',
    contextTitle: 'Customer segmentation for better targeting',
    context:
      'This reflects segmentation-based analytics used to identify stronger customer groups for campaign targeting. My work involved preparing behavioral data, supporting clustering / XGBoost-style segmentation, and helping teams focus outreach on higher-value customer patterns.',
  },
];

/* Same approach as Experience — condensed achievements + skills/tech
   tags instead of dropping the resume project write-ups in verbatim. */
const projects = [
  {
    icon: '🔍',
    title: 'Regulatory Audit Lineage',
    subtitle: 'Automated Data Lineage & Compliance Tracking Framework',
    achievements: [
      'Built an automated lineage tracking framework to map Hadoop-based data flows across ingestion, transformation, and reporting layers for a $5B+ corporate loan portfolio.',
      'Played a key role in improving audit readiness by making data movement, ownership, and transformation logic easier to trace for regulatory review.',
      'Helped strengthen data governance by reducing manual tracking effort and creating a more reliable framework for compliance documentation.',
    ],
    skillsGained: [
      'Data Lineage Tracking',
      'Regulatory Audit Support',
      'Data Governance',
      'Workflow Automation',
      'Compliance Documentation',
      'Enterprise Data Mapping',
    ],
    technologies: ['Apache Airflow', 'Hadoop', 'SQL', 'Data Governance', 'ETL Workflows', 'Audit Tracking'],
  },
  {
    icon: '🔗',
    title: 'Entity Resolution Engine',
    subtitle: 'Customer Record Matching & Deduplication System',
    achievements: [
      'Developed an in-house fuzzy matching workflow to identify duplicate and inconsistent customer records across multiple business datasets.',
      'Played a crucial role in improving data quality by consolidating redundant records, reducing reporting errors, and creating cleaner customer views for analytics teams.',
      'Eliminated approximately $70K in annual vendor costs and accelerated reporting cycles by 4 days through internal automation.',
    ],
    skillsGained: [
      'Fuzzy Matching',
      'Data Deduplication',
      'Data Quality Improvement',
      'Customer Data Consolidation',
      'Reporting Automation',
      'Problem-Solving with Analytics',
    ],
    technologies: ['Python', 'SQL', 'Fuzzy Matching', 'Data Cleaning', 'Record Linkage', 'Data Validation'],
  },
  {
    icon: '📉',
    title: 'Macroeconomic Risk Simulation',
    subtitle: 'Monte Carlo Risk Modeling & Stress Testing Optimization',
    achievements: [
      'Migrated legacy Monte Carlo risk simulation models from SAS to PySpark to improve scalability and reduce model execution time.',
      'Played a major role in modernizing the risk simulation workflow, enabling faster analysis of macroeconomic scenarios and portfolio loss distributions.',
      'Reduced runtime from hours to minutes, supporting intraday stress testing and quicker risk decision-making for business teams.',
    ],
    skillsGained: [
      'Risk Modeling',
      'Monte Carlo Simulation',
      'Stress Testing',
      'Model Migration',
      'Runtime Optimization',
      'Financial Analytics',
    ],
    technologies: ['PySpark', 'SAS', 'Monte Carlo Simulation', 'Risk Modeling', 'Financial Analytics', 'Big Data Processing'],
  },
];

const certifications = [
  { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services' },
  { name: 'Microsoft Certified: Azure Data Engineer', issuer: 'Microsoft' },
  { name: 'Snowflake SnowPro Core', issuer: 'Snowflake' },
  { name: 'Google Professional Data Engineer', issuer: 'Google Cloud' },
  { name: 'Tableau Desktop Specialist', issuer: 'Tableau / Salesforce' },
];

/* About info-panel data. Main technologies use real Simple Icons brand logos
   where they exist; AWS / Power BI / Tableau were dropped from Simple Icons
   upstream, so they fall back to matching Lucide glyphs (same pattern as
   DataProductProcessSection). */
const mainTech = [
  { name: 'Python', Icon: SiPython },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'Snowflake', Icon: SiSnowflake },
  { name: 'AWS', Icon: Cloud },
  { name: 'Power BI', Icon: BarChart3 },
  { name: 'Apache Airflow', Icon: SiApacheairflow },
  { name: 'Pandas', Icon: SiPandas },
  { name: 'scikit-learn', Icon: SiScikitlearn },
  { name: 'Tableau', Icon: PieChart },
  { name: 'Git', Icon: SiGit },
];

const quickFacts = [
  { Icon: Briefcase, text: 'Data Analyst' },
  { Icon: MapPin, text: 'Dallas, Texas' },
  { Icon: CalendarDays, text: '4+ yrs experience' },
  { Icon: GraduationCap, text: 'M.S. Computer Science' },
];

const socials = [
  { Icon: FiLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/in/vishnuvk12/' },
  { Icon: FiGithub, label: 'GitHub', href: 'https://github.com' },
  { Icon: Mail, label: 'Email', href: 'mailto:vishnuvardhanvv127@gmail.com' },
];

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className={styles.main}>

      {/* ── COVER SPLASH ── */}
      <CoverSplash />

      {/* ── HERO ── */}
      <VideoIntro videoSrc="/videos/hero.mp4" nextId="about" />

      {/* ── ABOUT (bento grid) ── */}
      <section id="about" className={`px-[8vw] pt-[90px] pb-[70px] ${styles.about}`} style={{ position: 'relative', overflow: 'visible' }}>
        <AmbientDataField color="255,140,66" density={36} />

        {/* Left — profile photo card with name + role overlay */}
        <Reveal className={`relative min-h-[440px] overflow-hidden rounded-[24px] ${styles.photoCard} ${styles.bentoIntro}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/profile.jpg" alt="Kaitepalli Vishnu Vardhan" className={`absolute inset-0 h-full w-full object-cover ${styles.photoCardImg}`} />
          <div className={`absolute inset-0 pointer-events-none ${styles.photoScrim}`} />
          <div className="absolute left-6 bottom-6 z-[1]">
            <span className="block text-[clamp(20px,2.4vw,28px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-white">Kaitepalli Vishnu Vardhan</span>
            <span className={`mt-2.5 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] ${styles.photoRolePill}`}>Data Analyst</span>
          </div>
        </Reveal>

        {/* Right — info panel: bio · quick facts · tech logos · connect */}
        <Reveal delay={0.08} className={`flex flex-col gap-6 rounded-[24px] p-7 ${styles.infoPanel} ${styles.bentoVisual}`}>
          <span className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${styles.statusPill}`}>Open to opportunities</span>

          <p className={`text-[clamp(14px,1.4vw,16px)] leading-[1.8] ${styles.infoBio}`}>
            I&apos;m a data analyst who turns fragmented, messy data into decisions leaders can trust. Across banking and enterprise analytics I&apos;ve shipped <strong>ETL automation</strong>, <strong>credit-risk and fraud models</strong>, and <strong>executive dashboards</strong> — always chasing cleaner data, faster answers, and measurable business impact.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {quickFacts.map(({ Icon, text }) => (
              <span key={text} className={`inline-flex items-center gap-2 text-[13px] font-medium ${styles.fact}`}>
                <Icon size={15} strokeWidth={2} aria-hidden /> {text}
              </span>
            ))}
          </div>

          <div>
            <span className={`mb-3 block text-[11px] font-bold uppercase tracking-[0.16em] ${styles.infoLabel}`}>Main Technologies</span>
            <div className="flex flex-wrap gap-2.5">
              {mainTech.map(({ name, Icon }) => (
                <span key={name} className={`inline-flex items-center gap-2 rounded-[10px] px-3 py-2 text-[12.5px] font-medium ${styles.techChip}`}>
                  <Icon size={16} aria-hidden className={styles.techIcon} /> {name}
                </span>
              ))}
            </div>
          </div>

          <div>
            <span className={`mb-3 block text-[11px] font-bold uppercase tracking-[0.16em] ${styles.infoLabel}`}>Connect</span>
            <div className="flex flex-wrap items-center gap-3">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${styles.connectLink}`}
                >
                  <Icon size={18} aria-hidden />
                </a>
              ))}
              <ResumeThanks />
            </div>
          </div>
        </Reveal>

        <Reveal as="span" className={styles.statGroupLabel}>PNC Financial Services</Reveal>
        {pncStats.map((stat, i) => (
          <AboutStatCard
            key={stat.lbl}
            stat={stat}
            delay={i * 0.08}
            group="pnc"
            index={i}
          />
        ))}

        <Reveal as="span" className={styles.statGroupLabel}>LTI Mindtree</Reveal>
        {ltiStats.map((stat, i) => (
          <AboutStatCard
            key={stat.lbl}
            stat={stat}
            delay={i * 0.08}
            group="lti"
            index={i}
          />
        ))}        
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className={`px-[8vw] pt-[80px] pb-[90px] ${styles.skills}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <AmbientDataField color="255,209,102" density={42} />
        <Reveal className={styles.sectionHeader}>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Tools I work with.</h2>
          <p>End-to-end analytics — from raw ingestion to production models and executive dashboards.</p>
        </Reveal>
        <Marquee
          items={skills.flatMap(s => s.tags.map(t => t.name))}
          speed={42}
          className={styles.skillsMarquee}
        />
        <div className="relative z-[1] grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-[22px]">
          {skills.map(({ icon, title, tags }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <TiltCard className={styles.skillCard}>
                <div className={styles.cardIcon}>{icon}</div>
                <h3>{title}</h3>
                <div className={styles.skillTags}>
                  {tags.map(({ name, level }) => (
                    <span key={name} className={styles.skillTag} data-level={`${level}%`}>{name}</span>
                  ))}
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className={`px-[8vw] py-[80px] ${styles.experience}`} style={{ position: 'relative', overflow: 'hidden' }}>
        <Reveal className={styles.sectionHeader}>
          <h2 className={styles.secTitle}>Where I&apos;ve built things.</h2>
        </Reveal>
        <div className={styles.timeline}>
          {experience.map(({ role, company, period, current, skillsGained, technologies }, i) => (
            <SlideIn key={company} direction={i === 0 ? 'left' : 'right'} className={styles.tlItem}>
              <div className={styles.tlDot} />
              <div className={styles.tlMeta}>
                <span className={styles.dateBadge}>{period}</span>
                {current && <span className={styles.currBadge}>Current</span>}
              </div>
              <KineticHeading as="h3">{role}</KineticHeading>
              <div className={styles.tlCompany}>{company}</div>
              <div className={styles.tlSkills}>
                <span className={styles.tlSectionLabel}>Skills Gained:</span>
                <ul className={styles.tlSkillList}>
                  {skillsGained.map((s, j) => <li key={j}>{s}</li>)}
                </ul>
              </div>
              <div className={styles.tlTech}>
                <span className={styles.tlSectionLabel}>Technologies:</span>
                <div className={styles.tlTechTags}>
                  {technologies.map((t, j) => <span key={j} className={styles.tlTechTag}>{t}</span>)}
                </div>
              </div>
            </SlideIn>
          ))}
          <TimelineFX dotClass={styles.tlDot} />
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className={`px-[8vw] py-[80px] ${styles.projects}`}>
        <Reveal className={styles.sectionHeader}>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Things I&apos;ve shipped.</h2>
        </Reveal>
        <ProjectCarousel>
          {projects.map(({ icon, title, subtitle, achievements, skillsGained, technologies }) => (
            <TiltCard key={title} className={styles.projCard}>
              <div className={styles.projIcon}>{icon}</div>
              <div>
                <h3>{title}</h3>
                <div className={styles.projSubtitle}>{subtitle}</div>
              </div>
              <ul className={styles.projAchievements}>
                {achievements.map((a, j) => <li key={j}>{a}</li>)}
              </ul>
              <div className={styles.tlSkills}>
                <span className={styles.tlSectionLabel}>Skills Gained:</span>
                <ul className={styles.tlSkillList}>
                  {skillsGained.map((s, j) => <li key={j}>{s}</li>)}
                </ul>
              </div>
              <div className={styles.tlTech}>
                <span className={styles.tlSectionLabel}>Technologies Used:</span>
                <div className={styles.tlTechTags}>
                  {technologies.map((t, j) => <span key={j} className={styles.tlTechTag}>{t}</span>)}
                </div>
              </div>
            </TiltCard>
          ))}
        </ProjectCarousel>
      </section>

      {/* ── HOW I SHIP DATA PRODUCTS ── */}
      <DataProductProcessSection />

      {/* ── EDUCATION & CERTS ── */}
      <section id="education" className={`px-[8vw] py-[80px] ${styles.education}`}>
        <div className={styles.eduCol}>
          <Reveal className={styles.sectionHeader}>
            <h2 className={styles.secTitle}>Academic background.</h2>
          </Reveal>
          <Reveal className={styles.eduCard}>
            <div className={styles.eduIcon}>🎓</div>
            <div>
              <h3>M.S. in Computer Science</h3>
              <div className={styles.eduSchool}>University of North Texas · Denton, USA</div>
              <div className={styles.eduPeriod}>Jan 2023 – May 2024</div>
            </div>
          </Reveal>
        </div>
        <div className={styles.certCol}>
          <Reveal className={styles.sectionHeader}>
            <h2 className={styles.secTitle}>Credentials.</h2>
          </Reveal>
          <div className={styles.certList}>
            {certifications.map(({ name, issuer }, i) => (
              <Reveal key={name} className={styles.certItem} delay={i * 0.06}>
                <div className={styles.certDot} />
                <div>
                  <strong>{name}</strong>
                  <span>{issuer}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section id="achievements" className={`px-[8vw] py-[70px] ${styles.achievements}`}>
        <Reveal className={styles.sectionHeader}>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Milestones.</h2>
        </Reveal>
        <div className="relative z-[1] flex flex-wrap gap-[22px]">
          {[
            {
              icon: '🏆',
              title: '$5,000 Grant Winner',
              desc: "Awarded by India's Ministry of MSME at Hackathon 2.0 for an IoT-based predictive maintenance solution demonstrating real-world industrial impact.",
            },
            {
              icon: '🚀',
              title: 'National Startup Pitch — IIT Madras',
              desc: 'Selected to represent PESCE in a national startup pitch round alongside IIT-Madras (2021–22), competing among India\'s top engineering institutions.',
            },
          ].map(({ icon, title, desc }, i) => (
            <Reveal key={title} className={styles.achCard} delay={i * 0.1}>
              <div className={styles.achIcon}>{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className={`px-[8vw] pt-[90px] pb-[70px] text-center ${styles.contact}`}>
        <span className={styles.secLabel}>Get In Touch</span>
        <KineticHeading as="h2" className={styles.secTitle}>Let&apos;s build something.</KineticHeading>
        <p className={styles.contactSub}>Open to data analytics, ML engineering, and BI architecture opportunities. Let&apos;s talk.</p>
        <Reveal as="div" className={`relative z-[1] mb-[56px] flex flex-wrap justify-center gap-[14px] ${styles.ctaLinks}`}>
          <MagneticButton className={`${styles.ctaBtn} ${styles.primary}`} href="mailto:vishnuvardhanvv127@gmail.com">Send an Email</MagneticButton>
          <MagneticButton className={`${styles.ctaBtn} ${styles.secondary}`} href="https://www.linkedin.com/in/vishnuvk12/" target="_blank" rel="noopener noreferrer">LinkedIn</MagneticButton>
          <MagneticButton className={`${styles.ctaBtn} ${styles.secondary}`} href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</MagneticButton>
        </Reveal>
        <Reveal as="div" className={`relative z-[1] flex flex-wrap justify-center gap-[44px] ${styles.contactInfoRow}`} delay={0.1}>
          <div className={styles.ci}>
            <span className={styles.ciLabel}>Email</span>
            <a className={styles.ciVal} href="mailto:vishnuvardhanvv127@gmail.com">vishnuvardhanvv127@gmail.com</a>
          </div>
          <div className={styles.ci}>
            <span className={styles.ciLabel}>Phone</span>
            <a className={styles.ciVal} href="tel:9409775273">940-977-5273</a>
          </div>
          <div className={styles.ci}>
            <span className={styles.ciLabel}>Location</span>
            <span className={styles.ciVal}>Dallas, Texas</span>
          </div>
        </Reveal>
      </section>

      <footer className={`px-[8vw] py-[28px] text-center text-xs font-normal tracking-[0.08em] ${styles.footer}`}>
        &copy; 2026 <span>Vishnu Vardhan Kaitepalli</span> · Crafted with precision.
      </footer>

    </main>
  );
}
