// App.jsx MODIFICADO

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
    septimoSentidoActivo: false, // NUEVO
    septimoSentidoIntentado: false, // NUEVO
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
    alcanzar_septimo_sentido: true, // NUEVA ACCIÓN
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
    septimoSentidoActivo: false, // NUEVO
    septimoSentidoIntentado: false, // NUEVO
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
    alcanzar_septimo_sentido: true, // NUEVA ACCIÓN
  },
  powers: [ { id: 'S001', name: 'Patada Dragón', cost: 50, type: ['R'], damage: 40, details: '+10 Dmg Salto stack' }, { id: 'S002', name: 'Dragón Volador', cost: 50, type: ['R', 'G'], damage: 70 }, { id: 'S003', name: 'Rozan Ryuu Hi Shou', cost: 100, type: ['R', 'G'], damage: 100, details: 'Weak Point on Counter' }, { id: 'S004', name: 'Cien Dragones de Rozan', cost: 200, type: ['RB', 'G'], damage: 160, effects: '-3 Bloquear' }, { id: 'S005', name: 'Último Dragón', cost: 200, type: ['LL'], damage: 200, details: 'Self-dmg 120, 1 use' }, { id: 'S006', name: 'Excalibur', cost: 100, type: ['R', 'RArm', 'M'], damage: 100, details: 'Ignore Def Bonus, Destroys Armor on 1-2' }, ],
  bonuses: { pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+10 Dmg Golpe (ARM)'], activos: ['+2 Ayuda (aliados)', '+2 Int Div', 'Valentía del Dragón', 'Armadura Divina'], flags: ['ESC', 'ARM'] },
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

// Helper function to check concentration requirements
const getActionConcentrationRequirement = (actionName) => {
    const level1Actions = ['velocidad_luz', 'salto', 'combo', 'engaño', 'lanzamientos_sucesivos'];
    const level2Actions = ['combo_velocidad_luz', 'doble_salto', 'arrojar', 'furia', 'apresar', 'quebrar'];

    if (level2Actions.includes(actionName)) return 2;
    if (level1Actions.includes(actionName)) return 1;
    return 0;
};

const getSeptimoSentidoPowerDamageBonus = (power, attackerStats) => {
    if (!attackerStats.septimoSentidoActivo || !power || !power.type) {
        return 0;
    }

    const types = Array.isArray(power.type) ? power.type : [power.type];
    let bonuses = [];

    if (types.includes('R')) bonuses.push(30);
    if (types.includes('RMult')) bonuses.push(10);
    if (types.includes('RD')) {
        // Asumiendo que podrías tener una propiedad como power.damageCategory = 'directPV' o 'directPA'
        // O podrías inferirlo si el poder tiene un efecto específico de daño directo a PV/PA.
        // Por ahora, asumimos que "RD" que no es directo a PV/PA específicamente recibe +10.
        // Necesitarías una forma de identificar si el daño RD es directo para aplicar +5.
        // Ejemplo simple (requiere más info en `power`):
        if (power.isDirectToPVPA) { // Propiedad hipotética
            bonuses.push(5);
        } else {
            bonuses.push(10);
        }
    }
    if (types.includes('RSD')) bonuses.push(10);
    if (types.includes('RVid') || types.includes('RArm')) bonuses.push(10);
    if (types.includes('P')) bonuses.push(10);
    if (types.includes('LL')) bonuses.push(30);

    if (bonuses.length === 0) return 0;
    if (bonuses.length === 1) return bonuses[0];

    // "Si un poder cumple 2 o mas atributos se toma el más restrictivo/menor"
    return Math.min(...bonuses);
};


function App() {
  const [player1Data, setPlayer1Data] = useState(JSON.parse(JSON.stringify(initialPlayer1Data)));
  const [player2Data, setPlayer2Data] = useState(JSON.parse(JSON.stringify(initialPlayer2Data)));
  const [currentPlayerId, setCurrentPlayerId] = useState(initialPlayer1Data.id);
  const [actionState, setActionState] = useState({
    active: false, type: null, attackerId: null, defenderId: null, stage: null, allowedDefenses: null,
    currentHit: 0,
    totalHits: 0,
    baseDamagePerHit: 0,
    blockDamagePA: 0,
    hitsLandedThisTurn: 0,
    damageDealtThisTurn: 0,
    furiaHitsLandedInSequence: 0,
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
    } else { // Daño normal (mitad y mitad)
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
        actualDamageApplied += damageToPv; // Solo el daño a PV se suma aquí, el de PA ya estaba
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
        stats: {
            ...prevData.stats,
            currentPV: finalPV,
            currentPA: finalPA
        }
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
        playerStats.septimoSentidoActivo = false; // NUEVO
        playerStats.septimoSentidoIntentado = false; // NUEVO
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
    let attackerRoll = 0, defenderRoll = 0, ties = 0;
    let currentDamage = attacker.actions.llave;
    if (attacker.stats.septimoSentidoActivo) {
        currentDamage += 30;
        logMessage(`(Séptimo Sentido: +30 Daño a Llave)`);
    }
    let winnerId = null, loserId = null;
    let llaveGameOver = false;

    while (ties < 3) {
      const attackerBaseRoll = rollD20();
      const defenderBaseRoll = rollD20();
      let totalAttackerBonus = 2 + additionalBonus;
      let totalDefenderBonus = 0;

      if (attacker.stats.septimoSentidoActivo) {
          totalAttackerBonus += 1;
      }
      if (defender.stats.septimoSentidoActivo && attacker.id !== defender.id ) {
          totalDefenderBonus +=1;
      }

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
      const { gameOver } = applyDamage(loserId, currentDamage);
      llaveGameOver = gameOver;
      setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', winnerName: winnerData.name, loserName: loserData.name, damage: currentDamage, message: `${winnerData.name} gana (${attackerRoll} vs ${defenderRoll}). ${loserData.name} recibe ${currentDamage} daño.` });
    } else { setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Llave', outcome: 'tie', message: `¡Empate final en Llave (${attackerRoll} vs ${defenderRoll})! La llave se anula.` }); }
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


  const handleActionInitiate = async (actionName) => {
    if (actionState.active && actionState.stage !== null) {
        logMessage("No se puede iniciar acción mientras otra está activa.");
        return;
    }
    const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
    const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;
    const setAttackerData = attacker.id === player1Data.id ? setPlayer1Data : setPlayer2Data;

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
        const currentLevel = attacker.stats.concentrationLevel;
        const actualPreviousLevel = concentrationConsumed ? requiredConcentration : currentLevel;

        if (actualPreviousLevel >= 2) {
            logMessage(`Error: ${attacker.name} ya está en el nivel máximo de concentración (Nivel 2) o intentó concentrarse desde Nivel 2.`);
            restoreConcentrationIfNeeded();
            return;
        }
        const nextLevel = actualPreviousLevel + 1;
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
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'alcanzar_septimo_sentido') {
        logMessage(`${attacker.name} intenta alcanzar el ¡Séptimo Sentido!`);
        if (attacker.stats.septimoSentidoIntentado) {
            logMessage(`¡${attacker.name} ya intentó alcanzar el Séptimo Sentido en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya intentaste alcanzar el Séptimo Sentido!` });
            return;
        }

        setAttackerData(prev => ({
            ...prev,
            stats: { ...prev.stats, septimoSentidoIntentado: true, lastActionType: actionName }
        }));

        const roll = rollD20();
        logMessage(`${attacker.name} tira un ${roll} para alcanzar el Séptimo Sentido (Necesita 19 o 20).`);

        if (roll >= 19) {
            logMessage(`¡ÉXITO! ¡${attacker.name} ha alcanzado el SÉPTIMO SENTIDO! (Tirada: ${roll})`);
            setAttackerData(prev => ({
                ...prev,
                stats: { ...prev.stats, septimoSentidoActivo: true }
            }));
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Séptimo Sentido Alcanzado',
                attackerName: attacker.name,
                roll: roll,
                message: `¡${attacker.name} alcanza el SÉPTIMO SENTIDO (Tirada: ${roll})! Sus habilidades se potencian.`,
                outcome: 'success'
            });
        } else {
            logMessage(`¡FALLO! ${attacker.name} no pudo alcanzar el Séptimo Sentido esta vez (Tirada: ${roll}).`);
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Intento de Séptimo Sentido Fallido',
                attackerName: attacker.name,
                roll: roll,
                message: `${attacker.name} no logra alcanzar el Séptimo Sentido (Tirada: ${roll}).`,
                outcome: 'failure'
            });
        }

        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    else if (actionName === 'quebrar') {
        logMessage(`${attacker.name} intenta Quebrar la armadura de ${defender.name}!`);
        if (attacker.stats.quebrarUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Quebrar en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Quebrar solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        if (defender.stats.currentPA <= 0) {
            logMessage(`La armadura de ${defender.name} ya está destruida. ¡Quebrar no tiene efecto!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'no_armor', message: `¡La armadura de ${defender.name} ya está rota! Quebrar no tiene efecto.` });
            restoreConcentrationIfNeeded();
            return;
        }

        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, quebrarUsedThisCombat: true, lastActionType: 'quebrar' } }));

        const numberOfDice = 5;
        const rolls = [];
        let oddRollsCount = 0;
        for (let i = 0; i < numberOfDice; i++) {
            const roll = rollD20();
            rolls.push(roll);
            if (roll % 2 !== 0) {
                oddRollsCount++;
            }
        }
        logMessage(`${attacker.name} lanza ${numberOfDice} dados para Quebrar: ${rolls.join(', ')}.`);
        logMessage(`Resultados impares: ${oddRollsCount}.`);

        let gameOverByQuebrar = false;
        if (oddRollsCount > 0) {
            let damagePerImparQuebrar = attacker.actions.destrozar?.damagePerHit || 15;
            if (attacker.stats.septimoSentidoActivo) {
                damagePerImparQuebrar += 5;
                logMessage(`(Séptimo Sentido: +5 Daño por impacto de Quebrar)`);
            }
            const totalDamage = oddRollsCount * damagePerImparQuebrar;
            logMessage(`${attacker.name} inflige ${totalDamage} daño directo a PA (${oddRollsCount} impares x ${damagePerImparQuebrar} c/u).`);
            const { gameOver } = applyDamage(defender.id, totalDamage, 'directPA');
            gameOverByQuebrar = gameOver;
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Quebrar',
                attackerName: attacker.name,
                defenderName: defender.name,
                rolls: rolls,
                oddCount: oddRollsCount,
                damage: totalDamage,
                message: `${attacker.name} quiebra la armadura de ${defender.name}! ${oddRollsCount} de ${numberOfDice} dados fueron impares (${rolls.join(', ')}), infligiendo ${totalDamage} daño directo a PA.`
            });
        } else {
            logMessage(`${attacker.name} no obtuvo resultados impares. ¡Quebrar no hace daño!`);
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Quebrar',
                attackerName: attacker.name,
                defenderName: defender.name,
                rolls: rolls,
                oddCount: oddRollsCount,
                outcome: 'failure',
                message: `${attacker.name} intenta Quebrar, pero no obtiene resultados impares (${rolls.join(', ')}). ¡Sin daño a la armadura!`
            });
        }

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
        if (attacker.stats.apresarUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Apresar en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Apresar solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, apresarUsedThisCombat: true, lastActionType: 'apresar' } }));

        const numberOfDice = 5;
        const rolls = [];
        let oddRollsCount = 0;
        for (let i = 0; i < numberOfDice; i++) {
            const roll = rollD20();
            rolls.push(roll);
            if (roll % 2 !== 0) {
                oddRollsCount++;
            }
        }
        logMessage(`${attacker.name} lanza ${numberOfDice} dados para Apresar: ${rolls.join(', ')}.`);
        logMessage(`Resultados impares: ${oddRollsCount}.`);

        let gameOverByApresar = false;
        if (oddRollsCount > 0) {
            let damagePerImparApresar = attacker.actions.presa?.damagePerHit || 15;
            if (attacker.stats.septimoSentidoActivo) {
                damagePerImparApresar += 5;
                logMessage(`(Séptimo Sentido: +5 Daño por impacto de Apresar)`);
            }
            const totalDamage = oddRollsCount * damagePerImparApresar;
            logMessage(`${attacker.name} inflige ${totalDamage} daño directo a PV (${oddRollsCount} x ${damagePerImparApresar}).`);
            const { gameOver } = applyDamage(defender.id, totalDamage, 'directPV');
            gameOverByApresar = gameOver;
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Apresar',
                attackerName: attacker.name,
                defenderName: defender.name,
                rolls: rolls,
                oddCount: oddRollsCount,
                damage: totalDamage,
                message: `${attacker.name} apresa a ${defender.name}! ${oddRollsCount} de ${numberOfDice} dados fueron impares (${rolls.join(', ')}), infligiendo ${totalDamage} daño directo a PV.`
            });
        } else {
            logMessage(`${attacker.name} no obtuvo resultados impares. ¡Apresar no hace daño!`);
            setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Apresar',
                attackerName: attacker.name,
                defenderName: defender.name,
                rolls: rolls,
                oddCount: oddRollsCount,
                outcome: 'failure',
                message: `${attacker.name} intenta Apresar, pero no obtiene resultados impares (${rolls.join(', ')}). ¡Sin daño!`
            });
        }

        if (!gameOverByApresar) {
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'furia') {
        logMessage(`${attacker.name} desata su ¡Furia!`);
        if (attacker.stats.furiaUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Furia en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Furia solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, furiaUsedThisCombat: true } }));
        
        let baseDamagePerHitFuria = attacker.actions.golpe || 0;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamagePerHitFuria += 10;
            logMessage(`(Séptimo Sentido: +10 Daño por golpe de Furia)`);
        }

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Furia - Ataque 1/3', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe de Furia!` });
        setActionState({
            active: true,
            type: 'Furia',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            currentHit: 1,
            totalHits: 3,
            baseDamagePerHit: baseDamagePerHitFuria,
            blockDamagePA: 10,
            allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'],
            defenseBonuses: {},
            furiaHitsLandedInSequence: 0,
        });
        return;
    }
    else if (actionName === 'arrojar') {
        logMessage(`${attacker.name} inicia ¡Arrojar Objetos!`);
        if (attacker.stats.arrojarUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Arrojar en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Arrojar solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, arrojarUsedThisCombat: true } }));

        let baseDamagePerHitArrojar = 30;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamagePerHitArrojar += 10;
            logMessage(`(Séptimo Sentido: +10 Daño por objeto arrojado)`);
        }

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Arrojar - Ataque 1/6', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} comienza a arrojar objetos (${defender.name} tiene +2 Esq, -2 Bloq)` });
        setActionState({
            active: true,
            type: 'Arrojar',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            currentHit: 1,
            totalHits: 6,
            baseDamagePerHit: baseDamagePerHitArrojar,
            blockDamagePA: 10,
            allowedDefenses: ['esquivar', 'bloquear', 'contraatacar'],
            defenseBonuses: { esquivar: -2, bloquear: 2 },
            hitsLandedThisTurn: 0,
            damageDealtThisTurn: 0,
        });
        return;
    }
    else if (actionName === 'doble_salto') {
        logMessage(`${attacker.name} inicia ¡Doble Salto!`);
        if (attacker.stats.dobleSaltoUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó Doble Salto en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Doble Salto solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, dobleSaltoUsedThisCombat: true } }));

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Doble Salto', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} realiza un Doble Salto hacia ${defender.name}!` });
        setActionState({
            active: true,
            type: 'DobleSalto',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            allowedDefenses: ['esquivar'],
            defenseBonuses: { esquivar: 4 }
        });
        return;
    }
    else if (actionName === 'combo_velocidad_luz') {
        logMessage(`${attacker.name} inicia ¡Combo a Velocidad Luz!`);
        if (attacker.stats.comboVelocidadLuzUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó ${actionName.replace(/_/g,' ')} en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${actionName.replace(/_/g,' ')} solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, comboVelocidadLuzUsedThisCombat: true } }));

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo Vel. Luz - Golpe 1', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe del combo a velocidad luz!` });
        setActionState(prev => ({
            ...prev,
            active: true,
            type: 'ComboVelocidadLuz',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            currentComboHit: 1,
            allowedDefenses: ['esquivar', 'bloquear'],
            furiaHitsLandedInSequence: 0, // Reutilizado para contar golpes en combo, o podría ser su propia variable.
        }));
        return;
    }
    else if (['golpe', 'lanzar_obj', 'embestir', 'cargar', 'salto', 'velocidad_luz'].includes(actionName)) {
        logMessage(`${attacker.name} inicia Acción: ${actionName.replace(/_/g, ' ')}!`);
        const displayActionName = actionName.charAt(0).toUpperCase() + actionName.slice(1).replace('_',' ');
        const actionStateType = actionName.charAt(0).toUpperCase() + actionName.slice(1);
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: displayActionName, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} usa ${displayActionName} contra ${defender.name}!` });
        let allowedDefensesForAction = null;
        let defenseBonusesForAction = {};

        if (actionName === 'velocidad_luz') {
            allowedDefensesForAction = ['esquivar', 'bloquear'];
            defenseBonusesForAction = { bloquear: 6 };
        } else if (actionName === 'salto') {
             defenseBonusesForAction = { bloquear: 2 };
        } else if (actionName === 'lanzar_obj') {
            defenseBonusesForAction = { esquivar: -2, bloquear: 2 };
        } else if (actionName === 'cargar') {
            defenseBonusesForAction = { esquivar: -2, contraatacar: -2}
        }


        setActionState(prev => ({
            ...prev,
            active: true,
            type: actionStateType,
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense',
            allowedDefenses: allowedDefensesForAction,
            defenseBonuses: defenseBonusesForAction,
            furiaHitsLandedInSequence: 0,
        }));
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
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
        }
        return;
    } else if (actionName === 'lanzamientos_sucesivos') {
        logMessage(`${attacker.name} intenta Lanzamientos Sucesivos.`);
        if (attacker.stats.lanzamientosSucesivosUsedThisCombat) {
            logMessage(`¡${attacker.name} ya usó ${actionName.replace(/_/g, ' ')} en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${actionName.replace('_', ' ')} solo se puede usar una vez por combate!` });
            restoreConcentrationIfNeeded();
            return;
        }
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
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
                const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                setCurrentPlayerId(nextPlayerId);
                logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
            }
        }
        return;
    }
    else if (actionName === 'presa' || actionName === 'destrozar') {
        const isPresaOriginal = actionName === 'presa';
        const damageTarget = isPresaOriginal ? 'PV' : 'PA';
        const damageType = isPresaOriginal ? 'directPV' : 'directPA';
        logMessage(`${attacker.name} intenta ${actionName} contra ${defender.name}!`);
        if (!isPresaOriginal && defender.stats.currentPA <= 0) { logMessage(`No se puede usar Destrozar, la armadura de ${defender.name} ya está rota!`); setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Destrozar', outcome: 'no_armor', message: `¡La armadura de ${defender.name} ya está rota!` }); return; }

        let totalDamageAccumulated = 0, successfulHits = 0, successfulRolls = [], lastRoll = null, isGameOverByAction = false;
        const maxHits = attacker.actions[actionName]?.maxHits || 3;
        
        let damagePerHitBase = attacker.actions[actionName]?.damagePerHit || 15;
        if (attacker.stats.septimoSentidoActivo) {
            if (actionName === 'presa') {
                damagePerHitBase += 5;
                logMessage(`(Séptimo Sentido: +5 Daño por golpe de Presa)`);
            } else if (actionName === 'destrozar') {
                damagePerHitBase += 5;
                logMessage(`(Séptimo Sentido: +5 Daño por golpe de Destrozar)`);
            }
        }
        const damagePerHit = damagePerHitBase;

        for (let i = 0; i < maxHits; i++) {
            const roll = rollD20(); lastRoll = roll;
            const isOdd = roll % 2 !== 0;
            if (isOdd) {
                successfulHits++; totalDamageAccumulated += damagePerHit; successfulRolls.push(roll);
                logMessage(`Tirada ${i + 1}: ${roll} (Impar!) - +${damagePerHit} Daño ${damageTarget} (Total: ${totalDamageAccumulated})`);
            } else {
                logMessage(`Tirada ${i + 1}: ${roll} (Par!) - Intento ${i+1} de ${actionName} fallido.`);
            }
        }
        logMessage(`Intentos de ${actionName} finalizados. Golpes exitosos: ${successfulHits}`);

        if (totalDamageAccumulated > 0) {
            logMessage(`Daño total de ${actionName}: ${totalDamageAccumulated} directo a ${damageTarget}.`);
            const { gameOver } = applyDamage(defender.id, totalDamageAccumulated, damageType);
            isGameOverByAction = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, damage: totalDamageAccumulated, hits: successfulHits, successfulRolls: successfulRolls, message: `${attacker.name} asesta ${successfulHits} golpes (Tiradas: ${successfulRolls.join(', ')}). ${defender.name} recibe ${totalDamageAccumulated} daño a ${damageTarget}.` });
        } else {
            logMessage(`${actionName} no hizo daño.`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: actionName.charAt(0).toUpperCase() + actionName.slice(1), attackerName: attacker.name, defenderName: defender.name, outcome: 'failed', message: `${attacker.name} falla ${actionName} (Última Tirada: ${lastRoll})` });
        }

        if (!isGameOverByAction) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
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
        logMessage(`${attacker.name} intenta Atrapar a ${defender.name}!`);
        const rollAtrapar = rollD20();
        let bonus = attacker.stats.atrapar_bonus || 0;
        if (attacker.stats.septimoSentidoActivo) {
            bonus += 1;
        }
        const finalRoll = rollAtrapar + bonus;
        const targetRange = [11, 20];
        logMessage(`${attacker.name} tiró ${rollAtrapar}${bonus !== 0 ? ` + ${bonus}` : ''} = ${finalRoll} (Necesita ${targetRange[0]}-${targetRange[1]})`);
        if (finalRoll >= targetRange[0] && finalRoll <= targetRange[1]) {
             logMessage("¡Rival atrapado!");
             setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'success', message: `${attacker.name} atrapa a ${defender.name} (Tirada: ${finalRoll}). ¡Elige una opción de ataque!` });
             setActionState({ active: true, type: 'Atrapar', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_followup', allowedDefenses: null });
        } else {
             logMessage("¡Atrapar falló!");
             setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla al atrapar a ${defender.name} (Tirada: ${finalRoll})` });
             setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionName } }));
             setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        }
        return;
    }
    else if (actionName === 'combo') {
        logMessage(`${attacker.name} inicia Acción: ¡Combo!`);
        setActionState(prev => ({ ...prev, active: true, type: 'Combo', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense', currentComboHit: 1, currentDefensePenalty: 0, allowedDefenses: null, furiaHitsLandedInSequence: 0 }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Combo - Golpe 1', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el primer golpe del combo!` });
        return;
    } else if (actionName === 'engaño') {
        logMessage(`${attacker.name} inicia Acción: ¡Engaño!`);
        setActionState(prev => ({ ...prev, active: true, type: 'Engaño', attackerId: attacker.id, defenderId: defender.id, stage: 'awaiting_defense_part_1', allowedDefenses: null, defenseBonuses: { esquivar: -2 }, furiaHitsLandedInSequence: 0 }));
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Engaño - Ataque Falso', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza un ataque falso (+2 Esq. para ${defender.name})!` });
        return;
    }
    else if (['fortaleza', 'agilidad', 'destreza', 'resistencia'].includes(actionName)) {
        const usedThisCombatKey = `${actionName}UsedThisCombat`;
        const availableKey = `${actionName}Available`;
        const readableName = actionName.charAt(0).toUpperCase() + actionName.slice(1);

        logMessage(`${attacker.name} usa ${readableName}.`);
        if (attacker.stats[usedThisCombatKey]) {
            logMessage(`¡${attacker.name} ya usó ${readableName} en este combate!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${readableName} solo se puede usar una vez por combate!` });
            return;
        }
        if (attacker.stats[availableKey]) {
            logMessage(`¡${attacker.name} ya tiene el bono de ${readableName} activo!`);
            setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Ya tienes el bono de ${readableName} preparado!` });
            return;
        }
        setAttackerData(prev => ({
            ...prev,
            stats: {
                ...prev.stats,
                [availableKey]: true,
                [usedThisCombatKey]: true,
            },
            lastActionType: actionName
        }));
        let bonusMessage = "";
        if(actionName === 'fortaleza') bonusMessage = "+3 a Bloquear";
        else if(actionName === 'agilidad') bonusMessage = "+3 a Esquivar";
        else if(actionName === 'destreza') bonusMessage = "+2 a Contraatacar";
        else if(actionName === 'resistencia') bonusMessage = "+2 a Ataque de Llave/Lanz. Sucesivos";

        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${readableName} Activada`, attackerName: attacker.name, message: `¡${attacker.name} activa ${readableName}! Bono ${bonusMessage} disponible.` });
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
    if (!actionState.active || !actionState.stage?.startsWith('awaiting_defense') || !actionState.attackerId || !actionState.defenderId) { logMessage("Estado inválido para selección de defensa."); return; }
    const attackerId = actionState.attackerId; const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data; const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data; const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const actionType = actionState.type;
    const currentStage = actionState.stage;
    const baseDefenseType = defenseType.startsWith('esquivar') ? 'esquivar' :
                           defenseType.startsWith('bloquear') ? 'bloquear' :
                           defenseType.startsWith('contraatacar') ? 'contraatacar' : defenseType;

    if (actionState.allowedDefenses && !actionState.allowedDefenses.includes(baseDefenseType)) {
        logMessage(`¡Defensa inválida! ${baseDefenseType} no está permitido contra ${actionType.replace(/_/g," ")} (Fase: ${currentStage}).`);
        setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡${baseDefenseType} no permitido contra ${actionType.replace(/_/g," ")}!` });

        if (actionType === 'Arrojar' || actionType === 'Furia') {
            logMessage(`Ataque de ${actionType} #${actionState.currentHit} conecta debido a defensa inválida.`);
            const damageToApply = actionState.baseDamagePerHit;
            const { gameOver: hitGameOver, actualDamageDealt } = applyDamage(defenderId, damageToApply);

            let updatedActionState = { ...actionState };
            if (actionType === 'Arrojar') {
                updatedActionState.hitsLandedThisTurn += 1;
                updatedActionState.damageDealtThisTurn += actualDamageDealt;
            } else if (actionType === 'Furia') {
                updatedActionState.furiaHitsLandedInSequence += 1;
            }


            if (hitGameOver || updatedActionState.currentHit >= updatedActionState.totalHits) {
                const finalActionName = actionType.toLowerCase();
                logMessage(`Secuencia de ${actionType} terminada. Total golpes efectivos: ${actionType === 'Arrojar' ? updatedActionState.hitsLandedThisTurn : updatedActionState.furiaHitsLandedInSequence}/${updatedActionState.totalHits}.`);
                setArenaEvent(prev => ({ ...prev, id: Date.now(), finalMessage: `${attacker.name} finaliza ${actionType}. ${actionType === 'Arrojar' ? updatedActionState.hitsLandedThisTurn : updatedActionState.furiaHitsLandedInSequence} de ${updatedActionState.totalHits} golpes hicieron efecto.`}));
                setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: finalActionName } }));
                setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentHit: 0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0 }));
                if (!hitGameOver) {
                    const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
                    setCurrentPlayerId(nextPlayerId);
                    logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
                }
            } else {
                updatedActionState.currentHit += 1;
                updatedActionState.stage = 'awaiting_defense';
                let defenseModText = "";
                if (actionType === 'Furia') {
                    let penalty = 0;
                    if (updatedActionState.furiaHitsLandedInSequence === 1) penalty = 2;
                    else if (updatedActionState.furiaHitsLandedInSequence >= 2) penalty = 4;
                    updatedActionState.defenseBonuses = { esquivar: penalty, bloquear: penalty };
                     if (penalty > 0) defenseModText = `(Defensa rival: Esq/Bloq -${penalty})`;
                } else if (actionType === 'Arrojar') {
                     defenseModText = `(${defender.name} tiene +2 Esq, -2 Bloq)`;
                }
                setActionState(updatedActionState);
                setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${actionType} - Ataque ${updatedActionState.currentHit}/${updatedActionState.totalHits}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} continúa ${actionType === 'Furia' ? 'su Furia' : 'arrojando objetos'}! ${defenseModText}` });
            }
            return;
        }
        return;
    }


    logMessage(`${defender.name} elige defenderse con: ${defenseType.replace(/_/g, ' ')}`);
    const roll = rollD20();
    let defenseSuccessful = false, damageToDefender = 0, damageToDefenderPA = 0, damageToAttacker = 0;
    let isGameOverByThisHit = false, rollOutcome = 'failure', targetMin = null, targetMax = null;
    let defenseBonusOrPenaltyText = '', baseDamage = 0;

    let defenseSpecificBonus = 0;
    if (defenseType === 'bloquear_fortaleza' && defender.stats.fortalezaAvailable) { logMessage(`¡${defender.name} usa Fortaleza (+3 Bloquear)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, fortalezaAvailable: false } })); defenseSpecificBonus = 3; }
    else if (defenseType === 'esquivar_agilidad' && defender.stats.agilidadAvailable) { logMessage(`¡${defender.name} usa Agilidad (+3 Esquivar)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, agilidadAvailable: false } })); defenseSpecificBonus = 3; }
    else if (defenseType === 'contraatacar_destreza' && defender.stats.destrezaAvailable) { logMessage(`¡${defender.name} usa Destreza (+2 Contraatacar)!`); setDefenderData(prev => ({ ...prev, stats: { ...prev.stats, destrezaAvailable: false } })); defenseSpecificBonus = 2; }

    let actionDefenseModifier = actionState.defenseBonuses?.[baseDefenseType] || 0;
    let septimoSentidoDefensaBonus = 0;
    if (defender.stats.septimoSentidoActivo) {
        septimoSentidoDefensaBonus = 1; // +1 al rango de defensa (significa que se necesita 1 menos en el dado)
    }

    const finalRequiredRollAdjustment = actionDefenseModifier - defenseSpecificBonus;


    if (actionDefenseModifier !== 0) defenseBonusOrPenaltyText += ` (Acción: ${actionDefenseModifier > 0 ? '-' : '+'}${Math.abs(actionDefenseModifier)} ${baseDefenseType})`;
    if (defenseSpecificBonus !== 0) defenseBonusOrPenaltyText += ` (Boost: +${defenseSpecificBonus} ${baseDefenseType})`;
    if (septimoSentidoDefensaBonus !==0 && (baseDefenseType === 'esquivar' || baseDefenseType === 'bloquear' || baseDefenseType === 'contraatacar')) defenseBonusOrPenaltyText += ` (7ºS: +1 Rango Def.)`;


    const actionKey = actionType.toLowerCase().replace('_opcion', '_op').replace('vel_luz', 'velocidad_luz');
    if (actionType === 'Arrojar') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Furia') baseDamage = actionState.baseDamagePerHit;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') baseDamage = 20;
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_2') {
        baseDamage = 50;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamage += 10;
            logMessage(`(Séptimo Sentido: +10 Daño a ataque real de Engaño)`);
        }
    }
    else if (actionType === 'Salto') baseDamage = attacker.actions.salto || 70;
    else if (actionType === 'Velocidad_luz') baseDamage = attacker.actions.velocidad_luz || 50;
    else if (actionType === 'Combo') {
        baseDamage = attacker.actions.golpe;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamage += 10;
            logMessage(`(Séptimo Sentido: +10 Daño a golpe de Combo)`);
        }
    }
    else if (actionType === 'ComboVelocidadLuz') {
        baseDamage = attacker.actions.velocidad_luz || 50;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamage += 10;
            logMessage(`(Séptimo Sentido: +10 Daño a golpe de Combo Vel. Luz)`);
        }
    }
    else if (actionType === 'DobleSalto') {
        baseDamage = (attacker.actions.salto || 0) + 20;
         if (attacker.stats.septimoSentidoActivo) { // Bono aplicado al daño final de Doble Salto
            baseDamage += 30;
            logMessage(`(Séptimo Sentido: +30 Daño a Doble Salto)`);
        }
    }
    else if (actionType.startsWith('Atrapar_')) baseDamage = actionState.baseDamage || 0; // El daño de Atrapar con 7S se calcula en handleAtraparFollowupSelect
    else baseDamage = attacker.actions[actionKey]?.damage || attacker.actions[actionKey] || 0;

    // Aplicar bono de 7S a acciones de daño fijo que no son multi-golpe y no DobleSalto (ya manejado)
    if (attacker.stats.septimoSentidoActivo && !actionType.startsWith('Atrapar_') && actionType !== 'DobleSalto' && actionType !== 'Combo' && actionType !== 'ComboVelocidadLuz' && actionType !== 'Engaño') {
        const actionKeyForSeptimo = actionType.toLowerCase().replace('_opcion', '_op').replace('vel_luz', 'velocidad_luz');
        if (['golpe', 'lanzar_obj', 'salto', 'velocidad_luz', 'embestir', 'cargar'].includes(actionKeyForSeptimo)) {
            baseDamage += 30;
            logMessage(`(Séptimo Sentido: +30 Daño a ${actionType})`);
        }
    }


    if (roll === 1 && baseDefenseType !== 'invalid') {
         defenseSuccessful = false; rollOutcome = 'failure'; damageToDefender = baseDamage;
         logMessage("¡Fallo Crítico en la defensa (Tirada 1)!");
    }
    else if (baseDefenseType === 'esquivar') {
        let [min, max] = defender.defenseRanges.esquivar;
        targetMin = Math.min(21, Math.max(1, min + finalRequiredRollAdjustment - septimoSentidoDefensaBonus));
        targetMax = max;
        if (roll >= targetMin && roll <= targetMax) { defenseSuccessful = true; rollOutcome = 'success'; }
        else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
    } else if (baseDefenseType === 'bloquear') {
        let [min, max] = defender.defenseRanges.bloquear;
        if ((actionType === 'Atrapar_Opcion2' && defenseType !== 'bloquear') || actionType === 'Atrapar_Opcion7' || actionType === 'DobleSalto') {
            rollOutcome = 'invalid'; damageToDefender = baseDamage; targetMin = null; targetMax = null;
            logMessage(`¡Defensa de Bloqueo inválida contra ${actionType}! Impacto directo.`);
        } else {
            targetMin = Math.min(21, Math.max(1, min + finalRequiredRollAdjustment - septimoSentidoDefensaBonus));
            targetMax = max;
            if (roll >= targetMin && roll <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'blocked';
                if (actionType === 'Arrojar') damageToDefenderPA = actionState.blockDamagePA;
                else if (actionType === 'Furia') damageToDefenderPA = actionState.blockDamagePA;
                else if (actionType === 'Golpe' || actionType === 'Velocidad_luz' || actionType === 'ComboVelocidadLuz') damageToDefenderPA = 10;
                else if (actionType === 'Lanzar_obj' || actionType === 'Embestir' || actionType === 'Cargar' || actionType === 'Salto') damageToDefenderPA = 20;
                else if (actionType === 'Atrapar_Opcion2') damageToDefenderPA = actionState.blockDamagePA || 20;
                else if (actionType === 'Atrapar_Opcion4') damageToDefenderPA = actionState.blockDamagePA || 10;
                else damageToDefenderPA = 10;
            } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
    } else if (baseDefenseType === 'contraatacar') {
         let [min, max] = defender.defenseRanges.contraatacar;
         const contraataqueRollAdjustment = (actionType === 'Furia' ? 0 : actionDefenseModifier) - defenseSpecificBonus;

         if (actionType === 'Atrapar_Opcion2' || actionType === 'Atrapar_Opcion7' || actionType === 'DobleSalto' || actionType === 'Velocidad_luz' || actionType === 'ComboVelocidadLuz') {
            rollOutcome = 'invalid'; damageToDefender = baseDamage; targetMin = null; targetMax = null;
            logMessage(`¡Contraataque inválido contra ${actionType}! Impacto directo.`);
         } else {
            targetMin = Math.min(21, Math.max(1, min + contraataqueRollAdjustment - septimoSentidoDefensaBonus));
            targetMax = max;
            if (roll >= targetMin && roll <= targetMax) {
                defenseSuccessful = true; rollOutcome = 'countered';
                damageToAttacker = Math.floor((defender.actions.golpe || 30) / 2);
            } else { damageToDefender = baseDamage; rollOutcome = 'failure'; }
        }
    }

    let attackerDamageMessage = "", defenderDamageMessage = "";
    let damageResultDefender = { gameOver: false, actualDamageDealt: 0 };
    let damageResultAttacker = { gameOver: false, actualDamageDealt: 0 };

    if (damageToAttacker > 0) {
        damageResultAttacker = applyDamage(attackerId, damageToAttacker);
        attackerDamageMessage = `${attacker.name} recibe ${damageToAttacker} de daño por contraataque.`;
        if (damageResultAttacker.gameOver) isGameOverByThisHit = true;
    }
    if (!isGameOverByThisHit && damageToDefender > 0) {
        damageResultDefender = applyDamage(defenderId, damageToDefender);
        defenderDamageMessage = `${defender.name} recibe ${damageToDefender} de daño.`;
        if (damageResultDefender.gameOver) isGameOverByThisHit = true;
    }
    if (!isGameOverByThisHit && damageToDefenderPA > 0) {
        damageResultDefender = applyDamage(defenderId, damageToDefenderPA, 'directPA');
        defenderDamageMessage = `${defender.name} recibe ${damageToDefenderPA} de daño a la armadura.`;
        if (damageResultDefender.gameOver) isGameOverByThisHit = true;
    }

    let hitContext = "";
    if (actionType === 'Arrojar' || actionType === 'Furia' || actionType === 'Combo' || actionType === 'ComboVelocidadLuz') {
        hitContext = ` (Golpe ${actionState.currentHit || actionState.currentComboHit})`;
    }

    let finalMessage = `${defender.name} intenta ${defenseType.replace(/_/g,' ')}${defenseBonusOrPenaltyText} vs ${actionType.replace(/_/g, ' ')}${hitContext}. Tirada: ${roll}. `;
    if (targetMin !== null) { finalMessage += `(Necesita ${targetMin}-${targetMax}). `; }
    switch (rollOutcome) { case 'success': finalMessage += "¡Éxito Defendiendo! "; break; case 'failure': finalMessage += "¡Fallo Defendiendo! "; break; case 'blocked': finalMessage += "¡Bloqueado! "; break; case 'countered': finalMessage += "¡Contraatacado! "; break; case 'invalid': finalMessage += "¡Defensa Inválida! "; break; default: finalMessage += "Resultado: "; break; }
    finalMessage += defenderDamageMessage + " " + attackerDamageMessage;

    const resolutionEvent = { id: Date.now(), type: 'defense_resolution', actionName: `${actionType.replace(/_/g, ' ')}${hitContext} vs ${defenseType.replace(/_/g,' ')}`, rollerName: defender.name, rollValue: roll, targetMin: targetMin, targetMax: targetMax, defenseType: defenseType, rollOutcome: rollOutcome, finalMessage: finalMessage.trim(), gameOver: isGameOverByThisHit };
    setArenaEvent(resolutionEvent); logMessage(finalMessage);
    await delay(1500);


    if (isGameOverByThisHit) {
        logMessage(`¡Combate terminado por el golpe actual!`);
        if (actionState.stage !== 'game_over') { setActionState(prev => ({ ...prev, stage: 'game_over' })); }
        return;
    }

    if (actionType === 'Arrojar' || actionType === 'Furia') {
        let updatedActionState = { ...actionState };

        if (actionType === 'Arrojar') {
            if (rollOutcome === 'failure' || rollOutcome === 'invalid' || (rollOutcome === 'blocked' && damageToDefenderPA > 0) || (rollOutcome === 'countered' && damageToAttacker > 0)) {
                if (damageResultDefender.actualDamageDealt > 0 || damageResultAttacker.actualDamageDealt > 0) {
                     updatedActionState.hitsLandedThisTurn++;
                }
                updatedActionState.damageDealtThisTurn += damageResultDefender.actualDamageDealt;
            }
        } else if (actionType === 'Furia') {
            if (rollOutcome === 'failure' || rollOutcome === 'invalid' || (rollOutcome === 'countered' && damageToDefender > 0 )) {
                updatedActionState.furiaHitsLandedInSequence++;
            }
        }

        if (updatedActionState.currentHit >= updatedActionState.totalHits) {
            const finalActionName = actionType.toLowerCase();
            logMessage(`Secuencia de ${actionType} terminada.`);
            if (actionType === 'Arrojar') {
                logMessage(`Total golpes efectivos de Arrojar: ${updatedActionState.hitsLandedThisTurn}/${updatedActionState.totalHits}. Daño total: ${updatedActionState.damageDealtThisTurn}.`);
                setArenaEvent(prev => ({ ...prev, id: Date.now(), finalMessage: `${attacker.name} finaliza Arrojar. ${updatedActionState.hitsLandedThisTurn} de ${updatedActionState.totalHits} golpes hicieron efecto, causando ${updatedActionState.damageDealtThisTurn} de daño total.`}));
            } else if (actionType === 'Furia') {
                logMessage(`Total golpes de Furia conectados: ${updatedActionState.furiaHitsLandedInSequence}/${updatedActionState.totalHits}.`);
                setArenaEvent(prev => ({ ...prev, id: Date.now(), finalMessage: `${attacker.name} finaliza su Furia. ${updatedActionState.furiaHitsLandedInSequence} de ${updatedActionState.totalHits} golpes impactaron.`}));
            }

            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: finalActionName } }));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentHit: 0, hitsLandedThisTurn: 0, damageDealtThisTurn: 0, furiaHitsLandedInSequence: 0 }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else {
            updatedActionState.currentHit += 1;
            updatedActionState.stage = 'awaiting_defense';

            let defenseModText = "";
            if (actionType === 'Furia') {
                let penalty = 0;
                if (updatedActionState.furiaHitsLandedInSequence === 1) penalty = 2;
                else if (updatedActionState.furiaHitsLandedInSequence >= 2) penalty = 4;
                updatedActionState.defenseBonuses = { esquivar: penalty, bloquear: penalty };
                 if (penalty > 0) defenseModText = `(Defensa rival: Esq/Bloq -${penalty})`;
            } else if (actionType === 'Arrojar') {
                 defenseModText = `(${defender.name} tiene +2 Esq, -2 Bloq)`;
            }

            setActionState(updatedActionState);
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${actionType} - Ataque ${updatedActionState.currentHit}/${updatedActionState.totalHits}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} continúa su ${actionType}! ${defenseModText}` });
        }
        return;
    }
    else if (actionType === 'Engaño' && currentStage === 'awaiting_defense_part_1') {
        if (!isGameOverByThisHit) {
            logMessage("--- Engaño: Preparando Ataque Real ---");
            setActionState(prevState => ({ ...prevState, stage: 'awaiting_defense_part_2', allowedDefenses: ['bloquear'], defenseBonuses: { bloquear: 3 } }));
            setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: 'Engaño - Ataque Real', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el ataque real! (${defender.name} solo puede Bloquear, -3 Penaliz.)` });
            return;
        }
    }
    else if (actionType === 'Combo' || actionType === 'ComboVelocidadLuz') {
        const isComboVel = actionType === 'ComboVelocidadLuz';
        const currentComboHit = actionState.currentComboHit || actionState.currentHit || 1;

        if (defenseSuccessful || currentComboHit >= 3 ) {
            let finalComboMessage = "";
            if (defenseSuccessful) { finalComboMessage = `¡${defender.name} detiene el ${isComboVel ? 'Combo a Velocidad Luz' : 'Combo'} en el golpe #${currentComboHit}!`; }
            else { finalComboMessage = `¡${attacker.name} completa el ${isComboVel ? 'Combo a Velocidad Luz' : 'Combo'} de 3 golpes!`; }
            logMessage(finalComboMessage);
            setArenaEvent({ id: Date.now() + 1, type: 'action_effect', actionName: `Fin ${isComboVel ? 'Combo Vel. Luz' : 'Combo'}`, message: finalComboMessage });

            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: isComboVel ? 'combo_velocidad_luz' : 'combo' } }));
            setActionState(prev => ({ ...prev, active: false, type: null, stage: null, currentComboHit: 0, currentHit: 0 }));
            const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
            setCurrentPlayerId(nextPlayerId);
            logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        } else {
            const nextHit = currentComboHit + 1;
            let nextBonuses = {};
            let messagePenalty = "";
            if (isComboVel) {
                nextBonuses = { esquivar: 4, bloquear: 6 };
                messagePenalty = "(Esq -4, Bloq -6)";
            } else {
                const penalty = nextHit === 2 ? 2 : 4;
                nextBonuses = { esquivar: penalty, bloquear: penalty, contraatacar: penalty };
                messagePenalty = `(Defensa -${penalty})`;
            }

            logMessage(`¡El golpe #${currentComboHit} conecta! ${attacker.name} continúa con golpe #${nextHit}...`);
            setActionState(prevState => ({
                ...prevState,
                stage: 'awaiting_defense',
                [isComboVel ? 'currentComboHit' : 'currentHit']: nextHit,
                currentDefensePenalty: !isComboVel ? (nextHit === 2 ? 2 : 4) : prevState.currentDefensePenalty,
                defenseBonuses: nextBonuses
            }));
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: `${isComboVel ? 'Combo Vel. Luz' : 'Combo'} - Golpe ${nextHit}`, attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza el golpe #${nextHit}! ${messagePenalty}` });
        }
        return;
    }

    if (!isGameOverByThisHit) {
        const actionJustFinished = actionState.type;
        let actionTypeForHistory = actionJustFinished.toLowerCase();
        if (actionTypeForHistory.startsWith('atrapar_')) actionTypeForHistory = 'atrapar';
        else if (actionTypeForHistory === 'velocidadluz' || actionTypeForHistory === 'vel_luz') actionTypeForHistory = 'velocidad_luz';
        else if (actionTypeForHistory === 'doblesalto') actionTypeForHistory = 'doble_salto';
        else if (actionTypeForHistory === 'combovelocidadluz') actionTypeForHistory = 'combo_velocidad_luz';


        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null, furiaHitsLandedInSequence: 0 }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
    }
  };


  const handleAtraparFollowupSelect = async (optionId) => {
    if (!actionState.active || actionState.type !== 'Atrapar' || actionState.stage !== 'awaiting_followup') { logMessage("Estado inválido para selección de seguimiento de Atrapar."); return; }
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setAttackerData = actionState.attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let gameOverByFollowup = false; const selectedOption = atraparFollowupOptions.find(opt => opt.id === optionId);
    logMessage(`${attacker.name} elige seguimiento de Atrapar: ${selectedOption?.name || optionId}`);

    switch (optionId) {
      case 'atrapar_op1': {
        logMessage(`${attacker.name} usa Golpes Múltiples!`); const rolls = [rollD20(), rollD20(), rollD20()]; const oddRolls = rolls.filter(r => r % 2 !== 0); const oddCount = oddRolls.length;
        let damagePerHitAtraparOp1 = 20;
        if (attacker.stats.septimoSentidoActivo) {
            damagePerHitAtraparOp1 += 10;
            logMessage(`(Séptimo Sentido: +10 Daño por golpe)`);
        }
        const damage = oddCount * damagePerHitAtraparOp1;
        logMessage(`Tiradas: ${rolls.join(', ')}. Aciertos (impares): ${oddCount}. Daño total: ${damage}`);
        if (damage > 0) {
            const { gameOver } = applyDamage(defender.id, damage, 'normal');
            gameOverByFollowup = gameOver;
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, damage: damage, hits: oddCount, successfulRolls: oddRolls, message: `${attacker.name} conecta ${oddCount} golpes (${oddRolls.join(', ')}) causando ${damage} de daño.` });
        } else {
            logMessage("Ningún golpe acertó.");
            setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Golpes Múltiples', attackerName: attacker.name, defenderName: defender.name, outcome: 'failure', message: `${attacker.name} falla todos los golpes (Tiradas: ${rolls.join(', ')}).` });
        }
        break;
      }
      case 'atrapar_op2': {
        logMessage(`${attacker.name} usa Ataque Potente!`);
        let baseDamageAtraparOp2 = 80;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamageAtraparOp2 += 30;
            logMessage(`(Séptimo Sentido: +30 Daño)`);
        }
        setActionState({ ...actionState, type: 'Atrapar_Opcion2', stage: 'awaiting_defense', baseDamage: baseDamageAtraparOp2, blockDamagePA: 20, allowedDefenses: ['bloquear'] });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Potente', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Potente (${baseDamageAtraparOp2} Daño). ${defender.name}, ¡solo puedes intentar Bloquear!` });
        return;
      }
      case 'atrapar_op3': {
        logMessage(`${attacker.name} inicia Ataques Rápidos!`); let successfulDamageHits = 0, successfulBlocks = 0, totalNormalDamage = 0, totalPADamage = 0;
        let damagePerHitAtraparOp3 = 20;
        if (attacker.stats.septimoSentidoActivo) {
            damagePerHitAtraparOp3 += 10;
            logMessage(`(Séptimo Sentido: +10 Daño por golpe)`);
        }
        for (let i = 0; i < 3; i++) {
          if (gameOverByFollowup) break;
          const hitNumber = i + 1; logMessage(`--- Golpe Rápido #${hitNumber} ---`);
          const [minRoll, maxRoll] = defender.defenseRanges.bloquear; const roll = rollD20();
          let septimoSentidoDefensaBonusAtrapar = 0;
          if (defender.stats.septimoSentidoActivo) septimoSentidoDefensaBonusAtrapar = 1;
          const targetMinBlock = Math.min(21, Math.max(1, minRoll - septimoSentidoDefensaBonusAtrapar));

          const blocked = (roll >= targetMinBlock && roll <= maxRoll);
          logMessage(`${defender.name} intenta Bloquear (Necesita ${targetMinBlock}-${maxRoll}): Tirada ${roll}!`);
          if (blocked) {
            successfulBlocks++; const damagePA = 10; totalPADamage += damagePA; logMessage(`¡Bloqueado! Recibe ${damagePA} daño PA.`);
            const { gameOver } = applyDamage(defender.id, damagePA, 'directPA');
            if (gameOver) gameOverByFollowup = true;
          } else {
            successfulDamageHits++; const damageNormal = damagePerHitAtraparOp3; totalNormalDamage += damageNormal; logMessage(`¡Impacto! Recibe ${damageNormal} daño.`);
            const { gameOver } = applyDamage(defender.id, damageNormal, 'normal');
            if (gameOver) gameOverByFollowup = true;
          }
          if (!gameOverByFollowup) await delay(1000); else break;
        }
        let finalMessage = `${attacker.name} usó Ataques Rápidos. `; let details = []; if (successfulDamageHits > 0) details.push(`${successfulDamageHits} impactos (${totalNormalDamage} Daño Normal)`); if (successfulBlocks > 0) details.push(`${successfulBlocks} bloqueados (${totalPADamage} Daño PA)`); finalMessage += details.length > 0 ? details.join(', ') + '.' : "¡Todos los golpes fallaron o fueron bloqueados sin efecto!";
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataques Rápidos', message: finalMessage, hitsLanded: successfulDamageHits, hitsBlocked: successfulBlocks, totalNormalDmg: totalNormalDamage, totalPADmg: totalPADamage });
        break;
      }
      case 'atrapar_op4': {
        logMessage(`${attacker.name} usa Ataque Vulnerante!`);
        let baseDamageAtraparOp4 = 60;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamageAtraparOp4 += 30;
            logMessage(`(Séptimo Sentido: +30 Daño)`);
        }
        setActionState({ ...actionState, type: 'Atrapar_Opcion4', stage: 'awaiting_defense', baseDamage: baseDamageAtraparOp4, blockDamagePA: 10, defenseBonuses: { esquivar: 2, bloquear: 2, contraatacar: 2 }, allowedDefenses: null });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Vulnerante', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Vulnerante (${baseDamageAtraparOp4} Daño). ¡${defender.name} defiende con -2 de penalización!` });
        return;
      }
      case 'atrapar_op5': {
        const currentActionName = 'llave';
        if (attacker.stats.lastActionType === currentActionName) {
          logMessage("¡Regla de Alternancia! No se puede usar Llave Mejorada después de Llave.");
          setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Llave Mejorada', outcome: 'invalid', message: "¡No puedes usar Llave consecutivamente!" });
        } else {
          logMessage(`${attacker.name} usa Llave Mejorada (+3 Bono)!`);
          const currentDefenderData = defender.id === player1Data.id ? player1Data : player2Data;
          gameOverByFollowup = resolveLlaveAction(attacker, currentDefenderData, 3); // El daño de 7S ya se aplica en resolveLlaveAction
          if (!gameOverByFollowup) {
            setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: currentActionName } }));
          }
        }
        break;
      }
      case 'atrapar_op6': {
        logMessage(`${attacker.name} usa Romper Mejorado.`);
        const canBreakAnyPart = ['arms', 'legs', 'ribs'].some(part => defender.stats.brokenParts[part] < 2);
        if (!canBreakAnyPart) {
          logMessage(`¡Todas las partes de ${defender.name} ya están rotas 2 veces! No se puede usar Romper Mejorado.`);
          setArenaEvent({ id: Date.now(), type: 'action_effect', outcome: 'invalid', message: `¡Todas las partes del rival están rotas al máximo!` });
        } else {
          setActionState({ ...actionState, type: 'Atrapar_Opcion6', stage: 'awaiting_romper_target', romperBonus: 4 });
          setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Romper Mejorado', message: `${attacker.name} intenta romper una parte del cuerpo con bono de +4.` });
          return;
        }
        break;
      }
      case 'atrapar_op7': {
        logMessage(`${attacker.name} usa Ataque Imbloqueable!`);
        let baseDamageAtraparOp7 = 60;
        if (attacker.stats.septimoSentidoActivo) {
            baseDamageAtraparOp7 += 10;
            logMessage(`(Séptimo Sentido: +10 Daño)`);
        }
        setActionState({ ...actionState, type: 'Atrapar_Opcion7', stage: 'awaiting_defense', baseDamage: baseDamageAtraparOp7, allowedDefenses: ['esquivar'] });
        setArenaEvent({ id: Date.now(), type: 'action_effect', actionName: 'Atrapar: Ataque Imbloqueable', attackerName: attacker.name, defenderName: defender.name, message: `${attacker.name} lanza Ataque Imbloqueable (${baseDamageAtraparOp7} Daño). ${defender.name}, ¡solo puedes intentar Esquivar!` });
        return;
      }
      default: {
        logMessage(`Opción ${optionId} no implementada.`);
        break;
      }
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
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
        return;
    }
    const bonus = actionState.romperBonus || 0;
    const gameOverByRomper = resolveRomperAttempt(attacker, defender, partToBreak, bonus);

    if (!gameOverByRomper) {
        await delay(1500);
        setAttackerData(prev => ({ ...prev, stats: { ...prev.stats, lastActionType: actionTypeForHistory } }));
        setActionState(prev => ({ ...prev, active: false, type: null, stage: null }));
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
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