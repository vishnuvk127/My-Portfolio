import VideoIntro from '@/components/VideoIntro';

export const metadata = {
  title: 'Vishnu Vardhan — Data Analytics Engineer',
  description: 'Portfolio of Vishnu Vardhan — ETL automation, risk scoring models, scalable BI.',
};

export default function HomePage() {
  return (
    <main>
      {/* ── Cinematic Hero ── */}
      <VideoIntro
        videoSrc="/videos/hero.mp4"
        nextId="work"
      />

      {/* ── Next section ── */}
      <section
        id="work"
        style={{
          minHeight: '100vh',
          background: '#07050d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        <h2 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '-0.02em' }}>
          Selected Work
        </h2>
        <p style={{ fontSize: 16, fontWeight: 300, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>
          Case studies · Dashboards · Data pipelines
        </p>
      </section>
    </main>
  );
}
