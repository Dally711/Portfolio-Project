import { FormGrid } from './FormGrid'
import { OrderSummary } from './OrderSummary'

// Step labels shown in the checkout progress indicator.
const checkoutSteps = ['Shipping', 'Payment', 'Confirmation']

// Guided checkout process after the user has reviewed the standalone cart.
export function Checkout({
  cartItems,
  checkoutStep,
  details,
  onDetailsChange,
  onPaymentChange,
  onPlaceOrder,
  onStepChange,
  onSurvey,
  orderPlaced,
  payment,
  shipping,
  subtotal,
  total,
}) {
  // Prevent advancing until the current step has the minimum required information.
  function canContinue() {
    if (checkoutStep === 0) return details.name && details.email && details.address
    if (checkoutStep === 1) return payment.card && payment.expiry && payment.postal
    return true
  }

  return (
    <section className="checkout" id="checkout">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Checkout</p>
          <h2>Complete your order</h2>
        </div>
        <p>The stepper shows what is done, where you are, and what remains.</p>
      </div>

      <ol className="stepper" aria-label="Checkout progress">
        {/* Visual feedback for completed, current, and upcoming checkout steps. */}
        {checkoutSteps.map((step, index) => (
          <li
            key={step}
            className={`${index < checkoutStep ? 'done' : ''} ${
              index === checkoutStep ? 'current' : ''
            }`}
          >
            <span>{index + 1}</span>
            {step}
          </li>
        ))}
      </ol>

      <div className="checkout-panel">
        {/* Render only the active checkout step to keep the process focused. */}
        {checkoutStep === 0 && (
          <DetailsStep details={details} onDetailsChange={onDetailsChange} />
        )}

        {checkoutStep === 1 && (
          <PaymentStep payment={payment} onPaymentChange={onPaymentChange} />
        )}

        {checkoutStep === 2 && (
          <ConfirmationStep
            cartItems={cartItems}
            details={details}
            orderPlaced={orderPlaced}
            shipping={shipping}
            subtotal={subtotal}
            total={total}
          />
        )}

        <div className="checkout-actions">
          <button
            type="button"
            className="quiet-button"
            disabled={checkoutStep === 0}
            onClick={() => onStepChange(Math.max(0, checkoutStep - 1))}
          >
            Back
          </button>
          {checkoutStep < 2 ? (
            <button
              type="button"
              disabled={!canContinue()}
              onClick={() => onStepChange(Math.min(2, checkoutStep + 1))}
            >
              Continue
            </button>
          ) : orderPlaced ? (
            <button type="button" onClick={onSurvey}>
              Take survey
            </button>
          ) : (
            <button type="button" disabled={cartItems.length === 0} onClick={onPlaceOrder}>
              Place order
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

// Delivery step collects the personal information needed for shipping.
function DetailsStep({ details, onDetailsChange }) {
  return (
    <FormGrid title="Shipping details">
      <label>
        Full name
        <input
          value={details.name}
          onChange={(event) => onDetailsChange({ ...details, name: event.target.value })}
          placeholder="Alex Morgan"
        />
      </label>
      <label>
        Email
        <input
          type="email"
          value={details.email}
          onChange={(event) => onDetailsChange({ ...details, email: event.target.value })}
          placeholder="alex@example.com"
        />
      </label>
      <label className="wide">
        Delivery address
        <textarea
          value={details.address}
          onChange={(event) => onDetailsChange({ ...details, address: event.target.value })}
          placeholder="Street, city, province, postal code"
        />
      </label>
    </FormGrid>
  )
}

// Payment step is a prototype form and does not connect to a payment provider.
function PaymentStep({ payment, onPaymentChange }) {
  return (
    <FormGrid title="Payment information">
      <label>
        Card number
        <input
          inputMode="numeric"
          value={payment.card}
          onChange={(event) => onPaymentChange({ ...payment, card: event.target.value })}
          placeholder="4242 4242 4242 4242"
        />
      </label>
      <label>
        Expiry
        <input
          value={payment.expiry}
          onChange={(event) => onPaymentChange({ ...payment, expiry: event.target.value })}
          placeholder="08/28"
        />
      </label>
      <label>
        Billing postal code
        <input
          value={payment.postal}
          onChange={(event) => onPaymentChange({ ...payment, postal: event.target.value })}
          placeholder="K1N 6N5"
        />
      </label>
    </FormGrid>
  )
}

// Final checkout step confirms the order after review.
function ConfirmationStep({ cartItems, details, orderPlaced, shipping, subtotal, total }) {
  return (
    <div className="confirmation">
      <p className="badge">{orderPlaced ? 'Order confirmed' : 'Ready to review'}</p>
      <h3>{orderPlaced ? 'Thank you for your order' : 'Check your order'}</h3>
      <div className="confirmation-items">
        {cartItems.map((item) => (
          <p key={item.id}>
            {item.quantity} x {item.product.name}
          </p>
        ))}
      </div>
      <OrderSummary subtotal={subtotal} shipping={shipping} total={total} />
      {orderPlaced ? (
        <p>
          Thank you, {details.name || 'shopper'}. A confirmation was prepared for{' '}
          {details.email || 'your email'}.
        </p>
      ) : (
        <p>Review the total, then place the order to complete the checkout flow.</p>
      )}
    </div>
  )
}
