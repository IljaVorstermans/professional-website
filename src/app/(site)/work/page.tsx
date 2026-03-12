import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Work',
  description: 'A selection of projects by Ilja Vorstermans spanning GDPR-compliant data pipelines, AI tooling, financial analysis, and strategic consulting.',
};

const projects = [
  {
    tag: 'Data / AI',
    title: 'GDPR Document Redaction',
    desc: 'Privacy-first pipeline for automated redaction of sensitive data in documents, built for a Dutch real estate agency. Locally processed, no cloud dependency, and built entirely on open-source software, so no licensing fees.',
  },
  {
    tag: 'Finance / API',
    title: 'Trading 212 Portfolio Dashboard',
    desc: 'Web app consuming the Trading 212 API to track and analyse group investment positions in real time. Built for Brût Investments.',
  },
  {
    tag: 'AI / Search',
    title: 'GenAI Document Search',
    desc: 'Semantic search across internal document libraries using embeddings and a retrieval-augmented generation (RAG) approach. GDPR-compliant by design.',
  },
];

export default function WorkPage() {
  return (
    <div className="page-content">
      <span className="label">Work</span>
      <h1 className="page-title">Projects &amp; Clients</h1>
      <p className="page-lead">
        A selection of projects spanning data engineering, AI tooling, financial analysis,
        and strategic consulting.
      </p>
      <div className="project-grid project-grid--full">
        {projects.map(p => (
          <div key={p.title} className="project-card">
            <span className="project-tag">{p.tag}</span>
            <h3 className="project-title">{p.title}</h3>
            <p className="project-desc">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
