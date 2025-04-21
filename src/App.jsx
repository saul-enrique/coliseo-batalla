import './App.css'
import { useState, useEffect } from 'react'
import PlayerArea from './components/PlayerArea' // Assuming PlayerArea is in components folder
// import GameBoard from './components/GameBoard' // GameBoard seems unused currently
import GameLog from './components/GameLog'       // Assuming GameLog is in components folder
import ArenaDisplay from './components/ArenaDisplay' // Assuming ArenaDisplay is in components folder
import StatBar from './components/StatBar'; // Import StatBar if used directly in App, otherwise ensure PlayerArea imports it

// Initial character data
const initialPlayer1Data = {
  id: 'seiya_v2',
  name: 'SEIYA DE PEGASO II',
  stats: {
    pv_max: 230, pa_max: 300, pc_max: 500,
    currentPV: 230, currentPA: 300, currentPC: 500,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    isConcentrated: false,
    lastActionType: null,
    fortalezaAvailable: false, // <-- NUEVO ESTADO: ¿Tiene el bono listo?
    fortalezaUsedThisCombat: false // <-- NUEVO ESTADO: ¿Ya usó la acción?
  },
  defenseRanges: {
    esquivar: [8, 20],
    bloquear: [8, 20],
    contraatacar: [13, 20],
  },
  actions: {
    golpe: 50,
    llave: 60,
    salto: 80,
    velocidad_luz: 50,
    embestir: 70,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true,
    combo: true,
    engaño: true,
    fortaleza: true // <-- NUEVA ACCIÓN
  },
  powers: [ /* ... */ ], // Shortened
  bonuses: { /* ... */ }, // Shortened
  statusEffects: [],
  supportRanges: { /* ... */ }, // Shortened
};

const initialPlayer2Data = {
  id: 'shiryu_v1',
  name: 'SHIRYU DE DRAGON',
  stats: {
    pv_max: 280, pa_max: 300, pc_max: 400,
    currentPV: 280, currentPA: 300, currentPC: 400,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    isConcentrated: false,
    lastActionType: null,
    fortalezaAvailable: false, // <-- NUEVO ESTADO
    fortalezaUsedThisCombat: false // <-- NUEVO ESTADO
  },
  defenseRanges: {
    esquivar: [10, 20],
    bloquear: [6, 20],
    contraatacar: [14, 20],
  },
  actions: {
    golpe: 60,
    llave: 60,
    salto: 70,
    velocidad_luz: 50,
    embestir: 60,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true,
    combo: true,
    engaño: true,
    fortaleza: true // <-- NUEVA ACCIÓN
  },
 powers: [ /* ... */ ], // Shortened
 bonuses: { /* ... */ }, // Shortened
 statusEffects: [],
 supportRanges: { /* ... */ }, // Shortened
};

// Follow-up options for 'Atrapar'
const atraparFollowupOptions = [ /* ... */ ];

function App() {
  // State for player data
  const [player1Data, setPlayer1Data] = useState(initialPlayer1Data);
  const [player2Data, setPlayer2Data] = useState(initialPlayer2Data);

  // State for current player turn
  const [currentPlayerId, setCurrentPlayerId] = useState(initialPlayer1Data.id);

  // State for managing the current action flow
  const [actionState, setActionState] = useState({
    active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null,
  });

  // State for the game log messages
  const [gameLog, setGameLog] = useState([]);

  // State for displaying events in the arena
  const [arenaEvent, setArenaEvent] = useState(null);

  // Function to roll a 20-sided die
  const rollD20 = () => { return Math.floor(Math.random() * 20) + 1; };

  // Function to add messages to the game log
  const logMessage = (message) => { console.log(message); setGameLog(prevLog => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLog].slice(0, 50)); };

   // Function to create a delay (Promise-based)
   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to apply damage to a player
  const applyDamage = (targetPlayerId, damageAmount, damageType = 'normal') => {
    // ... (applyDamage logic - unchanged) ...
    const targetData = targetPlayerId === player1Data.id ? player1Data : player2Data;
    const setTargetData = targetPlayerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let isGameOver = false;
    if (damageAmount <= 0) { logMessage(`Intento de aplicar ${damageAmount} daño. No se aplicó daño.`); return false; }
    logMessage(`Aplicando ${damageAmount} daño base (Tipo: ${damageType}) a ${targetData.name}...`);
    let damageToPa = 0, damageToPv = 0;
    let currentPA = targetData.stats.currentPA, currentPV = targetData.stats.currentPV;
    let finalPA = currentPA, finalPV = currentPV;
    if (damageType === 'directPV') {
        damageToPv = damageAmount;
        logMessage(`${targetData.name} recibe ${damageToPv} daño directo a PV.`);
    } else if (damageType === 'directPA') {
        damageToPa = Math.min(currentPA, damageAmount); finalPA = currentPA - damageToPa;
        let overflowDamage = damageAmount - damageToPa;
        if (overflowDamage > 0) { logMessage(`¡Armadura rota por daño directo a PA! ${overflowDamage} daño excedente.`); damageToPv = overflowDamage; }
        logMessage(`${targetData.name} recibe ${damageToPa} daño a PA${damageToPv > 0 ? ` y ${damageToPv} daño a PV` : ''}.`);
    } else { // normal
        damageToPa = Math.ceil(damageAmount / 2); damageToPv = Math.floor(damageAmount / 2);
        const actualPaDamage = Math.min(currentPA, damageToPa); finalPA = currentPA - actualPaDamage;
        const overflowDamage = damageToPa - actualPaDamage;
        if (overflowDamage > 0) { logMessage(`¡Armadura rota por daño! ${overflowDamage} daño excedente.`); damageToPv += overflowDamage; }
        logMessage(`${targetData.name} recibe ${damageToPv} daño a PV y ${actualPaDamage} daño a PA.`);
    }
    finalPV = currentPV - damageToPv;
    if (finalPV <= 0) { finalPV = 0; isGameOver = true; logMessage(`!!! ${targetData.name} ha sido derrotado !!!`); }
    finalPV = Math.max(0, finalPV); finalPA = Math.max(0, finalPA);
    setTargetData(prevData => ({ ...prevData, stats: { ...prevData.stats, currentPV: finalPV, currentPA: finalPA } }));
    logMessage(`${targetData.name} - PV: ${finalPV}/${targetData.stats.pv_max}, PA: ${finalPA}/${targetData.stats.pa_max}`);
    if (isGameOver) { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    return isGameOver;
  };

  // Function to restart the game
  const handlePlayAgain = () => {
    logMessage("Reiniciando el juego...");
    setPlayer1Data(initialPlayer1Data); setPlayer2Data(initialPlayer2Data);
    setCurrentPlayerId(initialPlayer1Data.id);
    setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
    setGameLog([]); setArenaEvent(null);
  };

  // Helper function to resolve the 'Llave' action
  const resolveLlaveAction = (attacker, defender, additionalBonus = 0) => {
    // ... (logic for Llave - unchanged) ...
    logMessage(`Resolviendo Llave [Bono Adicional: ${additionalBonus}]...`);
    const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const setAttackerData = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let attackerRoll = 0, defenderRoll = 0, ties = 0;
    let currentDamage = attacker.actions.llave;
    let winnerId = null, loserId = null;
    let llaveGameOver = false;
    while (ties < 3) {
      const attackerBaseRoll = rollD20(); const defenderBaseRoll = rollD20();
      const totalBonus = 2 + additionalBonus;
      attackerRoll = attackerBaseRoll + totalBonus; defenderRoll = defenderBaseRoll;
      logMessage(`Tirada Llave: ${attacker.name} (${attackerBaseRoll}+${totalBonus}=${attackerRoll}) vs ${defender.name} (${defenderBaseRoll})`);
      if (attackerRoll > defenderRoll) { winnerId = attacker.id; loserId = defender.id; logMessage(`${attacker.name} gana la llave!`); break; }
      else if (defenderRoll > attackerRoll) { winnerId = defender.id; loserId = attacker.id; logMessage(`${defender.name} gana la llave!`); break; }
      else { ties++; if (ties < 3) { currentDamage += 10; logMessage(`¡Empate ${ties}! Forcejeo... Daño aumenta a ${currentDamage}. Volviendo a tirar...`); }
        else { logMessage("¡Empate por tercera vez! La llave se anula."); winnerId = null; break; }
      }
    }
    if (winnerId && loserId) {
      llaveGameOver = applyDamage(loserId, currentDamage);
      const winner = winnerId === attacker.id ? attacker : defender; const loser = loserId === attacker.id ? attacker : defender;
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', winnerName: winner.name, loserName: loser.name, damage: currentDamage, message: `${winner.name} gana (${attackerRoll} vs ${defenderRoll}). ${loser.name} recibe ${currentDamage} daño.` });
    } else { setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', outcome: 'tie', message: `¡Empate final en Llave (${attackerRoll} vs ${defenderRoll})! La llave se anula.` }); }
    return llaveGameOver;
  };

  // Helper function to resolve 'Romper' attempts
  const resolveRomperAttempt = (attacker, defender, partToBreak, additionalBonus = 0) => {
      // ... (logic for Romper - unchanged) ...
      const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
      let gameOver = false; const partKey = partToBreak;
      const roll1Base = rollD20(); const roll1 = roll1Base + additionalBonus;
      logMessage(`Primer intento para romper ${partKey}: Tirada = ${roll1Base}${additionalBonus > 0 ? `+${additionalBonus}` : ''} = ${roll1}`);
      if (roll1 < 11) { logMessage("¡Primer intento fallido!"); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'failure', message: `${attacker.name} falla el primer intento (Tirada: ${roll1})` }); return false; }
      logMessage("¡Primer intento exitoso! Realizando segundo intento...");
      const roll2Base = rollD20(); const roll2 = roll2Base + additionalBonus;
      logMessage(`Segundo intento para romper ${partKey}: Tirada = ${roll2Base}${additionalBonus > 0 ? `+${additionalBonus}` : ''} = ${roll2}`);
      if (roll2 < 11) { logMessage("¡Segundo intento fallido!"); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'failure', message: `${attacker.name} falla el segundo intento (Tiradas: ${roll1}, ${roll2})` }); return false; }
      logMessage(`¡Éxito! ¡${partKey} de ${defender.name} rotos!`);
      const currentBreaks = defender.stats.brokenParts[partKey]; const newBreaks = currentBreaks + 1;
      const newBrokenParts = { ...defender.stats.brokenParts, [partKey]: newBreaks };
      const damagePV = 20; gameOver = applyDamage(defender.id, damagePV, 'directPV');
      setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, brokenParts: newBrokenParts } }));
      let penaltyMessage = '';
      if (partKey === 'arms') penaltyMessage = `-1 Bloquear (${newBreaks} vez/veces)`;
      if (partKey === 'legs') penaltyMessage = `-1 Esquivar (${newBreaks} vez/veces)`;
      if (partKey === 'ribs') penaltyMessage = `-1 Llave (${newBreaks} vez/veces)`;
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'success', message: `¡${partKey.charAt(0).toUpperCase() + partKey.slice(1)} Rotos! (Tiradas: ${roll1}, ${roll2}). ${defender.name} pierde ${damagePV} PV. Penalizador: ${penaltyMessage}.` });
      return gameOver;
  };


  // Function to handle the initiation of an action
  const handleActionInitiate = (actionName) => {
    if (actionState.active && actionState.stage !== null) { logMessage("No se puede iniciar acción mientras otra está activa."); return; }
    const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
    const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;
    const setAttackerData = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
    // Define actions requiring concentration
    const actionRequiresConcentration = ['velocidad_luz', 'salto', 'combo', 'engaño'].includes(actionName);
    const isAlternationAction = ['llave', 'romper'].includes(actionName); // Add other alternation actions if needed
    if (actionRequiresConcentration && !attacker.stats.isConcentrated) { logMessage(`! ${attacker.name} necesita Concentración para usar ${actionName}!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración para ${actionName}!` }); return; }
    if (isAlternationAction && attacker.stats.lastActionType === actionName) { logMessage(`¡Regla de Alternancia! No se puede usar ${actionName} dos veces seguidas.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡No puedes usar ${actionName} consecutivamente!` }); return; }

    // --- Action Specific Logic ---
    if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        logMessage(`${attacker.name} inicia Acción: ${actionName}!`);
        if (actionRequiresConcentration) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, isConcentrated: false } })); logMessage(`${attacker.name} usa su concentración para ${actionName}.`); }
        const displayActionName = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_',' ');
        const actionStateType = actionName.charAt(0).toUpperCase() + actionName.slice(1); // e.g., 'Lanzar_obj', 'Velocidad_luz'
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: displayActionName, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} usa ${displayActionName} contra ${defender.name}!` });
        let allowedDefensesForAction = null; if (actionName === 'velocidad_luz') { allowedDefensesForAction = ['esquivar', 'bloquear']; }
        setActionState({ active: true, type: actionStateType, attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', allowedDefenses: allowedDefensesForAction }); return;
    } else if (actionName === 'llave') {
        logMessage(`${attacker.name} intenta una Llave normal contra ${defender.name}!`); const gameOver = resolveLlaveAction(attacker, defender, 0);
        if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } return;
    } else if (actionName === 'presa' || actionName === 'destrozar') {
        const isPresa = actionName === 'presa'; const damageTarget = isPresa ? 'PV' : 'PA'; const damageType = isPresa ? 'directPV' : 'directPA'; logMessage(`${attacker.name} intenta ${actionName} contra ${defender.name}!`);
        if (!isPresa && defender.stats.currentPA <= 0) { logMessage(`No se puede usar Destrozar, la armadura de ${defender.name} ya está rota!`); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destrozar', outcome: 'no_armor', message: `¡La armadura de ${defender.name} ya está rota!` }); return; }
        let totalDamageAccumulated = 0, successfulHits = 0, successfulRolls = [], lastRoll = null, gameOver = false;
        const maxHits = attacker.actions[actionName]?.maxHits || 3; const damagePerHit = attacker.actions[actionName]?.damagePerHit || 15;
        for (let i = 0; i < maxHits; i++) { const roll = rollD20(); lastRoll = roll; const isOdd = roll % 2 !== 0; if (isOdd) { successfulHits++; totalDamageAccumulated += damagePerHit; successfulRolls.push(roll); logMessage(`Tirada ${i + 1}: ${roll} (Impar!) - +${damagePerHit} Daño ${damageTarget} (Total: ${totalDamageAccumulated})`); } else { logMessage(`Tirada ${i + 1}: ${roll} (Par!) - Intento ${i+1} de ${actionName} fallido.`); } } logMessage(`Intentos de ${actionName} finalizados. Golpes exitosos: ${successfulHits}`);
        if (totalDamageAccumulated > 0) { logMessage(`Daño total de ${actionName}: ${totalDamageAccumulated} directo a ${damageTarget}.`); gameOver = applyDamage(defender.id, totalDamageAccumulated, damageType); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, damage: totalDamageAccumulated, hits: successfulHits, successfulRolls: successfulRolls, message: `${attacker.name} asesta ${successfulHits} golpes (Tiradas: ${successfulRolls.join(', ')}). ${defender.name} recibe ${totalDamageAccumulated} daño a ${damageTarget}.` }); }
        else { logMessage(`${actionName} no hizo daño.`); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, outcome: 'failed', message: `${attacker.name} falla ${actionName} (Última Tirada: ${lastRoll})` }); }
        if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } return;
    } else if (actionName === 'romper') {
        logMessage(`${attacker.name} inicia acción Romper.`); const canBreakAnyPart = ['arms', 'legs', 'ribs'].some(part => defender.stats.brokenParts[part] < 2);
        if (!canBreakAnyPart) { logMessage(`¡Todas las partes de ${defender.name} ya están rotas 2 veces! No se puede usar Romper.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` }); return; }
        setActionState({ active: true, type: 'Romper', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_romper_target', allowedDefenses: null }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper', message: `${attacker.name} se prepara para Romper... ¿Qué parte atacará?` }); return;
    } else if (actionName === 'atrapar') {
        logMessage(`${attacker.name} intenta Atrapar a ${defender.name}!`); const roll = rollD20(); const bonus = attacker.stats.atrapar_bonus || 0; const finalRoll = roll + bonus; const targetRange = [11, 20]; logMessage(`${attacker.name} tiró ${roll}${bonus !== 0 ? ` + ${bonus}` : ''} = ${finalRoll} (Necesita ${targetRange[0]}-${targetRange[1]})`);
        if (finalRoll >= targetRange[0] && finalRoll <= targetRange[1]) { logMessage("¡Rival atrapado!"); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'success', message: `${attacker.name} atrapa a ${defender.name} (Tirada: ${finalRoll}). ¡Elige una opción de ataque!` }); setActionState({ active: true, type: 'Atrapar', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_followup', allowedDefenses: null }); }
        else { logMessage("¡Atrapar falló!"); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla al atrapar a ${defender.name} (Tirada: ${finalRoll})` }); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } return;
    } else if (actionName === 'concentracion') {
        logMessage(`${attacker.name} usa Concentración.`); if (attacker.stats.isConcentrated) { logMessage(`Error: ${attacker.name} ya está concentrado.`); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, isConcentrated: true }, lastActionType: 'concentracion' })); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Concentración', attackerName: attacker.name, message: `${attacker.name} se concentra intensamente...` });
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); return;
    } else if (actionName === 'combo') {
        logMessage(`${attacker.name} inicia Acción: ¡Combo!`);
        if (!attacker.stats.isConcentrated) { logMessage(`! ${attacker.name} necesita Concentración para usar Combo!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración para Combo!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, isConcentrated: false } })); logMessage(`${attacker.name} usa su concentración para Combo.`);
        const firstHitPenalty = 0;
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo - Golpe 1', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe del combo!` });
        setActionState({ active: true, type: 'Combo', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, currentDefensePenalty: firstHitPenalty, allowedDefenses: null, comboHitsLanded: 0 }); return;
    } else if (actionName === 'engaño') {
        logMessage(`${attacker.name} inicia Acción: ¡Engaño!`);
        if (!attacker.stats.isConcentrated) { logMessage(`! ${attacker.name} necesita Concentración para usar Engaño!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración para Engaño!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, isConcentrated: false } })); logMessage(`${attacker.name} usa su concentración para Engaño.`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Engaño - Ataque Falso', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza un ataque falso (+2 Esq. para ${defender.name})!` });
        setActionState({ active: true, type: 'Engaño', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense_part_1', allowedDefenses: null }); return;
    // --- ADDED: Fortaleza Initiation ---
    } else if (actionName === 'fortaleza') {
        logMessage(`${attacker.name} usa Fortaleza.`);
        if (attacker.stats.fortalezaUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Fortaleza en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Fortaleza solo se puede usar una vez por combate!` });
            return;
        }
        if (attacker.stats.fortalezaAvailable) {
             logMessage(`¡${attacker.name} ya tiene el bono de Fortaleza activo!`);
             setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de Fortaleza preparado!` });
             return;
        }

        // Activate Fortaleza
        setAttackerData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                fortalezaAvailable: true,
                fortalezaUsedThisCombat: true,
            },
            lastActionType: 'fortaleza' // Record action type
        }));

        setArenaEvent({
          id: Date.now(), type: 'action_effect', actionName: 'Fortaleza Activada',
          attackerName: attacker.name,
          message: `¡${attacker.name} activa Fortaleza! Bono +3 a Bloquear disponible.`
        });

        // Pass turn immediately
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    } else { logMessage(`Acción ${actionName} no implementada o reconocida.`); }
  };


  // --- handleDefenseSelection ---
  const handleDefenseSelection = async (defenseType) => { // defenseType can now be 'bloquear_fortaleza'
    if (!actionState.active || !actionState.stage?.startsWith('awaiting_defense') || !actionState.attackerId || !actionState.defenderId) { logMessage("Estado inválido para selección de defensa."); return; }
    const attackerId = actionState.attackerId; const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data; const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data; const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const actionType = actionState.type; // 'Golpe', 'Velocidad_luz', 'Combo', 'Engaño', etc.
    const currentStage = actionState.stage; // e.g., 'awaiting_defense', 'awaiting_defense_part_1', 'awaiting_defense_part_2'

    // Check if defense is allowed for this specific action/stage
    // Handle 'bloquear_fortaleza' as a valid 'bloquear' for allowed checks
    const effectiveDefenseType = defenseType === 'bloquear_fortaleza' ? 'bloquear' : defenseType;
    if (actionState.allowedDefenses && !actionState.allowedDefenses.includes(effectiveDefenseType)) { logMessage(`¡Defensa inválida! ${defenseType} no está permitido contra ${actionType} (Fase: ${currentStage}).`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${defenseType} no permitido contra ${actionType}!` }); return; }

    logMessage(`${defender.name} elige defenderse con: ${defenseType}`);
    const roll = rollD20();
    let defenseSuccessful = false, damageToDefender = 0, damageToDefenderPA = 0, damageToAttacker = 0;
    let gameOver = false, rollOutcome = 'failure', targetMin = null, targetMax = null;
    let defenseBonusOrPenaltyText = '', baseDamage = 0;
    let usingFortaleza = defenseType === 'bloquear_fortaleza'; // Flag if Fortaleza is being used

    console.log(`[DEBUG] Resolviendo ${actionType} (${currentStage}) con defensa ${defenseType}. Tirada: ${roll}`);

    // --- Consume Fortaleza Bonus if Used ---
    if (usingFortaleza) {
        if (!defender.stats.fortalezaAvailable) {
            logMessage(`¡ERROR! ${defender.name} intentó usar Fortaleza pero no estaba disponible.`);
            // Treat as normal block attempt without bonus
            usingFortaleza = false; // Correct the flag
            defenseType = 'bloquear'; // Revert defense type
        } else {
            logMessage(`¡${defender.name} usa el bono de Fortaleza (+3 Bloquear)!`);
            setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, fortalezaAvailable: false } })); // Consume the bonus
            defenseBonusOrPenaltyText = '(+3 Fortaleza)'; // Set text for message
        }
    }

    // --- Calculate Defense Success and Damage ---
    const actionKey = actionType.toLowerCase();

    // Get Base Damage
    if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') baseDamage = 20;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') baseDamage = 50;
    else if (actionType === 'Salto') baseDamage = 70;
    else if (actionType === 'Velocidad_luz') baseDamage = 50;
    else if (actionType === 'Combo') baseDamage = attacker.actions.golpe;
    else baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || actionState.baseDamage || 0;

    // --- Engaño Defense Logic ---
    if (actionType === 'Engaño') {
        // --- Part 1: Feint Attack ---
        if (currentStage === 'awaiting_defense_part_1') {
            logMessage("--- Resolviendo Engaño: Ataque Falso ---");
            if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
            else if (defenseType === 'esquivar') { let [min, max] = defender.defenseRanges.esquivar; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono Esq.)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
            else if (defenseType === 'bloquear' || usingFortaleza) { // Handle normal block and fortaleza block
                let [min, max] = defender.defenseRanges.bloquear;
                targetMin = usingFortaleza ? Math.max(1, min - 3) : min; // Apply Fortaleza bonus if used
                targetMax = max;
                if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            }
            else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; defenseBonusOrPenaltyText = ''; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }

            // Apply damage from Part 1
            let attackerDamageMessage = "", defenderDamageMessage = "";
            if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
            if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

            // Construct message for Part 1 result
            let part1Message = `${defender.name} intenta ${defenseType.replace('_fortaleza','')} ${defenseBonusOrPenaltyText} vs Ataque Falso. Tirada: ${roll}. `;
            if (targetMin !== null) { part1Message += `(Necesita ${targetMin}-${targetMax}). `; }
            switch (rollOutcome) { case 'success': part1Message += "¡Éxito Defendiendo! "; break; case 'failure': part1Message += "¡Fallo Defendiendo! "; break; case 'blocked': part1Message += "¡Bloqueado! "; break; case 'countered': part1Message += "¡Contraatacado! "; break; default: part1Message += "Resultado: "; break; }
            part1Message += defenderDamageMessage + " " + attackerDamageMessage;

            // Show Part 1 result
            const part1Event = { id: Date.now(), type: 'defense_resolution', actionName: `Engaño Pt.1 vs ${defenseType.replace('_fortaleza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: part1Message.trim(), gameOver: gameOver };
            setArenaEvent(part1Event); logMessage(part1Message); await delay(2000);

            // Transition to Part 2 (unless game over)
            if (!gameOver) {
                logMessage("--- Engaño: Preparando Ataque Real ---");
                setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense_part_2', allowedDefenses: ['bloquear'] }));
                setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Engaño - Ataque Real', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el ataque real! (${defender.name} solo puede Bloquear, -3 Penaliz.)` });
                return; // Wait for defense selection for Part 2
            } else {
                 logMessage("[DEBUG] Juego TERMINADO durante Engaño Parte 1.");
                 if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
                 return; // Exit defense handling
            }
        // --- Part 2: Real Attack ---
        } else if (currentStage === 'awaiting_defense_part_2') {
            baseDamage = 50; // Base damage for real attack
            logMessage("--- Resolviendo Engaño: Ataque Real ---");
            defenseBonusOrPenaltyText = '(-3 Penaliz.)'; // Base penalty
             if (usingFortaleza) defenseBonusOrPenaltyText = '(+3 Fortaleza, -3 Penaliz.)'; // Combined text if Fortaleza used

            if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
            else if (defenseType === 'bloquear' || usingFortaleza) {
                let [min, max] = defender.defenseRanges.bloquear;
                let penalty = 3; // Base penalty for Engaño Pt.2
                let bonus = usingFortaleza ? 3 : 0; // Bonus from Fortaleza
                targetMin = Math.min(21, Math.max(1, min + penalty - bonus)); // Apply penalty and bonus
                targetMax = max;
                if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            } else { logMessage(`¡Defensa inválida (${defenseType})! El Ataque Real solo puede ser bloqueado.`); defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'invalid'; targetMin=null; targetMax=null; }

             // Apply damage from Part 2
            let attackerDamageMessage = "", defenderDamageMessage = "";
            if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

            // Construct message for Part 2 result
            let part2Message = `${defender.name} intenta ${defenseType.replace('_fortaleza','')} ${defenseBonusOrPenaltyText} vs Ataque Real. Tirada: ${roll}. `;
            if (targetMin !== null) { part2Message += `(Necesita ${targetMin}-${targetMax}). `; }
            switch (rollOutcome) { case 'blocked': part2Message += "¡Bloqueado! "; break; case 'failure': part2Message += "¡Fallo! "; break; case 'invalid': part2Message += "¡Defensa Inválida! "; break; default: part2Message += "Resultado: "; break; }
            part2Message += defenderDamageMessage;
             if (gameOver) { part2Message += ` *** ¡Combate Terminado! ***`; }

            // Show Part 2 result
            const part2Event = { id: Date.now(), type: 'defense_resolution', actionName: `Engaño Pt.2 vs ${defenseType.replace('_fortaleza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: part2Message.trim(), gameOver: gameOver };
            setArenaEvent(part2Event); logMessage(part2Message); await delay(1500);

            // --- End Engaño Action & Pass Turn ---
             if (!gameOver) {
                 const actionTypeForHistory = 'engaño';
                 setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
                 setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                 const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                 setCurrentPlayerId(nextPlayerId);
                 logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            } else { console.log("[DEBUG] Juego TERMINADO durante Engaño Parte 2."); if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); } }
            return; // Exit handleDefenseSelection
        }
    } // --- End Engaño Block ---

    // --- Combo Defense Logic ---
    else if (actionType === 'Combo') {
        const currentHit = actionState.currentComboHit || 1;
        const currentPenalty = actionState.currentDefensePenalty || 0;
        baseDamage = attacker.actions.golpe; // Combo uses Golpe damage
        logMessage(`--- Resolviendo Combo: Golpe #${currentHit} (Penaliz. Def: -${currentPenalty}) ---`);
        defenseBonusOrPenaltyText = currentPenalty > 0 ? `(-${currentPenalty} Penaliz.)` : '';

        if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
        else if (defenseType === 'esquivar') { let [min, max] = defender.defenseRanges.esquivar; targetMin = Math.min(21, min + currentPenalty); targetMax = max; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear' || usingFortaleza) { // Handle fortaleza block
            let [min, max] = defender.defenseRanges.bloquear;
            let bonus = usingFortaleza ? 3 : 0;
            targetMin = Math.min(21, Math.max(1, min + currentPenalty - bonus)); // Apply penalty and bonus
            targetMax = max;
            if(usingFortaleza) defenseBonusOrPenaltyText += ' (+3 Fortaleza)'; // Append text
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
         }
        else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }

        // Process result of this hit
        let attackerDamageMessage = "", defenderDamageMessage = "";
        if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
        if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

        // Construct message for this hit
        let hitMessage = `${defender.name} intenta ${defenseType.replace('_fortaleza','')} ${defenseBonusOrPenaltyText} vs Combo Golpe #${currentHit}. Tirada: ${roll}. `;
        if (targetMin !== null) { hitMessage += `(Necesita ${targetMin}-${targetMax}). `; }
        switch (rollOutcome) { case 'success': hitMessage += "¡Éxito Defendiendo! "; break; case 'failure': hitMessage += "¡Fallo Defendiendo! "; break; case 'blocked': hitMessage += "¡Bloqueado! "; break; case 'countered': hitMessage += "¡Contraatacado! "; break; default: hitMessage += "Resultado: "; break; }
        hitMessage += defenderDamageMessage + " " + attackerDamageMessage;

        // Show result of the hit
        const hitEvent = { id: Date.now(), type: 'defense_resolution', actionName: `Combo Golpe #${currentHit} vs ${defenseType.replace('_fortaleza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: hitMessage.trim(), gameOver: gameOver };
        setArenaEvent(hitEvent); logMessage(hitMessage); await delay(2000);

        // Decide if combo continues
        if (defenseSuccessful || gameOver || currentHit >= 3) {
            // COMBO ENDS
            let finalComboMessage = "";
            if (defenseSuccessful) { finalComboMessage = `¡${defender.name} detiene el combo en el golpe #${currentHit}!`; }
            else if (gameOver) { finalComboMessage = `¡El golpe #${currentHit} del combo derrota a ${defender.name}! ¡Combate Terminado!`; }
            else { finalComboMessage = `¡${attacker.name} completa el combo de 3 golpes!`; }
            logMessage(finalComboMessage); setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Fin del Combo', message: finalComboMessage, gameOver: gameOver }); await delay(1000);
            if (!gameOver) { const actionTypeForHistory = 'combo'; setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); }
            else { console.log("[DEBUG] Juego TERMINADO durante el combo."); } return;
        } else {
            // COMBO CONTINUES
            const nextHit = currentHit + 1; const nextPenalty = nextHit === 2 ? 2 : 4;
            logMessage(`¡El golpe #${currentHit} conecta! ${attacker.name} continúa con el golpe #${nextHit}...`);
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense', currentComboHit: nextHit, currentDefensePenalty: nextPenalty, }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Combo - Golpe ${nextHit}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el golpe #${nextHit}! (Defensa ${nextPenalty === 2 ? '-2' : '-4'})` }); return;
        }
    } // --- End Combo Block ---

    // --- Other Action Defenses (Golpe, Salto, VdL, etc.) ---
    // --- This block now handles all actions EXCEPT Combo and Engaño ---
    else {
        // Get Base Damage (already done above unless overridden by specific action)
        if (actionType === 'Golpe') { baseDamage = attacker.actions.golpe; }
        else if (actionType === 'Lanzar_obj') { baseDamage = attacker.actions.lanzar_obj; }
        else if (actionType === 'Embestir') { baseDamage = attacker.actions.embestir; }
        else if (actionType === 'Cargar') { baseDamage = attacker.actions.cargar; }
        else if (actionType === 'Velocidad_luz') { baseDamage = 50; }
        else if (actionType === 'Salto') { baseDamage = 70; }
        else if (actionType === 'Atrapar_Opcion2') { baseDamage = actionState.baseDamage || 80; }
        else if (actionType === 'Atrapar_Opcion4') { baseDamage = actionState.baseDamage || 60; }
        else if (actionType === 'Atrapar_Opcion7') { baseDamage = actionState.baseDamage || 60; }
        else { logMessage(`Cálculo de defensa para ${actionType} no implementado.`); baseDamage = 0; } // Default base damage if unknown

        // Calculate Defense Outcome
        if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
        else if (defenseType === 'esquivar') {
            let [min, max] = defender.defenseRanges.esquivar;
            let bonus = 0;
            if (actionType === 'Lanzar_obj') { bonus = 2; defenseBonusOrPenaltyText = '(+2 Bono)'; }
            else if (actionType === 'Cargar') { bonus = 2; defenseBonusOrPenaltyText = '(+2 Bono)'; }
            targetMin = Math.max(1, min - bonus); targetMax = max;
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        } else if (defenseType === 'bloquear' || usingFortaleza) {
            let [min, max] = defender.defenseRanges.bloquear;
            let penalty = 0;
            let bonus = usingFortaleza ? 3 : 0;
            if(usingFortaleza) defenseBonusOrPenaltyText = '(+3 Fortaleza)';

            if (actionType === 'Lanzar_obj') { penalty = 2; defenseBonusOrPenaltyText += '(-2 Penaliz.)'; }
            else if (actionType === 'Velocidad_luz') { penalty = 6; defenseBonusOrPenaltyText += '(-6 Penaliz.)'; }
            else if (actionType === 'Salto') { penalty = 2; defenseBonusOrPenaltyText += '(-2 Penaliz.)'; }
            else if (actionType === 'Atrapar_Opcion4') { penalty = actionState.defensePenalty || 2; defenseBonusOrPenaltyText += `(-${penalty} Penaliz.)`; }
            else if (actionType === 'Atrapar_Opcion2' && defenseType !== 'bloquear' && !usingFortaleza) { rollOutcome = 'invalid'; } // Invalid defense for option 2

            if (rollOutcome !== 'invalid') {
                 targetMin = Math.min(21, Math.max(1, min + penalty - bonus)); targetMax = max;
                 if (roll >= targetMin && roll <= targetMax) {
                     defenseSuccessful = true; rollOutcome = 'blocked';
                     // Assign Block PA Damage based on action
                     if (actionType === 'Golpe' || actionType === 'Velocidad_luz') damageToDefenderPA = 10;
                     else if (actionType === 'Lanzar_obj' || actionType === 'Embestir' || actionType === 'Cargar') damageToDefenderPA = 20;
                     else if (actionType === 'Salto') damageToDefenderPA = 20;
                     else if (actionType === 'Atrapar_Opcion2') damageToDefenderPA = actionState.blockDamagePA || 20;
                     else if (actionType === 'Atrapar_Opcion4') damageToDefenderPA = actionState.blockDamagePA || 10;
                     else damageToDefenderPA = 10; // Default block damage?
                 } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            } else { // Handle invalid defense case for Atrapar_Opcion2
                 damageToDefender = baseDamage;
                 targetMin = null; targetMax = null;
            }

        } else if (defenseType === 'contraatacar') {
             [targetMin, targetMax] = defender.defenseRanges.contraatacar;
             let bonus = 0;
             if (actionType === 'Cargar') { bonus = 2; defenseBonusOrPenaltyText = '(+2 Bono)'; }
             else if (actionType === 'Atrapar_Opcion4') { let penalty = actionState.defensePenalty || 2; bonus = -penalty; defenseBonusOrPenaltyText = `(-${penalty} Penaliz.)`; } // Apply penalty as negative bonus
             let effectiveMin = Math.max(1, targetMin - bonus);

             if (roll >= effectiveMin && roll <= targetMax) {
                 defenseSuccessful = true; rollOutcome = 'countered';
                 // Assign Counter Damage based on action
                 if (actionType === 'Golpe' || actionType === 'Salto' || actionType === 'Atrapar_Opcion4') damageToAttacker = Math.floor(defender.actions.golpe / 2);
                 else if (actionType === 'Lanzar_obj') damageToAttacker = Math.floor(defender.actions.lanzar_obj / 2);
                 else if (actionType === 'Embestir') damageToAttacker = Math.floor(defender.actions.embestir / 2);
                 else if (actionType === 'Cargar') damageToAttacker = Math.floor(defender.actions.cargar / 2);
                 else damageToAttacker = 0; // Default if counter doesn't apply damage
             } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }

        // --- Common Logic for applying damage, creating event, passing turn ---
        let attackerDamageMessage = "", defenderDamageMessage = "";
        if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
        if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

        let finalMessage = `${defender.name} intenta ${defenseType.replace('_fortaleza','')} ${defenseBonusOrPenaltyText} vs ${actionType.replace('_', ' ')}. Tirada: ${roll}. `;
        if (targetMin !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
        switch (rollOutcome) { case 'success': finalMessage += "¡Éxito! "; break; case 'failure': finalMessage += "¡Fallo! "; break; case 'blocked': finalMessage += "¡Bloqueado! "; break; case 'countered': finalMessage += "¡Contraatacado! "; break; case 'invalid': finalMessage += "¡Defensa Inválida! "; break; default: finalMessage += "Resultado: "; break; }
        finalMessage += defenderDamageMessage + " " + attackerDamageMessage;
        if (gameOver) { finalMessage += ` *** ¡Combate Terminado! ***`; }

        const resolutionEvent = { id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace('_', ' ')} vs ${defenseType.replace('_fortaleza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: finalMessage.trim(), gameOver: gameOver };

        logMessage(finalMessage); setArenaEvent(resolutionEvent);
        if (!gameOver) {
            console.log("[DEBUG] Juego NO terminado. Esperando y cambiando turno...");
            await delay(2500);
            const actionJustFinished = actionState.type;
            const actionTypeForHistory = actionJustFinished.toLowerCase().startsWith('atrapar_') ? 'atrapar' : actionJustFinished.toLowerCase();
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
            setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else { console.log("[DEBUG] Juego TERMINADO."); if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); } }
    } // End common logic block

  }; // End of handleDefenseSelection


  // Function to handle selection of 'Atrapar' follow-up option
  const handleAtraparFollowupSelect = (optionId) => {
    // ... (logic for Atrapar follow-ups - unchanged) ...
    if (!actionState.active || actionState.type !== 'Atrapar' || actionState.stage !== 'awaiting_followup') { logMessage("Estado inválido para selección de seguimiento de Atrapar."); return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let gameOver = false; const selectedOption = atraparFollowupOptions.find(opt => opt.id === optionId);
    logMessage(`${attacker.name} elige seguimiento de Atrapar: ${selectedOption?.name || optionId}`);

    switch (optionId) {
      case 'atrapar_op1': { logMessage(`${attacker.name} usa Golpes Múltiples!`); const rolls = [rollD20(), rollD20(), rollD20()]; const oddRolls = rolls.filter(r => r % 2 !== 0); const oddCount = oddRolls.length; const damage = oddCount * 20; logMessage(`Tiradas: ${rolls.join(', ')}. Aciertos (impares): ${oddCount}. Daño total: ${damage}`); if (damage > 0) { gameOver = applyDamage(defender.id, damage, 'normal'); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, damage: damage, hits: oddCount, successfulRolls: oddRolls, message: `${attacker.name} conecta ${oddCount} golpes (${oddRolls.join(', ')}) causando ${damage} de daño.` }); } else { logMessage("Ningún golpe acertó."); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla todos los golpes (Tiradas: ${rolls.join(', ')}).` }); } if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } break; }
      case 'atrapar_op2': { logMessage(`${attacker.name} usa Ataque Potente!`); setActionState({ ...actionState, type: 'Atrapar_Opcion2', stage: 'awaiting_defense', baseDamage: 80, blockDamagePA: 20, allowedDefenses: ['bloquear'] }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Potente', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Potente (80 Daño). ${defender.name}, ¡solo puedes intentar Bloquear!` }); break; }
      case 'atrapar_op3': { logMessage(`${attacker.name} inicia Ataques Rápidos!`); let successfulDamageHits = 0, successfulBlocks = 0, totalNormalDamage = 0, totalPADamage = 0; for (let i = 0; i < 3; i++) { if (gameOver) break; const hitNumber = i + 1; logMessage(`--- Golpe Rápido #${hitNumber} ---`); const [minRoll, maxRoll] = defender.defenseRanges.bloquear; const roll = rollD20(); const blocked = (roll >= minRoll && roll <= maxRoll); logMessage(`${defender.name} intenta Bloquear (Necesita ${minRoll}-${maxRoll}): Tirada ${roll}!`); if (blocked) { successfulBlocks++; const damagePA = 10; totalPADamage += damagePA; logMessage(`¡Bloqueado! Recibe ${damagePA} daño PA.`); gameOver = applyDamage(defender.id, damagePA, 'directPA'); } else { successfulDamageHits++; const damageNormal = 20; totalNormalDamage += damageNormal; logMessage(`¡Impacto! Recibe ${damageNormal} daño.`); gameOver = applyDamage(defender.id, damageNormal, 'normal'); } } let finalMessage = `${attacker.name} usó Ataques Rápidos. `; let details = []; if (successfulDamageHits > 0) details.push(`${successfulDamageHits} impactos (${totalNormalDamage} Daño Normal)`); if (successfulBlocks > 0) details.push(`${successfulBlocks} bloqueados (${totalPADamage} Daño PA)`); finalMessage += details.length > 0 ? details.join(', ') + '.' : "¡Todos los golpes fallaron o fueron bloqueados sin efecto!"; setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataques Rápidos', message: finalMessage, hitsLanded: successfulDamageHits, hitsBlocked: successfulBlocks, totalNormalDmg: totalNormalDamage, totalPADmg: totalPADamage }); if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } break; }
      case 'atrapar_op4': { logMessage(`${attacker.name} usa Ataque Vulnerante!`); setActionState({ ...actionState, type: 'Atrapar_Opcion4', stage: 'awaiting_defense', baseDamage: 60, blockDamagePA: 10, defensePenalty: 2, allowedDefenses: null }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Vulnerante', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Vulnerante (60 Daño). ¡${defender.name} defiende con -2 de penalización!` }); break; }
      case 'atrapar_op5': { const currentActionName = 'llave'; if (attacker.stats.lastActionType === currentActionName) { logMessage("¡Regla de Alternancia! No se puede usar Llave Mejorada después de Llave."); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Llave Mejorada', outcome: 'invalid', message: "¡No puedes usar Llave consecutivamente!" }); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } else { logMessage(`${attacker.name} usa Llave Mejorada (+3 Bono)!`); gameOver = resolveLlaveAction(attacker, defender, 3); if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: currentActionName } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); } } break; }
      case 'atrapar_op6': { logMessage(`${attacker.name} usa Romper Mejorado.`); const canBreakAnyPart = ['arms', 'legs', 'ribs'].some(part => defender.stats.brokenParts[part] < 2); if (!canBreakAnyPart) { logMessage(`¡Todas las partes de ${defender.name} ya están rotas 2 veces! No se puede usar Romper Mejorado.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` }); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); return; } setActionState({ ...actionState, type: 'Atrapar_Opcion6', stage: 'awaiting_romper_target', romperBonus: 4 }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper Mejorado', message: `${attacker.name} intenta romper una parte del cuerpo con un bono de +4.` }); break; }
      case 'atrapar_op7': { logMessage(`${attacker.name} usa Ataque Imbloqueable!`); setActionState({ ...actionState, type: 'Atrapar_Opcion7', stage: 'awaiting_defense', baseDamage: 60, allowedDefenses: ['esquivar'] }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Imbloqueable', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Imbloqueable (60 Daño). ${defender.name}, ¡solo puedes intentar Esquivar!` }); break; }
      default: { logMessage(`Opción ${optionId} no implementada.`); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); break; }
    }
  };

  // Handler for selecting the target part for 'Romper' or 'Romper Mejorado'
  const handleRomperTargetSelect = (partToBreak) => {
    if (!actionState.active || actionState.stage !== 'awaiting_romper_target') { logMessage("Estado inválido para selección de objetivo de Romper."); return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const wasAtraparFollowup = actionState.type === 'Atrapar_Opcion6';
    const actionTypeForHistory = wasAtraparFollowup ? 'atrapar' : 'romper';
    logMessage(`${attacker.name} elige romper ${partToBreak} de ${defender.name}!`);
    if (defender.stats.brokenParts[partToBreak] >= 2) { logMessage(`ERROR LÓGICO: Intentando romper ${partToBreak} que ya está al máximo.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `${partToBreak.charAt(0).toUpperCase() + partToBreak.slice(1)} no se puede romper más.` }); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); return; }
    const bonus = actionState.romperBonus || 0;
    const gameOver = resolveRomperAttempt(attacker, defender, partToBreak, bonus);
    if (!gameOver) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); }
  };


  // --- Render Logic ---
  return (
    <div className="app-container">
      {actionState.stage === 'game_over' ? (
        <div className="game-over-screen">
          <h2>¡Fin del Combate!</h2>
          <button onClick={handlePlayAgain} className="play-again-button">Jugar de Nuevo</button>
          <GameLog log={gameLog} />
        </div>
      ) : (
        <div className="game-container">
          <PlayerArea characterData={player1Data} opponentData={player2Data} isCurrentPlayer={currentPlayerId === player1Data.id} handleActionInitiate={handleActionInitiate} actionState={actionState} handleDefenseSelection={handleDefenseSelection} handleAtraparFollowupSelect={handleAtraparFollowupSelect} handleRomperTargetSelect={handleRomperTargetSelect} atraparOptions={atraparFollowupOptions} />
          <div className="center-column"> <ArenaDisplay event={arenaEvent} /> <GameLog log={gameLog} /> </div>
          <PlayerArea characterData={player2Data} opponentData={player1Data} isCurrentPlayer={currentPlayerId === player2Data.id} handleActionInitiate={handleActionInitiate} actionState={actionState} handleDefenseSelection={handleDefenseSelection} handleAtraparFollowupSelect={handleAtraparFollowupSelect} handleRomperTargetSelect={handleRomperTargetSelect} atraparOptions={atraparFollowupOptions} />
        </div>
      )}
    </div>
  )
}

export default App
