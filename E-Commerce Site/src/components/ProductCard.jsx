// Individual catalog item with product details, favorite status, and cart action.
export function ProductCard({
  isFavorite,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  product,
}) {
  const colorCount = product.colors.length

  return (
    <article className="product-card">
      <div className={`product-visual ${product.color.toLowerCase().replace(' ', '-')}`}>
        <img src={product.image} alt={product.name} />
        <button
          className="product-image-button"
          type="button"
          onClick={() => onViewDetails(product.id)}
          aria-label={`View details for ${product.name}`}
        />
        <div className="product-hover-bar">
          <div className="swatches" aria-label={`Available colors for ${product.name}`}>
            {product.colors.map((color) => (
              <span
                className={`swatch ${color.toLowerCase().replace(' ', '-')}`}
                key={color}
                title={color}
              />
            ))}
          </div>
          <button type="button" onClick={() => onAddToCart(product.id)}>
            Add to Cart
          </button>
        </div>
      </div>
      <div className="product-content">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          <button
            className="favorite-button"
            type="button"
            onClick={() => onToggleFavorite(product.id)}
            aria-label={`${isFavorite ? 'Remove' : 'Add'} ${product.name} ${
              isFavorite ? 'from' : 'to'
            } favorites`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </button>
        </div>
        <p className="product-brand">{product.brand}</p>
        <p className="product-price">
          <span className={product.sale ? 'old-price' : ''}>${product.price}.00</span>
          {product.sale && (
            <span className="sale-price"> Now ${Math.max(product.price - 10, 1)}.99</span>
          )}
        </p>
        {product.sale && <p className="product-promo">Enjoy 30% off</p>}
        <p className="product-color-count">
          {colorCount} {colorCount === 1 ? 'color' : 'colors'} available
        </p>
      </div>
    </article>
  )
}
