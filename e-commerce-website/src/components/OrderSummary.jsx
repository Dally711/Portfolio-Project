// Shared price summary used in the cart and confirmation steps.
export function OrderSummary({ subtotal, shipping, total }) {
  return (
    <dl className="order-summary">
      <div>
        <dt>Subtotal</dt>
        <dd>${subtotal.toFixed(2)}</dd>
      </div>
      <div>
        <dt>Shipping</dt>
        <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
      </div>
      <div>
        <dt>Total</dt>
        <dd>${total.toFixed(2)}</dd>
      </div>
    </dl>
  )
}
