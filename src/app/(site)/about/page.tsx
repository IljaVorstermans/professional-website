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
          intersection of financial markets and technology. I self-host parts of my digital
          life on a Raspberry Pi and think carefully about what data I share and with whom.
        </p>
      </div>
    </div>
  );
}
