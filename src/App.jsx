import './App.css'
import { useState, useEffect } from 'react'
// Asegúrate que las rutas a tus componentes sean correctas
import PlayerArea from './components/PlayerArea'
import GameLog from './components/GameLog'
import ArenaDisplay from './components/ArenaDisplay'

// Initial character data - Added combo_velocidad_luz and its usage flag
const initialPlayer1Data = {
  id: 'seiya_v2',
  name: 'SEIYA DE PEGASO II',
  stats: {
    pv_max: 230, pa_max: 300, pc_max: 500,
    currentPV: 230, currentPA: 300, currentPC: 500,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    concentrationLevel: 0, // 0: None, 1: Concentrated, 2: Double Concentrated
    lastActionType: null,
    fortalezaAvailable: false,
    fortalezaUsedThisCombat: false,
    agilidadAvailable: false,
    agilidadUsedThisCombat: false,
    destrezaAvailable: false,
    destrezaUsedThisCombat: false,
    lanzamientosSucesivosUsedThisCombat: false,
    resistenciaAvailable: false,
    resistenciaUsedThisCombat: false,
    // --- Combo Velocidad Luz State ---
    comboVelocidadLuzUsedThisCombat: false,
  },
  defenseRanges: {
    esquivar: [8, 20],
    bloquear: [8, 20],
    contraatacar: [13, 20],
  },
  actions: {
    golpe: 50,
    llave: 60,
    salto: 80, // Requires level 1
    velocidad_luz: 50, // Requires level 1 (also base for combo_velocidad_luz)
    embestir: 70,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true,
    combo: true, // Requires level 1
    engaño: true, // Requires level 1
    fortaleza: true,
    agilidad: true,
    destreza: true,
    lanzamientos_sucesivos: true, // Requires level 1
    resistencia: true,
    // --- New Action ---
    combo_velocidad_luz: true, // Requires level 2
  },
  powers: [ { id: 'P001', name: 'Meteoros de Pegaso', cost: 100, type: ['RMult'], details: '5-8 golpes x 20 Ptos Daño' }, { id: 'P002', name: 'Vuelo del Pegaso', cost: 100, type: ['LL'], damage: 100 }, { id: 'P003', name: 'Cometa Pegaso', cost: 200, type: ['R'], damage: 190, effects: '-1 Esq/-1 Bloq' }, ],
  bonuses: { pasivos: ['+2 Esq', '+1 ContrAtq', '+2 7º Sent', '+10 Dmg Salto/VelLuz/Embestir', '+1 Percep'], activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'], },
  statusEffects: [],
  supportRanges: { percepcion: [16, 20], septimo_sentido: [17, 20], puntos_vitales: [17, 20], romper: [11, 20], ayuda: [12, 20], },
};

const initialPlayer2Data = {
  id: 'shiryu_v1',
  name: 'SHIRYU DE DRAGON',
  stats: {
    pv_max: 280, pa_max: 300, pc_max: 400,
    currentPV: 280, currentPA: 300, currentPC: 400,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    concentrationLevel: 0, // 0: None, 1: Concentrated, 2: Double Concentrated
    lastActionType: null,
    fortalezaAvailable: false,
    fortalezaUsedThisCombat: false,
    agilidadAvailable: false,
    agilidadUsedThisCombat: false,
    destrezaAvailable: false,
    destrezaUsedThisCombat: false,
    lanzamientosSucesivosUsedThisCombat: false,
    resistenciaAvailable: false,
    resistenciaUsedThisCombat: false,
    // --- Combo Velocidad Luz State ---
    comboVelocidadLuzUsedThisCombat: false,
  },
  defenseRanges: {
    esquivar: [10, 20],
    bloquear: [6, 20],
    contraatacar: [14, 20],
  },
  actions: {
    golpe: 60,
    llave: 60,
    salto: 70, // Requires level 1
    velocidad_luz: 50, // Requires level 1 (also base for combo_velocidad_luz)
    embestir: 60,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    romper: true,
    atrapar: true,
    concentracion: true,
    combo: true, // Requires level 1
    engaño: true, // Requires level 1
    fortaleza: true,
    agilidad: true,
    destreza: true,
    lanzamientos_sucesivos: true, // Requires level 1
    resistencia: true,
    // --- New Action ---
    combo_velocidad_luz: true, // Requires level 2
  },
  powers: [ { id: 'S001', name: 'Patada Dragón', cost: 50, type: ['R'], damage: 40, details: '+10 Dmg Salto stack' }, { id: 'S002', name: 'Dragón Volador', cost: 50, type: ['R', 'G'], damage: 70 }, { id: 'S003', name: 'Rozan Ryuu Hi Shou', cost: 100, type: ['R', 'G'], damage: 100, details: 'Weak Point on Counter' }, { id: 'S004', name: 'Cien Dragones de Rozan', cost: 200, type: ['RB', 'G'], damage: 160, effects: '-3 Bloquear' }, { id: 'S005', name: 'Último Dragón', cost: 200, type: ['LL'], damage: 200, details: 'Self-dmg 120, 1 use' }, { id: 'S006', name: 'Excalibur', cost: 100, type: ['R', 'RArm', 'M'], damage: 100, details: 'Ignore Def Bonus, Destroys Armor on 1-2' }, ],
  bonuses: { pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+10 Dmg Golpe (ARM)'], activos: ['+2 Ayuda (aliados)', '+2 Int Div', 'Valentía del Dragón', 'Armadura Divina'], flags: ['ESC', 'ARM'] },
  statusEffects: [],
  supportRanges: { percepcion: [15, 20], septimo_sentido: [19, 20], puntos_vitales: [17, 20], romper: [11, 20], ayuda: [12, 20], },
};

// Follow-up options for 'Atrapar' (unchanged)
const atraparFollowupOptions = [
  { id: 'atrapar_op1', name: 'Golpes Múltiples (3x20 Daño, Impares)' },
  { id: 'atrapar_op2', name: 'Ataque Potente (80 Daño, Solo Bloquear)' },
  { id: 'atrapar_op3', name: 'Ataques Rápidos (3x20 Daño, Bloqueable)' },
  { id: 'atrapar_op4', name: 'Ataque Vulnerante (60 Daño, -2 Def)' },
  { id: 'atrapar_op5', name: 'Llave Mejorada (+3 Bono)' },
  { id: 'atrapar_op6', name: 'Romper Mejorado (+4 Bono)' },
  { id: 'atrapar_op7', name: 'Ataque Imbloqueable (60 Daño, Solo Esquivar)' },
];

// --- Helper function to check concentration requirements ---
const getActionConcentrationRequirement = (actionName) => {
    const level1Actions = ['velocidad_luz', 'salto', 'combo', 'engaño', 'lanzamientos_sucesivos'];
    // --- Define actions requiring level 2 here ---
    const level2Actions = ['combo_velocidad_luz']; // Added the new combo

    if (level2Actions.includes(actionName)) return 2;
    if (level1Actions.includes(actionName)) return 1;
    return 0; // No concentration required
};


function App() {
  // State for player data
  const [player1Data, setPlayer1Data] = useState(JSON.parse(JSON.stringify(initialPlayer1Data)));
  const [player2Data, setPlayer2Data] = useState(JSON.parse(JSON.stringify(initialPlayer2Data)));

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
  const logMessage = (message) => {
      console.log(message);
      setGameLog(prevLog => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLog].slice(0, 50));
  };

   // Function to create a delay (Promise-based)
   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper function to apply damage to a player (unchanged)
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
    setTargetData(prevData => ({
        ...prevData,
        stats: {
            ...prevData.stats,
            currentPV: finalPV,
            currentPA: finalPA
        }
    }));
    logMessage(`${targetData.name} - PV: ${finalPV}/${targetData.stats.pv_max}, PA: ${finalPA}/${targetData.stats.pa_max}`);
    if (isGameOver) { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    return isGameOver;
  };

  // Function to restart the game - Resets concentrationLevel and combo usage
  const handlePlayAgain = () => {
    logMessage("Reiniciando el juego...");
    // Reset player data including concentrationLevel and combo usage flags
    const resetPlayer1 = JSON.parse(JSON.stringify(initialPlayer1Data));
    const resetPlayer2 = JSON.parse(JSON.stringify(initialPlayer2Data));
    resetPlayer1.stats.concentrationLevel = 0;
    resetPlayer1.stats.comboVelocidadLuzUsedThisCombat = false; // Reset flag
    resetPlayer2.stats.concentrationLevel = 0;
    resetPlayer2.stats.comboVelocidadLuzUsedThisCombat = false; // Reset flag

    setPlayer1Data(resetPlayer1);
    setPlayer2Data(resetPlayer2);
    setCurrentPlayerId(initialPlayer1Data.id);
    setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
    setGameLog([]);
    setArenaEvent(null);
  };

  // Helper function to resolve the 'Llave' action (unchanged)
  const resolveLlaveAction = (attacker, defender, additionalBonus = 0) => {
    logMessage(`Resolviendo Llave [Bono Atacante: +${additionalBonus}]...`);
    let attackerRoll = 0, defenderRoll = 0, ties = 0;
    let currentDamage = attacker.actions.llave;
    let winnerId = null, loserId = null;
    let llaveGameOver = false;

    while (ties < 3) {
      const attackerBaseRoll = rollD20();
      const defenderBaseRoll = rollD20();
      const totalAttackerBonus = 2 + additionalBonus;
      let totalDefenderBonus = 0;

      attackerRoll = attackerBaseRoll + totalAttackerBonus;
      defenderRoll = defenderBaseRoll + totalDefenderBonus;

      logMessage(`Tirada Llave: ${attacker.name} (${attackerBaseRoll}+${totalAttackerBonus}=${attackerRoll}) vs ${defender.name} (${defenderBaseRoll}+${totalDefenderBonus}=${defenderRoll})`);

      if (attackerRoll > defenderRoll) { winnerId = attacker.id; loserId = defender.id; logMessage(`${attacker.name} gana la llave!`); break; }
      else if (defenderRoll > attackerRoll) { winnerId = defender.id; loserId = attacker.id; logMessage(`${defender.name} gana la llave!`); break; }
      else { ties++; if (ties < 3) { currentDamage += 10; logMessage(`¡Empate ${ties}! Forcejeo... Daño aumenta a ${currentDamage}. Volviendo a tirar...`); }
        else { logMessage("¡Empate por tercera vez! La llave se anula."); winnerId = null; break; }
      }
    }
    if (winnerId && loserId) {
      const winnerData = winnerId === player1Data.id ? player1Data : player2Data;
      const loserData = loserId === player1Data.id ? player1Data : player2Data;
      llaveGameOver = applyDamage(loserId, currentDamage);
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', winnerName: winnerData.name, loserName: loserData.name, damage: currentDamage, message: `${winnerData.name} gana (${attackerRoll} vs ${defenderRoll}). ${loserData.name} recibe ${currentDamage} daño.` });
    } else { setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', outcome: 'tie', message: `¡Empate final en Llave (${attackerRoll} vs ${defenderRoll})! La llave se anula.` }); }
    return llaveGameOver;
  };

  // Helper function to resolve 'Romper' attempts (unchanged)
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

  // Helper function to resolve a single throw in Lanzamientos Sucesivos (unchanged)
  const resolveSingleLanzamiento = (attacker, defender, throwNumber, baseAttackerBonus = 0) => {
      logMessage(`--- Resolviendo Lanzamiento #${throwNumber} (Bono Base Atacante: +${baseAttackerBonus}) ---`);
      const baseDamage = 40;
      let currentDamage = baseDamage;
      let ties = 0;
      let winnerId = null;
      let loserId = null;
      let finalAttackerRoll = 0;
      let finalDefenderRoll = 0;
      let singleThrowGameOver = false;

      while (ties < 3) {
          const attackerBaseRoll = rollD20();
          const defenderBaseRoll = rollD20();
          const attackerRollBonus = throwNumber + baseAttackerBonus;
          let defenderRollBonus = 0;

          const attackerRoll = attackerBaseRoll + attackerRollBonus;
          const defenderRoll = defenderBaseRoll + defenderRollBonus;
          finalAttackerRoll = attackerRoll;
          finalDefenderRoll = defenderRoll;

          logMessage(`Tirada Lanzamiento #${throwNumber}: ${attacker.name} (${attackerBaseRoll}+${attackerRollBonus}=${attackerRoll}) vs ${defender.name} (${defenderBaseRoll}+${defenderRollBonus}=${defenderRoll})`);

          if (attackerRoll > defenderRoll) {
              winnerId = attacker.id; loserId = defender.id;
              logMessage(`${attacker.name} gana el lanzamiento #${throwNumber}!`); break;
          } else if (defenderRoll > attackerRoll) {
              winnerId = defender.id; loserId = attacker.id;
              logMessage(`${defender.name} gana el lanzamiento #${throwNumber}!`); break;
          } else {
              ties++;
              if (ties < 3) {
                  currentDamage += 10;
                  logMessage(`¡Empate ${ties}! Forcejeo... Daño para este lanzamiento aumenta a ${currentDamage}. Volviendo a tirar...`);
              } else {
                  logMessage(`¡Empate por tercera vez en Lanzamiento #${throwNumber}! El lanzamiento se anula.`);
                  winnerId = null; break;
              }
          }
      }

      let message = "";
      let damageDealt = 0;

      if (winnerId) {
          const winnerData = winnerId === player1Data.id ? player1Data : player2Data;
          const loserData = loserId === player1Data.id ? player1Data : player2Data;
          damageDealt = currentDamage;
          singleThrowGameOver = applyDamage(loserId, damageDealt);
          message = `${winnerData.name} gana Lanzamiento #${throwNumber} (${finalAttackerRoll} vs ${finalDefenderRoll}). ${loserData.name} recibe ${damageDealt} daño.`;
          logMessage(message);
      } else {
          message = `Lanzamiento #${throwNumber} anulado por triple empate (${finalAttackerRoll} vs ${finalDefenderRoll}).`;
          logMessage(message);
      }

      setArenaEvent({
          id: Date.now(), type: 'action_effect', actionName: `Lanzamiento #${throwNumber}`,
          winnerName: winnerId ? (winnerId === player1Data.id ? player1Data.name : player2Data.name) : 'Nadie',
          loserName: loserId ? (loserId === player1Data.id ? player1Data.name : player2Data.name) : 'Nadie',
          damage: damageDealt,
          outcome: winnerId ? (winnerId === attacker.id ? 'attacker_wins' : 'defender_wins') : 'tie_nullified',
          message: message
      });

      return { winnerId, loserId, damageDealt, gameOver: singleThrowGameOver };
  };

  // Helper function to orchestrate Lanzamientos Sucesivos (unchanged)
  const resolveLanzamientoSucesivo = async (attacker, defender, initialBonus = 0) => {
      logMessage(`¡${attacker.name} inicia Lanzamientos Sucesivos contra ${defender.name}! ${initialBonus > 0 ? '(Con Resistencia +2)' : ''}`);
      let overallGameOver = false;
      let totalDamageToDefender = 0;
      let totalDamageToAttacker = 0;

      for (let throwNumber = 1; throwNumber <= 3; throwNumber++) {
          if (overallGameOver) break;
          const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;
          const throwResult = await resolveSingleLanzamiento(attacker, currentDefenderData, throwNumber, initialBonus);
          overallGameOver = throwResult.gameOver;

          if (throwResult.winnerId === attacker.id) {
              totalDamageToDefender += throwResult.damageDealt;
          } else if (throwResult.winnerId === defender.id) {
              totalDamageToAttacker += throwResult.damageDealt;
              logMessage(`¡${defender.name} detiene los Lanzamientos Sucesivos!`);
              break;
          }

          if (throwNumber < 3 && !overallGameOver && throwResult.winnerId !== defender.id) {
              logMessage("Preparando siguiente lanzamiento...");
              await delay(2000);
          }
      }

      logMessage(`Lanzamientos Sucesivos finalizados. Daño total a ${defender.name}: ${totalDamageToDefender}. Daño total a ${attacker.name}: ${totalDamageToAttacker}.`);
      setArenaEvent({
          id: Date.now() + 1,
          type: 'action_effect', actionName: 'Fin Lanzamientos Sucesivos',
          message: `Secuencia terminada. Daño total - ${defender.name}: ${totalDamageToDefender}, ${attacker.name}: ${totalDamageToAttacker}.`
      });
      await delay(1000);

      return overallGameOver;
  };


  // Function to handle the initiation of an action - UPDATED for combo_velocidad_luz
  const handleActionInitiate = async (actionName) => {
    if (actionState.active && actionState.stage !== null) {
        logMessage("No se puede iniciar acción mientras otra está activa.");
        return;
    }
    const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
    const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;
    const setAttackerData = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;

    // --- Concentration Check ---
    const requiredConcentration = getActionConcentrationRequirement(actionName);
    if (requiredConcentration > 0 && attacker.stats.concentrationLevel < requiredConcentration) {
        logMessage(`! ${attacker.name} necesita Concentración Nivel ${requiredConcentration} para usar ${actionName}! (Nivel actual: ${attacker.stats.concentrationLevel})`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración Nivel ${requiredConcentration} para ${actionName}!` });
        return;
    }

    // --- Alternation Check (CORRECTED) ---
    const isAlternationAction = ['llave', 'romper', 'presa', 'destrozar', /*'concentracion',*/ 'fortaleza', 'agilidad', 'destreza', 'lanzamientos_sucesivos', 'resistencia'].includes(actionName);
    if (isAlternationAction && attacker.stats.lastActionType === actionName) {
        logMessage(`¡Regla de Alternancia! No se puede usar ${actionName} dos veces seguidas.`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡No puedes usar ${actionName} consecutivamente!` });
        return;
    }

    // --- Consume Concentration (if action requires it) ---
    let concentrationConsumed = false;
    if (requiredConcentration > 0) {
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: 0 } }));
        logMessage(`${attacker.name} usa su concentración (Nivel ${requiredConcentration}) para ${actionName}. Nivel reseteado a 0.`);
        concentrationConsumed = true;
    }


    // --- Action Specific Logic ---

    // --- Concentracion Action ---
    if (actionName === 'concentracion') {
        const currentLevel = attacker.stats.concentrationLevel;
        if (currentLevel >= 2) {
            logMessage(`Error: ${attacker.name} ya está en el nivel máximo de concentración (Nivel 2).`);
            return;
        }
        const nextLevel = currentLevel + 1;
        logMessage(`${attacker.name} usa Concentración. Nivel aumentado a ${nextLevel}.`);
        setAttackerData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                concentrationLevel: nextLevel,
                lastActionType: 'concentracion'
            }
        }));
        setArenaEvent({
            id: Date.now(),
            type: 'action_effect',
            actionName: 'Concentración',
            attackerName: attacker.name,
            message: `${attacker.name} se concentra intensamente... ¡Nivel ${nextLevel} alcanzado!`
        });
        // End turn immediately
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }

    // --- Combo a Velocidad Luz Action ---
    else if (actionName === 'combo_velocidad_luz') {
        logMessage(`${attacker.name} inicia ¡Combo a Velocidad Luz!`);
        // Check usage limit
        if (attacker.stats.comboVelocidadLuzUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó ${actionName.replace(/_/g,' ')} en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${actionName.replace(/_/g,' ')} solo se puede usar una vez por combate!` });
            // Restore concentration if it was consumed mistakenly
            if (concentrationConsumed) {
                 setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: requiredConcentration } }));
                 logMessage(`Concentración restaurada a Nivel ${requiredConcentration} debido a acción inválida.`);
            }
            return;
        }
        // Mark as used this combat
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, comboVelocidadLuzUsedThisCombat: true } }));
        // Concentration already consumed above

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo Vel. Luz - Golpe 1', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe del combo a velocidad luz!` });
        // Set action state to await defense for the first hit
        setActionState({
            active: true,
            type: 'ComboVelocidadLuz', // Specific type for this combo
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            currentComboHit: 1,
            allowedDefenses: ['esquivar', 'bloquear'], // Cannot be countered
            comboHitsLanded: 0 // Track successful hits if needed later
        });
        return; // Wait for defense selection
    }

    // --- Other Actions ---
    // (The rest of the 'else if' blocks remain the same)
    else if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        logMessage(`${attacker.name} inicia Acción: ${actionName}!`);
        const displayActionName = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_',' ');
        const actionStateType = actionName.charAt(0).toUpperCase() + actionName.slice(1);
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: displayActionName, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} usa ${displayActionName} contra ${defender.name}!` });
        let allowedDefensesForAction = null; if (actionName === 'velocidad_luz') { allowedDefensesForAction = ['esquivar', 'bloquear']; }
        setActionState({ active: true, type: actionStateType, attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', allowedDefenses: allowedDefensesForAction });
        return;
    } else if (actionName === 'llave') {
        if (attacker.stats.resistenciaAvailable) {
            logMessage(`${attacker.name} tiene Resistencia disponible para Llave. Presentando opción...`);
            setActionState({ active: true, type: 'llave', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿quieres usar tu bono de Resistencia (+2) para esta Llave?` });
        } else {
            logMessage(`${attacker.name} intenta una Llave normal contra ${defender.name}!`);
            const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;
            const gameOver = resolveLlaveAction(attacker, currentDefenderData, 0);
            if (!gameOver) {
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
                setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
        }
        return;
    } else if (actionName === 'lanzamientos_sucesivos') {
        logMessage(`${attacker.name} intenta Lanzamientos Sucesivos.`);
        if (attacker.stats.lanzamientosSucesivosUsedThisCombat) { logMessage(`¡${attacker.name} ya usó ${actionName} en este combate!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${actionName.replace('_', ' ')} solo se puede usar una vez por combate!` }); return; }
        if (attacker.stats.resistenciaAvailable) {
            logMessage(`${attacker.name} tiene Resistencia disponible para Lanzamientos Sucesivos. Presentando opción...`);
            setActionState({ active: true, type: 'lanzamientos_sucesivos', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿quieres usar tu bono de Resistencia (+2) para estos Lanzamientos?` });
        } else {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lanzamientosSucesivosUsedThisCombat: true } }));
            const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;
            const gameOver = await resolveLanzamientoSucesivo(attacker, currentDefenderData, 0);
            if (!gameOver && actionState.stage !== 'game_over') {
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
                setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
        }
        return;
    }
    else if (actionName === 'presa' || actionName === 'destrozar') {
        const isPresa = actionName === 'presa'; const damageTarget = isPresa ? 'PV' : 'PA'; const damageType = isPresa ? 'directPV' : 'directPA'; logMessage(`${attacker.name} intenta ${actionName} contra ${defender.name}!`);
        if (!isPresa && defender.stats.currentPA <= 0) { logMessage(`No se puede usar Destrozar, la armadura de ${defender.name} ya está rota!`); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destrozar', outcome: 'no_armor', message: `¡La armadura de ${defender.name} ya está rota!` }); return; }
        let totalDamageAccumulated = 0, successfulHits = 0, successfulRolls = [], lastRoll = null, gameOver = false;
        const maxHits = attacker.actions[actionName]?.maxHits || 3; const damagePerHit = attacker.actions[actionName]?.damagePerHit || 15;
        for (let i = 0; i < maxHits; i++) { const roll = rollD20(); lastRoll = roll; const isOdd = roll % 2 !== 0; if (isOdd) { successfulHits++; totalDamageAccumulated += damagePerHit; successfulRolls.push(roll); logMessage(`Tirada ${i + 1}: ${roll} (Impar!) - +${damagePerHit} Daño ${damageTarget} (Total: ${totalDamageAccumulated})`); } else { logMessage(`Tirada ${i + 1}: ${roll} (Par!) - Intento ${i+1} de ${actionName} fallido.`); } } logMessage(`Intentos de ${actionName} finalizados. Golpes exitosos: ${successfulHits}`);
        if (totalDamageAccumulated > 0) { logMessage(`Daño total de ${actionName}: ${totalDamageAccumulated} directo a ${damageTarget}.`); gameOver = applyDamage(defender.id, totalDamageAccumulated, damageType); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, damage: totalDamageAccumulated, hits: successfulHits, successfulRolls: successfulRolls, message: `${attacker.name} asesta ${successfulHits} golpes (Tiradas: ${successfulRolls.join(', ')}). ${defender.name} recibe ${totalDamageAccumulated} daño a ${damageTarget}.` }); }
        else { logMessage(`${actionName} no hizo daño.`); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, outcome: 'failed', message: `${attacker.name} falla ${actionName} (Última Tirada: ${lastRoll})` }); }
        if (!gameOver) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
            setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    } else if (actionName === 'romper') {
        logMessage(`${attacker.name} inicia acción Romper.`); const canBreakAnyPart = ['arms', 'legs', 'ribs'].some(part => defender.stats.brokenParts[part] < 2);
        if (!canBreakAnyPart) { logMessage(`¡Todas las partes de ${defender.name} ya están rotas 2 veces! No se puede usar Romper.`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` }); return; }
        setActionState({ active: true, type: 'Romper', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_romper_target', allowedDefenses: null }); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper', message: `${attacker.name} se prepara para Romper... ¿Qué parte atacará?` });
        return;
    } else if (actionName === 'atrapar') {
        logMessage(`${attacker.name} intenta Atrapar a ${defender.name}!`); const roll = rollD20(); const bonus = attacker.stats.atrapar_bonus || 0; const finalRoll = roll + bonus; const targetRange = [11, 20]; logMessage(`${attacker.name} tiró ${roll}${bonus !== 0 ? ` + ${bonus}` : ''} = ${finalRoll} (Necesita ${targetRange[0]}-${targetRange[1]})`);
        if (finalRoll >= targetRange[0] && finalRoll <= targetRange[1]) {
             logMessage("¡Rival atrapado!");
             setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'success', message: `${attacker.name} atrapa a ${defender.name} (Tirada: ${finalRoll}). ¡Elige una opción de ataque!` });
             setActionState({ active: true, type: 'Atrapar', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_followup', allowedDefenses: null });
        } else {
             logMessage("¡Atrapar falló!");
             setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla al atrapar a ${defender.name} (Tirada: ${finalRoll})` });
             setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
             setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'combo') {
        logMessage(`${attacker.name} inicia Acción: ¡Combo!`);
        const firstHitPenalty = 0;
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo - Golpe 1', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe del combo!` });
        setActionState({ active: true, type: 'Combo', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, currentDefensePenalty: firstHitPenalty, allowedDefenses: null, comboHitsLanded: 0 });
        return;
    } else if (actionName === 'engaño') {
        logMessage(`${attacker.name} inicia Acción: ¡Engaño!`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Engaño - Ataque Falso', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza un ataque falso (+2 Esq. para ${defender.name})!` });
        setActionState({ active: true, type: 'Engaño', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense_part_1', allowedDefenses: null });
        return;
    }
    else if (actionName === 'fortaleza') {
        logMessage(`${attacker.name} usa Fortaleza.`);
        if (attacker.stats.fortalezaUsedThisCombat) { logMessage(`¡${attacker.name} ya usó Fortaleza en este combate!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Fortaleza solo se puede usar una vez por combate!` }); return; }
        if (attacker.stats.fortalezaAvailable) { logMessage(`¡${attacker.name} ya tiene el bono de Fortaleza activo!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de Fortaleza preparado!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, fortalezaAvailable: true, fortalezaUsedThisCombat: true, }, lastActionType: 'fortaleza' }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Fortaleza Activada', attackerName: attacker.name, message: `¡${attacker.name} activa Fortaleza! Bono +3 a Bloquear disponible.` });
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    } else if (actionName === 'agilidad') {
        logMessage(`${attacker.name} usa Agilidad.`);
        if (attacker.stats.agilidadUsedThisCombat) { logMessage(`¡${attacker.name} ya usó Agilidad en este combate!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Agilidad solo se puede usar una vez por combate!` }); return; }
        if (attacker.stats.agilidadAvailable) { logMessage(`¡${attacker.name} ya tiene el bono de Agilidad activo!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de Agilidad preparado!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, agilidadAvailable: true, agilidadUsedThisCombat: true, }, lastActionType: 'agilidad' }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Agilidad Activada', attackerName: attacker.name, message: `¡${attacker.name} activa Agilidad! Bono +3 a Esquivar disponible.` });
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    } else if (actionName === 'destreza') {
        logMessage(`${attacker.name} usa Destreza.`);
        if (attacker.stats.destrezaUsedThisCombat) { logMessage(`¡${attacker.name} ya usó Destreza en este combate!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Destreza solo se puede usar una vez por combate!` }); return; }
        if (attacker.stats.destrezaAvailable) { logMessage(`¡${attacker.name} ya tiene el bono de Destreza activo!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de Destreza preparado!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, destrezaAvailable: true, destrezaUsedThisCombat: true, }, lastActionType: 'destreza' }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destreza Activada', attackerName: attacker.name, message: `¡${attacker.name} activa Destreza! Bono +2 a Contraatacar disponible.` });
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    } else if (actionName === 'resistencia') {
        logMessage(`${attacker.name} usa Resistencia.`);
        if (attacker.stats.resistenciaUsedThisCombat) { logMessage(`¡${attacker.name} ya usó Resistencia en este combate!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Resistencia solo se puede usar una vez por combate!` }); return; }
        if (attacker.stats.resistenciaAvailable) { logMessage(`¡${attacker.name} ya tiene el bono de Resistencia activo!`); setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de Resistencia preparado!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, resistenciaAvailable: true, resistenciaUsedThisCombat: true, }, lastActionType: 'resistencia' }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Resistencia Activada', attackerName: attacker.name, message: `¡${attacker.name} activa Resistencia! Bono +2 a Ataque de Llave disponible.` });
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else {
        logMessage(`Acción ${actionName} no implementada o reconocida.`);
        if (!actionState.active) {
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
    }
  };

  // --- Handler for Resistencia Choice --- (unchanged)
  const handleResistenciaChoice = async (actionName, useBonus) => {
    if (!actionState.active || actionState.stage !== 'awaiting_resistencia_choice' || actionState.attackerId !== currentPlayerId) {
      logMessage("Estado inválido para elegir uso de Resistencia.");
      return;
    }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;

    let bonusValue = 0;
    if (useBonus) {
        if (attacker.stats.resistenciaAvailable) {
            logMessage(`${attacker.name} elige usar Resistencia (+2) para ${actionName.replace('_', ' ')}.`);
            bonusValue = 2;
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, resistenciaAvailable: false } }));
        } else {
            logMessage(`¡ERROR! ${attacker.name} intentó usar Resistencia pero no estaba disponible.`);
        }
    } else {
        logMessage(`${attacker.name} elige NO usar Resistencia para ${actionName.replace('_', ' ')}.`);
    }

    let gameOver = false;
    if (actionName === 'llave') {
        gameOver = resolveLlaveAction(attacker, currentDefenderData, bonusValue);
        if (!gameOver) {
             setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'llave' } }));
        }
    } else if (actionName === 'lanzamientos_sucesivos') {
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lanzamientosSucesivosUsedThisCombat: true } }));
        gameOver = await resolveLanzamientoSucesivo(attacker, currentDefenderData, bonusValue);
        if (!gameOver) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'lanzamientos_sucesivos' } }));
        }
    }

    if (!gameOver && actionState.stage !== 'game_over') {
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    }
  };


  // --- handleDefenseSelection - UPDATED for ComboVelocidadLuz ---
  const handleDefenseSelection = async (defenseType) => {
    if (!actionState.active || !actionState.stage?.startsWith('awaiting_defense') || !actionState.attackerId || !actionState.defenderId) { logMessage("Estado inválido para selección de defensa."); return; }
    const attackerId = actionState.attackerId; const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data; const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data; const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const actionType = actionState.type; // e.g., 'ComboVelocidadLuz', 'Golpe', 'Engaño'
    const currentStage = actionState.stage;
    const baseDefenseType = defenseType.startsWith('esquivar') ? 'esquivar' :
                           defenseType.startsWith('bloquear') ? 'bloquear' :
                           defenseType.startsWith('contraatacar') ? 'contraatacar' : defenseType;

    // Check if selected defense is allowed for the current action/stage
    if (actionState.allowedDefenses && !actionState.allowedDefenses.includes(baseDefenseType)) {
        logMessage(`¡Defensa inválida! ${baseDefenseType} no está permitido contra ${actionType} (Fase: ${currentStage}).`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${baseDefenseType} no permitido contra ${actionType}!` });
        return; // Don't proceed if defense is invalid
    }

    logMessage(`${defender.name} elige defenderse con: ${defenseType}`);
    const roll = rollD20();
    let defenseSuccessful = false, damageToDefender = 0, damageToDefenderPA = 0, damageToAttacker = 0;
    let gameOver = false, rollOutcome = 'failure', targetMin = null, targetMax = null;
    let defenseBonusOrPenaltyText = '', baseDamage = 0;
    let usingFortaleza = defenseType === 'bloquear_fortaleza';
    let usingAgilidad = defenseType === 'esquivar_agilidad';
    let usingDestreza = defenseType === 'contraatacar_destreza';

    console.log(`[DEBUG] Resolviendo ${actionType} (${currentStage}) con defensa ${defenseType}. Tirada: ${roll}`);

    // Apply defense bonuses/penalties and consume boosts
    if (usingFortaleza) {
        if (!defender.stats.fortalezaAvailable) { logMessage(`¡ERROR! ${defender.name} intentó usar Fortaleza pero no estaba disponible.`); usingFortaleza = false; }
        else { logMessage(`¡${defender.name} usa el bono de Fortaleza (+3 Bloquear)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, fortalezaAvailable: false } })); defenseBonusOrPenaltyText = '(+3 Fortaleza)'; }
    }
    if (usingAgilidad) {
        if (!defender.stats.agilidadAvailable) { logMessage(`¡ERROR! ${defender.name} intentó usar Agilidad pero no estaba disponible.`); usingAgilidad = false; }
        else { logMessage(`¡${defender.name} usa el bono de Agilidad (+3 Esquivar)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, agilidadAvailable: false } })); defenseBonusOrPenaltyText = '(+3 Agilidad)'; }
    }
    if (usingDestreza) {
        if (!defender.stats.destrezaAvailable) { logMessage(`¡ERROR! ${defender.name} intentó usar Destreza pero no estaba disponible.`); usingDestreza = false; }
        else { logMessage(`¡${defender.name} usa el bono de Destreza (+2 Contraatacar)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, destrezaAvailable: false } })); defenseBonusOrPenaltyText = '(+2 Destreza)'; }
    }

    // Determine base damage for the action
    const actionKey = actionType.toLowerCase().replace('_opcion', '_op'); // Normalize action key
    if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') baseDamage = 20;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') baseDamage = 50;
    else if (actionType === 'Salto') baseDamage = attacker.actions.salto || 70;
    else if (actionType === 'Velocidad_luz') baseDamage = attacker.actions.velocidad_luz || 50;
    else if (actionType === 'Combo') baseDamage = attacker.actions.golpe;
    else if (actionType === 'ComboVelocidadLuz') baseDamage = attacker.actions.velocidad_luz || 50; // Use velocidad_luz damage
    else if (actionType.startsWith('Atrapar_')) baseDamage = actionState.baseDamage || 0;
    else baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || 0;

    // --- Resolve Defense based on Action Type ---

    if (actionType === 'Engaño') {
        // (Engaño logic remains the same)
        if (currentStage === 'awaiting_defense_part_1') {
            logMessage("--- Resolviendo Engaño: Ataque Falso ---");
            baseDamage = 20;
            if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
            else if (baseDefenseType === 'esquivar') {
                let [min, max] = defender.defenseRanges.esquivar; let bonus = 2; if(usingAgilidad) bonus += 3;
                targetMin = Math.max(1, min - bonus); targetMax = max; defenseBonusOrPenaltyText = `(+${bonus} Esq.)`;
                if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            }
            else if (baseDefenseType === 'bloquear') {
                let [min, max] = defender.defenseRanges.bloquear; let bonus = usingFortaleza ? 3 : 0;
                targetMin = Math.max(1, min - bonus); targetMax = max; defenseBonusOrPenaltyText = usingFortaleza ? '(+3 Fortaleza)' : '';
                if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            }
            else if (baseDefenseType === 'contraatacar') {
                let [min, max] = defender.defenseRanges.contraatacar; let bonus = usingDestreza ? 2 : 0;
                targetMin = Math.max(1, min - bonus); targetMax = max; defenseBonusOrPenaltyText = usingDestreza ? '(+2 Destreza)' : '';
                if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            }

            let attackerDamageMessage = "", defenderDamageMessage = "";
            if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
            if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }
            let part1Message = `${defender.name} intenta ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')} ${defenseBonusOrPenaltyText} vs Ataque Falso. Tirada: ${roll}. `;
            if (targetMin !== null) { part1Message += `(Necesita ${targetMin}-${targetMax}). `; }
            switch (rollOutcome) { case 'success': part1Message += "¡Éxito Defendiendo! "; break; case 'failure': part1Message += "¡Fallo Defendiendo! "; break; case 'blocked': part1Message += "¡Bloqueado! "; break; case 'countered': part1Message += "¡Contraatacado! "; break; default: part1Message += "Resultado: "; break; }
            part1Message += defenderDamageMessage + " " + attackerDamageMessage;
            const part1Event = { id: Date.now(), type: 'defense_resolution', actionName: `Engaño Pt.1 vs ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: part1Message.trim(), gameOver: gameOver };
            setArenaEvent(part1Event); logMessage(part1Message); await delay(2000);

            if (!gameOver) {
                logMessage("--- Engaño: Preparando Ataque Real ---");
                setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense_part_2', allowedDefenses: ['bloquear'] }));
                setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Engaño - Ataque Real', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el ataque real! (${defender.name} solo puede Bloquear, -3 Penaliz.)` });
                return;
            } else {
                logMessage("[DEBUG] Juego TERMINADO durante Engaño Parte 1.");
                if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
                return;
            }
        }
        else if (currentStage === 'awaiting_defense_part_2') {
             baseDamage = 50;
             logMessage("--- Resolviendo Engaño: Ataque Real ---");
             defenseBonusOrPenaltyText = '(-3 Penaliz.)'; if (usingFortaleza) defenseBonusOrPenaltyText = '(+3 Fortaleza, -3 Penaliz.)';
             if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
             else if (baseDefenseType === 'bloquear') {
                 let [min, max] = defender.defenseRanges.bloquear; let penalty = 3; let bonus = usingFortaleza ? 3 : 0;
                 targetMin = Math.min(21, Math.max(1, min + penalty - bonus));
                 targetMax = max;
                 if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
             } else {
                 logMessage(`¡Defensa inválida (${defenseType})! El Ataque Real solo puede ser bloqueado.`);
                 defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'invalid'; targetMin=null; targetMax=null;
             }

             let attackerDamageMessage = "", defenderDamageMessage = "";
             if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }
             let part2Message = `${defender.name} intenta ${defenseType.replace('_fortaleza','')} ${defenseBonusOrPenaltyText} vs Ataque Real. Tirada: ${roll}. `;
             if (targetMin !== null) { part2Message += `(Necesita ${targetMin}-${targetMax}). `; }
             switch (rollOutcome) { case 'blocked': part2Message += "¡Bloqueado! "; break; case 'failure': part2Message += "¡Fallo! "; break; case 'invalid': part2Message += "¡Defensa Inválida! "; break; default: part2Message += "Resultado: "; break; }
             part2Message += defenderDamageMessage; if (gameOver) { part2Message += ` *** ¡Combate Terminado! ***`; }
             const part2Event = { id: Date.now(), type: 'defense_resolution', actionName: `Engaño Pt.2 vs ${defenseType.replace('_fortaleza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: part2Message.trim(), gameOver: gameOver };
             setArenaEvent(part2Event); logMessage(part2Message); await delay(1500);

             if (!gameOver) {
                 const actionTypeForHistory = 'engaño';
                 setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
                 setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                 const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                 setCurrentPlayerId(nextPlayerId);
                 logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
             } else {
                 console.log("[DEBUG] Juego TERMINADO durante Engaño Parte 2.");
                 if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
             }
             return;
        }
    }
    // --- Combo Action ---
    else if (actionType === 'Combo') {
        // (Combo logic remains the same)
        const currentHit = actionState.currentComboHit || 1;
        const currentPenalty = actionState.currentDefensePenalty || 0;
        baseDamage = attacker.actions.golpe;
        logMessage(`--- Resolviendo Combo: Golpe #${currentHit} (Penaliz. Def: -${currentPenalty}) ---`);
        defenseBonusOrPenaltyText = currentPenalty > 0 ? `(-${currentPenalty} Penaliz.)` : '';
        if(usingFortaleza) defenseBonusOrPenaltyText += ' (+3 Fortaleza)';
        if(usingAgilidad) defenseBonusOrPenaltyText += ' (+3 Agilidad)';
        if(usingDestreza) defenseBonusOrPenaltyText += ' (+2 Destreza)';

        if (roll === 1) { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; }
        else if (baseDefenseType === 'esquivar') {
            let [min, max] = defender.defenseRanges.esquivar; let bonus = usingAgilidad ? 3 : 0;
            targetMin = Math.min(21, min + currentPenalty - bonus); targetMax = max;
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
        else if (baseDefenseType === 'bloquear') {
            let [min, max] = defender.defenseRanges.bloquear; let bonus = usingFortaleza ? 3 : 0;
            targetMin = Math.min(21, Math.max(1, min + currentPenalty - bonus)); targetMax = max;
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToDefenderPA = 10; rollOutcome = 'blocked'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
        else if (baseDefenseType === 'contraatacar') {
            let [min, max] = defender.defenseRanges.contraatacar; let bonus = usingDestreza ? 2 : 0;
            targetMin = Math.min(21, Math.max(1, min + currentPenalty - bonus));
            targetMax = max;
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; damageToAttacker = Math.floor(defender.actions.golpe / 2); rollOutcome = 'countered'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }

        let attackerDamageMessage = "", defenderDamageMessage = "";
        if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
        if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }
        let hitMessage = `${defender.name} intenta ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')} ${defenseBonusOrPenaltyText} vs Combo Golpe #${currentHit}. Tirada: ${roll}. `;
        if (targetMin !== null) { hitMessage += `(Necesita ${targetMin}-${targetMax}). `; }
        switch (rollOutcome) { case 'success': hitMessage += "¡Éxito Defendiendo! "; break; case 'failure': hitMessage += "¡Fallo Defendiendo! "; break; case 'blocked': hitMessage += "¡Bloqueado! "; break; case 'countered': hitMessage += "¡Contraatacado! "; break; default: hitMessage += "Resultado: "; break; }
        hitMessage += defenderDamageMessage + " " + attackerDamageMessage;
        const hitEvent = { id: Date.now(), type: 'defense_resolution', actionName: `Combo Golpe #${currentHit} vs ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: hitMessage.trim(), gameOver: gameOver };
        setArenaEvent(hitEvent); logMessage(hitMessage); await delay(2000);

        if (defenseSuccessful || gameOver || currentHit >= 3) {
            let finalComboMessage = "";
            if (defenseSuccessful) { finalComboMessage = `¡${defender.name} detiene el combo en el golpe #${currentHit}!`; }
            else if (gameOver) { finalComboMessage = `¡El golpe #${currentHit} del combo derrota a ${defender.name}! ¡Combate Terminado!`; }
            else { finalComboMessage = `¡${attacker.name} completa el combo de 3 golpes!`; }
            logMessage(finalComboMessage); setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Fin del Combo', message: finalComboMessage, gameOver: gameOver }); await delay(1000);

            if (!gameOver) {
                const actionTypeForHistory = 'combo';
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
                setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            } else {
                console.log("[DEBUG] Juego TERMINADO durante el combo.");
                if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
            }
            return;
        } else {
            const nextHit = currentHit + 1;
            const nextPenalty = nextHit === 2 ? 2 : 4;
            logMessage(`¡El golpe #${currentHit} conecta! ${attacker.name} continúa con golpe #${nextHit}...`);
            setActionState(prevState => ({
                ...prevState,
                stage: 'awaiting_defense',
                currentComboHit: nextHit,
                currentDefensePenalty: nextPenalty,
            }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Combo - Golpe ${nextHit}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el golpe #${nextHit}! (Defensa ${nextPenalty === 2 ? '-2' : '-4'})` });
            return;
        }
    }
    // --- NEW: Combo a Velocidad Luz ---
    else if (actionType === 'ComboVelocidadLuz') {
        const currentHit = actionState.currentComboHit || 1;
        baseDamage = attacker.actions.velocidad_luz || 50; // Damage per hit based on velocidad_luz action
        const dodgePenalty = 4;
        const blockPenalty = 6;
        logMessage(`--- Resolviendo Combo Vel. Luz: Golpe #${currentHit} (Esq -${dodgePenalty}, Bloq -${blockPenalty}) ---`);
        defenseBonusOrPenaltyText = `(Esq -${dodgePenalty}, Bloq -${blockPenalty})`;
        // Apply specific boost bonuses if active (Fortaleza for block, Agilidad for dodge)
        if(usingFortaleza) defenseBonusOrPenaltyText += ' (+3 Fortaleza)';
        if(usingAgilidad) defenseBonusOrPenaltyText += ' (+3 Agilidad)';
        // Destreza cannot be used (no counter)

        if (roll === 1) { // Critical failure on defense
            defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage;
        }
        else if (baseDefenseType === 'esquivar') {
            let [min, max] = defender.defenseRanges.esquivar;
            let bonus = usingAgilidad ? 3 : 0;
            targetMin = Math.min(21, min + dodgePenalty - bonus); // Apply penalty and bonus
            targetMax = max;
            if (roll >= targetMin && roll <= targetMax) {
                 defenseSuccessful = true; rollOutcome = 'success'; // Combo ends, no damage
            } else {
                 damageToDefender = baseDamage; rollOutcome = 'failure'; // Hit connects
            }
        }
        else if (baseDefenseType === 'bloquear') {
            let [min, max] = defender.defenseRanges.bloquear;
            let bonus = usingFortaleza ? 3 : 0;
            targetMin = Math.min(21, Math.max(1, min + blockPenalty - bonus)); // Apply penalty and bonus
            targetMax = max;
            if (roll >= targetMin && roll <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'blocked'; // Combo ends
                damageToDefenderPA = 10; // Apply 10 PA damage on successful block
            } else {
                damageToDefender = baseDamage; rollOutcome = 'failure'; // Hit connects
            }
        }
        // Contraatacar is not allowed, already filtered by allowedDefenses

        // Apply damage and create message for the hit
        let attackerDamageMessage = ""; // No counter damage possible
        let defenderDamageMessage = "";
        if (!gameOver && damageToDefender > 0) { // Normal damage on failure
             gameOver = applyDamage(defenderId, damageToDefender);
             defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`;
        }
        if (!gameOver && damageToDefenderPA > 0) { // PA damage on block success
            gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA');
            defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`;
        }

        let hitMessage = `${defender.name} intenta ${defenseType.replace('_fortaleza','').replace('_agilidad','')} ${defenseBonusOrPenaltyText} vs Combo Vel. Luz #${currentHit}. Tirada: ${roll}. `;
        if (targetMin !== null) { hitMessage += `(Necesita ${targetMin}-${targetMax}). `; }
        switch (rollOutcome) { case 'success': hitMessage += "¡Esquivado! "; break; case 'failure': hitMessage += "¡Impacto! "; break; case 'blocked': hitMessage += "¡Bloqueado! "; break; default: hitMessage += "Resultado: "; break; }
        hitMessage += defenderDamageMessage; // Add damage message if any

        const hitEvent = { id: Date.now(), type: 'defense_resolution', actionName: `Combo Vel. Luz #${currentHit} vs ${defenseType.replace('_fortaleza','').replace('_agilidad','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: hitMessage.trim(), gameOver: gameOver };
        setArenaEvent(hitEvent); logMessage(hitMessage); await delay(1500); // Shorter delay between light speed hits?

        // Check if combo ends
        if (defenseSuccessful || gameOver || currentHit >= 3) {
            // Combo ends
            let finalComboMessage = "";
            if (defenseSuccessful && rollOutcome === 'success') finalComboMessage = `¡${defender.name} esquiva y detiene el combo en el golpe #${currentHit}!`;
            else if (defenseSuccessful && rollOutcome === 'blocked') finalComboMessage = `¡${defender.name} bloquea y detiene el combo en el golpe #${currentHit}!`;
            else if (gameOver) finalComboMessage = `¡El golpe #${currentHit} del combo derrota a ${defender.name}! ¡Combate Terminado!`;
            else finalComboMessage = `¡${attacker.name} completa el combo a velocidad luz de 3 golpes!`; // Hit #3 landed

            logMessage(finalComboMessage);
            setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Fin Combo Vel. Luz', message: finalComboMessage, gameOver: gameOver });
            await delay(1000);

            // End turn if game not over
            if (!gameOver) {
                const actionTypeForHistory = 'combo_velocidad_luz';
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
                setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            } else {
                console.log("[DEBUG] Juego TERMINADO durante Combo Vel. Luz.");
                if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
            }
            return; // Exit defense handler
        } else {
            // Combo continues: increment hit count
            const nextHit = currentHit + 1;
            logMessage(`¡El golpe #${currentHit} conecta! ${attacker.name} continúa con golpe #${nextHit}...`);
            setActionState(prevState => ({
                ...prevState,
                stage: 'awaiting_defense', // Stay in defense stage for next hit
                currentComboHit: nextHit,
                // Penalties remain the same for all hits
            }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Combo Vel. Luz - Golpe ${nextHit}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el golpe #${nextHit}! (Esq -4, Bloq -6)` });
            return; // Exit defense handler, wait for next defense input
        }
    }
    // --- Other Standard Actions ---
    else {
        // (Logic for Golpe, Salto, Velocidad_luz, Embestir, Cargar, Lanzar_obj, and Atrapar followups remains the same)
        if (roll === 1) { // Critical failure on defense roll
             defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage;
        }
        else if (baseDefenseType === 'esquivar') {
            let [min, max] = defender.defenseRanges.esquivar; let bonus = 0;
            if (actionType === 'Lanzar_obj' || actionType === 'Cargar') { bonus = 2; defenseBonusOrPenaltyText = '(+2 Bono)'; }
            if (usingAgilidad) { bonus += 3; defenseBonusOrPenaltyText = '(+3 Agilidad)'; }
            targetMin = Math.max(1, min - bonus); targetMax = max;
            if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        } else if (baseDefenseType === 'bloquear') {
            let [min, max] = defender.defenseRanges.bloquear; let penalty = 0; let bonus = usingFortaleza ? 3 : 0;
            if (actionType === 'Lanzar_obj') { penalty = 2; defenseBonusOrPenaltyText += '(-2 Penaliz.)'; }
            else if (actionType === 'Velocidad_luz') { penalty = 6; defenseBonusOrPenaltyText += '(-6 Penaliz.)'; }
            else if (actionType === 'Salto') { penalty = 2; defenseBonusOrPenaltyText += '(-2 Penaliz.)'; }
            else if (actionType === 'Atrapar_Opcion4') { penalty = actionState.defensePenalty || 2; defenseBonusOrPenaltyText += `(-${penalty} Penaliz.)`; }
            else if (actionType === 'Atrapar_Opcion2' && defenseType !== 'bloquear') { rollOutcome = 'invalid'; }
            else if (actionType === 'Atrapar_Opcion7') { rollOutcome = 'invalid'; }

            if (rollOutcome !== 'invalid') {
                 targetMin = Math.min(21, Math.max(1, min + penalty - bonus)); targetMax = max;
                 if (roll >= targetMin && roll <= targetMax) {
                     defenseSuccessful = true; rollOutcome = 'blocked';
                     if (actionType === 'Golpe' || actionType === 'Velocidad_luz') damageToDefenderPA = 10;
                     else if (actionType === 'Lanzar_obj' || actionType === 'Embestir' || actionType === 'Cargar') damageToDefenderPA = 20;
                     else if (actionType === 'Salto') damageToDefenderPA = 20;
                     else if (actionType === 'Atrapar_Opcion2') damageToDefenderPA = actionState.blockDamagePA || 20;
                     else if (actionType === 'Atrapar_Opcion4') damageToDefenderPA = actionState.blockDamagePA || 10;
                     else damageToDefenderPA = 10;
                 } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
            } else { damageToDefender = baseDamage; targetMin = null; targetMax = null; }

        } else if (baseDefenseType === 'contraatacar') {
             let [min, max] = defender.defenseRanges.contraatacar; let bonus = 0; let penalty = 0;
             if (actionType === 'Cargar') { bonus = 2; defenseBonusOrPenaltyText = '(+2 Bono)'; }
             else if (actionType === 'Atrapar_Opcion4') { penalty = actionState.defensePenalty || 2; defenseBonusOrPenaltyText = `(-${penalty} Penaliz.)`; }
             else if (actionType === 'Atrapar_Opcion2' || actionType === 'Atrapar_Opcion7') { rollOutcome = 'invalid'; }
             if (usingDestreza) { bonus += 2; defenseBonusOrPenaltyText = '(+2 Destreza)'; }

             if(rollOutcome !== 'invalid') {
                 targetMin = Math.min(21, Math.max(1, min + penalty - bonus)); targetMax = max;
                 if (roll >= targetMin && roll <= targetMax) {
                     defenseSuccessful = true; rollOutcome = 'countered';
                     if (actionType === 'Golpe' || actionType === 'Salto' || actionType === 'Atrapar_Opcion4') damageToAttacker = Math.floor(defender.actions.golpe / 2);
                     else if (actionType === 'Lanzar_obj') damageToAttacker = Math.floor(defender.actions.lanzar_obj / 2);
                     else if (actionType === 'Embestir') damageToAttacker = Math.floor(defender.actions.embestir / 2);
                     else if (actionType === 'Cargar') damageToAttacker = Math.floor(defender.actions.cargar / 2);
                     else damageToAttacker = 0;
                 } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
             } else { damageToDefender = baseDamage; targetMin = null; targetMax = null; }
        }

        // Apply damage and create final message
        let attackerDamageMessage = "", defenderDamageMessage = "";
        if (!gameOver && damageToAttacker > 0) { gameOver = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`; }
        if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) { if (damageToDefender > 0) { gameOver = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`; } else { gameOver = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`; } }

        let finalMessage = `${defender.name} intenta ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')} ${defenseBonusOrPenaltyText} vs ${actionType.replace('_', ' ')}. Tirada: ${roll}. `;
        if (targetMin !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
        switch (rollOutcome) { case 'success': finalMessage += "¡Éxito! "; break; case 'failure': finalMessage += "¡Fallo! "; break; case 'blocked': finalMessage += "¡Bloqueado! "; break; case 'countered': finalMessage += "¡Contraatacado! "; break; case 'invalid': finalMessage += "¡Defensa Inválida! "; break; default: finalMessage += "Resultado: "; break; }
        finalMessage += defenderDamageMessage + " " + attackerDamageMessage;
        if (gameOver) { finalMessage += ` *** ¡Combate Terminado! ***`; }

        const resolutionEvent = { id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace('_', ' ')} vs ${defenseType.replace('_fortaleza','').replace('_agilidad','').replace('_destreza','')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: finalMessage.trim(), gameOver: gameOver };

        logMessage(finalMessage); setArenaEvent(resolutionEvent);

        // End turn after defense resolution
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
        } else {
            console.log("[DEBUG] Juego TERMINADO.");
            if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
        }
        return; // Exit defense handler
    }

  }; // End of handleDefenseSelection


  // Function to handle selection of 'Atrapar' follow-up option (unchanged)
  const handleAtraparFollowupSelect = async (optionId) => {
    if (!actionState.active || actionState.type !== 'Atrapar' || actionState.stage !== 'awaiting_followup') { logMessage("Estado inválido para selección de seguimiento de Atrapar."); return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let gameOver = false; const selectedOption = atraparFollowupOptions.find(opt => opt.id === optionId);
    logMessage(`${attacker.name} elige seguimiento de Atrapar: ${selectedOption?.name || optionId}`);

    switch (optionId) {
      case 'atrapar_op1': { // Golpes Múltiples
        logMessage(`${attacker.name} usa Golpes Múltiples!`); const rolls = [rollD20(), rollD20(), rollD20()]; const oddRolls = rolls.filter(r => r % 2 !== 0); const oddCount = oddRolls.length; const damage = oddCount * 20; logMessage(`Tiradas: ${rolls.join(', ')}. Aciertos (impares): ${oddCount}. Daño total: ${damage}`);
        if (damage > 0) { gameOver = applyDamage(defender.id, damage, 'normal'); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, damage: damage, hits: oddCount, successfulRolls: oddRolls, message: `${attacker.name} conecta ${oddCount} golpes (${oddRolls.join(', ')}) causando ${damage} de daño.` }); }
        else { logMessage("Ningún golpe acertó."); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla todos los golpes (Tiradas: ${rolls.join(', ')}).` }); }
        if (!gameOver) { await delay(1500); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); }
        break;
      }
      case 'atrapar_op2': { // Ataque Potente
        logMessage(`${attacker.name} usa Ataque Potente!`);
        setActionState({ ...actionState, type: 'Atrapar_Opcion2', stage: 'awaiting_defense', baseDamage: 80, blockDamagePA: 20, allowedDefenses: ['bloquear'] });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Potente', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Potente (80 Daño). ${defender.name}, ¡solo puedes intentar Bloquear!` });
        break;
      }
      case 'atrapar_op3': { // Ataques Rápidos
        logMessage(`${attacker.name} inicia Ataques Rápidos!`); let successfulDamageHits = 0, successfulBlocks = 0, totalNormalDamage = 0, totalPADamage = 0;
        for (let i = 0; i < 3; i++) {
          if (gameOver) break;
          const hitNumber = i + 1; logMessage(`--- Golpe Rápido #${hitNumber} ---`);
          const [minRoll, maxRoll] = defender.defenseRanges.bloquear; const roll = rollD20(); const blocked = (roll >= minRoll && roll <= maxRoll);
          logMessage(`${defender.name} intenta Bloquear (Necesita ${minRoll}-${maxRoll}): Tirada ${roll}!`);
          if (blocked) { successfulBlocks++; const damagePA = 10; totalPADamage += damagePA; logMessage(`¡Bloqueado! Recibe ${damagePA} daño PA.`); gameOver = applyDamage(defender.id, damagePA, 'directPA'); }
          else { successfulDamageHits++; const damageNormal = 20; totalNormalDamage += damageNormal; logMessage(`¡Impacto! Recibe ${damageNormal} daño.`); gameOver = applyDamage(defender.id, damageNormal, 'normal'); }
          await delay(1000);
        }
        let finalMessage = `${attacker.name} usó Ataques Rápidos. `; let details = []; if (successfulDamageHits > 0) details.push(`${successfulDamageHits} impactos (${totalNormalDamage} Daño Normal)`); if (successfulBlocks > 0) details.push(`${successfulBlocks} bloqueados (${totalPADamage} Daño PA)`); finalMessage += details.length > 0 ? details.join(', ') + '.' : "¡Todos los golpes fallaron o fueron bloqueados sin efecto!";
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataques Rápidos', message: finalMessage, hitsLanded: successfulDamageHits, hitsBlocked: successfulBlocks, totalNormalDmg: totalNormalDamage, totalPADmg: totalPADamage });
        if (!gameOver) { await delay(1500); setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } })); setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null }); const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`); }
        break;
      }
      case 'atrapar_op4': { // Ataque Vulnerante
        logMessage(`${attacker.name} usa Ataque Vulnerante!`);
        setActionState({ ...actionState, type: 'Atrapar_Opcion4', stage: 'awaiting_defense', baseDamage: 60, blockDamagePA: 10, defensePenalty: 2, allowedDefenses: null });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Vulnerante', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Vulnerante (60 Daño). ¡${defender.name} defiende con -2 de penalización!` });
        break;
      }
      case 'atrapar_op5': { // Llave Mejorada
        const currentActionName = 'llave';
        if (attacker.stats.lastActionType === currentActionName) {
          logMessage("¡Regla de Alternancia! No se puede usar Llave Mejorada después de Llave.");
          setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Llave Mejorada', outcome: 'invalid', message: "¡No puedes usar Llave consecutivamente!" });
          await delay(1500);
          setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } }));
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else {
          logMessage(`${attacker.name} usa Llave Mejorada (+3 Bono)!`);
          const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;
          gameOver = resolveLlaveAction(attacker, currentDefenderData, 3);
          if (!gameOver) {
            await delay(1500);
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: currentActionName } }));
            setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
          }
        }
        break;
      }
      case 'atrapar_op6': { // Romper Mejorado
        logMessage(`${attacker.name} usa Romper Mejorado.`);
        const canBreakAnyPart = ['arms', 'legs', 'ribs'].some(part => defender.stats.brokenParts[part] < 2);
        if (!canBreakAnyPart) {
          logMessage(`¡Todas las partes de ${defender.name} ya están rotas 2 veces! No se puede usar Romper Mejorado.`);
          setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` });
          await delay(1500);
          setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } }));
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
          return;
        }
        setActionState({ ...actionState, type: 'Atrapar_Opcion6', stage: 'awaiting_romper_target', romperBonus: 4 });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper Mejorado', message: `${attacker.name} intenta romper una parte del cuerpo con bono de +4.` });
        break;
      }
      case 'atrapar_op7': { // Ataque Imbloqueable
        logMessage(`${attacker.name} usa Ataque Imbloqueable!`);
        setActionState({ ...actionState, type: 'Atrapar_Opcion7', stage: 'awaiting_defense', baseDamage: 60, allowedDefenses: ['esquivar'] });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Imbloqueable', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Imbloqueable (60 Daño). ${defender.name}, ¡solo puedes intentar Esquivar!` });
        break;
      }
      default: {
        logMessage(`Opción ${optionId} no implementada.`);
        await delay(1500);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } }));
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        break;
      }
    }
  };

  // Handler for selecting the target part for 'Romper' or 'Romper Mejorado' (unchanged)
  const handleRomperTargetSelect = async (partToBreak) => {
    if (!actionState.active || actionState.stage !== 'awaiting_romper_target') { logMessage("Estado inválido para selección de objetivo de Romper."); return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const wasAtraparFollowup = actionState.type === 'Atrapar_Opcion6';
    const actionTypeForHistory = wasAtraparFollowup ? 'atrapar' : 'romper';
    logMessage(`${attacker.name} elige romper ${partToBreak} de ${defender.name}!`);

    if (defender.stats.brokenParts[partToBreak] >= 2) {
        logMessage(`ERROR LÓGICO: Intentando romper ${partToBreak} que ya está al máximo.`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `${partToBreak.charAt(0).toUpperCase() + partToBreak.slice(1)} no se puede romper más.` });
        await delay(1500);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    const bonus = actionState.romperBonus || 0;
    const gameOver = resolveRomperAttempt(attacker, defender, partToBreak, bonus);

    if (!gameOver) {
        await delay(1500);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    } else {
      if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    }
  };


  // --- Render Logic --- (Pass getActionConcentrationRequirement to PlayerArea)
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
          <PlayerArea
            characterData={player1Data}
            opponentData={player2Data}
            isCurrentPlayer={currentPlayerId === player1Data.id}
            handleActionInitiate={handleActionInitiate}
            actionState={actionState}
            handleDefenseSelection={handleDefenseSelection}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            handleRomperTargetSelect={handleRomperTargetSelect}
            handleResistenciaChoice={handleResistenciaChoice}
            atraparOptions={atraparFollowupOptions}
            getActionConcentrationRequirement={getActionConcentrationRequirement}
          />
          <div className="center-column">
             <ArenaDisplay event={arenaEvent} />
             <GameLog log={gameLog} />
          </div>
           <PlayerArea
            characterData={player2Data}
            opponentData={player1Data}
            isCurrentPlayer={currentPlayerId === player2Data.id}
            handleActionInitiate={handleActionInitiate}
            actionState={actionState}
            handleDefenseSelection={handleDefenseSelection}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            handleRomperTargetSelect={handleRomperTargetSelect}
            handleResistenciaChoice={handleResistenciaChoice}
            atraparOptions={atraparFollowupOptions}
            getActionConcentrationRequirement={getActionConcentrationRequirement}
          />
        </div>
      )}
    </div>
  )
}

export default App
