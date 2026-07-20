import { Link } from 'react-router-dom'

export default function Footer({ links, copy }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <Link className="wordmark wordmark-footer" to="/">
          <span className="wordmark-mark" aria-hidden="true">⌁</span>
          <span>Living<span>Costs</span></span>
        </Link>
        <p>{copy.footerDescription}</p>
      </div>
      <nav aria-label={copy.footerNavigation}>
        {links.map((link) => <Link key={link.to} to={link.to}>{link.label}</Link>)}
      </nav>
      <div className="footer-meta">
        <span>© 2026 Jaïme D. Tapa</span>
        <span>SEG 3125 · {copy.uOttawa}</span>
        <span>{copy.source}</span>
      </div>
    </footer>
  )
}
