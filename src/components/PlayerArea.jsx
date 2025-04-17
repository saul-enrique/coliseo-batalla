function PlayerArea({ characterData, isCurrentPlayer, handleActionInitiate, actionState }) {
  return (
    <div className="player-area">
      <h2>{characterData.name}</h2>
      
      {isCurrentPlayer ? (
        actionState.active ? (
          <div className="waiting-message">Esperando defensa del oponente...</div>
        ) : (
          <div className="actions-section">
            <h4>Acciones</h4>
            <div className="actions-buttons">
              {Object.keys(characterData.actions).map(actionName => (
                <button 
                  key={actionName} 
                  className="action-button"
                  onClick={() => handleActionInitiate(actionName)}
                >
                  {actionName}
                </button>
              ))}
            </div>
            
            <h4>Poderes</h4>
            <div className="powers-buttons">
              {characterData.powers.map(power => (
                <button 
                  key={power.id} 
                  className="power-button"
                  onClick={() => handleActionInitiate('poder_ejemplo_1')}
                >
                  {power.name} (Coste: {power.cost})
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        actionState.active && actionState.defenderId === characterData.id && actionState.stage === 'awaiting_defense' ? (
          <div className="defense-buttons">
            <h4>Elige Defensa:</h4>
            <button onClick={() => handleActionInitiate('esquivar')}>Esquivar</button>
            <button onClick={() => handleActionInitiate('bloquear')}>Bloquear (No implementado)</button>
            <button onClick={() => handleActionInitiate('contraatacar')}>Contraatacar (No implementado)</button>
          </div>
        ) : (
          <div className="waiting-message">Esperando turno...</div>
        )
      )}
      
      <div>Estado</div>
      <div>Efectos</div>
      <div>PV: {characterData.stats.currentPV} / {characterData.stats.pv_max}</div>
      <div>PA: {characterData.stats.currentPA} / {characterData.stats.pa_max}</div>
      <div>Cosmos: {characterData.stats.currentPC} / {characterData.stats.pc_max}</div>
    </div>
  )
}

export default PlayerArea 