export default function ContactPage() {
  return (
    <div className="page-content">
      <span className="label">Contact</span>
      <h1 className="page-title">Get in touch</h1>
      <p className="page-lead">
        Whether you&rsquo;re looking to collaborate on a project, have a question,
        or just want to connect — I&rsquo;m happy to hear from you.
      </p>
      <div className="contact-links">
        <a
          href="https://www.linkedin.com/in/ilja-vorstermans-644920193/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          <span className="contact-link-label">LinkedIn</span>
          <span className="contact-link-value">linkedin.com/in/ilja-vorstermans</span>
        </a>
        {/* <a
          href="https://github.com/IljaVorstermans"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          <span className="contact-link-label">GitHub</span>
          <span className="contact-link-value">github.com/IljaVorstermans</span>
        </a> */}
      </div>
    </div>
  );
}
