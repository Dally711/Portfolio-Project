import { ProductCard } from './ProductCard'

// Product grid receives already-filtered products from App.
export function ProductCatalog({
  favoriteIds = [],
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  products,
  title = 'Catalog',
}) {
  return (
    <section className="product-area" aria-live="polite">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Catalog</p>
          <h2>{title}</h2>
        </div>
        <p>{products.length} products match your search.</p>
      </div>

      <div className="product-grid">
        {products.length === 0 ? (
          <p className="empty-catalog">No products are saved here yet.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.id}
              isFavorite={favoriteIds.includes(product.id)}
              product={product}
              onAddToCart={onAddToCart}
              onToggleFavorite={onToggleFavorite}
              onViewDetails={onViewDetails}
            />
          ))
        )}
      </div>
    </section>
  )
}
