import heroImage from '../assets/thread-form-hero.png'

// Editorial hero section introduces the clothing store and primary actions.
export function Hero({ onNavigate }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Online and in stores</p>
        <h1>The Summer Refresh Event</h1>
        <p>
          Enjoy an extra 30% off select sale styles.
        </p>
        <div className="hero-actions">
          <button
            className="primary-link"
            type="button"
            onClick={() => onNavigate('shop', { audience: 'Men' })}
          >
            Men
          </button>
          <button
            className="secondary-link"
            type="button"
            onClick={() => onNavigate('shop', { audience: 'Women' })}
          >
            Women
          </button>
          <button
            className="secondary-link"
            type="button"
            onClick={() => onNavigate('shop', { audience: 'Accessories' })}
          >
            Accessories
          </button>
          <button
            className="secondary-link"
            type="button"
            onClick={() => onNavigate('shop', { sale: true })}
          >
            Sale
          </button>
        </div>
      </div>
      <img src={heroImage} alt="Clothing and accessories arranged like an editorial catalog" />
    </section>
  )
}
