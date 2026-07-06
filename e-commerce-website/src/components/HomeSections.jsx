import { ProductCard } from './ProductCard'

const categories = [
  { label: 'Men', filter: { audience: 'Men' } },
  { label: 'Women', filter: { audience: 'Women' } },
  { label: 'Accessories', filter: { audience: 'Accessories' } },
  { label: 'Sale', filter: { sale: true } },
]

// Category shortcuts move users from the homepage into a filtered shop view.
export function CategorySection({ onNavigate }) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Shop by category</p>
          <h2>Start with a clear edit</h2>
        </div>
      </div>
      <div className="category-grid">
        {categories.map((category) => (
          <button
            className="category-tile"
            type="button"
            key={category.label}
            onClick={() => onNavigate('shop', category.filter)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  )
}

// Homepage product sections preview the catalog without showing every item.
export function ProductPreviewSection({
  favoriteIds = [],
  label,
  onAddToCart,
  onNavigate,
  onToggleFavorite,
  onViewDetails,
  products,
  title,
}) {
  return (
    <section className="home-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">{label}</p>
          <h2>{title}</h2>
        </div>
        <button className="secondary-link" type="button" onClick={() => onNavigate('shop')}>
          View all
        </button>
      </div>
      <div className="product-grid preview-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            isFavorite={favoriteIds.includes(product.id)}
            product={product}
            onAddToCart={onAddToCart}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </section>
  )
}

// Trust signals commonly shown on clothing retail homepages.
export function WhyShopSection() {
  const benefits = [
    ['Free shipping', 'On orders over $75'],
    ['Easy returns', 'Exchange sizes within 30 days'],
    ['Secure checkout', 'Prototype payment flow with clear steps'],
    ['Premium quality', 'Material notes on every product'],
  ]

  return (
    <section className="home-section benefits-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Why shop with us</p>
          <h2>Simple service, better basics</h2>
        </div>
      </div>
      <div className="benefit-grid">
        {benefits.map(([title, copy]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
