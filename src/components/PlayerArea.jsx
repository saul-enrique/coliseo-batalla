// PlayerArea.jsx MODIFICADO para UI de Regla de Alternancia

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
  getActionConcentrationRequirement,
  IS_ACTION_ALTERNATION_EXCEPTION // NUEVA PROP
}) {

  const renderActionSelection = () => {
    const currentConcentrationLevel = characterData.stats.concentrationLevel || 0;

    const level0Actions = Object.entries(characterData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 0 &&
        actionValue &&
        actionName !== 'concentracion' &&
        actionName !== 'alcanzar_septimo_sentido' &&
        actionName !== 'golpear_puntos_vitales'
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
        const history = characterData.stats.actionHistory || [];

        // --- Start Disabling Logic ---

        // 1. Specific game state/cooldown checks (non-alternation related)
        // These checks run first. If any of these disable the button,
        // the alternation check below won't override it to enabled.
        if (actionName === 'romper') {
          const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
          if (allOpponentPartsMaxBroken) {
            isDisabled = true;
            buttonTitle = "Todas las partes del rival están rotas al máximo";
          }
        } else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
            const availableKey = `${actionName}Available`;
            const usedKey = `${actionName}UsedThisCombat`;
            if (characterData.stats[availableKey]) {
                isDisabled = true;
                buttonTitle = `Bono ${buttonTitle} ya activo`;
            } else if (characterData.stats[usedKey]) {
                isDisabled = true;
                buttonTitle = `${buttonTitle} ya usada este combate`;
            }
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
        } else if (actionName === 'apresar' && characterData.stats.apresarUsedThisCombat) {
          isDisabled = true; buttonTitle = "Apresar ya usado este combate";
        } else if (actionName === 'quebrar') {
            if (characterData.stats.quebrarUsedThisCombat) {
                isDisabled = true; buttonTitle = "Quebrar ya usado este combate";
            } else if (opponentData && opponentData.stats.currentPA <= 0) {
                isDisabled = true; buttonTitle = "La armadura del rival ya está destruida";
            }
        }

        // 2. New Alternation Rule Check (only if not already disabled and if IS_ACTION_ALTERNATION_EXCEPTION is available)
        if (!isDisabled && typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION(actionName)) {
          const actionDisplayName = actionName.replace(/_/g, ' ');
          if (history.length > 0 && history[0] === actionName) {
            isDisabled = true;
            buttonTitle = `Alternancia: No puedes repetir ${actionDisplayName} ahora. (Reciente: ${history[0].replace(/_/g, ' ')})`;
          } else if (history.length > 1 && history[1] === actionName) {
            isDisabled = true;
            buttonTitle = `Alternancia: 2 acciones diferentes antes de repetir ${actionDisplayName}. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')})`;
          }
        }
        // --- End Disabling Logic ---


        // Update buttonText based on final isDisabled and buttonTitle
        if (isDisabled) {
            if (buttonTitle.toLowerCase().includes("alternancia")) buttonText += " (Alt.)";
            else if (buttonTitle.includes("usad")) buttonText += " (Usada)";
            else if (buttonTitle.includes("activ")) buttonText += " (Activa)";
            else if (buttonTitle.includes("rotas al máximo")) buttonText += " (MAX)";
            else if (buttonTitle.includes("armadura del rival ya está destruida")) buttonText += " (S/A)";
        }


        return (
          <button
            key={`${actionName}-lvl${levelRequired}`}
            className={`action-button ${levelRequired === 2 ? 'concentrated-action-lvl2' : ''} ${actionName === 'quebrar' ? 'quebrar-button' : ''}`}
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
                   disabled={characterData.stats.concentrationLevel >= 2 || (
                        typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                        characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                        (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                   )}
                   title={
                     characterData.stats.concentrationLevel >= 2 ? "Ya estás en Concentración Máxima" :
                     ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                     ) ? `Alternancia: No puedes usar Concentración ahora` :
                     "Concentrarse (Nivel 1)"
                   }
                 >
                   Concentración
                   {( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                   ) ? ' (Alt.)' : ''}
                 </button>
               )}

              {/* Botón Golpear Puntos Vitales */}
              {characterData.actions.golpear_puntos_vitales && (
                 <button
                   key="golpear_puntos_vitales"
                   className="action-button"
                   onClick={() => handleActionInitiate('golpear_puntos_vitales')}
                   disabled={
                     characterData.stats.puntosVitalesUsadoPorAtacante ||
                     (opponentData && opponentData.stats.septimoSentidoActivo) ||
                     (opponentData && opponentData.stats.puntosVitalesGolpeados) ||
                     ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('golpear_puntos_vitales') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'golpear_puntos_vitales' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'golpear_puntos_vitales'))
                     )
                   }
                   title={
                     characterData.stats.puntosVitalesUsadoPorAtacante ? "Ya usaste Golpear Puntos Vitales este combate" :
                     (opponentData && opponentData.stats.septimoSentidoActivo) ? "El rival está protegido por su Séptimo Sentido" :
                     (opponentData && opponentData.stats.puntosVitalesGolpeados) ? "Los Puntos Vitales del rival ya están afectados" :
                     ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('golpear_puntos_vitales') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'golpear_puntos_vitales' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'golpear_puntos_vitales'))
                     ) ? `Alternancia: No puedes usar Puntos Vitales ahora` :
                     "Golpear Puntos Vitales del Rival"
                   }
                 >
                   Puntos Vitales
                   {characterData.stats.puntosVitalesUsadoPorAtacante ? '(Usada)' :
                    ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('golpear_puntos_vitales') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'golpear_puntos_vitales' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'golpear_puntos_vitales'))
                   ) ? ' (Alt.)' : ''}
                 </button>
               )}

              {/* Botón Alcanzar Séptimo Sentido / Recuperarse */}
              {characterData.actions.alcanzar_septimo_sentido &&
               (!characterData.stats.septimoSentidoActivo || characterData.stats.puntosVitalesGolpeados) &&
                 <button
                   key="alcanzar_septimo_sentido_o_recuperar"
                   className="action-button"
                   onClick={() => handleActionInitiate('alcanzar_septimo_sentido')}
                   disabled={
                       (!characterData.stats.puntosVitalesGolpeados &&
                       characterData.stats.septimoSentidoIntentado &&
                       !characterData.stats.septimoSentidoActivo) ||
                       ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('alcanzar_septimo_sentido') &&
                         characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                         (characterData.stats.actionHistory[0] === 'alcanzar_septimo_sentido' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'alcanzar_septimo_sentido'))
                       )
                   }
                   title={
                     characterData.stats.puntosVitalesGolpeados ? "Intentar recuperarse y alcanzar el 7º Sentido" :
                     (characterData.stats.septimoSentidoIntentado && !characterData.stats.septimoSentidoActivo) ? "Ya intentaste alcanzar el 7º Sentido y fallaste este combate" :
                     ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('alcanzar_septimo_sentido') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'alcanzar_septimo_sentido' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'alcanzar_septimo_sentido'))
                     ) ? `Alternancia: No puedes usar Alcanzar 7º Sentido ahora` :
                     "Intentar alcanzar el Séptimo Sentido"
                   }
                 >
                   {characterData.stats.puntosVitalesGolpeados ? "Recuperarse (7ºS)" : "Alcanzar 7º Sentido"}
                   {(!characterData.stats.puntosVitalesGolpeados && characterData.stats.septimoSentidoIntentado && !characterData.stats.septimoSentidoActivo) ? ' (Intentado)' :
                    ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('alcanzar_septimo_sentido') &&
                       characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                       (characterData.stats.actionHistory[0] === 'alcanzar_septimo_sentido' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'alcanzar_septimo_sentido'))
                   ) ? ' (Alt.)' : ''}
                 </button>
               }
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
                        disabled={characterData.stats.concentrationLevel >= 2 || (
                            typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                            characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                            (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                        )}
                        title={
                            characterData.stats.concentrationLevel >= 2 ? "Ya estás en Concentración Máxima" :
                            ( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                              characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                              (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                            ) ? `Alternancia: No puedes usar Concentración ahora` :
                            "Concentrarse de Nuevo (Nivel 2)"}
                    >
                        Concentrarse de Nuevo
                        {( typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('concentracion') &&
                            characterData.stats.actionHistory && characterData.stats.actionHistory.length > 0 &&
                            (characterData.stats.actionHistory[0] === 'concentracion' || (characterData.stats.actionHistory.length > 1 && characterData.stats.actionHistory[1] === 'concentracion'))
                        ) ? ' (Alt.)' : ''}
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
            {/* No hay botón para concentrarse desde Nivel 2 a Nivel 3 */}
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

                // Check alternation for 'Llave Mejorada' (atrapar_op5 which effectively is 'llave')
                let isLlaveAlternationBlocked = false;
                if (option.id === 'atrapar_op5' && typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('llave')) {
                    const history = characterData.stats.actionHistory || [];
                    if ((history.length > 0 && history[0] === 'llave') || (history.length > 1 && history[1] === 'llave')) {
                        isLlaveAlternationBlocked = true;
                    }
                }

                const isButtonDisabled = isRomperMejoradoDisabled || isLlaveAlternationBlocked;
                let buttonTitle = option.name;
                let buttonText = option.name;

                if (isRomperMejoradoDisabled) {
                    buttonTitle = "Todas las partes del rival están rotas al máximo"; buttonText += " (MAX)";
                } else if (isLlaveAlternationBlocked) {
                    const history = characterData.stats.actionHistory || [];
                    if (history.length > 0 && history[0] === 'llave') {
                       buttonTitle = `Alternancia: No puedes usar Llave ahora. (Reciente: ${history[0].replace(/_/g, ' ')})`;
                    } else if (history.length > 1 && history[1] === 'llave') {
                       buttonTitle = `Alternancia: 2 acciones diferentes antes de repetir Llave. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')})`;
                    }
                    buttonText += " (Alt.)";
                }


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
            {characterData.stats.septimoSentidoActivo && <div className="status-indicator septimo-sentido">¡SÉPTIMO SENTIDO ALCANZADO!</div>}
            {characterData.stats.puntosVitalesGolpeados && <div className="status-indicator puntos-vitales-afectado">Puntos Vitales Afectados</div>}
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
