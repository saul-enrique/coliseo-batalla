function GameLog({ log }) {
  return (
    <div className="game-log">
      <h4>Registro de Combate</h4>
      <div className="log-messages">
        {log.slice(0, 10).map((message, index) => (
          <div key={index} className="log-message">
            {message}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameLog 