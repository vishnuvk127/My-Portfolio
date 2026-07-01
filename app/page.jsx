import CoverSplash from '@/components/CoverSplash';
import VideoIntro from '@/components/VideoIntro';
import Reveal from '@/components/Reveal';
import StatCounter from '@/components/StatCounter';
import TiltCard from '@/components/TiltCard';
import SkillRadar from '@/components/SkillRadar';
import AmbientDataField from '@/components/AmbientDataField';
import TimelineFX from '@/components/TimelineFX';
import KineticHeading from '@/components/KineticHeading';
import MagneticButton from '@/components/MagneticButton';
import Marquee from '@/components/Marquee';
import PhotoFrame from '@/components/PhotoFrame';
import SlideIn from '@/components/SlideIn';
import ProjectCarousel from '@/components/ProjectCarousel';
import DataProductProcessSection from '@/components/DataProductProcessSection';
import styles from './page.module.css';

export const metadata = {
  title: 'Vishnu Vardhan Kaitepalli — Data Analytics Engineer',
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
  { num: '2+',   lbl: 'Years at PNC' },
  { num: '$15M', lbl: 'Credit Losses Mitigated' },
  { num: '30%',  lbl: 'Fraud Alert Reduction' },
  { num: '0.89', lbl: 'ROC-AUC Achieved' },
];

const ltiStats = [
  { num: '2',      lbl: 'Years at LTI Mindtree' },
  { num: '500GB+', lbl: 'Data Unified' },
  { num: '70%',    lbl: 'MLOps Rework Reduced' },
  { num: '60%',    lbl: 'Campaign Response Lift' },
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
      <section id="about" className={styles.about} style={{ position: 'relative', overflow: 'hidden' }}>
        <AmbientDataField color="255,140,66" density={36} />
        <div className={`${styles.aboutLeft} ${styles.bentoIntro}`}>
          <PhotoFrame />
          <KineticHeading as="p" className={styles.aboutHeadline}>
            A collection of analytics, automation, and risk-focused projects where I improved data reliability, reduced manual effort, and helped teams make faster, more confident business decisions.
          </KineticHeading>
        </div>
        <div className={`${styles.aboutVisual} ${styles.bentoVisual}`}>
          <SkillRadar />
        </div>

        <Reveal as="span" className={styles.statGroupLabel}>PNC Financial Services</Reveal>
        {pncStats.map(({ num, lbl }, i) => (
          <Reveal key={lbl} className={`${styles.statCard} ${styles.bentoStat}`} delay={i * 0.08}>
            <StatCounter value={num} className={styles.statNum} />
            <div className={styles.statLbl}>{lbl}</div>
          </Reveal>
        ))}

        <Reveal as="span" className={styles.statGroupLabel}>LTI Mindtree</Reveal>
        {ltiStats.map(({ num, lbl }, i) => (
          <Reveal key={lbl} className={`${styles.statCard} ${styles.bentoStat}`} delay={i * 0.08}>
            <StatCounter value={num} className={styles.statNum} />
            <div className={styles.statLbl}>{lbl}</div>
          </Reveal>
        ))}
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className={styles.skills} style={{ position: 'relative', overflow: 'hidden' }}>
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
        <div className={styles.skillsGrid}>
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
      <section id="experience" className={styles.experience} style={{ position: 'relative', overflow: 'hidden' }}>
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
      <section id="projects" className={styles.projects}>
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
      <section id="education" className={styles.education}>
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
      <section id="achievements" className={styles.achievements}>
        <Reveal className={styles.sectionHeader}>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Milestones.</h2>
        </Reveal>
        <div className={styles.achRow}>
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
      <section id="contact" className={styles.contact}>
        <span className={styles.secLabel}>Get In Touch</span>
        <KineticHeading as="h2" className={styles.secTitle}>Let&apos;s build something.</KineticHeading>
        <p className={styles.contactSub}>Open to data analytics, ML engineering, and BI architecture opportunities. Let&apos;s talk.</p>
        <Reveal as="div" className={styles.ctaLinks}>
          <MagneticButton className={`${styles.ctaBtn} ${styles.primary}`} href="mailto:vishnuvardhanvv127@gmail.com">Send an Email</MagneticButton>
          <MagneticButton className={`${styles.ctaBtn} ${styles.secondary}`} href="https://www.linkedin.com/in/vishnuvk12/" target="_blank" rel="noopener noreferrer">LinkedIn</MagneticButton>
          <MagneticButton className={`${styles.ctaBtn} ${styles.secondary}`} href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</MagneticButton>
        </Reveal>
        <Reveal as="div" className={styles.contactInfoRow} delay={0.1}>
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

      <footer className={styles.footer}>
        &copy; 2026 <span>Vishnu Vardhan Kaitepalli</span> · Crafted with precision.
      </footer>

    </main>
  );
}
