function PlayerArea({ 
  characterData, 
  isCurrentPlayer, 
  handleActionInitiate, 
  actionState, 
  handleDefenseSelection,
  handleAtraparFollowupSelect,
  atraparOptions 
}) {
  return (
    <div className={`player-area ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="character-info">
        <h3>{characterData.name}</h3>
        <div className="stats">
          <div>PV: {characterData.stats.currentPV}/{characterData.stats.pv_max}</div>
          <div>PA: {characterData.stats.currentPA}/{characterData.stats.pa_max}</div>
          <div>PC: {characterData.stats.currentPC}/{characterData.stats.pc_max}</div>
        </div>
      </div>

      {isCurrentPlayer ? (
        // Es mi turno
        actionState.stage === 'awaiting_followup' && actionState.attackerId === characterData.id ? (
          // Estoy en modo Atrapar, muestro las opciones:
          <div className="followup-options-section">
            <h4>Elige Opción de Ataque (Atrapado):</h4>
            <div className="followup-options-buttons">
              {atraparOptions.map(option => (
                <button
                  key={option.id}
                  className="followup-button"
                  onClick={() => handleAtraparFollowupSelect(option.id)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        ) : actionState.active ? (
          // Hay una acción activa, pero no es mi turno de elegir followup
          <div className="waiting-message">Esperando defensa del rival...</div>
        ) : (
          // No hay acción activa, muestro mis acciones normales
          <div className="actions-section">
            <h4>Acciones</h4>
            <div className="action-buttons">
              {Object.entries(characterData.actions).map(([actionName, actionValue]) => (
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
            <div className="power-buttons">
              {characterData.powers.map(power => (
                <button
                  key={power.id}
                  className="power-button"
                  onClick={() => handleActionInitiate(`poder_${power.id}`)}
                >
                  {power.name}
                </button>
              ))}
            </div>
          </div>
        )
      ) : (
        // No es mi turno
        actionState.active && actionState.defenderId === characterData.id && actionState.stage === 'awaiting_defense' ? (
          // Es mi turno de DEFENDER
          <div className="defense-buttons">
            <h4>Elige Defensa:</h4>
            
            {/* Mostrar Esquivar si no hay restricción O si está permitida */}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('esquivar')) && (
                <button 
                    className="defense-button" 
                    onClick={() => handleDefenseSelection('esquivar')}
                >
                    Esquivar
                </button>
            )}

            {/* Mostrar Bloquear si no hay restricción O si está permitida */}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('bloquear')) && (
                <button 
                    className="defense-button" 
                    onClick={() => handleDefenseSelection('bloquear')}
                >
                    Bloquear
                </button>
            )}

            {/* Mostrar Contraatacar si no hay restricción O si está permitida */}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('contraatacar')) && (
                <button 
                    className="defense-button" 
                    onClick={() => handleDefenseSelection('contraatacar')}
                >
                    Contraatacar
                </button>
            )}
          </div>
        ) : (
          // No es mi turno y no estoy defendiendo
          <div className="waiting-message">Esperando turno...</div>
        )
      )}
    </div>
  );
}

export default PlayerArea; 