import { useState } from 'react'

const waistSizes = ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '40', '42', '44']
const unavailableWaists = ['29', '30', '31', '35', '37', '44']
const lengthSizes = ['29', '30', '31', '32', '34']
const unavailableLengths = ['29', '31']

// Product detail view modeled after a premium clothing product page.
export function ProductDetails({
  isFavorite,
  onAddToCart,
  onBackToShop,
  onToggleFavorite,
  product,
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0])
  const [selectedWaist, setSelectedWaist] = useState('32')
  const [selectedLength, setSelectedLength] = useState('30')

  const colorSlug = selectedColor.toLowerCase().replace(' ', '-')

  return (
    <section className="detail-page">
      <div className="detail-layout">
        <div className={`detail-image ${colorSlug}`}>
          <img src={product.image} alt={product.name} />
        </div>

        <div className="detail-copy">
          <button className="text-button" type="button" onClick={onBackToShop}>
            Back to shop
          </button>

          <p className="detail-breadcrumb">
            {product.audience} / Clothing / {product.category}
          </p>

          <div className="detail-title-row">
            <div>
              <h1>{product.name}</h1>
              <p className="detail-brand">{product.brand}</p>
            </div>
            <button
              className="favorite-button detail-favorite"
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

          <p className="detail-price">${product.price}.00</p>
          {product.sale && (
            <p className="detail-promo">Enjoy an extra 30% off select sale styles</p>
          )}

          <div className="detail-option-block">
            <p>
              <strong>Color:</strong> {selectedColor}
            </p>
            <div className="detail-swatches">
            {product.colors.map((color) => (
                <button
                  className={`detail-color-choice ${
                    selectedColor === color ? 'selected-swatch' : ''
                  }`}
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  aria-label={`Select ${color}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-option-block">
            <p>
              <strong>{product.category === 'Bottoms' ? 'Waist:' : 'Size:'}</strong>
              <span className="size-chart"> Size chart</span>
            </p>
            <div className="size-grid">
              {(product.category === 'Bottoms' ? waistSizes : product.availableSizes).map((size) => {
                const unavailable =
                  product.category === 'Bottoms'
                    ? unavailableWaists.includes(size)
                    : !product.availableSizes.includes(size)

                return (
                  <button
                    className={`${selectedWaist === size ? 'selected-size' : ''} ${
                      unavailable ? 'unavailable-size' : ''
                    }`}
                    disabled={unavailable}
                    key={size}
                    type="button"
                    onClick={() => setSelectedWaist(size)}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>

          {product.category === 'Bottoms' && (
            <div className="detail-option-block">
              <p>
                <strong>Length:</strong>
              </p>
              <div className="size-grid length-grid">
                {lengthSizes.map((size) => {
                  const unavailable = unavailableLengths.includes(size)

                  return (
                    <button
                      className={`${selectedLength === size ? 'selected-size' : ''} ${
                        unavailable ? 'unavailable-size' : ''
                      }`}
                      disabled={unavailable}
                      key={size}
                      type="button"
                      onClick={() => setSelectedLength(size)}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <button className="add-to-bag-button" type="button" onClick={() => onAddToCart(product.id, 1)}>
            Add to bag
          </button>
        </div>
      </div>
    </section>
  )
}
