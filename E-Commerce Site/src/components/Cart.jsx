import { OrderSummary } from './OrderSummary'

// Standalone cart page sits between browsing and checkout.
export function Cart({
  cartItems,
  onCheckout,
  onQuantityChange,
  onShop,
  shipping,
  subtotal,
  total,
}) {
  return (
    <section className="cart-page">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Cart</p>
          <h2>Review your pieces</h2>
        </div>
        <button className="secondary-link" type="button" onClick={onShop}>
          Continue shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button type="button" onClick={onShop}>Shop now</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {cartItems.map((item) => (
              <div className="cart-line" key={item.id}>
                <div>
                  <strong>{item.product.name}</strong>
                  <span>${item.product.price} each</span>
                </div>
                <div className="quantity-control">
                  <button type="button" onClick={() => onQuantityChange(item.id, -1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => onQuantityChange(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
            <button type="button" onClick={onCheckout}>Checkout</button>
          </aside>
        </div>
      )}
    </section>
  )
}
