import Link from 'next/link';
import { levels } from '@/app/quiz/data';

export default function HomePage() {
  return (
    <>
      {/* ── Hero: quiz CTA ── */}
      <section className="hero">
        <div className="hero-inner">
          <span className="label">Digital Autonomy Quiz</span>
          <h1 className="landing-title">How&rsquo;s your relationship<br />with Big Tech?</h1>
          <div className="level-chips">
            {levels.map(lv => (
              <span key={lv.title} className="level-chip">{lv.title}</span>
            ))}
          </div>
          <p className="landing-sub">
            Find out if you&rsquo;re in denial or close to finding new love in under two minutes.
            No account required.
          </p>
          <Link href="/quiz" className="btn-primary">Find out →</Link>
        </div>
      </section>

      {/* ── About teaser ── */}
      <section className="site-section">
        <span className="label">About</span>
        <h2 className="section-title">Business meets technology</h2>
        <p className="section-body">
          I work at the intersection of business strategy and information technology —
          helping organisations make sense of data, AI, and digital infrastructure.
          Currently finishing my MSc Business Information Management at RSM.
        </p>
        <Link href="/about" className="link-arrow">More about me →</Link>
      </section>

      {/* ── Featured work ── */}
      <section className="site-section">
        <span className="label">Work</span>
        <h2 className="section-title">Selected projects</h2>
        <div className="project-grid">
          <div className="project-card">
            <span className="project-tag">Data / AI</span>
            <h3 className="project-title">GDPR Document Redaction</h3>
            <p className="project-desc">
              Built a privacy-first pipeline for automated redaction of sensitive data in
              legal documents — locally processed, no cloud dependency.
            </p>
          </div>
          <div className="project-card">
            <span className="project-tag">Finance / API</span>
            <h3 className="project-title">Trading 212 Portfolio Dashboard</h3>
            <p className="project-desc">
              Web app consuming the Trading 212 API to track and analyse group investment
              positions in real time, built for Brût Investments.
            </p>
          </div>
        </div>
        <Link href="/work" className="link-arrow">See all work →</Link>
      </section>

      {/* ── Contact CTA ── */}
      <section className="site-section site-section--last">
        <span className="label">Contact</span>
        <h2 className="section-title">Let&rsquo;s talk</h2>
        <p className="section-body">
          Interested in working together or just want to connect?
        </p>
        <Link href="/contact" className="btn-primary">Get in touch →</Link>
      </section>
    </>
  );
}
