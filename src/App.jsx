// App.jsx MODIFICADO (con regla de alternancia, console.logs y prop IS_ACTION_ALTERNATION_EXCEPTION descomentada)

import './App.css'
import { useState, useEffect } from 'react'
import PlayerArea from './components/PlayerArea' // Asegúrate que la ruta a PlayerArea sea correcta
import GameLog from './components/GameLog'       // Asegúrate que la ruta a GameLog sea correcta
import ArenaDisplay from './components/ArenaDisplay' // Asegúrate que la ruta a ArenaDisplay sea correcta
import CharacterSelection from './components/CharacterSelection'; // Importar CharacterSelection
import { CABALLEROS_DISPONIBLES } from './data/caballeros'; // Importar datos de personajes

// Initial character data
const initialPlayer1Data = {
  id: 'seiya_v2',
  name: 'SEIYA DE PEGASO II',
  stats: {
    pv_max: 230, pa_max: 300, pc_max: 500,
    currentPV: 230, currentPA: 300, currentPC: 500,
    atrapar_bonus: 0,
    brokenParts: { arms: 0, legs: 0, ribs: 0 },
    concentrationLevel: 0,
    lastActionType: null,
    actionHistory: [], // NUEVO: Historial de acciones
    fortalezaAvailable: false,
    fortalezaUsedThisCombat: false,
    agilidadAvailable: false,
    agilidadUsedThisCombat: false,
    destrezaAvailable: false,
    destrezaUsedThisCombat: false,
    lanzamientosSucesivosUsedThisCombat: false,
    resistenciaAvailable: false,
    resistenciaUsedThisCombat: false,
    comboVelocidadLuzUsedThisCombat: false,
    dobleSaltoUsedThisCombat: false,
    arrojarUsedThisCombat: false,
    furiaUsedThisCombat: false,
    apresarUsedThisCombat: false,
    quebrarUsedThisCombat: false,
    septimoSentidoActivo: false,
    septimoSentidoIntentado: false,
    puntosVitalesGolpeados: false,
    puntosVitalesUsadoPorAtacante: false,
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
    fortaleza: true,
    agilidad: true,
    destreza: true,
    lanzamientos_sucesivos: true,
    resistencia: true,
    combo_velocidad_luz: true,
    doble_salto: true,
    arrojar: true,
    furia: true,
    apresar: true,
    quebrar: true,
    alcanzar_septimo_sentido: true,
    golpear_puntos_vitales: true,
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
    concentrationLevel: 0,
    lastActionType: null,
    actionHistory: [], // NUEVO: Historial de acciones
    fortalezaAvailable: false,
    fortalezaUsedThisCombat: false,
    agilidadAvailable: false,
    agilidadUsedThisCombat: false,
    destrezaAvailable: false,
    destrezaUsedThisCombat: false,
    lanzamientosSucesivosUsedThisCombat: false,
    resistenciaAvailable: false,
    resistenciaUsedThisCombat: false,
    comboVelocidadLuzUsedThisCombat: false,
    dobleSaltoUsedThisCombat: false,
    arrojarUsedThisCombat: false,
    furiaUsedThisCombat: false,
    apresarUsedThisCombat: false,
    quebrarUsedThisCombat: false,
    septimoSentidoActivo: false,
    septimoSentidoIntentado: false,
    puntosVitalesGolpeados: false,
    puntosVitalesUsadoPorAtacante: false,
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
    fortaleza: true,
    agilidad: true,
    destreza: true,
    lanzamientos_sucesivos: true,
    resistencia: true,
    combo_velocidad_luz: true,
    doble_salto: true,
    arrojar: true,
    furia: true,
    apresar: true,
    quebrar: true,
    alcanzar_septimo_sentido: true,
    golpear_puntos_vitales: true,
  },
  powers: [ { id: 'S001', name: 'Patada Dragón', cost: 50, type: ['R'], damage: 40, details: '+10 Dmg Salto stack' }, { id: 'S002', name: 'Dragón Volador', cost: 50, type: ['R', 'G'], damage: 70 }, { id: 'S003', name: 'Rozan Ryuu Hi Shou', cost: 100, type: ['R', 'G'], damage: 100, details: 'Weak Point on Counter' }, { id: 'S004', name: 'Cien Dragones de Rozan', cost: 200, type: ['RB', 'G'], damage: 160, effects: '-3 Bloquear' }, { id: 'S005', name: 'Último Dragón', cost: 200, type: ['LL'], damage: 200, details: 'Self-dmg 120, 1 use' }, { id: 'S006', name: 'Excalibur', cost: 100, type: ['R', 'RArm', 'M'], damage: 100, details: 'Ignore Def Bonus, Destroys Armor on 1-2' }, ],
  bonuses: { pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+10 Dmg Golpe (ARM)', '+1 Puntos Vitales'], activos: ['+2 Ayuda (aliados)', '+2 Int Div', 'Valentía del Dragón', 'Armadura Divina'], flags: ['ESC', 'ARM'] },
  statusEffects: [],
  supportRanges: { percepcion: [15, 20], septimo_sentido: [19, 20], puntos_vitales: [17, 20], romper: [11, 20], ayuda: [12, 20], },
};

const atraparFollowupOptions = [
  { id: 'atrapar_op1', name: 'Golpes Múltiples (3x20 Daño, Impares)' },
  { id: 'atrapar_op2', name: 'Ataque Potente (80 Daño, Solo Bloquear)' },
  { id: 'atrapar_op3', name: 'Ataques Rápidos (3x20 Daño, Bloqueable)' },
  { id: 'atrapar_op4', name: 'Ataque Vulnerante (60 Daño, -2 Def)' },
  { id: 'atrapar_op5', name: 'Llave Mejorada (+3 Bono)' },
  { id: 'atrapar_op6', name: 'Romper Mejorado (+4 Bono)' },
  { id: 'atrapar_op7', name: 'Ataque Imbloqueable (60 Daño, Solo Esquivar)' },
];

const getActionConcentrationRequirement = (actionName) => {
    const level1Actions = ['velocidad_luz', 'salto', 'combo', 'engaño', 'lanzamientos_sucesivos'];
    const level2Actions = ['combo_velocidad_luz', 'doble_salto', 'arrojar', 'furia', 'apresar', 'quebrar'];
    if (level2Actions.includes(actionName)) return 2;
    if (level1Actions.includes(actionName)) return 1;
    return 0;
};

// Define qué acciones son excepción a la regla de alternancia
const IS_ACTION_ALTERNATION_EXCEPTION = (actionName) => {
  return ['concentracion', 'fortaleza', 'agilidad', 'destreza'].includes(actionName);
};


const getSeptimoSentidoPowerDamageBonus = (power, attackerStats) => {
    if (!attackerStats.septimoSentidoActivo || !power || !power.type) return 0;
    const types = Array.isArray(power.type) ? power.type : [power.type];
    let bonuses = [];
    if (types.includes('R')) bonuses.push(30);
    if (types.includes('RMult')) bonuses.push(10);
    if (types.includes('RD')) power.isDirectToPVPA ? bonuses.push(5) : bonuses.push(10);
    if (types.includes('RSD')) bonuses.push(10);
    if (types.includes('RVid') || types.includes('RArm')) bonuses.push(10);
    if (types.includes('P')) bonuses.push(10);
    if (types.includes('LL')) bonuses.push(30);
    if (bonuses.length === 0) return 0;
    return Math.min(...bonuses);
};

const getPuntosVitalesPowerDamagePenalty = (power, attackerStats) => {
    if (!attackerStats.puntosVitalesGolpeados || !power || !power.type) return 0;
    const types = Array.isArray(power.type) ? power.type : [power.type];
    let penalties = [];
    if (types.includes('R')) penalties.push(20);
    if (types.includes('RD')) power.isDirectToPVPA ? penalties.push(5) : penalties.push(10);
    if (types.includes('RSD')) penalties.push(10);
    if (types.includes('RMult')) penalties.push(10);
    if (types.includes('RVid') || types.includes('RArm')) penalties.push(10);
    if (types.includes('P')) penalties.push(10);
    if (types.includes('LL')) penalties.push(20);
    return penalties.length > 0 ? Math.max(...penalties) : 0;
};


function App() {
  const [gameView, setGameView] = useState('characterSelection'); // NUEVO estado para la vista
  const [player1Data, setPlayer1Data] = useState(null); // Inicializar con null
  const [player2Data, setPlayer2Data] = useState(null); // Inicializar con null
  const [currentPlayerId, setCurrentPlayerId] = useState(null); // Inicializar con null o el ID del primer jugador después de la selección
  const [actionState, setActionState] = useState({
    active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null,
    currentHit: 0, totalHits: 0, baseDamagePerHit: 0, blockDamagePA: 0,
    hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0,
  });
  const [gameLog, setGameLog] = useState([]);
  const [arenaEvent, setArenaEvent] = useState(null);

  const rollD20 = () => Math.floor(Math.random() * 20) + 1;

  const logMessage = (message) => {
      console.log(message);
      setGameLog(prevLog => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prevLog].slice(0, 50));
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // NUEVA función para manejar el inicio del combate
  const handleCombatStart = (selectedP1, selectedP2) => {
    const initializePlayerData = (playerData) => {
      const data = JSON.parse(JSON.stringify(playerData));
      if (!data.stats) {
        data.stats = {};
      }
      if (!data.stats.brokenParts) {
        data.stats.brokenParts = { arms: 0, legs: 0, ribs: 0 };
      }
      if (!data.stats.statPenaltiesFromBreaks) {
        data.stats.statPenaltiesFromBreaks = { esquivar: 0, bloquear: 0, llave: 0, contraatacar: 0, golpeDamageReduction: 0 };
      }
      if (typeof data.stats.allPartsBrokenPenaltyApplied === 'undefined') {
        data.stats.allPartsBrokenPenaltyApplied = false;
      }
      // Asegurar que otras stats necesarias para 'Romper' y sus consecuencias estén presentes
      // Por ejemplo, si 'contraatacar' o 'golpe' se leen directamente de 'actions' para su efectividad
      // y esta se modifica, hay que tenerlo en cuenta.
      // Por ahora, los penalizadores se almacenan en statPenaltiesFromBreaks.
      return data;
    };

    const p1Data = initializePlayerData(selectedP1);
    const p2Data = initializePlayerData(selectedP2);

    setPlayer1Data(p1Data);
    setPlayer2Data(p2Data);
    setCurrentPlayerId(p1Data.id);
    setGameView('combat');
    setGameLog([]);
    setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null });
    setArenaEvent(null);
  };

  // Helper para actualizar stats del jugador y el historial de acciones
  const updatePlayerStatsAndHistory = (playerId, statChanges, actionNameToLog) => {
    const setPlayerData = playerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    setPlayerData(prevData => {
        const currentActionHistory = prevData.stats.actionHistory || [];
        const newActionHistory = actionNameToLog
            ? [actionNameToLog, ...currentActionHistory].slice(0, 3)
            : currentActionHistory;

        return {
            ...prevData,
            stats: {
                ...prevData.stats,
                ...statChanges,
                actionHistory: newActionHistory,
                lastActionType: actionNameToLog || prevData.stats.lastActionType,
            }
        };
    });
  };

  const applyDamage = (targetPlayerId, damageAmount, damageType = 'normal') => {
    const targetData = targetPlayerId === player1Data.id ? player1Data : player2Data;
    if (!targetData) return; // Añadir verificación por si los datos del jugador aún no están cargados
    const setPlayerData = targetPlayerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let actualDamage = damageAmount;
    if (damageAmount <= 0) { logMessage(`Intento de aplicar ${damageAmount} daño. No se aplicó daño.`); return { gameOver: false, actualDamageDealt: 0 }; }
    logMessage(`Aplicando ${damageAmount} daño base (Tipo: ${damageType}) a ${targetData.name}...`);
    let damageToPa = 0, damageToPv = 0;
    let currentPA = targetData.stats.currentPA, currentPV = targetData.stats.currentPV;
    let finalPA = currentPA, finalPV = currentPV;
    let actualDamageApplied = 0;

    if (damageType === 'directPV') {
        damageToPv = damageAmount;
        actualDamageApplied = damageToPv;
        logMessage(`${targetData.name} recibe ${damageToPv} daño directo a PV.`);
    } else if (damageType === 'directPA') {
        damageToPa = Math.min(currentPA, damageAmount);
        finalPA = currentPA - damageToPa;
        actualDamageApplied = damageToPa;
        let overflowDamage = damageAmount - damageToPa;
        if (overflowDamage > 0) {
            logMessage(`¡Armadura rota por daño directo a PA! ${overflowDamage} daño excedente.`);
        }
        logMessage(`${targetData.name} recibe ${damageToPa} daño a PA.`);
    } else {
        damageToPa = Math.ceil(damageAmount / 2);
        damageToPv = Math.floor(damageAmount / 2);
        const actualPaDamage = Math.min(currentPA, damageToPa);
        finalPA = currentPA - actualPaDamage;
        actualDamageApplied += actualPaDamage;
        const overflowDamage = damageToPa - actualPaDamage;
        if (overflowDamage > 0) {
            logMessage(`¡Armadura rota por daño! ${overflowDamage} daño excedente.`);
            damageToPv += overflowDamage;
        }
        actualDamageApplied += damageToPv;
        logMessage(`${targetData.name} recibe ${damageToPv} daño a PV y ${actualPaDamage} daño a PA.`);
    }
    finalPV = Math.max(0, currentPV - damageToPv);
    finalPA = Math.max(0, finalPA);
    if (finalPV <= 0) {
        logMessage(`!!! ${targetData.name} ha sido derrotado !!!`);
        return { gameOver: true, actualDamageDealt: actualDamageApplied };
    }
     setPlayerData(prevData => ({
        ...prevData,
        stats: { ...prevData.stats, currentPV: finalPV, currentPA: finalPA }
    }));
    logMessage(`${targetData.name} - PV: ${finalPV}/${targetData.stats.pv_max}, PA: ${finalPA}/${targetData.stats.pa_max}`);
    return { gameOver: false, actualDamageDealt: actualDamageApplied };
  };

  const handlePlayAgain = () => {
    // No reiniciar los datos de los jugadores aquí directamente.
    // Simplemente cambia la vista a la selección de personajes.
    // Los datos de los jugadores se reiniciarán o se establecerán con nuevos personajes
    // cuando se llame a handleCombatStart.
    setGameView('characterSelection');
    setPlayer1Data(null); // Reiniciar datos del jugador 1
    setPlayer2Data(null); // Reiniciar datos del jugador 2
    setCurrentPlayerId(null); // Reiniciar jugador actual
    setGameLog([]); // Reiniciar el log del juego
    setActionState({ // Resetear el estado de la acción
        active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null,
        currentHit: 0, totalHits: 0, baseDamagePerHit: 0, blockDamagePA: 0,
        hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0,
      });
    setArenaEvent(null); // Resetear eventos de la arena
    // No es necesario llamar a resetCombatStats individualmente si se reinician los datos completos
    // de los jugadores a null o a nuevos personajes.
  };

  const resolveLlaveAction = (attacker, defender, additionalBonus = 0) => {
    logMessage(`Resolviendo Llave [Bono Atacante: +${additionalBonus}]...`);
    let attackerRollVal = 0, defenderRollVal = 0, ties = 0;
    let currentDamage = attacker.actions.llave;
    if (attacker.stats.septimoSentidoActivo) {
        currentDamage += 30;
        logMessage(`(Séptimo Sentido: +30 Daño a Llave)`);
    }
    if (attacker.stats.puntosVitalesGolpeados) {
        currentDamage = Math.max(0, currentDamage - 20);
        logMessage(`(Puntos Vitales Afectados: -20 Daño a Llave)`);
    }
    let winnerId = null, loserId = null;
    let llaveGameOver = false;

    while (ties < 3) {
      const attackerBaseRoll = rollD20();
      const defenderBaseRoll = rollD20();
      let totalAttackerBonus = 2 + additionalBonus; // Bono base de +2 para el atacante en llave
      let totalDefenderBonus = 0;

      // Aplicar penalizador a la tirada del atacante si tiene las costillas rotas
      if (attacker.stats.statPenaltiesFromBreaks?.llave) {
          const llavePenalty = attacker.stats.statPenaltiesFromBreaks.llave; // ej. -1
          if (llavePenalty !== 0) { // Solo aplicar y loguear si hay penalizador real
            totalAttackerBonus += llavePenalty;
            logMessage(`(Atacante con Costillas Rotas: ${llavePenalty} a tirada de Llave)`);
          }
      }

      if (attacker.stats.septimoSentidoActivo) totalAttackerBonus += 1;
      if (attacker.stats.puntosVitalesGolpeados) totalAttackerBonus -= 1;
      if (defender.stats.septimoSentidoActivo && attacker.id !== defender.id) totalDefenderBonus +=1;
      if (defender.stats.puntosVitalesGolpeados && attacker.id !== defender.id) totalDefenderBonus -=1;

      attackerRollVal = attackerBaseRoll + totalAttackerBonus;
      defenderRollVal = defenderBaseRoll + totalDefenderBonus;

      logMessage(`Tirada Llave: ${attacker.name} (${attackerBaseRoll}+${totalAttackerBonus}=${attackerRollVal}) vs ${defender.name} (${defenderBaseRoll}+${totalDefenderBonus}=${defenderRollVal})`);
      if (attackerRollVal > defenderRollVal) { winnerId = attacker.id; loserId = defender.id; logMessage(`${attacker.name} gana la llave!`); break; }
      else if (defenderRollVal > attackerRollVal) { winnerId = defender.id; loserId = attacker.id; logMessage(`${defender.name} gana la llave!`); break; }
      else { ties++; if (ties < 3) { currentDamage += 10; logMessage(`¡Empate ${ties}! Forcejeo... Daño aumenta a ${currentDamage}. Volviendo a tirar...`); }
        else { logMessage("¡Empate por tercera vez! La llave se anula."); winnerId = null; break; }
      }
    }
    if (winnerId && loserId) {
      const winnerData = winnerId === player1Data.id ? player1Data : player2Data;
      const loserData = loserId === player1Data.id ? player1Data : player2Data;
      const { gameOver } = applyDamage(loserId, currentDamage);
      llaveGameOver = gameOver;
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', winnerName: winnerData.name, loserName: loserData.name, damage: currentDamage, message: `${winnerData.name} gana (${attackerRollVal} vs ${defenderRollVal}). ${loserData.name} recibe ${currentDamage} daño.` });
    } else { setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', outcome: 'tie', message: `¡Empate final en Llave (${attackerRollVal} vs ${defenderRollVal})! La llave se anula.` }); }
    return llaveGameOver;
  };

  const resolveRomperAttempt = (attacker, defender, partToBreak, additionalBonus = 0) => {
      let isGameOver = false; const partKey = partToBreak;
      const roll1Base = rollD20(); const roll1 = roll1Base + additionalBonus;
      logMessage(`Primer intento para romper ${partKey}: Tirada = ${roll1Base}${additionalBonus > 0 ? `+${additionalBonus}` : ''} = ${roll1}`);
      if (roll1 < 11 || roll1 > 20) { // Rango es 11-20
          logMessage("¡Primer intento fallido!");
          setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'failure', message: `${attacker.name} falla el primer intento (Tirada: ${roll1})` });
          return false;
      }
      logMessage("¡Primer intento exitoso! Realizando segundo intento...");
      const roll2Base = rollD20(); const roll2 = roll2Base + additionalBonus;
      logMessage(`Segundo intento para romper ${partKey}: Tirada = ${roll2Base}${additionalBonus > 0 ? `+${additionalBonus}` : ''} = ${roll2}`);
      if (roll2 < 11 || roll2 > 20) { // Rango es 11-20
          logMessage("¡Segundo intento fallido!");
          setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'failure', message: `${attacker.name} falla el segundo intento (Tiradas: ${roll1}, ${roll2})` });
          return false;
      }
      logMessage(`¡Éxito! ¡${partKey} de ${defender.name} rotos!`);
      
      const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
      let defenderStatUpdates = {};
      let newBrokenParts = { ...defender.stats.brokenParts };
      newBrokenParts[partKey] = (newBrokenParts[partKey] || 0) + 1;

      let newPenalties = defender.stats.statPenaltiesFromBreaks ? { ...defender.stats.statPenaltiesFromBreaks } : { esquivar: 0, bloquear: 0, llave: 0, contraatacar: 0, golpeDamageReduction: 0 };

      let penaltyMessagePart = "";

      if (partKey === 'arms') {
          newPenalties.bloquear -= 1; // Acumulativo
          penaltyMessagePart = `-1 Bloquear (Total Acumulado: ${newPenalties.bloquear})`;
      } else if (partKey === 'legs') {
          newPenalties.esquivar -= 1; // Acumulativo
          penaltyMessagePart = `-1 Esquivar (Total Acumulado: ${newPenalties.esquivar})`;
      } else if (partKey === 'ribs') {
          newPenalties.llave -= 1; // Acumulativo
          penaltyMessagePart = `-1 Llave (Total Acumulado: ${newPenalties.llave})`;
      }

      defenderStatUpdates.brokenParts = newBrokenParts;
      defenderStatUpdates.statPenaltiesFromBreaks = newPenalties;

      // Verificar si las 3 partes principales están rotas al menos una vez
      // para aplicar el penalizador global. Solo se aplica una vez.
      const armsBroken = newBrokenParts.arms >= 1;
      const legsBroken = newBrokenParts.legs >= 1;
      const ribsBroken = newBrokenParts.ribs >= 1;

      // Añadir una flag para asegurar que este bono global solo se aplique una vez.
      // Asumimos que 'allPartsBrokenPenaltyApplied' se inicializa a false en las stats del personaje.
      let allPartsBrokenPenaltyMessage = "";
      if (armsBroken && legsBroken && ribsBroken && !defender.stats.allPartsBrokenPenaltyApplied) {
          newPenalties.contraatacar -= 1;
          newPenalties.golpeDamageReduction += 10; // Asumiendo que esto es una reducción directa
          defenderStatUpdates.allPartsBrokenPenaltyApplied = true; // Marcar como aplicado
          allPartsBrokenPenaltyMessage = "¡Todas las partes principales rotas! Rival pierde -1 Contraatacar y -10 Daño Golpe.";
          logMessage(allPartsBrokenPenaltyMessage);
      }
      
      setDefenderData(prev => ({
          ...prev,
          stats: {
              ...prev.stats,
              ...defenderStatUpdates
          }
      }));

      const damagePV = 20;
      const { gameOver } = applyDamage(defender.id, damagePV, 'directPV');
      isGameOver = gameOver;
      
      setArenaEvent({ 
          id: Date.now(), 
          type: 'action_effect', 
          actionName: `Romper ${partKey.charAt(0).toUpperCase() + partKey.slice(1)}`, 
          outcome: 'success', 
          message: `¡${partKey.charAt(0).toUpperCase() + partKey.slice(1)} de ${defender.name} Rotos! (Tiradas: ${roll1}, ${roll2}). ${defender.name} pierde ${damagePV} PV. ${penaltyMessagePart}. ${allPartsBrokenPenaltyMessage}`.trim() 
      });
      return isGameOver;
  };

  const resolveSingleLanzamiento = (attacker, defender, throwNumber, baseAttackerBonus = 0) => {
      logMessage(`--- Resolviendo Lanzamiento #${throwNumber} (Bono Base Atacante: +${baseAttackerBonus}) ---`);
      const baseDamageThrow = 40;
      let currentDamage = baseDamageThrow;
      if (attacker.stats.septimoSentidoActivo) {
          currentDamage += 10;
          logMessage(`(Séptimo Sentido: +10 Daño a este lanzamiento)`);
      }
      if (attacker.stats.puntosVitalesGolpeados) {
          currentDamage = Math.max(0, currentDamage - 10);
          logMessage(`(Puntos Vitales Afectados: -10 Daño a este lanzamiento)`);
      }
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
          if (attackerRoll > defenderRoll) { winnerId = attacker.id; loserId = defender.id; logMessage(`${attacker.name} gana el lanzamiento #${throwNumber}!`); break; }
          else if (defenderRoll > attackerRoll) { winnerId = defender.id; loserId = attacker.id; logMessage(`${defender.name} gana el lanzamiento #${throwNumber}!`); break; }
          else { ties++; if (ties < 3) { currentDamage += 10; logMessage(`¡Empate ${ties}! Forcejeo... Daño aumenta a ${currentDamage}. Volviendo a tirar...`); }
            else { logMessage(`¡Empate por tercera vez en Lanzamiento #${throwNumber}! El lanzamiento se anula.`); winnerId = null; break; }
          }
      }
      let message = "";
      let damageDealt = 0;
      if (winnerId) {
          const winnerData = winnerId === player1Data.id ? player1Data : player2Data;
          const loserData = loserId === player1Data.id ? player1Data : player2Data;
          damageDealt = currentDamage;
          const { gameOver } = applyDamage(loserId, damageDealt);
          singleThrowGameOver = gameOver;
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
          if (throwResult.winnerId === attacker.id) totalDamageToDefender += throwResult.damageDealt;
          else if (throwResult.winnerId === defender.id) { totalDamageToAttacker += throwResult.damageDealt; logMessage(`¡${defender.name} detiene los Lanzamientos Sucesivos!`); break; }
          if (throwNumber < 3 && !overallGameOver && throwResult.winnerId !== defender.id) { logMessage("Preparando siguiente lanzamiento..."); await delay(2000); }
      }
      logMessage(`Lanzamientos Sucesivos finalizados. Daño total a ${defender.name}: ${totalDamageToDefender}. Daño total a ${attacker.name}: ${totalDamageToAttacker}.`);
      setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Fin Lanzamientos Sucesivos', message: `Secuencia terminada. Daño total - ${defender.name}: ${totalDamageToDefender}, ${attacker.name}: ${totalDamageToAttacker}.` });
      await delay(1000);
      return overallGameOver;
  };


  const handleActionInitiate = async (actionName) => {
    const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
    const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;

    if (!attacker || !defender) { // Verificación crucial
        logMessage("Error en handleActionInitiate: Datos de jugador no cargados.");
        return;
    }

    console.log('Acción iniciada:', actionName, "por", attacker.name);

    if (actionState.active && actionState.stage !== null) {
        logMessage("No se puede iniciar acción mientras otra está activa.");
        return;
    }

    if (!IS_ACTION_ALTERNATION_EXCEPTION(actionName)) {
      const history = attacker.stats.actionHistory || [];
      const actionDisplayName = actionName.replace(/_/g, ' ');
      if (history.length > 0 && history[0] === actionName) {
        logMessage(`¡Alternancia! ${actionDisplayName} no puede usarse inmediatamente después de sí misma (Última acción: ${history[0].replace(/_/g, ' ')}).`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `Alternancia: No puedes repetir ${actionDisplayName} ahora.` });
        return;
      }
      if (history.length > 1 && history[1] === actionName) {
        logMessage(`¡Alternancia! Se requieren 2 acciones distintas antes de repetir ${actionDisplayName}. (Secuencia: ${history[1].replace(/_/g, ' ')} -> ${history[0].replace(/_/g, ' ')} -> intento de ${actionDisplayName})`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `Alternancia: Se necesitan 2 acciones diferentes antes de repetir ${actionDisplayName}.` });
        return;
      }
    }

    const requiredConcentration = getActionConcentrationRequirement(actionName);
    let concentrationConsumed = false;
    const restoreConcentrationIfNeeded = () => {
        if (concentrationConsumed) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: requiredConcentration }, null);
            logMessage(`Concentración restaurada a Nivel ${requiredConcentration} debido a acción inválida/ya usada.`);
        }
    };

    if (requiredConcentration > 0 && attacker.stats.concentrationLevel < requiredConcentration) {
        logMessage(`! ${attacker.name} necesita Concentración Nivel ${requiredConcentration} para usar ${actionName.replace(/_/g, ' ')}! (Nivel actual: ${attacker.stats.concentrationLevel})`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración Nivel ${requiredConcentration} para ${actionName.replace(/_/g, ' ')}!` });
        return;
    }

    if (requiredConcentration > 0) {
        const setAttackerDataProvisional = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
        setAttackerDataProvisional(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: 0 } }));
        logMessage(`${attacker.name} usa su concentración (Nivel ${requiredConcentration}) para ${actionName.replace(/_/g, ' ')}. Nivel reseteado a 0.`);
        concentrationConsumed = true;
    }

    if (actionName === 'concentracion') {
        const currentLevel = attacker.stats.concentrationLevel + (concentrationConsumed ? requiredConcentration : 0);
        const actualPreviousLevel = concentrationConsumed ? requiredConcentration : currentLevel;

        if (actualPreviousLevel >= 2) {
            logMessage(`Error: ${attacker.name} ya está en el nivel máximo de concentración (Nivel 2) o intentó concentrarse desde Nivel 2.`);
            restoreConcentrationIfNeeded();
            return;
        }
        const nextLevel = actualPreviousLevel + 1;
        logMessage(`${attacker.name} usa Concentración. Nivel aumentado a ${nextLevel}.`);
        updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: nextLevel }, 'concentracion');
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Concentración', attackerName: attacker.name, message: `${attacker.name} se concentra intensamente... ¡Nivel ${nextLevel} alcanzado!` });
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'usar_poder') {
        // Verificar si el personaje tiene poderes disponibles
        if (!attacker.powers || attacker.powers.length === 0) {
            logMessage(`${attacker.name} no tiene poderes disponibles.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `${attacker.name} no tiene poderes disponibles.` });
            return;
        }

        // Verificar si ya usó los poderes este combate
        if (attacker.stats.poderesUsadosThisCombat) {
            logMessage(`${attacker.name} ya usó sus poderes este combate.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: '¡Ya usaste tus poderes este combate!' });
            return;
        }

        // Buscar el poder 'Meteoros de Pegaso'
        const poderMeteoros = attacker.powers.find(poder => 
            poder.id === 'P001' || poder.name.toLowerCase().includes('meteoros')
        );

        if (!poderMeteoros) {
            logMessage(`${attacker.name} no tiene el poder 'Meteoros de Pegaso' disponible.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: 'No tienes el poder \'Meteoros de Pegaso\' disponible.' });
            return;
        }

        // Verificar si tiene suficiente cosmos (100 puntos)
        const costoCosmos = parseInt(poderMeteoros.cost) || 100;
        if (attacker.stats.currentPC < costoCosmos) {
            logMessage(`${attacker.name} no tiene suficiente cosmos (${costoCosmos} necesarios, ${attacker.stats.currentPC} disponibles).`);
            setArenaEvent({ 
                id: Date.now(), 
                type: 'action_effect', 
                outcome: 'invalid', 
                message: `No tienes suficiente cosmos (${costoCosmos} necesarios, ${attacker.stats.currentPC} disponibles).` 
            });
            return;
        }

        // Iniciar el ataque de Meteoros de Pegaso
        logMessage(`${attacker.name} inicia '${poderMeteoros.name}'!`);
        setArenaEvent({ 
            id: Date.now(), 
            type: 'action_effect', 
            actionName: poderMeteoros.name, 
            message: `¡${attacker.name} activa '${poderMeteoros.name}'! (${costoCosmos} PC)` 
        });

        // Configurar el estado para el ataque de meteoros
        setActionState({
            active: true,
            type: 'MeteorosPegaso',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            currentHit: 1,
            totalHits: 5, // 5 meteoros
            baseDamagePerHit: 20, // 20 puntos de daño cada uno
            blockDamagePA: 0, // No daña la armadura
            allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'], // Permitir contraatacar
            defenseBonuses: {},
            powerUsed: true,
            powerCost: costoCosmos
        });

        // Consumir el poder para este combate
        updatePlayerStatsAndHistory(attacker.id, { 
            poderesUsadosThisCombat: true,
            currentPC: attacker.stats.currentPC - costoCosmos
        }, 'usar_poder');
        
        return;
    }
    else if (actionName === 'alcanzar_septimo_sentido') {
        const isRecoveringFromPuntosVitales = attacker.stats.puntosVitalesGolpeados;
        if (isRecoveringFromPuntosVitales) logMessage(`${attacker.name} intenta recuperarse de Puntos Vitales y alcanzar el Séptimo Sentido.`);
        else {
            logMessage(`${attacker.name} intenta alcanzar el ¡Séptimo Sentido!`);
            if (attacker.stats.septimoSentidoIntentado && !attacker.stats.septimoSentidoActivo) {
                logMessage(`¡${attacker.name} ya intentó alcanzar el Séptimo Sentido en este combate y falló!`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya intentaste alcanzar el Séptimo Sentido y fallaste!` });
                restoreConcentrationIfNeeded(); return;
            }
            if (attacker.stats.septimoSentidoActivo) {
                logMessage(`¡${attacker.name} ya ha alcanzado el Séptimo Sentido!`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el Séptimo Sentido!` });
                restoreConcentrationIfNeeded(); return;
            }
        }

        let statChanges = {};
        if (!isRecoveringFromPuntosVitales && !attacker.stats.septimoSentidoActivo) {
            statChanges.septimoSentidoIntentado = true;
        }

        const rollVal = rollD20();
        const septimoSentidoTargetRange = attacker.supportRanges?.septimo_sentido || [17, 20];
        logMessage(`${attacker.name} tira un ${rollVal}.`);

        if (isRecoveringFromPuntosVitales) {
            logMessage(`(Necesita 15-18 para recuperarse, 19-20 para recuperarse y ganar 7º Sentido)`);
            if (rollVal >= 19) {
                logMessage(`¡ÉXITO MAYOR! ${attacker.name} se recupera de Puntos Vitales Y alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})`);
                statChanges = { ...statChanges, puntosVitalesGolpeados: false, septimoSentidoActivo: true, septimoSentidoIntentado: true };
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Recuperación y Séptimo Sentido', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} se recupera y alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})!`, outcome: 'success_major' });
            } else if (rollVal >= 15) {
                logMessage(`¡ÉXITO! ${attacker.name} se recupera de los Puntos Vitales (Tirada: ${rollVal})`);
                statChanges = { ...statChanges, puntosVitalesGolpeados: false };
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Recuperación de Puntos Vitales', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} se recupera de los Puntos Vitales (Tirada: ${rollVal})!`, outcome: 'success' });
            } else {
                logMessage(`¡FALLO! ${attacker.name} no logra recuperarse (Tirada: ${rollVal}). Sigue afectado por Puntos Vitales.`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Recuperación Fallido', attackerName: attacker.name, roll: rollVal, message: `${attacker.name} no logra recuperarse de Puntos Vitales (Tirada: ${rollVal}).`, outcome: 'failure' });
            }
        } else {
            logMessage(`(Necesita ${septimoSentidoTargetRange.join('-')} para alcanzar el Séptimo Sentido)`);
            if (rollVal >= septimoSentidoTargetRange[0] && rollVal <= septimoSentidoTargetRange[1]) {
                logMessage(`¡ÉXITO! ¡${attacker.name} ha alcanzado el SÉPTIMO SENTIDO! (Tirada: ${rollVal})`);
                statChanges = { ...statChanges, septimoSentidoActivo: true };
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Séptimo Sentido Alcanzado', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})! Sus habilidades se potencian.`, outcome: 'success' });
            } else {
                logMessage(`¡FALLO! ${attacker.name} no pudo alcanzar el Séptimo Sentido esta vez (Tirada: ${rollVal}).`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Séptimo Sentido Fallido', attackerName: attacker.name, roll: rollVal, message: `${attacker.name} no logra alcanzar el Séptimo Sentido (Tirada: ${rollVal}).`, outcome: 'failure' });
            }
        }
        updatePlayerStatsAndHistory(attacker.id, statChanges, actionName);
        if (concentrationConsumed && requiredConcentration > 0) {
             updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'golpear_puntos_vitales') {
        logMessage(`${attacker.name} intenta golpear los ¡Puntos Vitales de ${defender.name}!`);
        if (attacker.stats.puntosVitalesUsadoPorAtacante) {
            logMessage(`¡${attacker.name} ya usó Golpear Puntos Vitales en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya usaste Golpear Puntos Vitales este combate!` });
            restoreConcentrationIfNeeded(); return;
        }
        if (defender.stats.septimoSentidoActivo) {
            logMessage(`¡No se puede usar Golpear Puntos Vitales contra ${defender.name} porque ya alcanzó el Séptimo Sentido!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${defender.name} está protegido por su Séptimo Sentido!` });
            restoreConcentrationIfNeeded(); return;
        }
        if (defender.stats.puntosVitalesGolpeados) {
            logMessage(`¡Los Puntos Vitales de ${defender.name} ya han sido golpeados!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Los Puntos Vitales de ${defender.name} ya están afectados!` });
            restoreConcentrationIfNeeded(); return;
        }

        let attackerStatChanges = { puntosVitalesUsadoPorAtacante: true };
        let isGameOver = false;

        let targetRange = [...(attacker.supportRanges?.puntos_vitales || [17, 20])];
        const pvBonusString = attacker.bonuses?.pasivos?.find(b => b.toLowerCase().includes('puntos vitales'));
        if (pvBonusString) {
            const match = pvBonusString.match(/([+-])(\d+)/);
            if (match) {
                const bonusValue = parseInt(match[2], 10);
                if (match[1] === '+') targetRange[0] -= bonusValue; else targetRange[0] += bonusValue;
                targetRange[0] = Math.max(1, Math.min(20, targetRange[0]));
                logMessage(`${attacker.name} tiene un bono de ${pvBonusString}, nuevo rango: ${targetRange.join('-')}`);
            }
        }
        const rollVal = rollD20();
        logMessage(`${attacker.name} tira un ${rollVal} para Golpear Puntos Vitales (Necesita ${targetRange.join('-')}).`);

        if (rollVal >= targetRange[0] && rollVal <= targetRange[1]) {
            logMessage(`¡ÉXITO! ¡${attacker.name} golpea los Puntos Vitales de ${defender.name}! (Tirada: ${rollVal})`);
            const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
            setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, puntosVitalesGolpeados: true } }));

            const { gameOver } = applyDamage(defender.id, 20, 'directPV');
            isGameOver = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Puntos Vitales Golpeados', attackerName: attacker.name, defenderName: defender.name, roll: rollVal, damage: 20, message: `¡${attacker.name} golpea los Puntos Vitales de ${defender.name} (Tirada: ${rollVal})! Pierde 20 PV y sus habilidades se debilitan.`, outcome: 'success' });
        } else {
            logMessage(`¡FALLO! ${attacker.name} no pudo golpear los Puntos Vitales (Tirada: ${rollVal}).`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Puntos Vitales Fallido', attackerName: attacker.name, defenderName: defender.name, roll: rollVal, message: `${attacker.name} falla al intentar golpear los Puntos Vitales (Tirada: ${rollVal}).`, outcome: 'failure' });
        }

        updatePlayerStatsAndHistory(attacker.id, attackerStatChanges, actionName);
        if (concentrationConsumed && requiredConcentration > 0) {
             updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }

        if (!isGameOver) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'quebrar') {
        logMessage(`${attacker.name} intenta Quebrar la armadura de ${defender.name}!`);
        if (attacker.stats.quebrarUsedThisCombat) { logMessage("Quebrar ya usado."); restoreConcentrationIfNeeded(); return; }
        if (defender.stats.currentPA <= 0) { logMessage("Armadura rival ya rota."); restoreConcentrationIfNeeded(); return; }

        const numberOfDice = 5; const rolls = []; let oddRollsCount = 0;
        for (let i = 0; i < numberOfDice; i++) { const roll = rollD20(); rolls.push(roll); if (roll % 2 !== 0) oddRollsCount++; }
        logMessage(`${attacker.name} lanza ${numberOfDice} dados para Quebrar: ${rolls.join(', ')}. Resultados impares: ${oddRollsCount}.`);
        let gameOverByQuebrar = false;
        if (oddRollsCount > 0) {
            let damagePerImparQuebrar = attacker.actions.destrozar?.damagePerHit || 15;
            if (attacker.stats.septimoSentidoActivo) { damagePerImparQuebrar += 5; logMessage(`(7S: +5 Daño)`); }
            if (attacker.stats.puntosVitalesGolpeados) { damagePerImparQuebrar = Math.max(0, damagePerImparQuebrar - 5); logMessage(`(PV: -5 Daño)`); }
            const totalDamage = oddRollsCount * damagePerImparQuebrar;
            const { gameOver } = applyDamage(defender.id, totalDamage, 'directPA'); gameOverByQuebrar = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Quebrar', message: `${attacker.name} quiebra armadura! ${oddRollsCount} impares (${rolls.join(', ')}), ${totalDamage} daño PA.` });
        } else setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Quebrar', message: `${attacker.name} falla Quebrar (${rolls.join(', ')}).` });

        updatePlayerStatsAndHistory(attacker.id, { quebrarUsedThisCombat: true, concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, actionName);

        if (!gameOverByQuebrar) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'apresar') {
        logMessage(`${attacker.name} intenta Apresar a ${defender.name}!`);
        if (attacker.stats.apresarUsedThisCombat) { logMessage("Apresar ya usado."); restoreConcentrationIfNeeded(); return; }

        const numberOfDice = 5; const rolls = []; let oddRollsCount = 0;
        for (let i = 0; i < numberOfDice; i++) { const roll = rollD20(); rolls.push(roll); if (roll % 2 !== 0) oddRollsCount++; }
        logMessage(`${attacker.name} lanza ${numberOfDice} dados para Apresar: ${rolls.join(', ')}. Resultados impares: ${oddRollsCount}.`);
        let gameOverByApresar = false;
        if (oddRollsCount > 0) {
            let damagePerImparApresar = attacker.actions.presa?.damagePerHit || 15;
            if (attacker.stats.septimoSentidoActivo) { damagePerImparApresar += 5; logMessage(`(7S: +5 Daño)`); }
            if (attacker.stats.puntosVitalesGolpeados) { damagePerImparApresar = Math.max(0, damagePerImparApresar - 5); logMessage(`(PV: -5 Daño)`); }
            const totalDamage = oddRollsCount * damagePerImparApresar;
            const { gameOver } = applyDamage(defender.id, totalDamage, 'directPV'); gameOverByApresar = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Apresar', message: `${attacker.name} apresa! ${oddRollsCount} impares (${rolls.join(', ')}), ${totalDamage} daño PV.` });
        } else setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Apresar', message: `${attacker.name} falla Apresar (${rolls.join(', ')}).` });

        updatePlayerStatsAndHistory(attacker.id, { apresarUsedThisCombat: true, concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, actionName);

        if (!gameOverByApresar) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'furia') {
        if (attacker.stats.furiaUsedThisCombat) { logMessage("Furia ya usada."); restoreConcentrationIfNeeded(); return; }
        let baseDamagePerHitFuria = attacker.actions.golpe || 0;
        if (attacker.stats.septimoSentidoActivo) { baseDamagePerHitFuria += 10; logMessage(`(7S: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamagePerHitFuria = Math.max(0, baseDamagePerHitFuria - 10); logMessage(`(PV: -10 Daño/golpe)`); }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Furia - Ataque 1/3', message: `${attacker.name} inicia Furia!` });
        setActionState({ active: true, type: 'Furia', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentHit: 1, totalHits: 3, baseDamagePerHit: baseDamagePerHitFuria, blockDamagePA: 10, allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'], defenseBonuses: {}, furiaHitsLandedInSequence: 0 });
        if (concentrationConsumed && requiredConcentration > 0) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        return;
    }
    else if (actionName === 'arrojar') {
        if (attacker.stats.arrojarUsedThisCombat) { logMessage("Arrojar ya usado."); restoreConcentrationIfNeeded(); return; }
        let baseDamagePerHitArrojar = 30;
        if (attacker.stats.septimoSentidoActivo) { baseDamagePerHitArrojar += 10; logMessage(`(7S: +10 Daño/obj)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamagePerHitArrojar = Math.max(0, baseDamagePerHitArrojar - 10); logMessage(`(PV: -10 Daño/obj)`); }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Arrojar - Ataque 1/6', message: `${attacker.name} inicia Arrojar! (+2 Esq, -2 Bloq para rival)` });
        setActionState({ active: true, type: 'Arrojar', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentHit: 1, totalHits: 6, baseDamagePerHit: baseDamagePerHitArrojar, blockDamagePA: 10, allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'], defenseBonuses: { esquivar: -2, bloquear: 2 }, hitsLandedThisTurn: 0, damageDealtThisTurn: 0 });
        if (concentrationConsumed && requiredConcentration > 0) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        return;
    }
    else if (actionName === 'doble_salto') {
        if (attacker.stats.dobleSaltoUsedThisCombat) { logMessage("Doble Salto ya usado."); restoreConcentrationIfNeeded(); return; }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Doble Salto', message: `${attacker.name} realiza Doble Salto!` });
        setActionState({ active: true, type: 'DobleSalto', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', allowedDefenses: ['esquivar'], defenseBonuses: { esquivar: 4 } });
        if (concentrationConsumed && requiredConcentration > 0) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        return;
    }
    else if (actionName === 'combo_velocidad_luz') {
        if (attacker.stats.comboVelocidadLuzUsedThisCombat) { logMessage("Combo Vel. Luz ya usado."); restoreConcentrationIfNeeded(); return; }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo Vel. Luz - Golpe 1', message: `${attacker.name} inicia Combo Vel. Luz!` });
        setActionState(prev => ({ ...prev, active: true, type: 'ComboVelocidadLuz', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, allowedDefenses: ['esquivar', 'bloquear'], furiaHitsLandedInSequence: 0 }));
        if (concentrationConsumed && requiredConcentration > 0) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        return;
    }
    else if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        logMessage(`${attacker.name} inicia Acción: ${actionName.replace(/_/g, ' ')}!`);
        const displayActionName = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_',' ');
        const actionStateType = actionName.charAt(0).toUpperCase() + actionName.slice(1);
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: displayActionName, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} usa ${displayActionName} contra ${defender.name}!` });
        let allowedDefensesForAction = null;
        let defenseBonusesForAction = {};
        if (actionName === 'velocidad_luz') { allowedDefensesForAction = ['esquivar', 'bloquear']; defenseBonusesForAction = { bloquear: 6 }; }
        else if (actionName === 'salto') { defenseBonusesForAction = { bloquear: 2 }; }
        else if (actionName === 'lanzar_obj') { defenseBonusesForAction = { esquivar: -2, bloquear: 2 }; }
        else if (actionName === 'cargar') { defenseBonusesForAction = { esquivar: -2, contraatacar: -2}; }
        setActionState(prev => ({ ...prev, active: true, type: actionStateType, attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', allowedDefenses: allowedDefensesForAction, defenseBonuses: defenseBonusesForAction, furiaHitsLandedInSequence: 0, }));
        if (concentrationConsumed && requiredConcentration > 0) {
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null);
        }
        return;
    }
    else if (actionName === 'llave') {
        if (attacker.stats.resistenciaAvailable) {
            setActionState({ active: true, type: 'llave', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿usar Resistencia (+2) para Llave?` });
            if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
            return;
        } else {
            const gameOver = resolveLlaveAction(attacker, defender, 0);
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, 'llave');
            if (!gameOver) {
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
            return;
        }
    }
    else if (actionName === 'lanzamientos_sucesivos') {
        if (attacker.stats.lanzamientosSucesivosUsedThisCombat) { logMessage("Lanz. Suc. ya usado."); restoreConcentrationIfNeeded(); return; }
        if (attacker.stats.resistenciaAvailable) {
            setActionState({ active: true, type: 'lanzamientos_sucesivos', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿usar Resistencia (+2) para Lanz. Sucesivos?` });
            if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
            return;
        } else {
            const gameOver = await resolveLanzamientoSucesivo(attacker, defender, 0);
            updatePlayerStatsAndHistory(attacker.id, { lanzamientosSucesivosUsedThisCombat: true, concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, 'lanzamientos_sucesivos');
            if (!gameOver && actionState.stage !== 'game_over') {
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
            return;
        }
    }
    else if (actionName === 'presa' || actionName === 'destrozar') {
        const isPresa = actionName === 'presa';
        if (!isPresa && defender.stats.currentPA <= 0) {
            logMessage(`Armadura de ${defender.name} ya rota. Destrozar sin efecto.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destrozar', outcome: 'no_armor', message: `¡Armadura de ${defender.name} ya rota!` });
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, actionName);
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            return;
        }
        let damagePerHitBase = attacker.actions[actionName]?.damagePerHit || 15;
        if (attacker.stats.septimoSentidoActivo) {
            if (isPresa) { damagePerHitBase += 5; logMessage(`(7S: +5 Daño Presa)`); }
            else { damagePerHitBase += 5; logMessage(`(7S: +5 Daño Destrozar)`); }
        }
        if (attacker.stats.puntosVitalesGolpeados) {
            if (isPresa) { damagePerHitBase = Math.max(0, damagePerHitBase - 5); logMessage(`(PV: -5 Daño Presa)`); }
            else { damagePerHitBase = Math.max(0, damagePerHitBase - 5); logMessage(`(PV: -5 Daño Destrozar)`); }
        }
        let totalDamageAccumulated = 0, successfulHits = 0, successfulRolls = [], lastRollVal = null, isGameOverByAction = false;
        for (let i = 0; i < (attacker.actions[actionName]?.maxHits || 3); i++) {
            const rollVal = rollD20(); lastRollVal = rollVal;
            if (rollVal % 2 !== 0) { successfulHits++; totalDamageAccumulated += damagePerHitBase; successfulRolls.push(rollVal); }
        }
        if (totalDamageAccumulated > 0) {
            const { gameOver } = applyDamage(defender.id, totalDamageAccumulated, isPresa ? 'directPV' : 'directPA'); isGameOverByAction = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', message: `${attacker.name} ${actionName}: ${successfulHits} golpes (${successfulRolls.join(', ')}), ${totalDamageAccumulated} daño.`});
        } else setArenaEvent({ id: Date.now(), type: 'action_effect', message: `${attacker.name} falla ${actionName} (Última tirada: ${lastRollVal}).`});

        updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, actionName);
        if (!isGameOverByAction) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'romper') {
        if (['arms', 'legs', 'ribs'].every(part => defender.stats.brokenParts[part] >= 2)) {
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` });
            restoreConcentrationIfNeeded(); return;
        }
        setActionState({ active: true, type: 'Romper', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_romper_target', allowedDefenses: null });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper', message: `${attacker.name} se prepara para Romper...` });
        if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
        return;
    }
    else if (actionName === 'atrapar') {
        let bonus = attacker.stats.atrapar_bonus || 0;
        if (attacker.stats.septimoSentidoActivo) bonus += 1;
        if (attacker.stats.puntosVitalesGolpeados) bonus -= 1;
        const rollVal = rollD20() + bonus;
        const targetRange = [11,20];
        if (rollVal >= targetRange[0] && rollVal <= targetRange[1]) {
            setArenaEvent({id: Date.now(), message: `${attacker.name} atrapa! (Tirada ${rollVal})`});
            setActionState({active:true, type:'Atrapar', attackerId:attacker.id, defenderId:defender.id, stage:'awaiting_followup', allowedDefenses: null});
            if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
        } else {
            setArenaEvent({id: Date.now(), message: `${attacker.name} falla Atrapar (Tirada ${rollVal})`});
            updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: (concentrationConsumed && requiredConcentration > 0) ? 0 : attacker.stats.concentrationLevel }, actionName);
            setActionState(prev=>({...prev, active:false, type: null, stage: null}));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'combo') {
        setActionState(prev => ({ ...prev, active: true, type: 'Combo', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, currentHit: 1, currentDefensePenalty: 0, allowedDefenses: null, furiaHitsLandedInSequence: 0 }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo - Golpe 1', message: `${attacker.name} lanza el primer golpe del combo!` });
        if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
        return;
    }
    else if (actionName === 'engaño') {
        setActionState(prev => ({ ...prev, active: true, type: 'Engaño', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense_part_1', allowedDefenses: null, defenseBonuses: { esquivar: -2 }, furiaHitsLandedInSequence: 0 }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Engaño - Ataque Falso', message: `${attacker.name} lanza un ataque falso (+2 Esq. para ${defender.name})!` });
        if (concentrationConsumed && requiredConcentration > 0) { updatePlayerStatsAndHistory(attacker.id, { concentrationLevel: 0 }, null); }
        return;
    }
    else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
        const usedThisCombatKey = `${actionName}UsedThisCombat`;
        const availableKey = `${actionName}Available`;
        const readableName = actionName.charAt(0).toUpperCase() + actionName.slice(1);
        if (attacker.stats[usedThisCombatKey]) { setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `¡${readableName} ya usada!` }); restoreConcentrationIfNeeded(); return; }
        if (attacker.stats[availableKey]) { setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `¡Bono ${readableName} ya activo!` }); restoreConcentrationIfNeeded(); return; }

        let statChanges = { [availableKey]: true, [usedThisCombatKey]: true };
        if (concentrationConsumed && requiredConcentration > 0) {
            statChanges.concentrationLevel = 0;
        }
        updatePlayerStatsAndHistory(attacker.id, statChanges, actionName);

        let bonusMessage = "";
        if(actionName === 'fortaleza') bonusMessage = "+3 Bloq"; else if(actionName === 'agilidad') bonusMessage = "+3 Esq"; else if(actionName === 'destreza') bonusMessage = "+2 ContrAtq"; else if(actionName === 'resistencia') bonusMessage = "+2 Ataque Llave/Lanz.";
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${readableName} Activada`, message: `¡${attacker.name} activa ${readableName}! (${bonusMessage})` });
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else {
        logMessage(`Acción ${actionName} no implementada o reconocida.`);
        restoreConcentrationIfNeeded();
    }
  };

  const handleResistenciaChoice = async (actionNameRes, useBonus) => {
      if (!actionState.active || actionState.stage !== 'awaiting_resistencia_choice' || actionState.attackerId !== currentPlayerId) {
        logMessage("Estado inválido para elegir uso de Resistencia.");
        return;
      }
      const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
      const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
      const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;

      let bonusValue = 0;
      let statChangesForAttacker = {};

      if (useBonus) {
          if (attacker.stats.resistenciaAvailable) {
              logMessage(`${attacker.name} elige usar Resistencia (+2) para ${actionNameRes.replace('_', ' ')}.`);
              bonusValue = 2;
              statChangesForAttacker.resistenciaAvailable = false;
          } else {
              logMessage(`¡ERROR! ${attacker.name} intentó usar Resistencia pero no estaba disponible.`);
          }
      } else {
          logMessage(`${attacker.name} elige NO usar Resistencia para ${actionNameRes.replace('_', ' ')}.`);
      }

      let gameOver = false;
      if (actionNameRes === 'llave') {
          gameOver = resolveLlaveAction(attacker, currentDefenderData, bonusValue);
          statChangesForAttacker.lastActionType = 'llave';
      } else if (actionNameRes === 'lanzamientos_sucesivos') {
          statChangesForAttacker.lanzamientosSucesivosUsedThisCombat = true;
          gameOver = await resolveLanzamientoSucesivo(attacker, currentDefenderData, bonusValue);
          statChangesForAttacker.lastActionType = 'lanzamientos_sucesivos';
      }

      updatePlayerStatsAndHistory(attacker.id, statChangesForAttacker, actionNameRes);

      if (!gameOver && actionState.stage !== 'game_over') {
          setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
      }
  };

  const handleDefenseSelection = async (defenseType) => {
    console.log("--- handleDefenseSelection INICIO ---");
    console.log("Action State Actual:", JSON.parse(JSON.stringify(actionState)));

    if (!actionState.active || !actionState.stage?.startsWith('awaiting_defense') || !actionState.attackerId || !actionState.defenderId) {
        logMessage("Estado inválido para selección de defensa.");
        console.log("--- handleDefenseSelection FIN (Estado Inválido) ---");
        return;
    }

    const attackerId = actionState.attackerId;
    const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data;
    const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderDataProvisional = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data;


    const actionType = actionState.type;
    const currentStage = actionState.stage;
    const baseDefenseType = defenseType.startsWith('esquivar') ? 'esquivar' :
                           defenseType.startsWith('bloquear') ? 'bloquear' :
                           defenseType.startsWith('contraatacar') ? 'contraatacar' : defenseType;

    console.log(`Defender: ${defender.name}, ActionType: ${actionType}, DefenseType: ${defenseType}, BaseDefenseType: ${baseDefenseType}`);

    if (actionState.allowedDefenses && !actionState.allowedDefenses.includes(baseDefenseType)) {
        logMessage(`¡Defensa inválida! ${baseDefenseType} no permitido contra ${actionType.replace(/_/g," ")}.`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${baseDefenseType} no permitido contra ${actionType.replace(/_/g," ")}!` });
        if (actionType === 'Arrojar' || actionType === 'Furia') {
            logMessage(`Ataque de ${actionType} #${actionState.currentHit} conecta debido a defensa inválida.`);
            const damageToApply = actionState.baseDamagePerHit;
            const { gameOver: hitGameOver, actualDamageDealt } = applyDamage(defenderId, damageToApply);
            let updatedActionState = { ...actionState };
            if (actionType === 'Arrojar') { updatedActionState.hitsLandedThisTurn += 1; updatedActionState.damageDealtThisTurn += actualDamageDealt; }
            else if (actionType === 'Furia') { updatedActionState.furiaHitsLandedInSequence += 1; }

            if (hitGameOver || updatedActionState.currentHit >= updatedActionState.totalHits) {
                const finalActionName = actionType.toLowerCase();
                let attackerStatChanges = {};
                if (finalActionName === 'furia') attackerStatChanges.furiaUsedThisCombat = true;
                if (finalActionName === 'arrojar') attackerStatChanges.arrojarUsedThisCombat = true;
                updatePlayerStatsAndHistory(attackerId, attackerStatChanges, finalActionName);

                setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentHit: 0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0 }));
                if (!hitGameOver) { const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id; setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);}
            } else {
                updatedActionState.currentHit += 1; updatedActionState.stage = 'awaiting_defense';
                let defenseModText = "";
                if (actionType === 'Furia') { let penalty = 0; if (updatedActionState.furiaHitsLandedInSequence === 1) penalty = 2; else if (updatedActionState.furiaHitsLandedInSequence >= 2) penalty = 4; updatedActionState.defenseBonuses = { esquivar: penalty, bloquear: penalty }; if (penalty > 0) defenseModText = `(Defensa rival: Esq/Bloq -${penalty})`; }
                else if (actionType === 'Arrojar') { defenseModText = `(${defender.name} tiene +2 Esq, -2 Bloq)`; }
                setActionState(updatedActionState);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${actionType} - Ataque ${updatedActionState.currentHit}/${updatedActionState.totalHits}`, message: `${attacker.name} continúa ${actionType}! ${defenseModText}` });
            }
        }
        console.log("--- handleDefenseSelection FIN (Defensa Inválida contra Acción) ---");
        return;
    }

    logMessage(`${defender.name} elige defenderse con: ${defenseType.replace(/_/g, ' ')}`);
    const rollVal = rollD20();
    let defenseSuccessful = false;
    let damageToDefender = 0, damageToDefenderPA = 0, damageToAttacker = 0;
    let isGameOverByThisHit = false, rollOutcome = 'failure', targetMin = null, targetMax = null;
    let defenseBonusOrPenaltyText = '', baseDamage = 0;

    let defenseSpecificBonus = 0;
    let defenderStatChanges = {};
    if (defenseType === 'bloquear_fortaleza' && defender.stats.fortalezaAvailable) { defenseSpecificBonus = 3; defenderStatChanges.fortalezaAvailable = false; logMessage("Fortaleza usada");}
    else if (defenseType === 'esquivar_agilidad' && defender.stats.agilidadAvailable) { defenseSpecificBonus = 3; defenderStatChanges.agilidadAvailable = false; logMessage("Agilidad usada");}
    else if (defenseType === 'contraatacar_destreza' && defender.stats.destrezaAvailable) { defenseSpecificBonus = 2; defenderStatChanges.destrezaAvailable = false; logMessage("Destreza usada");}

    if (Object.keys(defenderStatChanges).length > 0) {
        updatePlayerStatsAndHistory(defenderId, defenderStatChanges, null);
    }


    let actionDefenseModifier = actionState.defenseBonuses?.[baseDefenseType] || 0;
    let septimoSentidoDefensaBonus = defender.stats.septimoSentidoActivo ? 1 : 0;
    let puntosVitalesDefensaPenaltyValue = defender.stats.puntosVitalesGolpeados ? 1 : 0;

    // Incorporar penalizadores por partes rotas del DEFENSOR
    const breakPenalties = defender.stats.statPenaltiesFromBreaks || { esquivar: 0, bloquear: 0, contraatacar: 0 };
    let specificBreakPenaltyValue = 0; // Este será el valor del penalizador (ej. -1, -2)

    if (baseDefenseType === 'esquivar') {
        specificBreakPenaltyValue = breakPenalties.esquivar;
    } else if (baseDefenseType === 'bloquear') {
        specificBreakPenaltyValue = breakPenalties.bloquear;
    } else if (baseDefenseType === 'contraatacar') {
        specificBreakPenaltyValue = breakPenalties.contraatacar;
    }
    
    // finalRequiredRollAdjustment se suma al 'min' del rango de defensa.
    // Si specificBreakPenaltyValue es -1 (un malus), queremos que targetMin AUMENTE.
    // Entonces, restamos el penalizador: X - (-1) = X + 1.
    const finalRequiredRollAdjustment = actionDefenseModifier - defenseSpecificBonus - specificBreakPenaltyValue;


    if (actionDefenseModifier !== 0) defenseBonusOrPenaltyText += ` (Acción: ${actionDefenseModifier > 0 ? '-' : '+'}${Math.abs(actionDefenseModifier)})`;
    if (defenseSpecificBonus !== 0) defenseBonusOrPenaltyText += ` (Boost: +${defenseSpecificBonus})`;
    if (septimoSentidoDefensaBonus !==0 && (baseDefenseType === 'esquivar' || baseDefenseType === 'bloquear' || baseDefenseType === 'contraatacar')) defenseBonusOrPenaltyText += ` (7ºS Def: +1 Rango)`;
    if (puntosVitalesDefensaPenaltyValue !==0 && (baseDefenseType === 'esquivar' || baseDefenseType === 'bloquear' || baseDefenseType === 'contraatacar')) defenseBonusOrPenaltyText += ` (PV Def: -1 Rango)`;
    if (specificBreakPenaltyValue !== 0) defenseBonusOrPenaltyText += ` (Roto: ${specificBreakPenaltyValue > 0 ? '+' : ''}${specificBreakPenaltyValue})`;


    const actionKey = actionType.toLowerCase().replace('_opcion', '_op').replace('vel_luz', 'velocidad_luz');
    const attackerBreakPenalties = attacker.stats.statPenaltiesFromBreaks || { golpeDamageReduction: 0 };
    const golpeDamageReductionFromBreaks = attackerBreakPenalties.golpeDamageReduction || 0;

    if (actionType === 'Arrojar') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Furia') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') baseDamage = 20;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') {
        baseDamage = 50;
    }
    else if (actionType === 'Combo') {
        baseDamage = attacker.actions.golpe;
        if (golpeDamageReductionFromBreaks > 0) {
            baseDamage = Math.max(0, baseDamage - golpeDamageReductionFromBreaks);
            logMessage(`(Atacante con partes rotas: -${golpeDamageReductionFromBreaks} Daño/Golpe Combo)`);
        }
    }
    else if (actionType === 'ComboVelocidadLuz') {
        baseDamage = attacker.actions.velocidad_luz || 50;
        if (golpeDamageReductionFromBreaks > 0) {
            baseDamage = Math.max(0, baseDamage - golpeDamageReductionFromBreaks);
            logMessage(`(Atacante con partes rotas: -${golpeDamageReductionFromBreaks} Daño/Golpe ComboVelLuz)`);
        }
    }
    else if (actionType === 'DobleSalto') {
        baseDamage = (attacker.actions.salto || 0) + 20; // DobleSalto parece más un Salto potente, no necesariamente un "Golpe"
    }
    else if (actionType.startsWith('Atrapar_')) baseDamage = actionState.baseDamage || 0;
    else baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || 0;

    // Aplicar reducción de daño por partes rotas para acciones de tipo "Golpe" individuales
    if (golpeDamageReductionFromBreaks > 0) {
        if (['golpe', 'velocidad_luz', 'embestir', 'cargar'].includes(actionKey) && 
            !['Combo', 'ComboVelocidadLuz'].includes(actionType)) { // Evitar doble aplicación para combos
            baseDamage = Math.max(0, baseDamage - golpeDamageReductionFromBreaks);
            logMessage(`(Atacante con partes rotas: -${golpeDamageReductionFromBreaks} Daño a ${actionType})`);
        }
    }

    // Aplicar bonos/malus de 7S y PV del atacante DESPUÉS de la reducción por partes rotas
    if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') {
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño)`); }
    }
    else if (actionType === 'Combo') {
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño/golpe)`); }
    }
    else if (actionType === 'ComboVelocidadLuz') {
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño/golpe)`); }
    }
    else if (actionType === 'DobleSalto') {
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 30; logMessage(`(7S Atacante: +30 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 20); logMessage(`(PV Atacante: -20 Daño)`); }
    }
    else if (actionType === 'MeteorosPegaso') {
        baseDamage = actionState.baseDamagePerHit || 20; // 20 de daño por cada meteoro
        logMessage(`Meteoro ${actionState.currentHit} de ${actionState.totalHits}`);
    }
    else if (!actionType.startsWith('Atrapar_') && !['DobleSalto', 'Combo', 'ComboVelocidadLuz', 'Engaño', 'Arrojar', 'Furia'].includes(actionType)) {
        if (attacker.stats.septimoSentidoActivo && ['golpe', 'lanzar_obj', 'salto', 'velocidad_luz', 'embestir', 'cargar'].includes(actionKey)) {
            baseDamage += 30; logMessage(`(7S Atacante: +30 Daño a ${actionType})`);
        }
        if (attacker.stats.puntosVitalesGolpeados && ['golpe', 'lanzar_obj', 'salto', 'velocidad_luz', 'embestir', 'cargar'].includes(actionKey)) {
            baseDamage = Math.max(0, baseDamage - 20); logMessage(`(PV Atacante: -20 Daño a ${actionType})`);
        }
    }
    console.log(`Roll de Defensa: ${rollVal}, BaseDamage calculado para ${actionType}: ${baseDamage}`);

    if (rollVal === 1 && baseDefenseType !== 'invalid') { defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage; logMessage("¡Fallo Crítico en defensa (1)!"); }
    else if (baseDefenseType === 'esquivar') {
        let [min, max] = defender.defenseRanges.esquivar;
        targetMin = Math.min(21, Math.max(1, min + finalRequiredRollAdjustment - septimoSentidoDefensaBonus + puntosVitalesDefensaPenaltyValue));
        targetMax = max;
        if (rollVal >= targetMin && rollVal <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; }
        else { defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'failure'; }
    } else if (baseDefenseType === 'bloquear') {
        let [min, max] = defender.defenseRanges.bloquear;
        if ((actionType === 'Atrapar_Opcion2' && defenseType !== 'bloquear') || actionType === 'Atrapar_Opcion7' || actionType === 'DobleSalto') { defenseSuccessful = false; rollOutcome = 'invalid'; damageToDefender = baseDamage; targetMin = null; targetMax = null; logMessage(`¡Bloqueo inválido contra ${actionType}!`);}
        else {
            targetMin = Math.min(21, Math.max(1, min + finalRequiredRollAdjustment - septimoSentidoDefensaBonus + puntosVitalesDefensaPenaltyValue));
            targetMax = max;
            if (rollVal >= targetMin && rollVal <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'blocked';
                if (actionType === 'Arrojar') damageToDefenderPA = actionState.blockDamagePA;
                else if (actionType === 'Furia') damageToDefenderPA = actionState.blockDamagePA;
                else if (['Golpe', 'Velocidad_luz', 'ComboVelocidadLuz'].includes(actionType)) damageToDefenderPA = 10;
                else if (['Lanzar_obj', 'Embestir', 'Cargar', 'Salto'].includes(actionType)) damageToDefenderPA = 20;
                else if (actionType === 'Atrapar_Opcion2') damageToDefenderPA = actionState.blockDamagePA || 20;
                else if (actionType === 'Atrapar_Opcion4') damageToDefenderPA = actionState.blockDamagePA || 10;
                else damageToDefenderPA = 10;
            } else { defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
    } else if (baseDefenseType === 'contraatacar') {
         let [min, max] = defender.defenseRanges.contraatacar;
         const contraataqueRollAdjustment = (actionType === 'Furia' ? 0 : actionDefenseModifier) - defenseSpecificBonus;
         if (['Atrapar_Opcion2', 'Atrapar_Opcion7', 'DobleSalto', 'Velocidad_luz', 'ComboVelocidadLuz'].includes(actionType)) { 
             defenseSuccessful = false; 
             rollOutcome = 'invalid'; 
             damageToDefender = baseDamage; 
             targetMin = null; 
             targetMax = null; 
             logMessage(`¡Contraataque inválido contra ${actionType}!`);
         }
         else {
            targetMin = Math.min(21, Math.max(1, min + contraataqueRollAdjustment - septimoSentidoDefensaBonus + puntosVitalesDefensaPenaltyValue));
            targetMax = max;
            if (rollVal >= targetMin && rollVal <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'countered';
                // Aplicar reducción de daño al contraataque si el DEFENSOR (quien contraataca) tiene partes rotas
                let counterDamage = Math.floor((defender.actions.golpe || 30) / 2);
                const defenderBreakPenalties = defender.stats.statPenaltiesFromBreaks || { golpeDamageReduction: 0 };
                const counterDamageReduction = defenderBreakPenalties.golpeDamageReduction || 0;
                if (counterDamageReduction > 0) {
                    counterDamage = Math.max(0, counterDamage - counterDamageReduction);
                    logMessage(`(Contraataque del Defensor debilitado por partes rotas: -${counterDamageReduction} Daño)`);
                }
                damageToAttacker = counterDamage;
                
                // Si se contraataca exitosamente un meteoro, se aplica el daño pero se continúa con los meteoros restantes
                if (actionType === 'MeteorosPegaso') {
                    logMessage(`¡${defender.name} ha contraatacado exitosamente el meteoro!`);
                }
            } else { defenseSuccessful = false; damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
    }
    console.log(`Resultado Defensa: defenseSuccessful=${defenseSuccessful}, rollOutcome=${rollOutcome}, targetMin=${targetMin}, targetMax=${targetMax}`);

    let attackerDamageMessage = "", defenderDamageMessage = "";
    let damageResultDefender = { gameOver: false, actualDamageDealt: 0 };
    let damageResultAttacker = { gameOver: false, actualDamageDealt: 0 };
    if (damageToAttacker > 0) { damageResultAttacker = applyDamage(attackerId, damageToAttacker); attackerDamageMessage = `${attacker.name} recibe ${damageResultAttacker.actualDamageDealt} daño por contraataque.`; if (damageResultAttacker.gameOver) isGameOverByThisHit = true; }
    if (!isGameOverByThisHit && damageToDefender > 0) { damageResultDefender = applyDamage(defenderId, damageToDefender); defenderDamageMessage = `${defender.name} recibe ${damageResultDefender.actualDamageDealt} de daño.`; if (damageResultDefender.gameOver) isGameOverByThisHit = true; }
    if (!isGameOverByThisHit && damageToDefenderPA > 0) { damageResultDefender = applyDamage(defenderId, damageToDefenderPA, 'directPA'); defenderDamageMessage = `${defender.name} recibe ${damageResultDefender.actualDamageDealt} de daño a PA.`; if (damageResultDefender.gameOver) isGameOverByThisHit = true; }

    let hitContext = "";
    if (['Arrojar', 'Furia', 'Combo', 'ComboVelocidadLuz', 'MeteorosPegaso'].includes(actionType)) { 
        const hitNumber = actionState.currentHit || actionState.currentComboHit;
        hitContext = actionType === 'MeteorosPegaso' 
            ? ` (Meteoro ${hitNumber} de ${actionState.totalHits})` 
            : ` (Golpe ${hitNumber})`; 
    }
    const actionDisplayName = actionType === 'MeteorosPegaso' ? 'Meteoros de Pegaso' : actionType.replace(/_/g, ' ');
    let finalMessage = `${defender.name} intenta ${defenseType.replace(/_/g,' ')}${defenseBonusOrPenaltyText} vs ${actionDisplayName}${hitContext}. Tirada: ${rollVal}. `;
    if (targetMin !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
    switch (rollOutcome) { case 'success': finalMessage += "¡Éxito Defendiendo! "; break; case 'failure': finalMessage += "¡Fallo Defendiendo! "; break; case 'blocked': finalMessage += "¡Bloqueado! "; break; case 'countered': finalMessage += "¡Contraatacado! "; break; case 'invalid': finalMessage += "¡Defensa Inválida! "; break; default: finalMessage += "Resultado: "; break; }
    finalMessage += defenderDamageMessage + " " + attackerDamageMessage;
    const resolutionEvent = { id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace(/_/g, ' ')}${hitContext} vs ${defenseType.replace(/_/g,' ')}`, rollerName: defender.name, rollValue: rollVal, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: finalMessage.trim(), gameOver: isGameOverByThisHit };
    setArenaEvent(resolutionEvent); logMessage(finalMessage);
    await delay(1500);

    if (isGameOverByThisHit) { if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); } console.log("--- handleDefenseSelection FIN (Game Over) ---"); return; }

    let actionCompletedName = null;
    let attackerStatChangesOnComplete = {};

    if (actionType === 'Arrojar' || actionType === 'Furia' || actionType === 'MeteorosPegaso') {
        let updatedActionState = { ...actionState };
        if (actionType === 'Arrojar') { 
            if (damageResultDefender.actualDamageDealt > 0 || damageResultAttacker.actualDamageDealt > 0) { 
                updatedActionState.hitsLandedThisTurn++; 
            } 
            updatedActionState.damageDealtThisTurn += damageResultDefender.actualDamageDealt; 
        }
        else if (actionType === 'Furia') { 
            if (rollOutcome === 'failure' || rollOutcome === 'invalid' || (rollOutcome === 'countered' && damageToDefender > 0)) { 
                updatedActionState.furiaHitsLandedInSequence++; 
            } 
        }
        // Para Meteoros de Pegaso, siempre continuamos con el siguiente meteoro
        else if (actionType === 'MeteorosPegaso') {
            if (rollOutcome === 'countered') {
                logMessage(`¡${defender.name} ha contraatacado el meteoro!`);
            } else {
                logMessage(`Meteoro ${updatedActionState.currentHit} impacta con ${baseDamage} de daño.`);
            }
        }

        if (updatedActionState.currentHit >= updatedActionState.totalHits) {
            actionCompletedName = actionType === 'MeteorosPegaso' ? 'usar_poder' : actionType.toLowerCase();
            if (actionType === 'Furia') attackerStatChangesOnComplete.furiaUsedThisCombat = true;
            else if (actionType === 'Arrojar') attackerStatChangesOnComplete.arrojarUsedThisCombat = true;
            logMessage(`Secuencia de ${actionType} terminada.`);
        } else {
            updatedActionState.currentHit += 1; updatedActionState.stage = 'awaiting_defense';
            let defenseModText = "";
            if (actionType === 'Furia') { let penalty = 0; if (updatedActionState.furiaHitsLandedInSequence === 1) penalty = 2; else if (updatedActionState.furiaHitsLandedInSequence >= 2) penalty = 4; updatedActionState.defenseBonuses = { esquivar: penalty, bloquear: penalty }; if (penalty > 0) defenseModText = `(Defensa rival: Esq/Bloq -${penalty})`; }
            else if (actionType === 'Arrojar') { defenseModText = `(${defender.name} tiene +2 Esq, -2 Bloq)`; }
            setActionState(updatedActionState);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${actionType} - Ataque ${updatedActionState.currentHit}/${updatedActionState.totalHits}`, message: `${attacker.name} continúa ${actionType}! ${defenseModText}` });
        }
    }
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') {
        if (!isGameOverByThisHit) {
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense_part_2', allowedDefenses: ['bloquear'], defenseBonuses: { bloquear: 3 } }));
            setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Engaño - Ataque Real', message: `${attacker.name} lanza ataque real! (${defender.name} solo Bloquear, -3 Penaliz.)` });
        }
    }
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') {
        actionCompletedName = 'engaño';
    }
    else if (actionType === 'Combo' || actionType === 'ComboVelocidadLuz') {
        const isComboVel = actionType === 'ComboVelocidadLuz';
        const currentComboHitState = isComboVel ? actionState.currentComboHit : actionState.currentHit;
        const currentComboHit = currentComboHitState || 1;

        if (defenseSuccessful || currentComboHit >= 3 ) {
            actionCompletedName = isComboVel ? 'combo_velocidad_luz' : 'combo';
            if (actionCompletedName === 'combo_velocidad_luz') attackerStatChangesOnComplete.comboVelocidadLuzUsedThisCombat = true;
            let finalComboMessage = defenseSuccessful ? `¡${defender.name} detiene el ${isComboVel ? 'Combo Vel. Luz' : 'Combo'} en golpe #${currentComboHit}!` : `¡${attacker.name} completa ${isComboVel ? 'Combo Vel. Luz' : 'Combo'} de 3 golpes!`;
            logMessage(finalComboMessage); setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: `Fin ${isComboVel ? 'Combo Vel. Luz' : 'Combo'}`, message: finalComboMessage });
        } else {
            const nextHit = currentComboHit + 1; let nextBonuses = {}; let messagePenalty = "";
            if (isComboVel) { nextBonuses = { esquivar: 4, bloquear: 6 }; messagePenalty = "(Esq -4, Bloq -6)"; }
            else { const penalty = nextHit === 2 ? 2 : 4; nextBonuses = { esquivar: penalty, bloquear: penalty, contraatacar: penalty }; messagePenalty = `(Defensa -${penalty})`; }
            logMessage(`¡Golpe #${currentComboHit} conecta! ${attacker.name} continúa con golpe #${nextHit}...`);
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense', [isComboVel ? 'currentComboHit' : 'currentHit']: nextHit, currentDefensePenalty: !isComboVel ? (nextHit === 2 ? 2 : 4) : prevState.currentDefensePenalty, defenseBonuses: nextBonuses }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${isComboVel ? 'Combo Vel. Luz' : 'Combo'} - Golpe ${nextHit}`, message: `${attacker.name} lanza golpe #${nextHit}! ${messagePenalty}` });
        }
    }
    else if (actionType === 'DobleSalto') {
        actionCompletedName = 'doble_salto';
        attackerStatChangesOnComplete.dobleSaltoUsedThisCombat = true;
    }
    else if (actionType.startsWith('Atrapar_')) {
        actionCompletedName = 'atrapar';
    }
    else {
        actionCompletedName = actionType.toLowerCase().replace('vel_luz', 'velocidad_luz');
    }


    if (actionCompletedName) {
      console.log(`Acción ${actionCompletedName} completada. Actualizando historial y pasando turno.`);
      updatePlayerStatsAndHistory(attacker.id, attackerStatChangesOnComplete, actionCompletedName);
      setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentHit: 0, totalHits:0, baseDamagePerHit:0, blockDamagePA:0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0, currentComboHit: 0, currentDefensePenalty: 0 }));
      if (!isGameOverByThisHit) {
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
      }
    }
    console.log("--- handleDefenseSelection FIN ---");
  };


  const handleAtraparFollowupSelect = async (optionId) => {
    if (!actionState.active || actionState.type !== 'Atrapar' || actionState.stage !== 'awaiting_followup') { return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;

    if (!attacker || !defender) { // Verificación crucial
        logMessage("Error en handleAtraparFollowupSelect: Datos de jugador no cargados.");
        return;
    }

    let gameOverByFollowup = false; const selectedOption = atraparFollowupOptions.find(opt => opt.id === optionId);
    logMessage(`${attacker.name} elige seguimiento de Atrapar: ${selectedOption?.name || optionId}`);
    let actionToLogForHistory = 'atrapar';
    let attackerStatChanges = {};

    switch (optionId) {
      case 'atrapar_op1': {
        let damagePerHit = 20;
        if (attacker.stats.septimoSentidoActivo) { damagePerHit += 10; logMessage(`(7S: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { damagePerHit = Math.max(0, damagePerHit - 10); logMessage(`(PV: -10 Daño/golpe)`); }
        const rolls = [rollD20(), rollD20(), rollD20()]; const oddRolls = rolls.filter(r => r % 2 !== 0); const oddCount = oddRolls.length; const damage = oddCount * damagePerHit;
        if (damage > 0) { const { gameOver } = applyDamage(defender.id, damage, 'normal'); gameOverByFollowup = gameOver; setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op1: ${oddCount} golpes (${rolls.join(',')}), ${damage} daño.`});}
        else { setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op1: Falla (Tiradas: ${rolls.join(',')}).`});}
        break;
      }
      case 'atrapar_op2': {
        let baseDmg = 80;
        if (attacker.stats.septimoSentidoActivo) { baseDmg += 30; logMessage(`(7S: +30 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDmg = Math.max(0, baseDmg - 20); logMessage(`(PV: -20 Daño)`); }
        setActionState({ ...actionState, type: 'Atrapar_Opcion2', stage: 'awaiting_defense', baseDamage: baseDmg, blockDamagePA: 20, allowedDefenses: ['bloquear'] });
        setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op2 (${baseDmg} daño). Rival solo Bloquear.`});
        return;
      }
      case 'atrapar_op3': {
        let damagePerHit = 20;
        if (attacker.stats.septimoSentidoActivo) { damagePerHit += 10; logMessage(`(7S: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { damagePerHit = Math.max(0, damagePerHit - 10); logMessage(`(PV: -10 Daño/golpe)`); }
        let successfulDamageHits = 0, successfulBlocks = 0, totalNormalDamage = 0, totalPADamage = 0;
        for (let i = 0; i < 3; i++) {
          if (gameOverByFollowup) break;
          const [minRoll, maxRoll] = defender.defenseRanges.bloquear; const roll = rollD20();
          let septimoSentidoDefBonus = defender.stats.septimoSentidoActivo ? 1 : 0;
          let pvDefPenalty = defender.stats.puntosVitalesGolpeados ? 1 : 0;
          const targetMinBlock = Math.min(21, Math.max(1, minRoll - septimoSentidoDefBonus + pvDefPenalty));
          const blocked = (roll >= targetMinBlock && roll <= maxRoll);
          if (blocked) { successfulBlocks++; const damagePA = 10; totalPADamage += damagePA; const{gameOver}=applyDamage(defender.id, damagePA, 'directPA'); if(gameOver)gameOverByFollowup=true; }
          else { successfulDamageHits++; const damageNormal = damagePerHit; totalNormalDamage += damageNormal; const{gameOver}=applyDamage(defender.id, damageNormal, 'normal'); if(gameOver)gameOverByFollowup=true; }
          if(!gameOverByFollowup) await delay(1000); else break;
        }
        setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op3: ${successfulDamageHits} imp, ${successfulBlocks} bloq. Daño: ${totalNormalDamage} PV, ${totalPADamage} PA.`});
        break;
      }
      case 'atrapar_op4': {
        let baseDmg = 60;
        if (attacker.stats.septimoSentidoActivo) { baseDmg += 30; logMessage(`(7S: +30 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDmg = Math.max(0, baseDmg - 20); logMessage(`(PV: -20 Daño)`); }
        setActionState({ ...actionState, type: 'Atrapar_Opcion4', stage: 'awaiting_defense', baseDamage: baseDmg, blockDamagePA: 10, defenseBonuses: { esquivar: 2, bloquear: 2, contraatacar: 2 }, allowedDefenses: null });
        setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op4 (${baseDmg} daño). Rival defiende con -2.`});
        return;
      }
      case 'atrapar_op5': {
        gameOverByFollowup = resolveLlaveAction(attacker, defender, 3);
        actionToLogForHistory = 'llave';
        break;
      }
      case 'atrapar_op6': {
        setActionState({ ...actionState, type: 'Atrapar_Opcion6', stage: 'awaiting_romper_target', romperBonus: 4 });
        setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op6 (Romper +4).`});
        return;
      }
      case 'atrapar_op7': {
        let baseDmg = 60;
        if (attacker.stats.septimoSentidoActivo) { baseDmg += 10; logMessage(`(7S: +10 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDmg = Math.max(0, baseDmg - 10); logMessage(`(PV: -10 Daño)`); }
        setActionState({ ...actionState, type: 'Atrapar_Opcion7', stage: 'awaiting_defense', baseDamage: baseDmg, allowedDefenses: ['esquivar'] });
        setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op7 (${baseDmg} daño). Rival solo Esquivar.`});
        return;
      }
      default: break;
    }

    updatePlayerStatsAndHistory(attacker.id, attackerStatChanges, actionToLogForHistory);

    if (!gameOverByFollowup && actionState.stage !== 'game_over') {
        await delay(1500);
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    } else if (gameOverByFollowup) {
        if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    }
  };

  const handleRomperTargetSelect = async (partToBreak) => {
    if (!actionState.active || actionState.stage !== 'awaiting_romper_target') { return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;

    if (!attacker || !defender) { // Verificación crucial
        logMessage("Error en handleRomperTargetSelect: Datos de jugador no cargados.");
        return;
    }

    const wasAtraparFollowup = actionState.type === 'Atrapar_Opcion6';
    const actionTypeForHistory = wasAtraparFollowup ? 'atrapar' : 'romper';
    let attackerStatChanges = {};

    if (defender.stats.brokenParts[partToBreak] >= 2) {
        setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `${partToBreak.charAt(0).toUpperCase() + partToBreak.slice(1)} no se puede romper más.` });
        updatePlayerStatsAndHistory(attacker.id, attackerStatChanges, actionTypeForHistory);
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    const bonus = actionState.romperBonus || 0;
    const gameOverByRomper = resolveRomperAttempt(attacker, defender, partToBreak, bonus);

    updatePlayerStatsAndHistory(attacker.id, attackerStatChanges, actionTypeForHistory);

    if (!gameOverByRomper) {
        await delay(1500);
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    } else {
      if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    }
  };

  const checkGameOver = () => {
    if (!player1Data || !player2Data) return false; // No hay juego si no hay datos de jugadores

    const p1Dead = player1Data.stats.currentPV <= 0;
    const p2Dead = player2Data.stats.currentPV <= 0;
    return p1Dead || p2Dead;
  };

  // RENDER LOGIC
  if (gameView === 'characterSelection') {
    return (
      <div className="app-container">
        <CharacterSelection
          personajes={CABALLEROS_DISPONIBLES}
          onStartCombat={handleCombatStart}
        />
      </div>
    );
  }

  if (gameView === 'combat' && player1Data && player2Data) {
    const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
    const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;
    const isGameOver = checkGameOver();

    return (
      <div className="app-container">
        <div className="game-container">
          <PlayerArea
            playerData={player1Data}
            opponentData={player2Data}
            handleActionInitiate={handleActionInitiate}
            handleDefenseSelection={handleDefenseSelection}
            handleResistenciaChoice={handleResistenciaChoice}
            isCurrentPlayer={currentPlayerId === player1Data.id && !isGameOver}
            actionState={actionState}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            handleRomperTargetSelect={handleRomperTargetSelect}
            selectedActionName={actionState.active && actionState.attackerId === player1Data.id ? actionState.type : null}
            getActionConcentrationRequirement={getActionConcentrationRequirement}
            IS_ACTION_ALTERNATION_EXCEPTION={IS_ACTION_ALTERNATION_EXCEPTION}
            atraparOptions={atraparFollowupOptions}
          />
          <ArenaDisplay
            attacker={attacker}
            defender={defender}
            actionState={actionState}
            handleDefenseSelection={handleDefenseSelection}
            currentPlayerId={currentPlayerId}
            gameLog={gameLog}
            arenaEvent={arenaEvent}
            isGameOver={isGameOver}
            onPlayAgain={handlePlayAgain}
            atraparFollowupOptions={atraparFollowupOptions}
          />
          <PlayerArea
            playerData={player2Data}
            opponentData={player1Data}
            handleActionInitiate={handleActionInitiate}
            handleDefenseSelection={handleDefenseSelection}
            handleResistenciaChoice={handleResistenciaChoice}
            isCurrentPlayer={currentPlayerId === player2Data.id && !isGameOver}
            actionState={actionState}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            handleRomperTargetSelect={handleRomperTargetSelect}
            selectedActionName={actionState.active && actionState.attackerId === player2Data.id ? actionState.type : null}
            isRightAligned
            getActionConcentrationRequirement={getActionConcentrationRequirement}
            IS_ACTION_ALTERNATION_EXCEPTION={IS_ACTION_ALTERNATION_EXCEPTION}
            atraparOptions={atraparFollowupOptions}
          />
        </div>
        <GameLog log={gameLog} />
      </div>
    );
  }
  // Fallback si gameView no es ni 'characterSelection' ni 'combat', o si los datos no están listos para 'combat'
  return <div className="app-container">Cargando la aplicación...</div>;
}

export default App;
