import Controls from './Controls';

function RecapPanel({ recap, onRestart }) {
  if (!recap) {
    return null;
  }

  // Average score shows how many points the player earned per completed round.
  const averageScore = recap.roundScores.length > 0
    ? recap.roundScores.reduce((total, round) => total + round.points, 0) / recap.roundScores.length
    : 0;
  // The recap compares the final score against the record for the played mode.
  const modeLabel = recap.mode === 'order' ? 'Sequence' : 'Pattern';

  return (
    <section className="app-panel recap-panel">
      <div className="recap-header">
        <div>
          <h2>Recap</h2>
          <p className="text-secondary mb-0">Final score breakdown</p>
        </div>
        {recap.isNewRecord && (
          <span className="record-badge">New Record</span>
        )}
      </div>

      <div className="row g-2">
        <div className="col-6">
          <div className="score-stat">
            <span>Final Score</span>
            <strong>{recap.finalScore}</strong>
          </div>
        </div>
        <div className="col-6">
          <div className="score-stat">
            <span>{modeLabel} Record</span>
            <strong>{recap.recordScore}</strong>
          </div>
        </div>
        <div className="col-6">
          <div className="score-stat">
            <span>Avg Score</span>
            <strong>{Math.round(averageScore)}</strong>
          </div>
        </div>
        <div className="col-6">
          <div className="score-stat">
            <span>Level Reached</span>
            <strong>{recap.levelReached}</strong>
          </div>
        </div>
      </div>

      <div className="round-breakdown">
        <h3>Round Scores</h3>
        {recap.roundScores.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Grid</th>
                  <th>Time</th>
                  <th className="text-end">Points</th>
                </tr>
              </thead>
              <tbody>
                {recap.roundScores.map((round) => (
                  <tr key={round.round}>
                    <td>{round.round}</td>
                    <td>{round.gridSize}x{round.gridSize}</td>
                    <td>{round.timeTaken.toFixed(2)}s</td>
                    <td className="text-end">{round.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-secondary mb-0">No completed rounds yet.</p>
        )}
      </div>

      <Controls
        onRestart={onRestart}
        showStart={false}
      />
    </section>
  );
}

export default RecapPanel;
