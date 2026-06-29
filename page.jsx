import VideoIntro from '@/components/VideoIntro';
import styles from './page.module.css';

export const metadata = {
  title: 'Vishnu Vardhan Kaitepalli — Data Analytics Engineer',
  description: 'Portfolio of Vishnu Vardhan — ETL automation, risk scoring models, credit risk analytics, and scalable BI architecture.',
};

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const skills = [
  {
    icon: '📊', title: 'Analysis & Modeling',
    tags: ['EDA','Time-Series Forecasting','A/B Testing','Risk Scoring','Root Cause Analysis','CECL / CCAR','PD / LGD / EAD'],
  },
  {
    icon: '💻', title: 'Programming & Databases',
    tags: ['Python','SQL','R','SAS','SPSS','Snowflake','Amazon Redshift','Azure Synapse','PostgreSQL','Oracle'],
  },
  {
    icon: '☁️', title: 'Cloud, Big Data & ETL',
    tags: ['AWS Glue','SageMaker','S3','Azure Data Factory','GCP','Hadoop','Apache Airflow','Airbyte'],
  },
  {
    icon: '🤖', title: 'Machine Learning',
    tags: ['LightGBM','XGBoost','LSTM','Deep Neural Networks','Factorization Machines','ARIMA','NLP','Clustering'],
  },
  {
    icon: '📈', title: 'Visualisation & MLOps',
    tags: ['Power BI','DAX','Row-Level Security','Tableau','CI/CD','Git','Confluence'],
  },
  {
    icon: '📋', title: 'Business & Delivery',
    tags: ['JIRA','Agile / SDLC','UAT','Data Quality Controls','SR 11-7 Governance','OPM'],
  },
];

const experience = [
  {
    role: 'Data Analyst',
    company: 'PNC Financial Services · Dallas, Texas (Remote)',
    period: 'Jan 2024 – Present',
    current: true,
    bullets: [
      'Overhauled AWS Glue and Snowflake data pipelines feeding Pega risk models (PD, LGD, EAD), accelerating credit decisioning from days to hours.',
      'Implemented LightGBM and deep neural network credit risk scoring models using Amazon Redshift — improved validation ROC-AUC from 0.76 to 0.89.',
      'Developed stochastic CECL and CCAR models with NLP-derived loan covenant risk signals, mitigating $15M in annual portfolio credit losses.',
      'Automated transactional anomaly detection for Enterprise Fraud Organization using LSTMs and Factorization Machines — reduced false-positive fraud alerts by 30%.',
      'Drove a 30% increase in risk-dashboard engagement via Power BI row-level security, CI/CD pipelines, and optimised DAX.',
      'Instituted Ongoing Performance Monitoring and automated back-testing via Git and Confluence ensuring strict SR 11-7 model governance.',
    ],
  },
  {
    role: 'Data Analyst',
    company: 'LTI Mindtree · Andhra Pradesh, India',
    period: 'Jan 2021 – Dec 2022',
    current: false,
    bullets: [
      'Unified 500GB+ of disparate data across SQL Server, Azure SQL DB, and Oracle using Azure Data Factory and Airbyte — accelerated dashboard load times by 30%.',
      'Reduced downstream MLOps rework by 70% and accelerated data handoffs by 40% through normalised modular ETL outputs.',
      'Improved sales forecast accuracy by 22% using ARIMA-based models in Azure Synapse for executive planning dashboards.',
      'Architected customer-behaviour segmentation models using clustering and XGBoost — improved campaign response by 60%.',
      'Enabled 60+ cross-functional leaders to track KPIs, forecast accuracy, and campaign ROI through Power BI and Tableau dashboards.',
      'Isolated post-lunch performance shifts via hypothesis testing in SAS and SPSS to quantify a 15% regional sales increase.',
    ],
  },
];

const projects = [
  {
    icon: '🔍',
    title: 'Regulatory Audit Lineage',
    description: 'Constructed an automated tracking framework using Apache Airflow to map Hadoop data flows, securing federal auditing records for a $5B+ corporate loan portfolio.',
    impact: '$5B+ portfolio compliance',
  },
  {
    icon: '🔗',
    title: 'Entity Resolution Engine',
    description: 'Formulated an in-house fuzzy matching workflow to consolidate redundant customer records — eliminating $70k in annual vendor costs and accelerating reporting cycles by 4 days.',
    impact: '$70k annual savings',
  },
  {
    icon: '📉',
    title: 'Macroeconomic Risk Simulation',
    description: 'Migrated Monte Carlo risk models from legacy SAS to PySpark — reducing loss distribution runtimes from hours to minutes and enabling intraday stress testing.',
    impact: 'Hours → minutes runtime',
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

      {/* ── HERO ── */}
      <VideoIntro videoSrc="/videos/hero.mp4" nextId="about" />

      {/* ── ABOUT ── */}
      <section id="about" className={styles.about}>
        <div className={styles.aboutLeft}>
          <span className={styles.secLabel}>About Me</span>
          <h2 className={styles.secTitle}>Turning complex<br/>data into decisions.</h2>
          <p>Data Analyst with 4+ years of experience in credit risk, ETL automation, time-series forecasting, and enterprise BI dashboards — operating at the intersection of financial analytics and engineering.</p>
          <p>I've worked across PNC Financial Services and LTI Mindtree, building production-grade models that reduced fraud false-positives, mitigated $15M in credit losses, and accelerated decisioning pipelines from days to hours.</p>
          <div className={styles.aboutStats}>
            {[
              { num: '4+',   lbl: 'Years Experience' },
              { num: '$15M', lbl: 'Credit Losses Mitigated' },
              { num: '30%',  lbl: 'Fraud Alert Reduction' },
              { num: '0.89', lbl: 'ROC-AUC Achieved' },
            ].map(({ num, lbl }) => (
              <div key={lbl} className={styles.statCard}>
                <div className={styles.statNum}>{num}</div>
                <div className={styles.statLbl}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.aboutRight}>
          <div className={styles.aboutVisual}>
            <span className={styles.monogram}>VV</span>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className={styles.skills}>
        <div className={styles.sectionHeader}>
          <span className={styles.secLabel}>Technical Stack</span>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Tools I work with.</h2>
          <p>End-to-end analytics — from raw ingestion to production models and executive dashboards.</p>
        </div>
        <div className={styles.skillsGrid}>
          {skills.map(({ icon, title, tags }) => (
            <div key={title} className={styles.skillCard}>
              <div className={styles.cardIcon}>{icon}</div>
              <h3>{title}</h3>
              <div className={styles.skillTags}>
                {tags.map(t => <span key={t} className={styles.skillTag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className={styles.experience}>
        <div className={styles.sectionHeader}>
          <span className={styles.secLabel}>Experience</span>
          <h2 className={styles.secTitle}>Where I've built things.</h2>
        </div>
        <div className={styles.timeline}>
          {experience.map(({ role, company, period, current, bullets }) => (
            <div key={company} className={styles.tlItem}>
              <div className={styles.tlDot} />
              <div className={styles.tlMeta}>
                <span className={styles.dateBadge}>{period}</span>
                {current && <span className={styles.currBadge}>Current</span>}
              </div>
              <h3>{role}</h3>
              <div className={styles.tlCompany}>{company}</div>
              <ul className={styles.tlBullets}>
                {bullets.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className={styles.projects}>
        <div className={styles.sectionHeader}>
          <span className={styles.secLabel}>Projects</span>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Things I've shipped.</h2>
        </div>
        <div className={styles.projectsGrid}>
          {projects.map(({ icon, title, description, impact }) => (
            <div key={title} className={styles.projCard}>
              <div className={styles.projIcon}>{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
              <div className={styles.projImpact}>⚡ {impact}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EDUCATION & CERTS ── */}
      <section id="education" className={styles.education}>
        <div className={styles.eduCol}>
          <div className={styles.sectionHeader}>
            <span className={styles.secLabel}>Education</span>
            <h2 className={styles.secTitle}>Academic background.</h2>
          </div>
          <div className={styles.eduCard}>
            <div className={styles.eduIcon}>🎓</div>
            <div>
              <h3>M.S. in Computer Science</h3>
              <div className={styles.eduSchool}>University of North Texas · Denton, USA</div>
              <div className={styles.eduPeriod}>Jan 2023 – May 2024</div>
            </div>
          </div>
        </div>
        <div className={styles.certCol}>
          <div className={styles.sectionHeader}>
            <span className={styles.secLabel}>Certifications</span>
            <h2 className={styles.secTitle}>Credentials.</h2>
          </div>
          <div className={styles.certList}>
            {certifications.map(({ name, issuer }) => (
              <div key={name} className={styles.certItem}>
                <div className={styles.certDot} />
                <div>
                  <strong>{name}</strong>
                  <span>{issuer}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ── */}
      <section id="achievements" className={styles.achievements}>
        <div className={styles.sectionHeader}>
          <span className={styles.secLabel}>Recognition</span>
          <h2 className={`${styles.secTitle} ${styles.light}`}>Milestones.</h2>
        </div>
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
          ].map(({ icon, title, desc }) => (
            <div key={title} className={styles.achCard}>
              <div className={styles.achIcon}>{icon}</div>
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className={styles.contact}>
        <span className={styles.secLabel}>Get In Touch</span>
        <h2 className={styles.secTitle}>Let&apos;s build something.</h2>
        <p className={styles.contactSub}>Open to data analytics, ML engineering, and BI architecture opportunities. Let&apos;s talk.</p>
        <div className={styles.ctaLinks}>
          <a className={`${styles.ctaBtn} ${styles.primary}`} href="mailto:vishnuvardhanvv127@gmail.com">Send an Email</a>
          <a className={`${styles.ctaBtn} ${styles.secondary}`} href="https://www.linkedin.com/in/vishnuvk12/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className={`${styles.ctaBtn} ${styles.secondary}`} href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div className={styles.contactInfoRow}>
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
        </div>
      </section>

      <footer className={styles.footer}>
        &copy; 2026 <span>Vishnu Vardhan Kaitepalli</span> · Crafted with precision.
      </footer>

    </main>
  );
}
