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
    const concentrationActions = ['velocidad_luz', 'salto', 'combo', 'engaño'];
    return concentrationActions.includes(actionName);
  };

  // --- Helper Function to Render Action Buttons ---
  const renderActionSelection = () => {
    if (characterData.stats.isConcentrated) {
      // --- Concentrated State ---
      return (
        <>
          <h4>Acciones (Concentrado)</h4>
          <div className="action-buttons">
            {Object.entries(characterData.actions)
              .filter(([actionName, actionValue]) =>
                doesActionRequireConcentration(actionName) && actionValue
              )
              .map(([actionName, actionValue]) => (
                <button
                  key={actionName}
                  className="action-button"
                  onClick={() => handleActionInitiate(actionName)}
                >
                  {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ')}
                </button>
              ))}
          </div>
        </>
      );
    } else {
      // --- Normal State ---
      return (
        <>
          <h4>Acciones</h4>
          <div className="action-buttons">
            {Object.entries(characterData.actions)
              .filter(([actionName, actionValue]) => {
                if (doesActionRequireConcentration(actionName)) return false; // Hide concentration actions
                if (actionName === 'concentracion' && characterData.stats.isConcentrated) return false; // Hide Concentracion if concentrated (safety check)
                return actionValue !== undefined && actionValue !== null; // Show if exists
              })
              .map(([actionName, actionValue]) => {
                const isRomperAction = actionName === 'romper';
                const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
                const isRomperDisabled = isRomperAction && allOpponentPartsMaxBroken;
                const isLlaveDisabled = actionName === 'llave' && characterData.stats.lastActionType === 'llave';
                const isConcentracionDisabled = actionName === 'concentracion' && characterData.stats.isConcentrated;
                const isFortalezaDisabled = actionName === 'fortaleza' && (characterData.stats.fortalezaAvailable || characterData.stats.fortalezaUsedThisCombat);

                const isDisabled = isRomperDisabled || isLlaveDisabled || isConcentracionDisabled || isFortalezaDisabled;
                let buttonTitle = actionName; // Default title
                if (isRomperDisabled) buttonTitle = "Todas las partes del rival están rotas al máximo";
                else if (isLlaveDisabled) buttonTitle = "No se puede usar Llave consecutivamente";
                else if (isConcentracionDisabled) buttonTitle = "Ya estás concentrado";
                else if (isFortalezaDisabled && characterData.stats.fortalezaAvailable) buttonTitle = "Bono Fortaleza ya activo";
                else if (isFortalezaDisabled && characterData.stats.fortalezaUsedThisCombat) buttonTitle = "Fortaleza ya usada este combate";


                return (
                  <button
                    key={actionName}
                    className="action-button"
                    onClick={() => handleActionInitiate(actionName)}
                    disabled={isDisabled}
                    title={buttonTitle}
                  >
                    {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ')}
                    {isRomperDisabled ? ' (MAX)' : ''}
                    {isLlaveDisabled ? ' (Alternancia)' : ''}
                    {isFortalezaDisabled && characterData.stats.fortalezaUsedThisCombat ? ' (Usada)' : ''}
                  </button>
                );
            })}
          </div>
          {/* Powers Section (Optional) */}
          {/* <h4>Poderes</h4> ... */}
        </>
      );
    }
  };

  // --- Helper Function to Render Defense Buttons --- UPDATED ---
   const renderDefenseSelection = () => {
     // Check if blocking is generally allowed for the current action
     const canBlock = !actionState.allowedDefenses || actionState.allowedDefenses.includes('bloquear');

     return (
       <div className="defense-buttons">
         <h4>Elige Defensa contra {actionState.type?.replace('_', ' ') || 'Ataque'}:</h4>

         {/* Esquivar */}
         {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('esquivar')) && (
             <button className="defense-button" onClick={() => handleDefenseSelection('esquivar')}>Esquivar</button>
         )}

         {/* Bloquear NORMAL (Always show if blocking is allowed) */}
         {canBlock && (
             <button className="defense-button" onClick={() => handleDefenseSelection('bloquear')}>Bloquear</button>
         )}

         {/* Bloquear CON FORTALEZA (Show additionally if blocking is allowed AND bonus is available) */}
         {canBlock && characterData.stats.fortalezaAvailable && (
             <button className="defense-button fortaleza-boost" onClick={() => handleDefenseSelection('bloquear_fortaleza')}>
               Bloquear con Fortaleza (+3)
             </button>
         )}

         {/* Contraatacar */}
         {(!actionState.allowedDefenses || actionState.allowedDefenses.includes('contraatacar')) && (
             <button className="defense-button" onClick={() => handleDefenseSelection('contraatacar')}>Contraatacar</button>
         )}
       </div>
     );
   };

   // --- Helper Function to Render Atrapar Followup ---
   const renderAtraparFollowup = () => {
       return (
          <div className="followup-options-section">
            <h4>Elige Opción de Atrapar:</h4>
            <div className="followup-options-buttons">
              {atraparOptions.map(option => {
                const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
                const isRomperMejoradoDisabled = option.id === 'atrapar_op6' && allOpponentPartsMaxBroken;
                const isLlaveBlockedByAlternation = option.id === 'atrapar_op5' && characterData.stats.lastActionType === 'llave';
                const isButtonDisabled = isRomperMejoradoDisabled || isLlaveBlockedByAlternation;
                let buttonTitle = option.name;
                if (isRomperMejoradoDisabled) buttonTitle = "Todas las partes del rival están rotas al máximo";
                else if (isLlaveBlockedByAlternation) buttonTitle = "No se puede usar Llave consecutivamente";

                return (
                  <button key={option.id} className="action-button" onClick={() => handleAtraparFollowupSelect(option.id)} disabled={isButtonDisabled} title={buttonTitle} >
                    {option.name}
                    {isRomperMejoradoDisabled ? ' (MAX)' : ''}
                    {isLlaveBlockedByAlternation ? ' (Alternancia)' : ''}
                  </button>
                );
              })}
            </div>
          </div>
       );
   };

   // --- Helper Function to Render Romper Target ---
    const renderRomperTarget = () => {
        return (
          <div className="romper-target-section">
            <h4>Elige Parte a Romper:</h4>
            <div className="romper-target-buttons">
              {['arms', 'legs', 'ribs'].map(part => {
                 const isPartMaxBroken = opponentData?.stats.brokenParts[part] >= 2;
                 return (
                    <button key={part} className="action-button" onClick={() => handleRomperTargetSelect(part)} disabled={!opponentData || isPartMaxBroken} title={isPartMaxBroken ? `Los ${part} del rival ya están rotos al máximo` : `Romper ${part}`} >
                        {part.charAt(0).toUpperCase() + part.slice(1)} {isPartMaxBroken ? '(MAX)' : `(${opponentData?.stats.brokenParts[part]}/2)`}
                    </button>
                 );
              })}
            </div>
          </div>
        );
    };

  // --- Main Return ---
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
        {characterData.stats.isConcentrated && <div className="status-indicator concentrated">Concentrado</div>}
        {characterData.stats.fortalezaAvailable && <div className="status-indicator fortaleza">Fortaleza (+3 Bloq) Lista</div>}
      </div>

      {/* Conditional Rendering Logic */}
      {isCurrentPlayer ? (
        // My Turn
        actionState.stage === 'awaiting_followup' && actionState.attackerId === characterData.id ? renderAtraparFollowup()
        : actionState.stage === 'awaiting_romper_target' && actionState.attackerId === characterData.id ? renderRomperTarget()
        : actionState.active && actionState.attackerId === characterData.id ? <div className="waiting-message">Esperando defensa del rival...</div>
        : renderActionSelection() // Show normal action buttons
      ) : (
        // Opponent's Turn
        actionState.active && actionState.defenderId === characterData.id && actionState.stage?.startsWith('awaiting_defense') ? renderDefenseSelection()
        : <div className="waiting-message">Esperando turno del rival...</div>
      )}
    </div>
  );
}

export default PlayerArea;
