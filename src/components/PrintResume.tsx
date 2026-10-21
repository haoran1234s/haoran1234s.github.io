import { useApp } from '../context/app-context'

const prettyUrl = (href: string) => href.replace(/^https?:\/\//, '').replace(/\/$/, '')

/**
 * A plain, ATS-friendly résumé built from the same content as the site.
 * Hidden on screen; `window.print()` (the "download résumé" buttons) renders it to PDF,
 * and Chrome keeps the <a> elements clickable in the saved file.
 */
export function PrintResume() {
  const { content } = useApp()
  const { profile, about, skills, experience, projects, print } = content
  const site = `${window.location.origin}${window.location.pathname.replace(/index\.html$/, '')}`

  return (
    <article className="print-resume">
      <header className="pr-header">
        <div>
          <h1 className="pr-name">
            {profile.name} <span>{profile.nameAlt}</span>
          </h1>
          <p className="pr-role">{profile.role}</p>
        </div>
        <ul className="pr-contact">
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>{profile.phone}</li>
          <li>{profile.location}</li>
          <li>{profile.status}</li>
          <li>
            {print.portfolio}: <a href={site}>{prettyUrl(site)}</a>
          </li>
        </ul>
      </header>

      <section className="pr-section">
        <h2>{print.summary}</h2>
        <div>
          <p>{about.paragraph}</p>
          <ul className="pr-stats">
            {about.stats.map((stat) => (
              <li key={stat.label}>
                <strong>
                  {stat.value}
                  {stat.suffix}
                </strong>{' '}
                {stat.label}
              </li>
            ))}
          </ul>
          <dl className="pr-facts">
            {about.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="pr-section">
        <h2>{print.skills}</h2>
        <dl className="pr-skills">
          {skills.groups.map((group) => (
            <div key={group.title}>
              <dt>{group.title}</dt>
              <dd>{group.items.join(' · ')}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="pr-section">
        <h2>{print.experience}</h2>
        <div>
          {experience.items.map((job) => (
            <div className="pr-item" key={job.company}>
              <div className="pr-item__head">
                <h3>{job.company}</h3>
                <span className="pr-item__meta">
                  {job.period} · {job.location}
                </span>
              </div>
              <p className="pr-item__role">{job.role}</p>
              <p>{job.summary}</p>
              <ul className="pr-bullets">
                {job.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <p className="pr-stack">{job.stack.join(' / ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pr-section">
        <h2>{print.projects}</h2>
        <div>
          {projects.items.map((project) => (
            <div className="pr-item" key={project.id}>
              <div className="pr-item__head">
                <h3>
                  {project.title} <span>· {project.role}</span>
                </h3>
                <span className="pr-item__meta">{project.year}</span>
              </div>
              <p>{project.description}</p>
              <ul className="pr-bullets">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <p className="pr-stack">{project.stack.join(' / ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pr-section">
        <h2>{print.contact}</h2>
        <ul className="pr-links">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <span>{social.label}</span>
              <a href={social.href}>
                {social.handle} · {prettyUrl(social.href)}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
