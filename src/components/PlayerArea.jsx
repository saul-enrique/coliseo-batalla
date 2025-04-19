import StatBar from './StatBar'; // Ajusta la ruta si es necesario

function PlayerArea({ 
  characterData, 
  opponentData, 
  isCurrentPlayer, 
  handleActionInitiate, 
  actionState, 
  handleDefenseSelection,
  handleAtraparFollowupSelect,
  handleRomperTargetSelect,
  atraparOptions 
}) {
  return (
    <div className={`player-area ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="character-info">
        <h3>{characterData.name}</h3>
        <div className="stats">
          <StatBar
            label="PV"
            currentValue={characterData.stats.currentPV}
            maxValue={characterData.stats.pv_max}
            color="#e74c3c" /* Rojo para Vida */
          />
          <StatBar
            label="PA"
            currentValue={characterData.stats.currentPA}
            maxValue={characterData.stats.pa_max}
            color="#3498db" /* Azul para Armadura */
          />
          <StatBar
            label="PC"
            currentValue={characterData.stats.currentPC}
            maxValue={characterData.stats.pc_max}
            color="#f1c40f" /* Amarillo/Dorado para Cosmos */
          />
        </div>
      </div>

      {isCurrentPlayer ? (
        // Es mi turno
        actionState.stage === 'awaiting_followup' ? (
          <div className="atrapar-followup-section">
            <h4>Elige Opción de Atrapar:</h4>
            <div className="atrapar-followup-buttons">
              {atraparOptions.map(option => {
                // Comprobar si todas las partes del Oponente están MAX rotas (para Opción 6)
                const allOpponentPartsMaxBroken = opponentData &&
                  opponentData.stats.brokenParts.arms >= 2 &&
                  opponentData.stats.brokenParts.legs >= 2 &&
                  opponentData.stats.brokenParts.ribs >= 2;

                // Comprobar alternancia para Llave (para Opción 5)
                const isLlaveBlockedByAlternation = option.id === 'atrapar_op5' && characterData.lastActionType === 'llave';

                // Determinar si ESTE botón debe estar deshabilitado
                let isButtonDisabled = false;
                if (option.id === 'atrapar_op6' && allOpponentPartsMaxBroken) {
                  isButtonDisabled = true;
                } else if (isLlaveBlockedByAlternation) {
                  isButtonDisabled = true;
                }

                return (
                  <button
                    key={option.id}
                    className="action-button"
                    onClick={() => handleAtraparFollowupSelect(option.id)}
                    disabled={isButtonDisabled}
                  >
                    {option.name}
                    {option.id === 'atrapar_op6' && allOpponentPartsMaxBroken ? ' (MAX)' : ''}
                    {isLlaveBlockedByAlternation ? ' (Alternancia)' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ) : actionState.stage === 'awaiting_romper_target' ? (
          <div className="romper-target-section">
            <h4>Elige Parte a Romper:</h4>
            <div className="romper-target-buttons">
              <button
                className="action-button"
                onClick={() => handleRomperTargetSelect('arms')}
                disabled={!opponentData || opponentData.stats.brokenParts.arms >= 2}
              >
                Brazos {opponentData?.stats.brokenParts.arms >= 2 ? '(MAX)' : ''}
              </button>
              <button
                className="action-button"
                onClick={() => handleRomperTargetSelect('legs')}
                disabled={!opponentData || opponentData.stats.brokenParts.legs >= 2}
              >
                Piernas {opponentData?.stats.brokenParts.legs >= 2 ? '(MAX)' : ''}
              </button>
              <button
                className="action-button"
                onClick={() => handleRomperTargetSelect('ribs')}
                disabled={!opponentData || opponentData.stats.brokenParts.ribs >= 2}
              >
                Costillas {opponentData?.stats.brokenParts.ribs >= 2 ? '(MAX)' : ''}
              </button>
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
              {Object.entries(characterData.actions)
                .filter(([actionName, actionValue]) => {
                  // Define las acciones que dependen de la concentración
                  const concentrationActions = ['salto', 'velocidad_luz'];

                  // Oculta 'Concentracion' si ya está concentrado
                  if (actionName === 'concentracion') {
                    return !characterData.stats.isConcentrated;
                  }

                  // Verifica si la acción actual requiere concentración
                  if (concentrationActions.includes(actionName)) {
                    // Si requiere concentración, solo se muestra si characterData.stats.isConcentrated es true
                    return characterData.stats.isConcentrated;
                  }
                  
                  // Muestra todas las demás acciones por defecto
                  return true; 
                })
                .map(([actionName, actionValue]) => {
                const isRomperAction = actionName === 'romper';
                const allOpponentPartsMaxBroken = opponentData &&
                  opponentData.stats.brokenParts.arms >= 2 &&
                  opponentData.stats.brokenParts.legs >= 2 &&
                  opponentData.stats.brokenParts.ribs >= 2;

                const isDisabledByTurn = !isCurrentPlayer || (actionState.active && actionState.stage !== null && actionState.stage !== 'awaiting_romper_target' && actionState.stage !== 'awaiting_followup');

                return (
                  <button
                    key={actionName}
                    className="action-button"
                    onClick={() => handleActionInitiate(actionName)}
                    disabled={
                      isDisabledByTurn ||
                      (isRomperAction && allOpponentPartsMaxBroken)
                    }
                  >
                    {actionName.charAt(0).toUpperCase() + actionName.slice(1)}
                    {isRomperAction && allOpponentPartsMaxBroken ? ' (MAX)' : ''}
                  </button>
                );
              })}
            </div>
            {/* Comentado temporalmente hasta implementar lógica de poderes
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
            */}
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