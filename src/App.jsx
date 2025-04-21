import './App.css'
import { useState, useEffect } from 'react'
import PlayerArea from './components/PlayerArea' // Assuming PlayerArea is in components folder
// import GameBoard from './components/GameBoard' // GameBoard seems unused currently
import GameLog from './components/GameLog'       // Assuming GameLog is in components folder
import ArenaDisplay from './components/ArenaDisplay' // Assuming ArenaDisplay is in components folder
import StatBar from './components/StatBar'; // Import StatBar if used directly in App, otherwise ensure PlayerArea imports it

// Initial character data (Ensure Velocidad Luz damage is 50 and added to both if applicable)
const initialPlayer1Data = {
  id: 'seiya_v2',
  name: 'SEIYA DE PEGASO II',
  stats: {
    pv_max: 230, pa_max: 300, pc_max: 500,
    currentPV: 230, currentPA: 300, currentPC: 500,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    isConcentrated: false, // State for concentration
    lastActionType: null
  },
  defenseRanges: {
    esquivar: [8, 20],
    bloquear: [8, 20],
    contraatacar: [13, 20],
  },
  actions: {
    golpe: 50,
    llave: 60,
    salto: 80, // Assumed to require concentration
    velocidad_luz: 50, // Damage updated to 50 as requested
    embestir: 70,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true // Action to initiate concentration
  },
  powers: [ { id: 'P001', name: 'Meteoros de Pegaso', cost: 100, type: ['RMult'], details: '5-8 golpes x 20 Ptos Daño' }, { id: 'P002', name: 'Vuelo del Pegaso', cost: 100, type: ['LL'], damage: 100 }, { id: 'P003', name: 'Cometa Pegaso', cost: 200, type: ['R'], damage: 190, effects: '-1 Esq/-1 Bloq' }, ], // Shortened for brevity
  bonuses: { pasivos: ['+2 Esq', '+1 ContrAtq', '+2 7º Sent', '+10 Dmg Salto/VelLuz/Embestir', '+1 Percep'], activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'], }, // Shortened
  statusEffects: [],
  supportRanges: { percepcion: [16, 20], septimo_sentido: [17, 20], puntos_vitales: [17, 20], romper: [11, 20], ayuda: [12, 20], }, // Shortened
};

const initialPlayer2Data = {
  id: 'shiryu_v1',
  name: 'SHIRYU DE DRAGON',
  stats: {
    pv_max: 280, pa_max: 300, pc_max: 400,
    currentPV: 280, currentPA: 300, currentPC: 400,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    isConcentrated: false, // State for concentration
    lastActionType: null
  },
  defenseRanges: {
    esquivar: [10, 20], // Shiryu's base dodge range
    bloquear: [6, 20],
    contraatacar: [14, 20],
  },
  actions: {
    golpe: 60,
    llave: 60,
    salto: 70, // Assumed to require concentration
    velocidad_luz: 50, // Added as per request
    embestir: 60,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true // Action to initiate concentration
  },
  powers: [ { id: 'S001', name: 'Patada Dragón', cost: 50, type: ['R'], damage: 40, details: '+10 Dmg Salto stack' }, { id: 'S002', name: 'Dragón Volador', cost: 50, type: ['R', 'G'], damage: 70 }, { id: 'S003', name: 'Rozan Ryuu Hi Shou', cost: 100, type: ['R', 'G'], damage: 100, details: 'Weak Point on Counter' }, { id: 'S004', name: 'Cien Dragones de Rozan', cost: 200, type: ['RB', 'G'], damage: 160, effects: '-3 Bloquear' }, { id: 'S005', name: 'Último Dragón', cost: 200, type: ['LL'], damage: 200, details: 'Self-dmg 120, 1 use' }, { id: 'S006', name: 'Excalibur', cost: 100, type: ['R', 'RArm', 'M'], damage: 100, details: 'Ignore Def Bonus, Destroys Armor on 1-2' }, ], // Shortened
  bonuses: { pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+10 Dmg Golpe (ARM)'], activos: ['+2 Ayuda (aliados)', '+2 Int Div', 'Valentía del Dragón', 'Armadura Divina'], flags: ['ESC', 'ARM'] }, // Shortened
  statusEffects: [],
  supportRanges: { percepcion: [15, 20], septimo_sentido: [19, 20], puntos_vitales: [17, 20], romper: [11, 20], ayuda: [12, 20], }, // Shortened
};

// Follow-up options for 'Atrapar'
const atraparFollowupOptions = [
  { id: 'atrapar_op1', name: 'Golpes Múltiples (3d20 Impar=20 Daño)' },
  { id: 'atrapar_op2', name: 'Ataque Potente (80 Daño, Solo Bloqueo)' },
  { id: 'atrapar_op3', name: 'Ataques Rápidos (3x20 Daño, Solo Bloqueo)' },
  { id: 'atrapar_op4', name: 'Ataque Vulnerante (60 Daño, -2 Def Rival)' },
  { id: 'atrapar_op5', name: 'Llave Mejorada (+3 Bono)' },
  { id: 'atrapar_op6', name: 'Romper Mejorado (+4 Bono)' },
  { id: 'atrapar_op7', name: 'Ataque Imbloqueable (60 Daño, Solo Esquiva)' },
];

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
  const logMessage = (message) => { console.log(message); setGameLog(prevLog => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLog].slice(0, 50)); }; // Added timestamp

   // Function to create a delay (Promise-based)
   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to apply damage to a player
  const applyDamage = (targetPlayerId, damageAmount, damageType = 'normal') => {
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
    const actionRequiresConcentration = ['velocidad_luz', 'salto'].includes(actionName);
    const isAlternationAction = ['llave', 'romper'].includes(actionName);
    if (actionRequiresConcentration && !attacker.stats.isConcentrated) { logMessage(`! ${attacker.name} necesita Concentración para usar ${actionName}!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración para ${actionName}!` }); return; }
    if (isAlternationAction && attacker.stats.lastActionType === actionName) { logMessage(`¡Regla de Alternancia! No se puede usar ${actionName} dos veces seguidas.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡No puedes usar ${actionName} consecutivamente!` }); return; }

    // --- Action Specific Logic ---
    if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        logMessage(`${attacker.name} inicia Acción: ${actionName}!`);
        if (actionRequiresConcentration) { setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, isConcentrated: false } })); logMessage(`${attacker.name} usa su concentración para ${actionName}.`); }
        const actionStateType = actionName.charAt(0).toUpperCase() + actionName.slice(1); // Capitalize (e.g., Velocidad_luz)
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionStateType, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} usa ${actionName} contra ${defender.name}!` });
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
    } else { logMessage(`Acción ${actionName} no implementada o reconocida.`); }
  };


  // --- UPDATED handleDefenseSelection with Spanish Messages & CORRECTED CHECK ---
  const handleDefenseSelection = async (defenseType) => { // Make the function async
    if (!actionState.active || actionState.stage !== 'awaiting_defense' || !actionState.attackerId || !actionState.defenderId) { logMessage("Estado inválido para selección de defensa."); return; }
    const attackerId = actionState.attackerId; const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data; const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data; const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const actionType = actionState.type; // This holds the Capitalized_name
    if (actionState.allowedDefenses && !actionState.allowedDefenses.includes(defenseType)) { logMessage(`¡Defensa inválida! ${defenseType} no está permitido contra ${actionType}.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${defenseType} no permitido contra ${actionType}!` }); return; }

    logMessage(`${defender.name} elige defenderse con: ${defenseType}`);
    const roll = rollD20();
    let defenseSuccessful = false, damageToDefender = 0, damageToDefenderPA = 0, damageToAttacker = 0;
    let gameOver = false, rollOutcome = 'failure', targetMin = null, targetMax = null;
    let defenseBonusOrPenaltyText = '', baseDamage = 0;
    console.log(`[DEBUG] Resolviendo ${actionType} con defensa ${defenseType}. Tirada: ${roll}`); // Keep this debug line

    // --- Calculate Defense Success and Damage ---
    // Use actionType directly as it's already capitalized (e.g., 'Golpe', 'Velocidad_luz')
    const actionKey = actionType.toLowerCase(); // Get lowercase key for accessing attacker.actions
    baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || actionState.baseDamage || 0; // Get damage

    // --- Golpe Defense ---
    if (actionType === 'Golpe') { // Compare with the Capitalized version from actionState.type
        baseDamage = attacker.actions.golpe;
        if (defenseType === 'esquivar') { [targetMin, targetMax] = defender.defenseRanges.esquivar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear') { [targetMin, targetMax] = defender.defenseRanges.bloquear; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
    }
    // --- Lanzar Objeto Defense ---
    else if (actionType === 'Lanzar Objeto') { // Note: Assumes handleActionInitiate stores 'Lanzar Objeto'
        baseDamage = attacker.actions.lanzar_obj;
        if (defenseType === 'esquivar') { let [min, max] = defender.defenseRanges.esquivar; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear') { let [min, max] = defender.defenseRanges.bloquear; targetMin = Math.min(21, min + 2); targetMax = max; defenseBonusOrPenaltyText = '(-2 Penaliz.)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 20; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.lanzar_obj / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
    }
    // --- Embestir Defense ---
    else if (actionType === 'Embestir') {
        baseDamage = attacker.actions.embestir;
        if (defenseType === 'esquivar') { [targetMin, targetMax] = defender.defenseRanges.esquivar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear') { let [min, max] = defender.defenseRanges.bloquear; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 20; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.embestir / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
    }
    // --- Cargar Defense ---
    else if (actionType === 'Cargar') {
        baseDamage = attacker.actions.cargar;
        if (defenseType === 'esquivar') { let [min, max] = defender.defenseRanges.esquivar; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear') { let [min, max] = defender.defenseRanges.bloquear; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 20; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'contraatacar') { let [min, max] = defender.defenseRanges.contraatacar; targetMin = Math.max(1, min - 2); targetMax = max; defenseBonusOrPenaltyText = '(+2 Bono)'; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.cargar / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
    }
    // --- Velocidad Luz Defense ---
    // **** CORRECTION HERE **** Compare with the actual value from actionState.type
    else if (actionType === 'Velocidad_luz') { // Use the Capitalized_underscore version
        baseDamage = attacker.actions.velocidad_luz;
        if (defenseType === 'esquivar') {
            let [minRollBase, maxRollBase] = defender.defenseRanges.esquivar;
            targetMin = Math.min(21, minRollBase + 4); targetMax = maxRollBase; defenseBonusOrPenaltyText = '(-4 Penaliz.)';
             console.log(`[DEBUG VdL Esq] Base Range: [${minRollBase}, ${maxRollBase}], Target: [${targetMin}, ${targetMax}], Roll: ${roll}`); // Simplified log
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        } else if (defenseType === 'bloquear') {
            let [minRollBase, maxRollBase] = defender.defenseRanges.bloquear;
            targetMin = Math.min(21, minRollBase + 6); targetMax = maxRollBase; defenseBonusOrPenaltyText = '(-6 Penaliz.)';
             console.log(`[DEBUG VdL Bloq] Base Range: [${minRollBase}, ${maxRollBase}], Target: [${targetMin}, ${targetMax}], Roll: ${roll}`); // Simplified log
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
    }
    // --- Salto Defense ---
    else if (actionType === 'Salto') { // Assuming 'Salto' is stored
        baseDamage = attacker.actions.salto;
        if (defenseType === 'esquivar') { [targetMin, targetMax] = defender.defenseRanges.esquivar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'bloquear') { [targetMin, targetMax] = defender.defenseRanges.bloquear; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 15; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
        else if (defenseType === 'contraatacar') { [targetMin, targetMax] = defender.defenseRanges.contraatacar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } }
    }
    // --- Atrapar Follow-up Defenses ---
    else if (actionType === 'Atrapar_Opcion2') { baseDamage = actionState.baseDamage || 80; const blockDamagePA = actionState.blockDamagePA || 20; if (defenseType === 'bloquear') { [targetMin, targetMax] = defender.defenseRanges.bloquear; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = blockDamagePA; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } } else { defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'invalid'; targetMin=null; targetMax=null; } }
    else if (actionType === 'Atrapar_Opcion4') { baseDamage = actionState.baseDamage || 60; const blockDamagePA = actionState.blockDamagePA || 10; const defensePenalty = actionState.defensePenalty || 2; defenseBonusOrPenaltyText = `(-${defensePenalty} Penaliz.)`; if (defenseType === 'esquivar') { let [min, max] = defender.defenseRanges.esquivar; targetMin = Math.min(21, min + defensePenalty); targetMax = max; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } } else if (defenseType === 'bloquear') { let [min, max] = defender.defenseRanges.bloquear; targetMin = Math.min(21, min + defensePenalty); targetMax = max; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = blockDamagePA; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } } else if (defenseType === 'contraatacar') { let [min, max] = defender.defenseRanges.contraatacar; targetMin = Math.min(21, min + defensePenalty); targetMax = max; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } } }
    else if (actionType === 'Atrapar_Opcion7') { baseDamage = actionState.baseDamage || 60; if (defenseType === 'esquivar') { [targetMin, targetMax] = defender.defenseRanges.esquivar; if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; } } else { defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'invalid'; targetMin=null; targetMax=null; } }
    // --- Default for Unhandled Actions ---
    else {
         logMessage(`Cálculo de defensa para ${actionType} no implementado.`); // Log the error clearly
         defenseSuccessful = true; // Default to success to avoid unexpected damage
         rollOutcome = 'success'; // Default outcome
         targetMin = null; targetMax = null; // No target range known
    }

    // --- Apply Damage ---
    let attackerDamageMessage = "", defenderDamageMessage = "";
    if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
    if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

    // --- Construct Final Message in Spanish ---
    let finalMessage = `${defender.name} intenta ${defenseType} ${defenseBonusOrPenaltyText} vs ${actionType.replace('_', ' ')}. Tirada: ${roll}. `; // Replace underscore for display
    if (targetMin !== null && targetMax !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
    else if (targetMin !== null) { finalMessage += `(Necesita >= ${targetMin}). `; }

    switch (rollOutcome) {
        case 'success': finalMessage += "¡Éxito! "; break;
        case 'failure': finalMessage += "¡Fallo! "; break;
        case 'blocked': finalMessage += "¡Bloqueado! "; break;
        case 'countered': finalMessage += "¡Contraatacado! "; break;
        case 'invalid': finalMessage += "¡Defensa Inválida! "; break;
        default: finalMessage += "Resultado: "; break;
    }
    finalMessage += defenderDamageMessage + " " + attackerDamageMessage; // Append damage details
    if (gameOver) { finalMessage += ` *** ¡Combate Terminado! ***`; }

     // --- DEBUG: Log final decision ---
     // console.log(`[DEBUG Final] Outcome: ${rollOutcome}, DmgToDefender: ${damageToDefender}, DmgToDefenderPA: ${damageToDefenderPA}, DmgToAttacker: ${damageToAttacker}`);
     // console.log(`--- Defensa Finalizada ---`); // Removed debug logs

    // --- Create ONE Event Object ---
    const resolutionEvent = {
        id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace('_', ' ')} vs ${defenseType}`, // Replace underscore for display
        rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax,
        defenseType: defenseType, rollOutcome: rollOutcome,
        finalMessage: finalMessage.trim(), gameOver: gameOver
    };

    // --- Update Arena Display ---
    logMessage(finalMessage); // Log the final outcome
    setArenaEvent(resolutionEvent); // Update display ONCE

    // --- Delay and Pass Turn ---
    if (!gameOver) {
        console.log("[DEBUG] Juego NO terminado. Esperando y cambiando turno...");
        await delay(2500); // Wait
        const actionJustFinished = actionState.type;
        const actionTypeForHistory = actionJustFinished.toLowerCase().startsWith('atrapar_') ? 'atrapar' : actionJustFinished.toLowerCase();
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    } else { console.log("[DEBUG] Juego TERMINADO."); if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); } }
  }; // End of handleDefenseSelection


  // Function to handle selection of 'Atrapar' follow-up option
  const handleAtraparFollowupSelect = (optionId) => {
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
