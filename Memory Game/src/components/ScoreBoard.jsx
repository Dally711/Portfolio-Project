function ScoreBoard({ level, score, message }) {
  return (
    // The scoreboard groups the player's level, score, and current instruction.
    <div className="score-board">
      <div className="row g-2">
        {/* Shows the current round number. */}
        <div className="col-6">
          <div className="score-stat">
            <span>Level</span>
            <strong>{level}</strong>
          </div>
        </div>
        {/* Shows how many rounds the player has completed successfully. */}
        <div className="col-6">
          <div className="score-stat">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
        </div>
      </div>
      {/* Message changes based on the current game state. */}
      <p className="message mb-0 mt-3">{message}</p>
    </div>
  );
}

export default ScoreBoard;
