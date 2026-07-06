import logoImage from '../assets/thread-form-logo.png'

// Footer provides common support links for a complete retail page structure.
export function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img src={logoImage} alt="Thread & Form" />
        <p>Studio wardrobe essentials designed for everyday dressing.</p>
      </div>

      <div className="footer-columns">
        <section>
          <h3>Shop</h3>
          <button type="button" onClick={() => onNavigate('shop', { audience: 'Women' })}>Women</button>
          <button type="button" onClick={() => onNavigate('shop', { audience: 'Men' })}>Men</button>
          <button type="button" onClick={() => onNavigate('shop', { sale: true })}>Sale</button>
          <button type="button" onClick={() => onNavigate('shop', { newArrival: true })}>New arrivals</button>
        </section>

        <section>
          <h3>Support</h3>
          <button type="button">Contact</button>
          <button type="button">Returns</button>
          <button type="button">Shipping</button>
          <button type="button">FAQ</button>
        </section>

        <section>
          <h3>Company</h3>
          <button type="button">About</button>
          <button type="button">Privacy policy</button>
          <button type="button">Terms</button>
          <button type="button" onClick={() => onNavigate('survey')}>Feedback</button>
        </section>

        <section>
          <h3>Follow</h3>
          <button type="button">Instagram</button>
          <button type="button">Pinterest</button>
          <button type="button">TikTok</button>
        </section>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Thread & Form</span>
        <span>Canada English</span>
      </div>
    </footer>
  )
}
