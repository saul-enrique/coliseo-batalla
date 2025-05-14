// App.jsx MODIFICADO (con console.logs para depurar Combo y corrección de 'attacker')

import './App.css'
import { useState, useEffect } from 'react'
import PlayerArea from './components/PlayerArea'
import GameLog from './components/GameLog'
import ArenaDisplay from './components/ArenaDisplay'

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

const getSeptimoSentidoPowerDamageBonus = (power, attackerStats) => {
    if (!attackerStats.septimoSentidoActivo || !power || !power.type) return 0;
    const types = Array.isArray(power.type) ? power.type : [power.type];
    let bonuses = [];
    if (types.includes('R')) bonuses.push(30);
    if (types.includes('RMult')) bonuses.push(10);
    if (types.includes('RD')) power.isDirectToPVPA ? bonuses.push(5) : bonuses.push(10); // Asume 'isDirectToPVPA'
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
    if (types.includes('RD')) power.isDirectToPVPA ? penalties.push(5) : penalties.push(10); // Asume 'isDirectToPVPA'
    if (types.includes('RSD')) penalties.push(10);
    if (types.includes('RMult')) penalties.push(10);
    if (types.includes('RVid') || types.includes('RArm')) penalties.push(10);
    if (types.includes('P')) penalties.push(10);
    if (types.includes('LL')) penalties.push(20);
    return penalties.length > 0 ? Math.max(...penalties) : 0;
};


function App() {
  const [player1Data, setPlayer1Data] = useState(JSON.parse(JSON.stringify(initialPlayer1Data)));
  const [player2Data, setPlayer2Data] = useState(JSON.parse(JSON.stringify(initialPlayer2Data)));
  const [currentPlayerId, setCurrentPlayerId] = useState(initialPlayer1Data.id);
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

  const applyDamage = (targetPlayerId, damageAmount, damageType = 'normal') => {
    const targetData = targetPlayerId === player1Data.id ? player1Data : player2Data;
    const setTargetData = targetPlayerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let isGameOver = false;
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
        isGameOver = true;
        logMessage(`!!! ${targetData.name} ha sido derrotado !!!`);
    }
    setTargetData(prevData => ({
        ...prevData,
        stats: { ...prevData.stats, currentPV: finalPV, currentPA: finalPA }
    }));
    logMessage(`${targetData.name} - PV: ${finalPV}/${targetData.stats.pv_max}, PA: ${finalPA}/${targetData.stats.pa_max}`);
    if (isGameOver) { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    return { gameOver: isGameOver, actualDamageDealt: actualDamageApplied };
  };

  const handlePlayAgain = () => {
    logMessage("Reiniciando el juego...");
    const resetPlayer1 = JSON.parse(JSON.stringify(initialPlayer1Data));
    const resetPlayer2 = JSON.parse(JSON.stringify(initialPlayer2Data));
    const resetCombatStats = (playerStats) => {
        playerStats.concentrationLevel = 0;
        playerStats.comboVelocidadLuzUsedThisCombat = false;
        playerStats.dobleSaltoUsedThisCombat = false;
        playerStats.arrojarUsedThisCombat = false;
        playerStats.furiaUsedThisCombat = false;
        playerStats.apresarUsedThisCombat = false;
        playerStats.quebrarUsedThisCombat = false;
        playerStats.fortalezaUsedThisCombat = false;
        playerStats.agilidadUsedThisCombat = false;
        playerStats.destrezaUsedThisCombat = false;
        playerStats.resistenciaUsedThisCombat = false;
        playerStats.lanzamientosSucesivosUsedThisCombat = false;
        playerStats.fortalezaAvailable = false;
        playerStats.agilidadAvailable = false;
        playerStats.destrezaAvailable = false;
        playerStats.resistenciaAvailable = false;
        playerStats.lastActionType = null;
        playerStats.septimoSentidoActivo = false;
        playerStats.septimoSentidoIntentado = false;
        playerStats.puntosVitalesGolpeados = false;
        playerStats.puntosVitalesUsadoPorAtacante = false;
        return playerStats;
    };
    resetPlayer1.stats = resetCombatStats(resetPlayer1.stats);
    resetPlayer2.stats = resetCombatStats(resetPlayer2.stats);
    setPlayer1Data(resetPlayer1);
    setPlayer2Data(resetPlayer2);
    setCurrentPlayerId(initialPlayer1Data.id);
    setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null, currentHit: 0, totalHits: 0, baseDamagePerHit: 0, blockDamagePA: 0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0 });
    setGameLog([]);
    setArenaEvent(null);
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
      let totalAttackerBonus = 2 + additionalBonus;
      let totalDefenderBonus = 0;

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
      const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
      let isGameOver = false; const partKey = partToBreak;
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
      const damagePV = 20;
      const { gameOver } = applyDamage(defender.id, damagePV, 'directPV');
      isGameOver = gameOver;
      setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, brokenParts: newBrokenParts } }));
      let penaltyMessage = '';
      if (partKey === 'arms') penaltyMessage = `-1 Bloquear (${newBreaks} vez/veces)`;
      if (partKey === 'legs') penaltyMessage = `-1 Esquivar (${newBreaks} vez/veces)`;
      if (partKey === 'ribs') penaltyMessage = `-1 Llave (${newBreaks} vez/veces)`;
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `Romper ${partKey}`, outcome: 'success', message: `¡${partKey.charAt(0).toUpperCase() + partKey.slice(1)} Rotos! (Tiradas: ${roll1}, ${roll2}). ${defender.name} pierde ${damagePV} PV. Penalizador: ${penaltyMessage}.` });
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
    const setAttackerData = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;

    console.log('Acción iniciada:', actionName, "por", attacker.name);

    if (actionState.active && actionState.stage !== null) {
        logMessage("No se puede iniciar acción mientras otra está activa.");
        return;
    }

    const requiredConcentration = getActionConcentrationRequirement(actionName);
    if (requiredConcentration > 0 && attacker.stats.concentrationLevel < requiredConcentration) {
        logMessage(`! ${attacker.name} necesita Concentración Nivel ${requiredConcentration} para usar ${actionName.replace(/_/g, ' ')}! (Nivel actual: ${attacker.stats.concentrationLevel})`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Se requiere Concentración Nivel ${requiredConcentration} para ${actionName.replace(/_/g, ' ')}!` });
        return;
    }

    const isAlternationAction = ['llave', 'romper', 'presa', 'destrozar', 'fortaleza', 'agilidad', 'destreza', 'lanzamientos_sucesivos', 'resistencia', 'apresar'].includes(actionName);
    if (isAlternationAction && attacker.stats.lastActionType === actionName) {
        logMessage(`¡Regla de Alternancia! No se puede usar ${actionName.replace(/_/g, ' ')} dos veces seguidas.`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡No puedes usar ${actionName.replace(/_/g, ' ')} consecutivamente!` });
        return;
    }

    let concentrationConsumed = false;
    if (requiredConcentration > 0) {
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: 0 } }));
        logMessage(`${attacker.name} usa su concentración (Nivel ${requiredConcentration}) para ${actionName.replace(/_/g, ' ')}. Nivel reseteado a 0.`);
        concentrationConsumed = true;
    }

    const restoreConcentrationIfNeeded = () => {
        if (concentrationConsumed) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: requiredConcentration } }));
            logMessage(`Concentración restaurada a Nivel ${requiredConcentration} debido a acción inválida/ya usada.`);
        }
    };

    if (actionName === 'concentracion') {
        console.log('Entrando al bloque de:', actionName);
        const currentLevel = attacker.stats.concentrationLevel;
        const actualPreviousLevel = concentrationConsumed ? requiredConcentration : currentLevel;
        if (actualPreviousLevel >= 2) {
            logMessage(`Error: ${attacker.name} ya está en el nivel máximo de concentración (Nivel 2) o intentó concentrarse desde Nivel 2.`);
            restoreConcentrationIfNeeded(); return;
        }
        const nextLevel = actualPreviousLevel + 1;
        logMessage(`${attacker.name} usa Concentración. Nivel aumentado a ${nextLevel}.`);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, concentrationLevel: nextLevel, lastActionType: 'concentracion' } }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Concentración', attackerName: attacker.name, message: `${attacker.name} se concentra intensamente... ¡Nivel ${nextLevel} alcanzado!` });
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'alcanzar_septimo_sentido') {
        console.log('Entrando al bloque de:', actionName);
        const isRecoveringFromPuntosVitales = attacker.stats.puntosVitalesGolpeados;
        if (isRecoveringFromPuntosVitales) logMessage(`${attacker.name} intenta recuperarse de Puntos Vitales y alcanzar el Séptimo Sentido.`);
        else {
            logMessage(`${attacker.name} intenta alcanzar el ¡Séptimo Sentido!`);
            if (attacker.stats.septimoSentidoIntentado && !attacker.stats.septimoSentidoActivo) {
                logMessage(`¡${attacker.name} ya intentó alcanzar el Séptimo Sentido en este combate y falló!`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya intentaste alcanzar el Séptimo Sentido y fallaste!` });
                return;
            }
            if (attacker.stats.septimoSentidoActivo) {
                logMessage(`¡${attacker.name} ya ha alcanzado el Séptimo Sentido!`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el Séptimo Sentido!` });
                return;
            }
        }
        if (!isRecoveringFromPuntosVitales && !attacker.stats.septimoSentidoActivo) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, septimoSentidoIntentado: true } }));
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
        const rollVal = rollD20();
        const septimoSentidoTargetRange = attacker.supportRanges?.septimo_sentido || [17, 20];
        logMessage(`${attacker.name} tira un ${rollVal}.`);
        if (isRecoveringFromPuntosVitales) {
            logMessage(`(Necesita 15-18 para recuperarse, 19-20 para recuperarse y ganar 7º Sentido)`);
            if (rollVal >= 19) {
                logMessage(`¡ÉXITO MAYOR! ${attacker.name} se recupera de Puntos Vitales Y alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})`);
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, puntosVitalesGolpeados: false, septimoSentidoActivo: true, septimoSentidoIntentado: true } }));
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Recuperación y Séptimo Sentido', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} se recupera y alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})!`, outcome: 'success_major' });
            } else if (rollVal >= 15) {
                logMessage(`¡ÉXITO! ${attacker.name} se recupera de los Puntos Vitales (Tirada: ${rollVal})`);
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, puntosVitalesGolpeados: false } }));
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Recuperación de Puntos Vitales', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} se recupera de los Puntos Vitales (Tirada: ${rollVal})!`, outcome: 'success' });
            } else {
                logMessage(`¡FALLO! ${attacker.name} no logra recuperarse (Tirada: ${rollVal}). Sigue afectado por Puntos Vitales.`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Recuperación Fallido', attackerName: attacker.name, roll: rollVal, message: `${attacker.name} no logra recuperarse de Puntos Vitales (Tirada: ${rollVal}).`, outcome: 'failure' });
            }
        } else {
            logMessage(`(Necesita ${septimoSentidoTargetRange.join('-')} para alcanzar el Séptimo Sentido)`);
            if (rollVal >= septimoSentidoTargetRange[0] && rollVal <= septimoSentidoTargetRange[1]) {
                logMessage(`¡ÉXITO! ¡${attacker.name} ha alcanzado el SÉPTIMO SENTIDO! (Tirada: ${rollVal})`);
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, septimoSentidoActivo: true } }));
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Séptimo Sentido Alcanzado', attackerName: attacker.name, roll: rollVal, message: `¡${attacker.name} alcanza el SÉPTIMO SENTIDO (Tirada: ${rollVal})! Sus habilidades se potencian.`, outcome: 'success' });
            } else {
                logMessage(`¡FALLO! ${attacker.name} no pudo alcanzar el Séptimo Sentido esta vez (Tirada: ${rollVal}).`);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Séptimo Sentido Fallido', attackerName: attacker.name, roll: rollVal, message: `${attacker.name} no logra alcanzar el Séptimo Sentido (Tirada: ${rollVal}).`, outcome: 'failure' });
            }
        }
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'golpear_puntos_vitales') {
        console.log('Entrando al bloque de:', actionName); // DEBUG
        logMessage(`${attacker.name} intenta golpear los ¡Puntos Vitales de ${defender.name}!`);
        if (attacker.stats.puntosVitalesUsadoPorAtacante) {
            logMessage(`¡${attacker.name} ya usó Golpear Puntos Vitales en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya usaste Golpear Puntos Vitales este combate!` });
            return;
        }
        if (defender.stats.septimoSentidoActivo) {
            logMessage(`¡No se puede usar Golpear Puntos Vitales contra ${defender.name} porque ya alcanzó el Séptimo Sentido!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${defender.name} está protegido por su Séptimo Sentido!` });
            return;
        }
        if (defender.stats.puntosVitalesGolpeados) {
            logMessage(`¡Los Puntos Vitales de ${defender.name} ya han sido golpeados!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Los Puntos Vitales de ${defender.name} ya están afectados!` });
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, puntosVitalesUsadoPorAtacante: true, lastActionType: actionName } }));
        const setDefenderData = defender.id === player1Data.id ? setPlayer1Data : setPlayer2Data;
        let targetRange = [...(attacker.supportRanges?.puntos_vitales || [17, 20])];
        const pvBonusString = attacker.bonuses?.pasivos?.find(b => b.toLowerCase().includes('puntos vitales'));
        if (pvBonusString) {
            const match = pvBonusString.match(/([+-])(\d+)/);
            if (match) {
                const bonusValue = parseInt(match[2], 10);
                if (match[1] === '+') targetRange[0] -= bonusValue;
                else targetRange[0] += bonusValue;
                targetRange[0] = Math.max(1, Math.min(20, targetRange[0]));
                logMessage(`${attacker.name} tiene un bono de ${pvBonusString}, nuevo rango: ${targetRange.join('-')}`);
            }
        }
        const rollVal = rollD20();
        logMessage(`${attacker.name} tira un ${rollVal} para Golpear Puntos Vitales (Necesita ${targetRange.join('-')}).`);
        let isGameOver = false;
        if (rollVal >= targetRange[0] && rollVal <= targetRange[1]) {
            logMessage(`¡ÉXITO! ¡${attacker.name} golpea los Puntos Vitales de ${defender.name}! (Tirada: ${rollVal})`);
            setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, puntosVitalesGolpeados: true } }));
            const { gameOver } = applyDamage(defender.id, 20, 'directPV');
            isGameOver = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Puntos Vitales Golpeados', attackerName: attacker.name, defenderName: defender.name, roll: rollVal, damage: 20, message: `¡${attacker.name} golpea los Puntos Vitales de ${defender.name} (Tirada: ${rollVal})! Pierde 20 PV y sus habilidades se debilitan.`, outcome: 'success' });
        } else {
            logMessage(`¡FALLO! ${attacker.name} no pudo golpear los Puntos Vitales (Tirada: ${rollVal}).`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Intento de Puntos Vitales Fallido', attackerName: attacker.name, defenderName: defender.name, roll: rollVal, message: `${attacker.name} falla al intentar golpear los Puntos Vitales (Tirada: ${rollVal}).`, outcome: 'failure' });
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
        console.log('Entrando al bloque de:', actionName);
        logMessage(`${attacker.name} intenta Quebrar la armadura de ${defender.name}!`);
        if (attacker.stats.quebrarUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        if (defender.stats.currentPA <= 0) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, quebrarUsedThisCombat: true, lastActionType: 'quebrar' } }));
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
        if (!gameOverByQuebrar) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'apresar') {
        console.log('Entrando al bloque de:', actionName);
        logMessage(`${attacker.name} intenta Apresar a ${defender.name}!`);
        if (attacker.stats.apresarUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, apresarUsedThisCombat: true, lastActionType: 'apresar' } }));
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
        if (!gameOverByApresar) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'furia') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.furiaUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, furiaUsedThisCombat: true } }));
        let baseDamagePerHitFuria = attacker.actions.golpe || 0;
        if (attacker.stats.septimoSentidoActivo) { baseDamagePerHitFuria += 10; logMessage(`(7S: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamagePerHitFuria = Math.max(0, baseDamagePerHitFuria - 10); logMessage(`(PV: -10 Daño/golpe)`); }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Furia - Ataque 1/3', message: `${attacker.name} inicia Furia!` });
        setActionState({ active: true, type: 'Furia', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentHit: 1, totalHits: 3, baseDamagePerHit: baseDamagePerHitFuria, blockDamagePA: 10, allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'], defenseBonuses: {}, furiaHitsLandedInSequence: 0 });
        return;
    }
    else if (actionName === 'arrojar') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.arrojarUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, arrojarUsedThisCombat: true } }));
        let baseDamagePerHitArrojar = 30;
        if (attacker.stats.septimoSentidoActivo) { baseDamagePerHitArrojar += 10; logMessage(`(7S: +10 Daño/obj)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamagePerHitArrojar = Math.max(0, baseDamagePerHitArrojar - 10); logMessage(`(PV: -10 Daño/obj)`); }
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Arrojar - Ataque 1/6', message: `${attacker.name} inicia Arrojar! (+2 Esq, -2 Bloq para rival)` });
        setActionState({ active: true, type: 'Arrojar', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentHit: 1, totalHits: 6, baseDamagePerHit: baseDamagePerHitArrojar, blockDamagePA: 10, allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'], defenseBonuses: { esquivar: -2, bloquear: 2 }, hitsLandedThisTurn: 0, damageDealtThisTurn: 0 });
        return;
    }
    else if (actionName === 'doble_salto') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.dobleSaltoUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, dobleSaltoUsedThisCombat: true } }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Doble Salto', message: `${attacker.name} realiza Doble Salto!` });
        setActionState({ active: true, type: 'DobleSalto', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', allowedDefenses: ['esquivar'], defenseBonuses: { esquivar: 4 } });
        return;
    }
    else if (actionName === 'combo_velocidad_luz') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.comboVelocidadLuzUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, comboVelocidadLuzUsedThisCombat: true } }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo Vel. Luz - Golpe 1', message: `${attacker.name} inicia Combo Vel. Luz!` });
        setActionState(prev => ({ ...prev, active: true, type: 'ComboVelocidadLuz', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, allowedDefenses: ['esquivar', 'bloquear'], furiaHitsLandedInSequence: 0 }));
        return;
    }
    else if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        console.log('Entrando al bloque de:', actionName);
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
        return;
    }
    else if (actionName === 'llave') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.resistenciaAvailable) {
            setActionState({ active: true, type: 'llave', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿usar Resistencia (+2) para Llave?` });
            return;
        } else {
            const gameOver = resolveLlaveAction(attacker, defender, 0);
            if (!gameOver) {
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
            return;
        }
    }
    else if (actionName === 'lanzamientos_sucesivos') {
        console.log('Entrando al bloque de:', actionName);
        if (attacker.stats.lanzamientosSucesivosUsedThisCombat) { restoreConcentrationIfNeeded(); return; }
        if (attacker.stats.resistenciaAvailable) {
            setActionState({ active: true, type: 'lanzamientos_sucesivos', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_resistencia_choice' });
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Opción Resistencia', message: `${attacker.name}, ¿usar Resistencia (+2) para Lanz. Sucesivos?` });
            return;
        } else {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lanzamientosSucesivosUsedThisCombat: true } }));
            const gameOver = await resolveLanzamientoSucesivo(attacker, defender, 0);
            if (!gameOver && actionState.stage !== 'game_over') {
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
            return;
        }
    }
    else if (actionName === 'presa' || actionName === 'destrozar') {
        console.log('Entrando al bloque de:', actionName);
        const isPresa = actionName === 'presa';
        if (!isPresa && defender.stats.currentPA <= 0) {
            logMessage(`Armadura de ${defender.name} ya rota. Destrozar sin efecto.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destrozar', outcome: 'no_armor', message: `¡Armadura de ${defender.name} ya rota!` });
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
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

        if (!isGameOverByAction) {
            setAttackerData(prev => ({...prev, stats: {...prev.stats, lastActionType: actionName}}));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'romper') {
        console.log('Entrando al bloque de:', actionName);
        if (['arms', 'legs', 'ribs'].every(part => defender.stats.brokenParts[part] >= 2)) {
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` });
            return;
        }
        setActionState({ active: true, type: 'Romper', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_romper_target', allowedDefenses: null });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper', message: `${attacker.name} se prepara para Romper...` });
        return;
    }
    else if (actionName === 'atrapar') {
        console.log('Entrando al bloque de:', actionName);
        let bonus = attacker.stats.atrapar_bonus || 0;
        if (attacker.stats.septimoSentidoActivo) bonus += 1;
        if (attacker.stats.puntosVitalesGolpeados) bonus -= 1;
        const rollVal = rollD20() + bonus;
        const targetRange = [11,20];
        if (rollVal >= targetRange[0] && rollVal <= targetRange[1]) {
            setArenaEvent({id: Date.now(), message: `${attacker.name} atrapa! (Tirada ${rollVal})`});
            setActionState({active:true, type:'Atrapar', attackerId:attacker.id, defenderId:defender.id, stage:'awaiting_followup', allowedDefenses: null});
        } else {
            setArenaEvent({id: Date.now(), message: `${attacker.name} falla Atrapar (Tirada ${rollVal})`});
            setAttackerData(prev=>({...prev, stats:{...prev.stats, lastActionType: actionName}}));
            setActionState(prev=>({...prev, active:false, type: null, stage: null}));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'combo') {
        console.log('Entrando al bloque de:', actionName);
        setActionState(prev => ({ ...prev, active: true, type: 'Combo', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, currentHit: 1, currentDefensePenalty: 0, allowedDefenses: null, furiaHitsLandedInSequence: 0 })); // Initialize currentHit as well
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo - Golpe 1', message: `${attacker.name} lanza el primer golpe del combo!` });
        return;
    }
    else if (actionName === 'engaño') {
        console.log('Entrando al bloque de:', actionName);
        setActionState(prev => ({ ...prev, active: true, type: 'Engaño', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense_part_1', allowedDefenses: null, defenseBonuses: { esquivar: -2 }, furiaHitsLandedInSequence: 0 }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Engaño - Ataque Falso', message: `${attacker.name} lanza un ataque falso (+2 Esq. para ${defender.name})!` });
        return;
    }
    else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
        console.log('Entrando al bloque de:', actionName);
        const usedThisCombatKey = `${actionName}UsedThisCombat`;
        const availableKey = `${actionName}Available`;
        const readableName = actionName.charAt(0).toUpperCase() + actionName.slice(1);
        if (attacker.stats[usedThisCombatKey]) { setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `¡${readableName} ya usada!` }); return; }
        if (attacker.stats[availableKey]) { setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `¡Bono ${readableName} ya activo!` }); return; }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, [availableKey]: true, [usedThisCombatKey]: true, lastActionType: actionName } }));
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
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;

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
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: finalActionName } }));
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
    if (defenseType === 'bloquear_fortaleza' && defender.stats.fortalezaAvailable) { defenseSpecificBonus = 3; setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, fortalezaAvailable: false } })); logMessage("Fortaleza usada");}
    else if (defenseType === 'esquivar_agilidad' && defender.stats.agilidadAvailable) { defenseSpecificBonus = 3; setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, agilidadAvailable: false } })); logMessage("Agilidad usada");}
    else if (defenseType === 'contraatacar_destreza' && defender.stats.destrezaAvailable) { defenseSpecificBonus = 2; setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, destrezaAvailable: false } })); logMessage("Destreza usada");}

    let actionDefenseModifier = actionState.defenseBonuses?.[baseDefenseType] || 0;
    let septimoSentidoDefensaBonus = defender.stats.septimoSentidoActivo ? 1 : 0;
    let puntosVitalesDefensaPenaltyValue = defender.stats.puntosVitalesGolpeados ? 1 : 0;

    const finalRequiredRollAdjustment = actionDefenseModifier - defenseSpecificBonus;

    if (actionDefenseModifier !== 0) defenseBonusOrPenaltyText += ` (Acción: ${actionDefenseModifier > 0 ? '-' : '+'}${Math.abs(actionDefenseModifier)})`;
    if (defenseSpecificBonus !== 0) defenseBonusOrPenaltyText += ` (Boost: +${defenseSpecificBonus})`;
    if (septimoSentidoDefensaBonus !==0 && (baseDefenseType === 'esquivar' || baseDefenseType === 'bloquear' || baseDefenseType === 'contraatacar')) defenseBonusOrPenaltyText += ` (7ºS Def: +1 Rango)`;
    if (puntosVitalesDefensaPenaltyValue !==0 && (baseDefenseType === 'esquivar' || baseDefenseType === 'bloquear' || baseDefenseType === 'contraatacar')) defenseBonusOrPenaltyText += ` (PV Def: -1 Rango)`;

    const actionKey = actionType.toLowerCase().replace('_opcion', '_op').replace('vel_luz', 'velocidad_luz');
    if (actionType === 'Arrojar') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Furia') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') baseDamage = 20;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') {
        baseDamage = 50;
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño)`); }
    }
    else if (actionType === 'Combo') {
        baseDamage = attacker.actions.golpe;
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño/golpe)`); }
    }
    else if (actionType === 'ComboVelocidadLuz') {
        baseDamage = attacker.actions.velocidad_luz || 50;
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 10; logMessage(`(7S Atacante: +10 Daño/golpe)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 10); logMessage(`(PV Atacante: -10 Daño/golpe)`); }
    }
    else if (actionType === 'DobleSalto') {
        baseDamage = (attacker.actions.salto || 0) + 20;
        if (attacker.stats.septimoSentidoActivo) { baseDamage += 30; logMessage(`(7S Atacante: +30 Daño)`); }
        if (attacker.stats.puntosVitalesGolpeados) { baseDamage = Math.max(0, baseDamage - 20); logMessage(`(PV Atacante: -20 Daño)`); }
    }
    else if (actionType.startsWith('Atrapar_')) baseDamage = actionState.baseDamage || 0;
    else baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || 0;

    if (!actionType.startsWith('Atrapar_') && !['DobleSalto', 'Combo', 'ComboVelocidadLuz', 'Engaño', 'Arrojar', 'Furia'].includes(actionType)) {
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
         if (['Atrapar_Opcion2', 'Atrapar_Opcion7', 'DobleSalto', 'Velocidad_luz', 'ComboVelocidadLuz'].includes(actionType)) { defenseSuccessful = false; rollOutcome = 'invalid'; damageToDefender = baseDamage; targetMin = null; targetMax = null; logMessage(`¡Contraataque inválido contra ${actionType}!`);}
         else {
            targetMin = Math.min(21, Math.max(1, min + contraataqueRollAdjustment - septimoSentidoDefensaBonus + puntosVitalesDefensaPenaltyValue));
            targetMax = max;
            if (rollVal >= targetMin && rollVal <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'countered';
                damageToAttacker = Math.floor((defender.actions.golpe || 30) / 2);
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
    if (['Arrojar', 'Furia', 'Combo', 'ComboVelocidadLuz'].includes(actionType)) { hitContext = ` (Golpe ${actionState.currentHit || actionState.currentComboHit})`; }
    let finalMessage = `${defender.name} intenta ${defenseType.replace(/_/g,' ')}${defenseBonusOrPenaltyText} vs ${actionType.replace(/_/g, ' ')}${hitContext}. Tirada: ${rollVal}. `;
    if (targetMin !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
    switch (rollOutcome) { case 'success': finalMessage += "¡Éxito Defendiendo! "; break; case 'failure': finalMessage += "¡Fallo Defendiendo! "; break; case 'blocked': finalMessage += "¡Bloqueado! "; break; case 'countered': finalMessage += "¡Contraatacado! "; break; case 'invalid': finalMessage += "¡Defensa Inválida! "; break; default: finalMessage += "Resultado: "; break; }
    finalMessage += defenderDamageMessage + " " + attackerDamageMessage;
    const resolutionEvent = { id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace(/_/g, ' ')}${hitContext} vs ${defenseType.replace(/_/g,' ')}`, rollerName: defender.name, rollValue: rollVal, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: finalMessage.trim(), gameOver: isGameOverByThisHit };
    setArenaEvent(resolutionEvent); logMessage(finalMessage);
    await delay(1500);

    if (isGameOverByThisHit) { if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); } console.log("--- handleDefenseSelection FIN (Game Over) ---"); return; }

    if (actionType === 'Arrojar' || actionType === 'Furia') {
        console.log(`Entrando bloque Arrojar/Furia. ActionType: ${actionType}`);
        let updatedActionState = { ...actionState };
        if (actionType === 'Arrojar') { if (damageResultDefender.actualDamageDealt > 0 || damageResultAttacker.actualDamageDealt > 0) { updatedActionState.hitsLandedThisTurn++; } updatedActionState.damageDealtThisTurn += damageResultDefender.actualDamageDealt; }
        else if (actionType === 'Furia') { if (rollOutcome === 'failure' || rollOutcome === 'invalid' || (rollOutcome === 'countered' && damageToDefender > 0 )) { updatedActionState.furiaHitsLandedInSequence++; } }
        if (updatedActionState.currentHit >= updatedActionState.totalHits) {
            const finalActionName = actionType.toLowerCase();
            logMessage(`Secuencia de ${actionType} terminada.`);
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: finalActionName } }));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentHit: 0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0 }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else {
            updatedActionState.currentHit += 1; updatedActionState.stage = 'awaiting_defense';
            let defenseModText = "";
            if (actionType === 'Furia') { let penalty = 0; if (updatedActionState.furiaHitsLandedInSequence === 1) penalty = 2; else if (updatedActionState.furiaHitsLandedInSequence >= 2) penalty = 4; updatedActionState.defenseBonuses = { esquivar: penalty, bloquear: penalty }; if (penalty > 0) defenseModText = `(Defensa rival: Esq/Bloq -${penalty})`; }
            else if (actionType === 'Arrojar') { defenseModText = `(${defender.name} tiene +2 Esq, -2 Bloq)`; }
            setActionState(updatedActionState);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${actionType} - Ataque ${updatedActionState.currentHit}/${updatedActionState.totalHits}`, message: `${attacker.name} continúa ${actionType}! ${defenseModText}` });
        }
        console.log("--- handleDefenseSelection FIN (Arrojar/Furia procesado) ---");
        return;
    }
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') {
        console.log(`Entrando bloque Engaño p1. ActionType: ${actionType}`);
        if (!isGameOverByThisHit) {
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense_part_2', allowedDefenses: ['bloquear'], defenseBonuses: { bloquear: 3 } }));
            setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Engaño - Ataque Real', message: `${attacker.name} lanza ataque real! (${defender.name} solo Bloquear, -3 Penaliz.)` });
        }
        console.log("--- handleDefenseSelection FIN (Engaño p1 procesado) ---");
        return;
    }
    else if (actionType === 'Combo' || actionType === 'ComboVelocidadLuz') {
        console.log(`Entrando bloque Combo/ComboVelLuz. ActionType: ${actionType}`);
        const isComboVel = actionType === 'ComboVelocidadLuz';
        const currentComboHitState = isComboVel ? actionState.currentComboHit : actionState.currentHit;
        const currentComboHit = currentComboHitState || 1;

        console.log(`COMBO CHECK: defenseSuccessful=${defenseSuccessful}, currentComboHit=${currentComboHit}`);

        if (defenseSuccessful || currentComboHit >= 3 ) {
            console.log("COMBO TERMINANDO");
            let finalComboMessage = defenseSuccessful ? `¡${defender.name} detiene el ${isComboVel ? 'Combo Vel. Luz' : 'Combo'} en golpe #${currentComboHit}!` : `¡${attacker.name} completa ${isComboVel ? 'Combo Vel. Luz' : 'Combo'} de 3 golpes!`;
            logMessage(finalComboMessage); setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: `Fin ${isComboVel ? 'Combo Vel. Luz' : 'Combo'}`, message: finalComboMessage });
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: isComboVel ? 'combo_velocidad_luz' : 'combo' } }));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentComboHit: 0, currentHit: 0 }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else {
            console.log("COMBO CONTINUANDO");
            const nextHit = currentComboHit + 1; let nextBonuses = {}; let messagePenalty = "";
            if (isComboVel) { nextBonuses = { esquivar: 4, bloquear: 6 }; messagePenalty = "(Esq -4, Bloq -6)"; }
            else { const penalty = nextHit === 2 ? 2 : 4; nextBonuses = { esquivar: penalty, bloquear: penalty, contraatacar: penalty }; messagePenalty = `(Defensa -${penalty})`; }
            logMessage(`¡Golpe #${currentComboHit} conecta! ${attacker.name} continúa con golpe #${nextHit}...`);
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense', [isComboVel ? 'currentComboHit' : 'currentHit']: nextHit, currentDefensePenalty: !isComboVel ? (nextHit === 2 ? 2 : 4) : prevState.currentDefensePenalty, defenseBonuses: nextBonuses }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${isComboVel ? 'Combo Vel. Luz' : 'Combo'} - Golpe ${nextHit}`, message: `${attacker.name} lanza golpe #${nextHit}! ${messagePenalty}` });
        }
        console.log("--- handleDefenseSelection FIN (Combo/ComboVelLuz procesado) ---");
        return;
    }

    console.log(`Acción de un solo golpe (${actionType}) o fin de secuencia no multi-hit. Pasando turno.`);
    if (!isGameOverByThisHit) {
        const actionJustFinished = actionState.type;
        if (actionJustFinished) {
            let actionTypeForHistory = actionJustFinished.toLowerCase().replace('vel_luz', 'velocidad_luz').replace('doblesalto', 'doble_salto').replace('combovelocidadluz', 'combo_velocidad_luz');
            if (actionTypeForHistory.startsWith('atrapar_')) actionTypeForHistory = 'atrapar';
            // El lastActionType se establece en handleActionInitiate para la mayoría de las acciones
            // o al final de secuencias como Furia/Arrojar/Combo.
            // No es necesario setearlo aquí de nuevo si ya está correcto.
        }
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null, furiaHitsLandedInSequence: 0 }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    }
    console.log("--- handleDefenseSelection FIN (Acción de un golpe / Fin normal) ---");
  };


  const handleAtraparFollowupSelect = async (optionId) => {
    if (!actionState.active || actionState.type !== 'Atrapar' || actionState.stage !== 'awaiting_followup') { return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let gameOverByFollowup = false; const selectedOption = atraparFollowupOptions.find(opt => opt.id === optionId);
    logMessage(`${attacker.name} elige seguimiento de Atrapar: ${selectedOption?.name || optionId}`);

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
      case 'atrapar_op5': { gameOverByFollowup = resolveLlaveAction(attacker, defender, 3); if(!gameOverByFollowup) setAttackerData(prev=>({...prev, stats:{...prev.stats, lastActionType: 'llave'}})); break; }
      case 'atrapar_op6': { setActionState({ ...actionState, type: 'Atrapar_Opcion6', stage: 'awaiting_romper_target', romperBonus: 4 }); setArenaEvent({id:Date.now(), message:`${attacker.name} Atrapa Op6 (Romper +4).`}); return; }
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
    if (!gameOverByFollowup && actionState.stage !== 'awaiting_defense' && actionState.stage !== 'awaiting_romper_target') {
        await delay(1500);
        if (optionId !== 'atrapar_op5' || (optionId === 'atrapar_op5' && attacker.stats.lastActionType !== 'llave')) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: 'atrapar' } }));
        }
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
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const wasAtraparFollowup = actionState.type === 'Atrapar_Opcion6';
    const actionTypeForHistory = wasAtraparFollowup ? 'atrapar' : 'romper';
    if (defender.stats.brokenParts[partToBreak] >= 2) {
        setArenaEvent({ id: Date.now(), outcome: 'invalid', message: `${partToBreak.charAt(0).toUpperCase() + partToBreak.slice(1)} no se puede romper más.` });
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    const bonus = actionState.romperBonus || 0;
    const gameOverByRomper = resolveRomperAttempt(attacker, defender, partToBreak, bonus);
    if (!gameOverByRomper) {
        await delay(1500);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId); logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    } else {
      if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
    }
  };


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