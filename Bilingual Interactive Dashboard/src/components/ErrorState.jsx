export default function ErrorState({ title, message, onRetry, retryLabel }) {
  return (
    <div className="state-panel error-panel" role="alert">
      <span className="state-icon" aria-hidden="true">!</span>
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
        {onRetry && <button type="button" onClick={onRetry}>{retryLabel}</button>}
      </div>
    </div>
  )
}
