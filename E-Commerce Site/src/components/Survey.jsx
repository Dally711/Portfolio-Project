// Short feedback form for the assignment's communication process.
export function Survey({ onSurveyChange, onSurveySubmit, survey, surveySent }) {
  return (
    <section className="survey" id="survey">
      <div>
        <p className="section-kicker">Quick survey</p>
        <h2>How did this shopping visit feel?</h2>
        <p>
          Your answer helps us make sizing, filters, product details, and checkout easier
          for the next visit.
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSurveySubmit()
        }}
      >
        <label>
          Experience rating
          <select
            value={survey.rating}
            onChange={(event) => onSurveyChange({ ...survey, rating: event.target.value })}
          >
            <option value="5">5 - Clear and easy</option>
            <option value="4">4 - Mostly easy</option>
            <option value="3">3 - Some friction</option>
            <option value="2">2 - Hard to use</option>
            <option value="1">1 - I felt stuck</option>
          </select>
        </label>
        <label>
          What should we improve?
          <textarea
            value={survey.comment}
            onChange={(event) => onSurveyChange({ ...survey, comment: event.target.value })}
            placeholder="Tell us what helped or what got in your way."
          />
        </label>
        <button type="submit">Send feedback</button>
        {surveySent && <p className="success">Thanks. Your feedback was recorded in this prototype.</p>}
      </form>
    </section>
  )
}
