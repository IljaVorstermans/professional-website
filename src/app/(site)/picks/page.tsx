const picks = [
  {
    tag: 'Newsletter',
    title: 'The AI Field',
    desc: 'The newsletter I rely on to stay current with AI, even on busy weeks. Drops every 1-2 weeks and covers the developments that actually matter.',
    url: 'https://theaifield.beehiiv.com/subscribe',
  },
  // {
  //   tag: 'Video',
  //   title: '',
  //   desc: '',
  //   url: '',
  // },
];

export default function PicksPage() {
  return (
    <div className="page-content">
      <span className="label">My Picks</span>
      <h1 className="page-title">Worth your time</h1>
      <p className="page-lead">
        A curated list of videos, articles, and ideas I keep coming back to.
      </p>
      {picks.length === 0 ? (
        <div className="empty-state">
          <p>Coming soon — check back.</p>
        </div>
      ) : (
        <div className="project-grid project-grid--full">
          {picks.map(p => (
            <a key={p.title} href={p.url} target="_blank" rel="noopener noreferrer" className="project-card">
              <span className="project-tag">{p.tag}</span>
              <h3 className="project-title">{p.title}</h3>
              <p className="project-desc">{p.desc}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
