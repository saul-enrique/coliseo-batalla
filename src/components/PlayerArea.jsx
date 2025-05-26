// PlayerArea.jsx MODIFICADO para UI de Regla de Alternancia y Estilo Condicional

import React from 'react';
import StatBar from './StatBar';
import './PlayerArea.css'; // Ensure CSS path is correct

function PlayerArea({
  playerData,
  opponentData,
  isCurrentPlayer,
  handleActionInitiate,
  handlePowerSelect,
  actionState,
  handleDefenseSelection,
  handleAtraparFollowupSelect,
  handleRomperTargetSelect,
  handleResistenciaChoice,
  atraparOptions,
  getActionConcentrationRequirement,
  IS_ACTION_ALTERNATION_EXCEPTION // NUEVA PROP
}) {
  // Añadir logs para depuración
  console.log(`PlayerArea (${playerData.name}):`, {
    actionState: JSON.parse(JSON.stringify(actionState)),
    isCurrentPlayer,
    isDefender: actionState.active && actionState.defenderId === playerData.id,
    shouldShowDefense: actionState.active && 
                      actionState.defenderId === playerData.id && 
                      actionState.stage?.startsWith('awaiting_defense')
  });

  const renderActionSelection = () => {
    const currentConcentrationLevel = playerData.stats.concentrationLevel || 0;

    const level0Actions = Object.entries(playerData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 0 &&
        actionValue &&
        actionName !== 'concentracion' &&
        actionName !== 'alcanzar_septimo_sentido' &&
        actionName !== 'golpear_puntos_vitales'
      );

    const level1Actions = Object.entries(playerData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 1 && actionValue
      );

    const level2Actions = Object.entries(playerData.actions)
      .filter(([actionName, actionValue]) =>
        getActionConcentrationRequirement(actionName) === 2 && actionValue
      );

    const renderButtons = (actions, levelRequired) => {
      return actions.map(([actionName, actionValue]) => {
        let isDisabled = false;
        let buttonTitle = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace(/_/g, ' ');
        let buttonText = buttonTitle;
        const history = playerData.stats.actionHistory || [];
        let isAlternationBlocked = false; // Flag para saber si el bloqueo es por alternancia

        // --- Start Disabling Logic ---

        // 1. Specific game state/cooldown checks (non-alternation related)
        if (actionName === 'romper') {
          const allOpponentPartsMaxBroken = opponentData && ['arms', 'legs', 'ribs'].every(part => opponentData.stats.brokenParts[part] >= 2);
          if (allOpponentPartsMaxBroken) {
            isDisabled = true;
            buttonTitle = "Todas las partes del rival están rotas al máximo";
          }
        } else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
            const availableKey = `${actionName}Available`;
            const usedKey = `${actionName}UsedThisCombat`;
            if (playerData.stats[availableKey]) {
                isDisabled = true;
                buttonTitle = `Bono ${buttonTitle} ya activo`;
            } else if (playerData.stats[usedKey]) {
                isDisabled = true;
                buttonTitle = `${buttonTitle} ya usada este combate`;
            }
        } else if (actionName === 'lanzamientos_sucesivos' && playerData.stats.lanzamientosSucesivosUsedThisCombat) {
          isDisabled = true; buttonTitle = "Lanzamientos Sucesivos ya usado";
        } else if (actionName === 'combo_velocidad_luz' && playerData.stats.comboVelocidadLuzUsedThisCombat) {
          isDisabled = true; buttonTitle = "Combo Velocidad Luz ya usado";
        } else if (actionName === 'doble_salto' && playerData.stats.dobleSaltoUsedThisCombat) {
          isDisabled = true; buttonTitle = "Doble Salto ya usado este combate";
        } else if (actionName === 'arrojar' && playerData.stats.arrojarUsedThisCombat) {
          isDisabled = true; buttonTitle = "Arrojar ya usado este combate";
        } else if (actionName === 'furia' && playerData.stats.furiaUsedThisCombat) {
          isDisabled = true; buttonTitle = "Furia ya usada este combate";
        } else if (actionName === 'apresar' && playerData.stats.apresarUsedThisCombat) {
          isDisabled = true; buttonTitle = "Apresar ya usado este combate";
        } else if (actionName === 'quebrar') {
            if (playerData.stats.quebrarUsedThisCombat) {
                isDisabled = true; buttonTitle = "Quebrar ya usado este combate";
            } else if (opponentData && opponentData.stats.currentPA <= 0) {
                isDisabled = true; buttonTitle = "La armadura del rival ya está destruida";
            }
        }

        // 2. New Alternation Rule Check
        if (!isDisabled && typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION(actionName)) {
          const actionDisplayName = actionName.replace(/_/g, ' ');
          if (history.length > 0 && history[0] === actionName) {
            isDisabled = true;
            isAlternationBlocked = true; // Marcar que el bloqueo es por alternancia
            buttonTitle = `Alternancia: No puedes repetir ${actionDisplayName} ahora. (Reciente: ${history[0].replace(/_/g, ' ')})`;
          } else if (history.length > 1 && history[1] === actionName) {
            isDisabled = true;
            isAlternationBlocked = true; // Marcar que el bloqueo es por alternancia
            buttonTitle = `Alternancia: 2 acciones diferentes antes de repetir ${actionDisplayName}. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')})`;
          }
        }
        // --- End Disabling Logic ---

        // Construir clases CSS
        let buttonClassName = `action-button`;
        if (levelRequired === 2) buttonClassName += ' concentrated-action-lvl2';
        if (actionName === 'quebrar') buttonClassName += ' quebrar-button';
        if (isAlternationBlocked) { // Aplicar clase si está bloqueado por alternancia
            buttonClassName += ' action-button-alternation-blocked';
        }

        // Update buttonText based on final isDisabled and buttonTitle
        if (isDisabled) {
            if (isAlternationBlocked) buttonText += " (Alt.)"; // Más específico para alternancia
            else if (buttonTitle.includes("usad")) buttonText += " (Usada)";
            else if (buttonTitle.includes("activ")) buttonText += " (Activa)";
            else if (buttonTitle.includes("rotas al máximo")) buttonText += " (MAX)";
            else if (buttonTitle.includes("armadura del rival ya está destruida")) buttonText += " (S/A)";
        }

        return (
          <button
            key={`${actionName}-lvl${levelRequired}`}
            className={buttonClassName} // Usar la clase construida
            onClick={() => handleActionInitiate(actionName)}
            disabled={isDisabled}
            title={buttonTitle}
          >
            {buttonText}
          </button>
        );
      });
    };

    // Helper para construir clases y título para botones especiales (Concentración, etc.)
    const getSpecialButtonProps = (actionName, baseTitle, disabledCondition, disabledTextForCondition) => {
        let isDisabled = disabledCondition;
        let buttonTitle = baseTitle;
        let buttonClassName = "action-button";
        let buttonText = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace(/_/g, ' ');
        let isAlternationBlockedForSpecial = false;

        if (disabledCondition) {
            buttonTitle = disabledTextForCondition;
        }

        if (!isDisabled && typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION(actionName)) {
            const history = playerData.stats.actionHistory || [];
            const actionDisplayName = actionName.replace(/_/g, ' ');
            if (history.length > 0 && history[0] === actionName) {
                isDisabled = true;
                isAlternationBlockedForSpecial = true;
                buttonTitle = `Alternancia: No puedes repetir ${actionDisplayName} ahora. (Reciente: ${history[0].replace(/_/g, ' ')})`;
            } else if (history.length > 1 && history[1] === actionName) {
                isDisabled = true;
                isAlternationBlockedForSpecial = true;
                buttonTitle = `Alternancia: 2 acciones diferentes antes de repetir ${actionDisplayName}. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')})`;
            }
        }

        if (isAlternationBlockedForSpecial) {
            buttonClassName += ' action-button-alternation-blocked';
            if (actionName === 'concentracion' && currentConcentrationLevel === 1) { // Específico para "Concentrarse de Nuevo"
                 buttonText = "Concentrarse de Nuevo";
            }
            buttonText += ' (Alt.)';
        } else if (disabledCondition) {
             if (actionName === 'golpear_puntos_vitales' && playerData.stats.puntosVitalesUsadoPorAtacante) buttonText += ' (Usada)';
             else if (actionName === 'alcanzar_septimo_sentido' && (!playerData.stats.puntosVitalesGolpeados && playerData.stats.septimoSentidoIntentado && !playerData.stats.septimoSentidoActivo)) buttonText += ' (Intentado)';
             // No añadir (Alt.) si la deshabilitación no es por alternancia
        }

         if (actionName === 'alcanzar_septimo_sentido' && playerData.stats.puntosVitalesGolpeados) {
            buttonText = "Recuperarse (7ºS)"; // Texto base para este caso
            if (isAlternationBlockedForSpecial) buttonText += ' (Alt.)'; // Añadir (Alt.) si aplica
        }


        return { isDisabled, buttonTitle, buttonClassName, buttonText };
    };


    return (
      <div className="actions-section">
        {currentConcentrationLevel === 0 && (
          <>
            <h4>Acciones</h4>
            <div className="action-buttons">
              {renderButtons(level0Actions, 0)}
              {playerData.actions.concentracion && (() => {
                 const props = getSpecialButtonProps(
                    'concentracion',
                    "Concentrarse (Nivel 1)",
                    playerData.stats.concentrationLevel >= 2,
                    "Ya estás en Concentración Máxima"
                 );
                 return (
                     <button
                       key="concentracion-lvl0"
                       className={props.buttonClassName}
                       onClick={() => handleActionInitiate('concentracion')}
                       disabled={props.isDisabled}
                       title={props.buttonTitle}
                     >
                       {props.buttonText}
                     </button>
                 );
              })()}

              {playerData.actions.golpear_puntos_vitales && (() => {
                  const props = getSpecialButtonProps(
                    'golpear_puntos_vitales',
                    "Golpear Puntos Vitales del Rival",
                    playerData.stats.puntosVitalesUsadoPorAtacante ||
                    (opponentData && opponentData.stats.septimoSentidoActivo) ||
                    (opponentData && opponentData.stats.puntosVitalesGolpeados),
                    playerData.stats.puntosVitalesUsadoPorAtacante ? "Ya usaste Golpear Puntos Vitales este combate" :
                    (opponentData && opponentData.stats.septimoSentidoActivo) ? "El rival está protegido por su Séptimo Sentido" :
                    (opponentData && opponentData.stats.puntosVitalesGolpeados) ? "Los Puntos Vitales del rival ya están afectados" : "Golpear Puntos Vitales del Rival"
                  );
                  return (
                    <button
                      key="golpear_puntos_vitales-lvl0"
                      className={props.buttonClassName}
                      onClick={() => handleActionInitiate('golpear_puntos_vitales')}
                      disabled={props.isDisabled}
                      title={props.buttonTitle}
                    >
                      {props.buttonText}
                    </button>
                  );
              })()}

              {/* Botón de Poderes */}
              {playerData.powers && playerData.powers.length > 0 && (() => {
                  const hasMeteoros = playerData.powers.some(p => p.id === 'P001' || p.name.toLowerCase().includes('meteoros'));
                  const isDisabled = playerData.stats.poderesUsadosThisCombat && !hasMeteoros;
                  const buttonTitle = isDisabled ? "Ya usaste tus poderes este combate" : "Usar un Poder";
                  const buttonText = isDisabled ? "Poderes (Usados)" : "Poderes";
                  
                  return (
                    <button
                      key="usar_poder-lvl0"
                      className="action-button"
                      onClick={() => handleActionInitiate('usar_poder')}
                      disabled={isDisabled}
                      title={buttonTitle}
                    >
                      {buttonText}
                    </button>
                  );
              })()}

              {playerData.actions.alcanzar_septimo_sentido &&
               (!playerData.stats.septimoSentidoActivo || playerData.stats.puntosVitalesGolpeados) && (() => {
                 const props = getSpecialButtonProps(
                    'alcanzar_septimo_sentido',
                    playerData.stats.puntosVitalesGolpeados ? "Intentar recuperarse y alcanzar el 7º Sentido" : "Intentar alcanzar el Séptimo Sentido",
                    (!playerData.stats.puntosVitalesGolpeados &&
                       playerData.stats.septimoSentidoIntentado &&
                       !playerData.stats.septimoSentidoActivo),
                    "Ya intentaste alcanzar el 7º Sentido y fallaste este combate"
                 );
                 return (
                     <button
                       key="alcanzar_septimo_sentido_o_recuperar"
                       className={props.buttonClassName}
                       onClick={() => handleActionInitiate('alcanzar_septimo_sentido')}
                       disabled={props.isDisabled}
                       title={props.buttonTitle}
                     >
                       {props.buttonText}
                     </button>
                 );
               })()}
            </div>
          </>
        )}

        {currentConcentrationLevel === 1 && (
          <>
            <h4>Acciones (Concentrado Nivel 1)</h4>
            <div className="action-buttons">
              {renderButtons(level1Actions, 1)}
            </div>
            {playerData.actions.concentracion && (
                 <div className="action-buttons" style={{marginTop: '15px'}}>
                    {(() => {
                        const props = getSpecialButtonProps(
                            'concentracion',
                            "Concentrarse de Nuevo (Nivel 2)",
                            playerData.stats.concentrationLevel >= 2,
                            "Ya estás en Concentración Máxima"
                        );
                        // El texto se maneja dentro de getSpecialButtonProps para "Concentrarse de Nuevo"
                        return (
                            <button
                                key="concentracion-again"
                                className={`${props.buttonClassName} concentrate-again-button`}
                                onClick={() => handleActionInitiate('concentracion')}
                                disabled={props.isDisabled}
                                title={props.buttonTitle}
                            >
                                {props.buttonText}
                            </button>
                        );
                    })()}
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
             {canEsquivar && playerData.stats.agilidadAvailable && (
                 <button className="defense-button agilidad-boost" onClick={() => handleDefenseSelection('esquivar_agilidad')}>
                 Esquivar con Agilidad (+3)
                 </button>
             )}
             {canBlock && (
                 <button className="defense-button" onClick={() => handleDefenseSelection('bloquear')}>Bloquear</button>
             )}
             {canBlock && playerData.stats.fortalezaAvailable && (
                 <button className="defense-button fortaleza-boost" onClick={() => handleDefenseSelection('bloquear_fortaleza')}>
                 Bloquear con Fortaleza (+3)
                 </button>
             )}
             {canCounter && (
                 <button className="defense-button" onClick={() => handleDefenseSelection('contraatacar')}>Contraatacar</button>
             )}
             {canCounter && playerData.stats.destrezaAvailable && (
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

                let isLlaveAlternationBlocked = false;
                let llaveAlternationTitle = "";
                if (option.id === 'atrapar_op5' && typeof IS_ACTION_ALTERNATION_EXCEPTION === 'function' && !IS_ACTION_ALTERNATION_EXCEPTION('llave')) {
                    const history = playerData.stats.actionHistory || [];
                    if (history.length > 0 && history[0] === 'llave') {
                        isLlaveAlternationBlocked = true;
                        llaveAlternationTitle = `Alternancia: No puedes usar Llave ahora. (Reciente: ${history[0].replace(/_/g, ' ')})`;
                    } else if (history.length > 1 && history[1] === 'llave') {
                        isLlaveAlternationBlocked = true;
                        llaveAlternationTitle = `Alternancia: 2 acciones diferentes antes de repetir Llave. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')})`;
                    }
                }

                const isButtonDisabled = isRomperMejoradoDisabled || isLlaveAlternationBlocked;
                let buttonTitle = option.name;
                let buttonText = option.name;
                let buttonClassName = "action-button"; // Clase base

                if (isRomperMejoradoDisabled) {
                    buttonTitle = "Todas las partes del rival están rotas al máximo"; buttonText += " (MAX)";
                } else if (isLlaveAlternationBlocked) {
                    buttonTitle = llaveAlternationTitle; // Usar el título específico de alternancia
                    buttonText += " (Alt.)";
                    buttonClassName += ' action-button-alternation-blocked'; // Añadir clase de alternancia
                }

                return (
                  <button key={option.id} className={buttonClassName} onClick={() => handleAtraparFollowupSelect(option.id)} disabled={isButtonDisabled} title={buttonTitle} >
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

  // Nueva función para renderizar la selección de poderes
  const renderPowerSelection = () => {
    if (!playerData.powers || playerData.powers.length === 0) {
        return <div className="waiting-message">No tienes poderes disponibles.</div>;
    }

    // Excepción para Meteoros de Pegaso (multi-uso)
    const meteorosPower = playerData.powers.find(p => p.id === 'P001' || p.name.toLowerCase().includes('meteoros'));
    
    // Si ya se usó un poder Y NO hay meteoros disponibles (o el único poder era de un solo uso y ya se usó)
    if (playerData.stats.poderesUsadosThisCombat && !meteorosPower) {
         return <div className="waiting-message">Ya has utilizado tu poder este combate.</div>;
    }

    return (
        <div className="power-selection-section">
            <h4>Elige un Poder:</h4>
            <div className="power-buttons">
                {playerData.powers.map(power => {
                    const cost = parseInt(power.cost) || 0;
                    const suficientePC = playerData.stats.currentPC >= cost;
                    const isMeteoros = power.id === 'P001' || power.name.toLowerCase().includes('meteoros');
                    
                    // Un poder está deshabilitado si no hay suficiente PC,
                    // O si es un poder de un solo uso y ya se usó un poder de un solo uso.
                    const isDisabled = !suficientePC || (!isMeteoros && playerData.stats.poderesUsadosThisCombat);
                    
                    let buttonText = `${power.name} (${cost} PC)`;
                    let buttonTitle = `${power.name} - Costo: ${cost} PC. ${power.details || ''}`;
                    if (!suficientePC) {
                        buttonTitle = `PC Insuficiente (Necesitas ${cost}, tienes ${playerData.stats.currentPC})`;
                        buttonText += " (PC Insuf.)";
                    } else if (!isMeteoros && playerData.stats.poderesUsadosThisCombat) {
                        buttonTitle = "Ya usaste un poder de un solo uso este combate.";
                        buttonText += " (Usado)";
                    }

                    return (
                        <button
                            key={power.id}
                            className="power-button"
                            onClick={() => handlePowerSelect(power.id)}
                            disabled={isDisabled}
                            title={buttonTitle}
                        >
                            {buttonText}
                        </button>
                    );
                })}
            </div>
        </div>
    );
  };

  return (
    <div className={`player-area ${isCurrentPlayer ? 'current-player' : ''}`}>
      <div className="character-info">
        <h3>{playerData.name}</h3>
        <div className="stats">
          <StatBar label="PV" currentValue={playerData.stats.currentPV} maxValue={playerData.stats.pv_max} color="#e74c3c" />
          <StatBar label="PA" currentValue={playerData.stats.currentPA} maxValue={playerData.stats.pa_max} color="#3498db" />
          <StatBar label="PC" currentValue={playerData.stats.currentPC} maxValue={playerData.stats.pc_max} color="#f1c40f" />
        </div>
        <div className="status-indicators-container">
            {playerData.stats.concentrationLevel === 1 && <div className="status-indicator concentrated-1">Concentrado (Nivel 1)</div>}
            {playerData.stats.concentrationLevel === 2 && <div className="status-indicator concentrated-2">Concentrado (Nivel 2)</div>}
            {playerData.stats.fortalezaAvailable && <div className="status-indicator fortaleza">Fortaleza (+3 Bloq) Lista</div>}
            {playerData.stats.agilidadAvailable && <div className="status-indicator agilidad">Agilidad (+3 Esq) Lista</div>}
            {playerData.stats.destrezaAvailable && <div className="status-indicator destreza">Destreza (+2 ContrAtq) Lista</div>}
            {playerData.stats.resistenciaAvailable && <div className="status-indicator resistencia">Resistencia (+2 Ataque Llave/Lanz.) Lista</div>}
            {playerData.stats.septimoSentidoActivo && <div className="status-indicator septimo-sentido">¡SÉPTIMO SENTIDO ALCANZADO!</div>}
            {playerData.stats.puntosVitalesGolpeados && <div className="status-indicator puntos-vitales-afectado">Puntos Vitales Afectados</div>}
        </div>
      </div>

      <div className="action-defense-area">
          {isCurrentPlayer ? (
            actionState.stage === 'awaiting_power_selection' && actionState.attackerId === playerData.id ? renderPowerSelection()
            : actionState.stage === 'awaiting_resistencia_choice' && actionState.attackerId === playerData.id ? renderResistenciaChoice()
            : actionState.stage === 'awaiting_followup' && actionState.attackerId === playerData.id ? renderAtraparFollowup()
            : actionState.stage === 'awaiting_romper_target' && actionState.attackerId === playerData.id ? renderRomperTarget()
            : actionState.active && actionState.attackerId === playerData.id && (actionState.stage?.startsWith('awaiting_defense') || actionState.type === 'UsarPoder')
                ? <div className="waiting-message">
                    Esperando {actionState.stage?.startsWith('awaiting_defense') ? 'defensa del rival' : 'acción'} ({
                      actionState.powerDetails ? actionState.powerDetails.name : 
                      actionState.type?.replace(/_/g, ' ').replace('VelocidadLuz', 'Vel. Luz') || 'Acción Actual'
                    }
                    { (actionState.type === 'Arrojar' || actionState.type === 'Furia' || actionState.type === 'MeteorosPegaso') ? ` - Ataque ${actionState.currentHit}/${actionState.totalHits}` : '' }
                    )...
                  </div>
            : renderActionSelection()
          ) : (
            actionState.active && actionState.defenderId === playerData.id && actionState.stage?.startsWith('awaiting_defense') ? renderDefenseSelection()
            : <div className="waiting-message">Esperando turno del rival...</div>
          )}
      </div>
    </div>
  );
}

export default PlayerArea;
