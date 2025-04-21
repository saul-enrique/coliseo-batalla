import React from 'react'; // Import React if not already present
import StatBar from './StatBar';
import './PlayerArea.css'; // Make sure CSS path is correct

function PlayerArea({
  characterData,
  opponentData, // Receive opponent data for checks
  isCurrentPlayer,
  handleActionInitiate,
  actionState,
  handleDefenseSelection,
  handleAtraparFollowupSelect,
  handleRomperTargetSelect, // Receive the new handler
  atraparOptions
}) {

  // Helper to determine if an action requires concentration
  const doesActionRequireConcentration = (actionName) => {
    // Define actions that need concentration here
    // *** ADDED 'engaño' TO THIS LIST ***
    const concentrationActions = ['velocidad_luz', 'salto', 'combo', 'engaño'];
    return concentrationActions.includes(actionName);
  };

  return (
    <div className={`player-area ${isCurrentPlayer ? 'current-player' : ''}`}>
      {/* Character Info and Stats */}
      <div className="character-info">
        <h3>{characterData.name}</h3>
        <div className="stats">
          <StatBar label="PV" currentValue={characterData.stats.currentPV} maxValue={characterData.stats.pv_max} color="#e74c3c" />
          <StatBar label="PA" currentValue={characterData.stats.currentPA} maxValue={characterData.stats.pa_max} color="#3498db" />
          <StatBar label="PC" currentValue={characterData.stats.currentPC} maxValue={characterData.stats.pc_max} color="#f1c40f" />
        </div>
        {/* Display if player is concentrated */}
        {characterData.stats.isConcentrated && <div className="status-indicator concentrated">Concentrado</div>}
      </div>

      {/* Conditional Rendering based on Turn and Action State */}
      {isCurrentPlayer ? (
        // --- Player's Turn ---
        actionState.stage === 'awaiting_followup' && actionState.attackerId === characterData.id ? (
          // --- Atrapar Follow-up Selection ---
          <div className="followup-options-section"> {/* Updated class name */}
            <h4>Elige Opción de Atrapar:</h4>
            <div className="followup-options-buttons"> {/* Updated class name */}
              {atraparOptions.map(option => {
                // Disable Romper Mejorado if all opponent parts are max broken
                const allOpponentPartsMaxBroken = opponentData &&
                  opponentData.stats.brokenParts.arms >= 2 &&
                  opponentData.stats.brokenParts.legs >= 2 &&
                  opponentData.stats.brokenParts.ribs >= 2;
                const isRomperMejoradoDisabled = option.id === 'atrapar_op6' && allOpponentPartsMaxBroken;

                // Disable Llave Mejorada if last action was Llave (Alternation)
                const isLlaveBlockedByAlternation = option.id === 'atrapar_op5' && characterData.stats.lastActionType === 'llave';

                const isButtonDisabled = isRomperMejoradoDisabled || isLlaveBlockedByAlternation;

                return (
                  <button
                    key={option.id}
                    className="action-button" // Use consistent button class
                    onClick={() => handleAtraparFollowupSelect(option.id)}
                    disabled={isButtonDisabled}
                    title={isRomperMejoradoDisabled ? "Todas las partes del rival están rotas al máximo" : isLlaveBlockedByAlternation ? "No se puede usar Llave consecutivamente" : option.name} // Add tooltip
                  >
                    {option.name}
                    {isRomperMejoradoDisabled ? ' (MAX)' : ''}
                    {isLlaveBlockedByAlternation ? ' (Alternancia)' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ) : actionState.stage === 'awaiting_romper_target' && actionState.attackerId === characterData.id ? (
          // --- Romper Target Selection ---
          <div className="romper-target-section">
            <h4>Elige Parte a Romper:</h4>
            <div className="romper-target-buttons">
              {['arms', 'legs', 'ribs'].map(part => {
                 const isPartMaxBroken = opponentData?.stats.brokenParts[part] >= 2;
                 return (
                    <button
                        key={part}
                        className="action-button" // Use consistent button class
                        onClick={() => handleRomperTargetSelect(part)}
                        disabled={!opponentData || isPartMaxBroken}
                        title={isPartMaxBroken ? `Los ${part} del rival ya están rotos al máximo` : `Romper ${part}`}
                    >
                        {part.charAt(0).toUpperCase() + part.slice(1)} {isPartMaxBroken ? '(MAX)' : `(${opponentData?.stats.brokenParts[part]}/2)`}
                    </button>
                 );
              })}
            </div>
          </div>
        ) : actionState.active && actionState.attackerId === characterData.id ? (
           // --- Waiting for opponent's defense ---
           <div className="waiting-message">Esperando defensa del rival...</div>
        ) : (
          // --- Normal Action Selection ---
          <div className="actions-section">
            {characterData.stats.isConcentrated ? (
              // --- Concentrated State: Show only concentration actions ---
              <>
                <h4>Acciones (Concentrado)</h4>
                <div className="action-buttons">
                   {Object.entries(characterData.actions)
                    .filter(([actionName, actionValue]) =>
                       // Filter now includes 'engaño' via the helper function
                       doesActionRequireConcentration(actionName) && actionValue
                    )
                    .map(([actionName, actionValue]) => (
                      <button
                        key={actionName}
                        className="action-button"
                        onClick={() => handleActionInitiate(actionName)}
                        // disabled={!isCurrentPlayer} // Already checked isCurrentPlayer
                      >
                        {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ')} {/* Replace underscore for display */}
                      </button>
                    ))}
                </div>
                {/* Add Concentrated Powers here if applicable */}
              </>

            ) : (
              // --- Normal State: Show normal actions and Concentracion ---
              <>
                <h4>Acciones</h4>
                <div className="action-buttons">
                   {Object.entries(characterData.actions)
                    .filter(([actionName, actionValue]) => {
                      // Filter now hides 'engaño' via the helper function
                      if (doesActionRequireConcentration(actionName)) {
                          return false; // Hide concentration actions
                      }
                      // Hide Concentracion button itself if already concentrated (shouldn't happen here, but safe check)
                      if (actionName === 'concentracion' && characterData.stats.isConcentrated) {
                          return false;
                      }
                      // Show the action if it exists
                      return actionValue !== undefined && actionValue !== null;
                    })
                    .map(([actionName, actionValue]) => {
                      // Disable Romper if opponent parts are maxed out
                      const isRomperAction = actionName === 'romper';
                      const allOpponentPartsMaxBroken = opponentData &&
                        ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
                      const isRomperDisabled = isRomperAction && allOpponentPartsMaxBroken;

                      // Disable Llave if last action was Llave (Alternation)
                      const isLlaveDisabled = actionName === 'llave' && characterData.stats.lastActionType === 'llave';

                      // Disable Concentracion if already concentrated (handled by outer filter, but safe)
                      const isConcentracionDisabled = actionName === 'concentracion' && characterData.stats.isConcentrated;

                      const isDisabled = isRomperDisabled || isLlaveDisabled || isConcentracionDisabled;

                      return (
                        <button
                          key={actionName}
                          className="action-button"
                          onClick={() => handleActionInitiate(actionName)}
                          disabled={isDisabled}
                           title={
                               isRomperDisabled ? "Todas las partes del rival están rotas al máximo" :
                               isLlaveDisabled ? "No se puede usar Llave consecutivamente" :
                               isConcentracionDisabled ? "Ya estás concentrado" :
                               actionName // Default title
                           }
                        >
                          {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ')} {/* Replace underscore */}
                        </button>
                      );
                  })}
                </div>
                {/* --- Powers Section (if implemented) --- */}
                {/* ... (powers section commented out) ... */}
              </>
            )}
          </div>
        )
      ) : (
        // --- Opponent's Turn ---
        actionState.active && actionState.defenderId === characterData.id && actionState.stage?.startsWith('awaiting_defense') ? ( // Check if stage starts with awaiting_defense
          // --- Defense Selection ---
          <div className="defense-buttons">
             {/* Use actionState.type OR a more specific state property if needed */}
            <h4>Elige Defensa contra {actionState.type?.replace('_', ' ') || 'Ataque'}:</h4>
            {/* Render defense buttons based on actionState.allowedDefenses */}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('esquivar')) && (
                <button className="defense-button" onClick={() => handleDefenseSelection('esquivar')}>Esquivar</button>
            )}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('bloquear')) && (
                <button className="defense-button" onClick={() => handleDefenseSelection('bloquear')}>Bloquear</button>
            )}
            {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('contraatacar')) && (
                <button className="defense-button" onClick={() => handleDefenseSelection('contraatacar')}>Contraatacar</button>
            )}
          </div>
        ) : (
          // --- Waiting for Opponent ---
          <div className="waiting-message">Esperando turno del rival...</div>
        )
      )}
    </div>
  );
}

export default PlayerArea;
