import React from 'react';
import StatBar from './StatBar';
import './PlayerArea.css'; // Ensure CSS path is correct

function PlayerArea({
  characterData,
  opponentData,
  isCurrentPlayer,
  handleActionInitiate,
  actionState,
  handleDefenseSelection,
  handleAtraparFollowupSelect,
  handleRomperTargetSelect,
  handleResistenciaChoice,
  atraparOptions,
  getActionConcentrationRequirement // Receive concentration requirement checker
}) {

  // --- Helper Function to Render Action Buttons - UPDATED for concentrationLevel filtering ---
  const renderActionSelection = () => {
    const currentConcentrationLevel = characterData.stats.concentrationLevel || 0;

    // Filter actions based on required concentration level
    const level1Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 1 && actionValue
      );

    const level2Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 2 && actionValue
      );

    // Filter normal actions (Level 0 or no requirement)
    const normalActions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) => {
        if (getActionConcentrationRequirement(actionName) > 0) return false;
        if (actionName === 'concentracion') return false;
        return actionValue !== undefined && actionValue !== null;
      });

    return (
      <div className="actions-section">

        {/* --- Normal Actions (Only show if concentration level is 0) --- */}
        {currentConcentrationLevel === 0 && (
          <>
            <h4>Acciones</h4>
            <div className="action-buttons">
              {normalActions.map(([actionName, actionValue]) => {
                  const isRomperAction = actionName === 'romper';
                  const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
                  const isRomperDisabled = isRomperAction && allOpponentPartsMaxBroken;
                  const isAlternationBlocked = ['llave', 'romper', 'presa', 'destrozar', 'fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName) && characterData.stats.lastActionType === actionName;
                  const isFortalezaDisabled = actionName === 'fortaleza' && (characterData.stats.fortalezaAvailable || characterData.stats.fortalezaUsedThisCombat);
                  const isAgilidadDisabled = actionName === 'agilidad' && (characterData.stats.agilidadAvailable || characterData.stats.agilidadUsedThisCombat);
                  const isDestrezaDisabled = actionName === 'destreza' && (characterData.stats.destrezaAvailable || characterData.stats.destrezaUsedThisCombat);
                  const isResistenciaDisabled = actionName === 'resistencia' && (characterData.stats.resistenciaAvailable || characterData.stats.resistenciaUsedThisCombat);

                  const isDisabled = isRomperDisabled || isAlternationBlocked || isFortalezaDisabled || isAgilidadDisabled || isDestrezaDisabled || isResistenciaDisabled;
                  let buttonTitle = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ');
                  if (isRomperDisabled) buttonTitle = "Todas las partes del rival están rotas al máximo";
                  else if (isAlternationBlocked) buttonTitle = `No se puede usar ${buttonTitle} consecutivamente`;
                  else if (isFortalezaDisabled && characterData.stats.fortalezaAvailable) buttonTitle = "Bono Fortaleza ya activo";
                  else if (isFortalezaDisabled && characterData.stats.fortalezaUsedThisCombat) buttonTitle = "Fortaleza ya usada este combate";
                  else if (isAgilidadDisabled && characterData.stats.agilidadAvailable) buttonTitle = "Bono Agilidad ya activo";
                  else if (isAgilidadDisabled && characterData.stats.agilidadUsedThisCombat) buttonTitle = "Agilidad ya usada este combate";
                  else if (isDestrezaDisabled && characterData.stats.destrezaAvailable) buttonTitle = "Bono Destreza ya activo";
                  else if (isDestrezaDisabled && characterData.stats.destrezaUsedThisCombat) buttonTitle = "Destreza ya usada este combate";
                  else if (isResistenciaDisabled && characterData.stats.resistenciaAvailable) buttonTitle = "Bono Resistencia ya activo";
                  else if (isResistenciaDisabled && characterData.stats.resistenciaUsedThisCombat) buttonTitle = "Resistencia ya usada este combate";

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
                      {isAlternationBlocked ? ' (Alt.)' : ''}
                      {isFortalezaDisabled && characterData.stats.fortalezaUsedThisCombat ? ' (Usada)' : ''}
                      {isAgilidadDisabled && characterData.stats.agilidadUsedThisCombat ? ' (Usada)' : ''}
                      {isDestrezaDisabled && characterData.stats.destrezaUsedThisCombat ? ' (Usada)' : ''}
                      {isResistenciaDisabled && characterData.stats.resistenciaUsedThisCombat ? ' (Usada)' : ''}
                    </button>
                  );
              })}
               {characterData.actions.concentracion && (
                 <button
                   key="concentracion-lvl0"
                   className="action-button"
                   onClick={() => handleActionInitiate('concentracion')}
                   disabled={false} // Let App.jsx handle alternation logic
                   title={"Concentrarse (Nivel 1)"}
                 >
                   Concentración
                 </button>
               )}
            </div>
          </>
        )}

        {/* --- Actions requiring Level 1 Concentration (Show ONLY if level is EXACTLY 1) --- */}
        {currentConcentrationLevel === 1 && level1Actions.length > 0 && (
          <>
            <h4>Acciones (Concentrado Nivel 1 Requerido)</h4>
            <div className="action-buttons">
              {level1Actions.map(([actionName, actionValue]) => {
                 const isLanzamientosDisabled = actionName === 'lanzamientos_sucesivos' && characterData.stats.lanzamientosSucesivosUsedThisCombat;
                 const isDisabled = isLanzamientosDisabled;
                 let buttonTitle = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ');
                 if (isLanzamientosDisabled) buttonTitle = "Lanzamientos Sucesivos ya usado este combate";

                 return (
                    <button
                      key={actionName + "-lvl1"}
                      className="action-button"
                      onClick={() => handleActionInitiate(actionName)}
                      disabled={isDisabled}
                      title={buttonTitle}
                    >
                      {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_', ' ')}
                      {isLanzamientosDisabled ? ' (Usada)' : ''}
                    </button>
                 );
              })}
            </div>
          </>
        )}

        {/* --- Actions requiring Level 2 Concentration (Show ONLY if level is EXACTLY 2) --- */}
        {currentConcentrationLevel === 2 && level2Actions.length > 0 && (
          <>
            <h4>Acciones (Concentrado Nivel 2 Requerido)</h4>
            <div className="action-buttons">
              {level2Actions.map(([actionName, actionValue]) => {
                 const isComboVelocidadLuzUsed = actionName === 'combo_velocidad_luz' && characterData.stats.comboVelocidadLuzUsedThisCombat;
                 const isDisabled = isComboVelocidadLuzUsed;
                 let buttonTitle = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace(/_/g, ' ');
                 if (isComboVelocidadLuzUsed) buttonTitle = "Combo a Velocidad Luz ya usado este combate";

                 return (
                    <button
                      key={actionName + "-lvl2"}
                      className="action-button concentrated-action-lvl2"
                      onClick={() => handleActionInitiate(actionName)}
                      disabled={isDisabled}
                      title={buttonTitle}
                    >
                      {actionName.charAt(0).toUpperCase() + actionName.slice(1).replace(/_/g, ' ')}
                      {isComboVelocidadLuzUsed ? ' (Usada)' : ''}
                    </button>
                 );
              })}
            </div>
          </>
        )}

         {/* --- Button to Concentrate Again (Show ONLY if level is EXACTLY 1) --- */}
        {currentConcentrationLevel === 1 && characterData.actions.concentracion && (
             <div className="action-buttons" style={{marginTop: '15px'}}>
                <button
                    key="concentracion-again"
                    className="action-button concentrate-again-button"
                    onClick={() => handleActionInitiate('concentracion')}
                    disabled={false}
                    title={"Concentrarse de Nuevo (Nivel 2)"}
                >
                    Concentrarse de Nuevo
                </button>
            </div>
        )}
      </div>
    );
  };

  // --- Helper Function to Render Defense Buttons --- (unchanged)
   const renderDefenseSelection = () => {
     const canEsquivar = !actionState.allowedDefenses || actionState.allowedDefenses.includes('esquivar');
     const canBlock = !actionState.allowedDefenses || actionState.allowedDefenses.includes('bloquear');
     const canCounter = !actionState.allowedDefenses || actionState.allowedDefenses.includes('contraatacar');

     return (
       <div className="defense-buttons">
         <h4>Elige Defensa contra {actionState.type?.replace(/_/g, ' ').replace('VelocidadLuz', 'Vel. Luz') || 'Ataque'}:</h4>
         <div className="defense-button-group">
             {canEsquivar && (
                 <button className="defense-button" onClick={() => handleDefenseSelection('esquivar')}>Esquivar</button>
             )}
             {canEsquivar && characterData.stats.agilidadAvailable && (
                 <button className="defense-button agilidad-boost" onClick={() => handleDefenseSelection('esquivar_agilidad')}>
                 Esquivar con Agilidad (+3)
                 </button>
             )}
             {canBlock && (
                 <button className="defense-button" onClick={() => handleDefenseSelection('bloquear')}>Bloquear</button>
             )}
             {canBlock && characterData.stats.fortalezaAvailable && (
                 <button className="defense-button fortaleza-boost" onClick={() => handleDefenseSelection('bloquear_fortaleza')}>
                 Bloquear con Fortaleza (+3)
                 </button>
             )}
             {canCounter && (
                 <button className="defense-button" onClick={() => handleDefenseSelection('contraatacar')}>Contraatacar</button>
             )}
             {canCounter && characterData.stats.destrezaAvailable && (
                 <button className="defense-button destreza-boost" onClick={() => handleDefenseSelection('contraatacar_destreza')}>
                 Contraatacar con Destreza (+2)
                 </button>
             )}
         </div>
       </div>
     );
   };

   // --- Helper Function to Render Atrapar Followup --- (unchanged)
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
                    {isLlaveBlockedByAlternation ? ' (Alt.)' : ''}
                  </button>
                );
              })}
            </div>
          </div>
       );
   };

   // --- Helper Function to Render Romper Target --- (unchanged)
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

   // --- Helper Function to Render Resistencia Choice --- (unchanged)
   const renderResistenciaChoice = () => {
     const actionNameDisplay = actionState.type === 'llave' ? 'Llave' : 'Lanzamientos Sucesivos';
     return (
       <div className="resistencia-choice-section">
         <h4>Usar Resistencia (+2) para {actionNameDisplay}?</h4>
         <div className="action-buttons">
           <button
             className="action-button"
             onClick={() => handleResistenciaChoice(actionState.type, false)}
           >
             {actionNameDisplay} (Normal)
           </button>
           <button
             className="action-button resistencia-boost-choice"
             onClick={() => handleResistenciaChoice(actionState.type, true)}
           >
             {actionNameDisplay} con Resistencia (+2)
           </button>
         </div>
       </div>
     );
   };

  // --- Main Return - UPDATED for concentrationLevel Status ---
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
        {/* Status Indicators */}
        <div className="status-indicators-container">
            {characterData.stats.concentrationLevel === 1 && <div className="status-indicator concentrated-1">Concentrado (Nivel 1)</div>}
            {characterData.stats.concentrationLevel === 2 && <div className="status-indicator concentrated-2">Concentrado (Nivel 2)</div>}
            {characterData.stats.fortalezaAvailable && <div className="status-indicator fortaleza">Fortaleza (+3 Bloq) Lista</div>}
            {characterData.stats.agilidadAvailable && <div className="status-indicator agilidad">Agilidad (+3 Esq) Lista</div>}
            {characterData.stats.destrezaAvailable && <div className="status-indicator destreza">Destreza (+2 ContrAtq) Lista</div>}
            {characterData.stats.resistenciaAvailable && <div className="status-indicator resistencia">Resistencia (+2 Ataque Llave) Lista</div>}
        </div>
      </div>

      {/* --- Action/Defense Area --- */}
      <div className="action-defense-area">
          {isCurrentPlayer ? (
            // --- Current Player's Turn ---
            actionState.stage === 'awaiting_resistencia_choice' && actionState.attackerId === characterData.id ? renderResistenciaChoice()
            : actionState.stage === 'awaiting_followup' && actionState.attackerId === characterData.id ? renderAtraparFollowup()
            : actionState.stage === 'awaiting_romper_target' && actionState.attackerId === characterData.id ? renderRomperTarget()
            : actionState.active && actionState.attackerId === characterData.id && actionState.stage === 'awaiting_defense' ? <div className="waiting-message">Esperando defensa del rival...</div>
            : renderActionSelection()
          ) : (
            // --- Opponent's Turn ---
            actionState.active && actionState.defenderId === characterData.id && actionState.stage?.startsWith('awaiting_defense') ? renderDefenseSelection()
            : <div className="waiting-message">Esperando turno del rival...</div>
          )}
      </div>
    </div>
  );
}

export default PlayerArea;
