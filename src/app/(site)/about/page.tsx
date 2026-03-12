import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Ilja Vorstermans works at the intersection of business strategy and IT, with a focus on privacy-first solutions, digital autonomy, and European tech independence.',
};

export default function AboutPage() {
  return (
    <div className="page-content">
      <span className="label">About</span>
      <h1 className="page-title">Ilja Vorstermans</h1>
      <p className="page-lead">
        I work at the intersection of business strategy and information technology.
        My background spans financial operations, data consulting, and strategic analysis —
        with a strong focus on privacy-first, practical solutions.
      </p>

      <div className="content-section">
        <h2 className="content-heading">Background</h2>
        <p className="content-body">
          Currently finishing my MSc Business Information Management at Rotterdam School of
          Management (RSM), via an HBO International Business degree at HvA and a premaster.
          Previously worked at ABN AMRO in strategic initiatives and FX operations.
        </p>
      </div>

      <div className="content-section">
        <h2 className="content-heading">Consulting</h2>
        <p className="content-body">
          I run freelance data and AI projects through Generation C B.V., focusing on
          GDPR-compliant document workflows, generative AI search, and practical automation
          for organisations that care about how their data is handled.
        </p>
      </div>

      <div className="content-section">
        <h2 className="content-heading">Interests</h2>
        <p className="content-body">
          Digital autonomy, open-source infrastructure, privacy tooling, and the
          intersection of financial markets and technology. I believe most people give away
          more control over their data and tools than they realise, and I think a lot about
          what it means to actually own your digital life.
        </p>
      </div>
    </div>
  );
}
