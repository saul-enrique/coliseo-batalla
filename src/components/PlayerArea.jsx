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
  getActionConcentrationRequirement
}) {

  const renderActionSelection = () => {
    const currentConcentrationLevel = characterData.stats.concentrationLevel || 0;

    const level0Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 0 && actionValue && actionName !== 'concentracion'
      );

    const level1Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 1 && actionValue
      );

    const level2Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 2 && actionValue
      );

    const renderButtons = (actions, levelRequired) => {
      return actions.map(([actionName, actionValue]) => {
        let isDisabled = false;
        let buttonTitle = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace(/_/g, ' ');
        let buttonText = buttonTitle;

        // General alternation rule for specific actions
        const isAlternationAction = ['llave', 'romper', 'presa', 'destrozar', 'fortaleza', 'agilidad', 'destreza', 'resistencia', 'lanzamientos_sucesivos', 'apresar'].includes(actionName);
        const isAlternationBlocked = isAlternationAction && characterData.stats.lastActionType === actionName;

        if (isAlternationBlocked) {
            isDisabled = true;
            buttonTitle = `No se puede usar ${buttonTitle} consecutivamente`;
        }

        // Specific action disabling logic
        if (!isDisabled) { // Only check further if not already disabled by alternation
            if (actionName === 'romper') {
              const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
              if (allOpponentPartsMaxBroken) { isDisabled = true; buttonTitle = "Todas las partes del rival están rotas al máximo"; }
            } else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
                const availableKey = `${actionName}Available`;
                const usedKey = `${actionName}UsedThisCombat`;
                if (characterData.stats[availableKey]) { isDisabled = true; buttonTitle = `Bono ${buttonTitle} ya activo`; }
                else if (characterData.stats[usedKey]) { isDisabled = true; buttonTitle = `${buttonTitle} ya usada este combate`; }
            } else if (actionName === 'lanzamientos_sucesivos' && characterData.stats.lanzamientosSucesivosUsedThisCombat) {
              isDisabled = true; buttonTitle = "Lanzamientos Sucesivos ya usado";
            } else if (actionName === 'combo_velocidad_luz' && characterData.stats.comboVelocidadLuzUsedThisCombat) {
              isDisabled = true; buttonTitle = "Combo Velocidad Luz ya usado";
            } else if (actionName === 'doble_salto' && characterData.stats.dobleSaltoUsedThisCombat) {
              isDisabled = true; buttonTitle = "Doble Salto ya usado este combate";
            } else if (actionName === 'arrojar' && characterData.stats.arrojarUsedThisCombat) {
              isDisabled = true; buttonTitle = "Arrojar ya usado este combate";
            } else if (actionName === 'furia' && characterData.stats.furiaUsedThisCombat) {
              isDisabled = true; buttonTitle = "Furia ya usada este combate";
            } else if (actionName === 'apresar' && characterData.stats.apresarUsedThisCombat) { // Lógica para Apresar
              isDisabled = true; buttonTitle = "Apresar ya usado este combate";
            }
        }


        if (isDisabled) {
            if (buttonTitle.includes("usad")) buttonText += " (Usada)";
            else if (buttonTitle.includes("activ")) buttonText += " (Activa)";
            else if (buttonTitle.includes("rotas al máximo")) buttonText += " (MAX)";
            else if (isAlternationBlocked) buttonText += " (Alt.)";
        }


        return (
          <button
            key={`${actionName}-lvl${levelRequired}`}
            className={`action-button ${levelRequired === 2 ? 'concentrated-action-lvl2' : ''}`}
            onClick={() => handleActionInitiate(actionName)}
            disabled={isDisabled}
            title={buttonTitle}
          >
            {buttonText}
          </button>
        );
      });
    };

    return (
      <div className="actions-section">
        {currentConcentrationLevel === 0 && (
          <>
            <h4>Acciones</h4>
            <div className="action-buttons">
              {renderButtons(level0Actions, 0)}
              {characterData.actions.concentracion && (
                 <button
                   key="concentracion-lvl0"
                   className="action-button"
                   onClick={() => handleActionInitiate('concentracion')}
                   disabled={characterData.stats.lastActionType === 'concentracion'}
                   title={characterData.stats.lastActionType === 'concentracion' ? "No puedes concentrarte consecutivamente" : "Concentrarse (Nivel 1)"}
                 >
                   Concentración
                 </button>
               )}
            </div>
          </>
        )}

        {currentConcentrationLevel === 1 && (
          <>
            <h4>Acciones (Concentrado Nivel 1)</h4>
            <div className="action-buttons">
              {renderButtons(level1Actions, 1)}
            </div>
            {characterData.actions.concentracion && (
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
          </>
        )}

        {currentConcentrationLevel === 2 && (
          <>
            <h4>Acciones (Concentrado Nivel 2)</h4>
            <div className="action-buttons">
              {renderButtons(level2Actions, 2)}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDefenseSelection = () => {
     const canEsquivar = !actionState.allowedDefenses || actionState.allowedDefenses.includes('esquivar');
     const canBlock = !actionState.allowedDefenses || actionState.allowedDefenses.includes('bloquear');
     const canCounter = !actionState.allowedDefenses || actionState.allowedDefenses.includes('contraatacar');
     let defensePrompt = `Elige Defensa contra ${actionState.type?.replace(/_/g, ' ').replace('VelocidadLuz', 'Vel. Luz').replace('DobleSalto', 'Doble Salto') || 'Ataque'}`;
     let defenseModifiersText = "";

     if (actionState.type === 'Arrojar') {
         defensePrompt = `Defensa vs Arrojar (Ataque ${actionState.currentHit}/${actionState.totalHits})`;
         defenseModifiersText = "(+2 Esq, -2 Bloq)";
     } else if (actionState.type === 'Furia') {
         defensePrompt = `Defensa vs Furia (Ataque ${actionState.currentHit}/${actionState.totalHits})`;
         let penalty = 0;
         if (actionState.furiaHitsLandedInSequence === 1) penalty = 2;
         else if (actionState.furiaHitsLandedInSequence >= 2) penalty = 4;
         if (penalty > 0) defenseModifiersText = `(Esq/Bloq -${penalty})`;
     } else if (actionState.type === 'DobleSalto') {
         defenseModifiersText = "(Solo Esquivar, -4 Penalización)";
     } else if (actionState.type === 'Velocidad_luz') {
         defenseModifiersText = "(Bloquear con -6)";
     } else if (actionState.type === 'ComboVelocidadLuz') {
         defensePrompt = `Defensa vs Combo Vel. Luz (Golpe ${actionState.currentComboHit || actionState.currentHit})`;
         defenseModifiersText = "(Esq -4, Bloq -6)";
     } else if (actionState.type === 'Salto') {
        defenseModifiersText = "(Bloquear con -2)";
     } else if (actionState.type === 'Combo') {
        defensePrompt = `Defensa vs Combo (Golpe ${actionState.currentHit || actionState.currentComboHit})`;
        if (actionState.currentDefensePenalty > 0) defenseModifiersText = `(Penaliz. Def. -${actionState.currentDefensePenalty})`;
     }


     return (
       <div className="defense-buttons">
         <h4>{defensePrompt} {defenseModifiersText}:</h4>
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
                let buttonText = option.name;
                if (isRomperMejoradoDisabled) {buttonTitle = "Todas las partes del rival están rotas al máximo"; buttonText += " (MAX)";}
                else if (isLlaveBlockedByAlternation) {buttonTitle = "No se puede usar Llave consecutivamente"; buttonText += " (Alt.)";}

                return (
                  <button key={option.id} className="action-button" onClick={() => handleAtraparFollowupSelect(option.id)} disabled={isButtonDisabled} title={buttonTitle} >
                    {buttonText}
                  </button>
                );
              })}
            </div>
          </div>
       );
   };

    const renderRomperTarget = () => {
        return (
          <div className="romper-target-section">
            <h4>Elige Parte a Romper{actionState.type === 'Atrapar_Opcion6' ? ' (Mejorado +4)' : ''}:</h4>
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

  return (
    <div className={`player-area ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="character-info">
        <h3>{characterData.name}</h3>
        <div className="stats">
          <StatBar label="PV" currentValue={characterData.stats.currentPV} maxValue={characterData.stats.pv_max} color="#e74c3c" />
          <StatBar label="PA" currentValue={characterData.stats.currentPA} maxValue={characterData.stats.pa_max} color="#3498db" />
          <StatBar label="PC" currentValue={characterData.stats.currentPC} maxValue={characterData.stats.pc_max} color="#f1c40f" />
        </div>
        <div className="status-indicators-container">
            {characterData.stats.concentrationLevel === 1 && <div className="status-indicator concentrated-1">Concentrado (Nivel 1)</div>}
            {characterData.stats.concentrationLevel === 2 && <div className="status-indicator concentrated-2">Concentrado (Nivel 2)</div>}
            {characterData.stats.fortalezaAvailable && <div className="status-indicator fortaleza">Fortaleza (+3 Bloq) Lista</div>}
            {characterData.stats.agilidadAvailable && <div className="status-indicator agilidad">Agilidad (+3 Esq) Lista</div>}
            {characterData.stats.destrezaAvailable && <div className="status-indicator destreza">Destreza (+2 ContrAtq) Lista</div>}
            {characterData.stats.resistenciaAvailable && <div className="status-indicator resistencia">Resistencia (+2 Ataque Llave/Lanz.) Lista</div>}
        </div>
      </div>

      <div className="action-defense-area">
          {isCurrentPlayer ? (
            actionState.stage === 'awaiting_resistencia_choice' && actionState.attackerId === characterData.id ? renderResistenciaChoice()
            : actionState.stage === 'awaiting_followup' && actionState.attackerId === characterData.id ? renderAtraparFollowup()
            : actionState.stage === 'awaiting_romper_target' && actionState.attackerId === characterData.id ? renderRomperTarget()
            : actionState.active && actionState.attackerId === characterData.id && actionState.stage?.startsWith('awaiting_defense')
                ? <div className="waiting-message">
                    Esperando defensa del rival ({actionState.type === 'Arrojar' || actionState.type === 'Furia' ? `Ataque ${actionState.currentHit}/${actionState.totalHits}` : actionState.type?.replace(/_/g, ' ') || 'Acción Actual'})...
                  </div>
            : renderActionSelection()
          ) : (
            actionState.active && actionState.defenderId === characterData.id && actionState.stage?.startsWith('awaiting_defense') ? renderDefenseSelection()
            : <div className="waiting-message">Esperando turno del rival...</div>
          )}
      </div>
    </div>
  );
}

export default PlayerArea;
