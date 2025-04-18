import './App.css'
import { useState } from 'react'
import PlayerArea from './components/PlayerArea'
import GameBoard from './components/GameBoard'
import GameLog from './components/GameLog'
import ArenaDisplay from './components/ArenaDisplay'

// Datos iniciales para los personajes
const initialPlayer1Data = {
  id: 'seiya_v2',
  name: 'SEIYA DE PEGASO II',
  stats: {
    pv_max: 230, pa_max: 300, pc_max: 500,
    currentPV: 230, currentPA: 300, currentPC: 500,
    atrapar_bonus: 0, // Bono base para atrapar
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
    velocidad_luz: 60,
    embestir: 70,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    atrapar: true, // Nueva acción
  },
  powers: [
    { id: 'P001', name: 'Meteoros de Pegaso', cost: 100, type: ['RMult'], details: '5-8 golpes x 20 Ptos Daño' },
    { id: 'P002', name: 'Vuelo del Pegaso', cost: 100, type: ['LL'], damage: 100 },
    { id: 'P003', name: 'Cometa Pegaso', cost: 200, type: ['R'], damage: 190, effects: '-1 Esq/-1 Bloq' },
  ],
  bonuses: {
    pasivos: ['+2 Esq', '+1 ContrAtq', '+2 7º Sent', '+10 Dmg Salto/VelLuz/Embestir', '+1 Percep'],
    activos: ['+4 Int Div', '+4 Ayuda (aliados)', 'UltSuspiro 25% PV', 'Armadura Divina'],
  },
  statusEffects: [],
  canConcentrate: true,
  concentrationLevel: 0,
  supportRanges: {
      percepcion: [16, 20],
      septimo_sentido: [17, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
  }
};

// Datos de Shiryu de Dragón como Jugador 2
const initialPlayer2Data = {
  id: 'shiryu_v1',
  name: 'SHIRYU DE DRAGON',
  stats: {
    pv_max: 280, pa_max: 300, pc_max: 400,
    currentPV: 280, currentPA: 300, currentPC: 400,
    atrapar_bonus: 0, // Bono base para atrapar
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
    embestir: 60,
    cargar: 80,
    presa: { damagePerHit: 15, maxHits: 3, type: 'vida' },
    destrozar: { damagePerHit: 15, maxHits: 3, type: 'armadura' },
    lanzar_obj: 60,
    atrapar: true, // Nueva acción
  },
  powers: [
    { id: 'S001', name: 'Patada Dragón', cost: 50, type: ['R'], damage: 40, details: '+10 Dmg Salto stack' },
    { id: 'S002', name: 'Dragón Volador', cost: 50, type: ['R', 'G'], damage: 70 },
    { id: 'S003', name: 'Rozan Ryuu Hi Shou', cost: 100, type: ['R', 'G'], damage: 100, details: 'Weak Point on Counter' },
    { id: 'S004', name: 'Cien Dragones de Rozan', cost: 200, type: ['RB', 'G'], damage: 160, effects: '-3 Bloquear' },
    { id: 'S005', name: 'Último Dragón', cost: 200, type: ['LL'], damage: 200, details: 'Self-dmg 120, 1 use' },
    { id: 'S006', name: 'Excalibur', cost: 100, type: ['R', 'RArm', 'M'], damage: 100, details: 'Ignore Def Bonus, Destroys Armor on 1-2' },
  ],
  bonuses: {
    pasivos: ['+1 Percep', '+2 Bloq (ESC, ARM)', '+10 Dmg Golpe (ARM)'],
    activos: ['+2 Ayuda (aliados)', '+2 Int Div', 'Valentía del Dragón', 'Armadura Divina'],
    flags: ['ESC', 'ARM']
  },
  statusEffects: [],
  canConcentrate: true,
  concentrationLevel: 0,
  supportRanges: {
      percepcion: [15, 20],
      septimo_sentido: [19, 20],
      puntos_vitales: [17, 20],
      romper: [11, 20],
      ayuda: [12, 20],
  }
};

// Opciones de seguimiento para Atrapar
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
  // Estado para los datos completos de cada personaje
  const [player1Data, setPlayer1Data] = useState(initialPlayer1Data);
  const [player2Data, setPlayer2Data] = useState(initialPlayer2Data);
  
  // Estado para rastrear el jugador actual
  const [currentPlayerId, setCurrentPlayerId] = useState('seiya_v2');
  
  // Estado para manejar la acción actual
  const [actionState, setActionState] = useState({ 
    active: false, 
    type: null, 
    attackerId: null, 
    defenderId: null, 
    stage: null 
  });
  
  // Estado para el registro del juego
  const [gameLog, setGameLog] = useState([]);
  
  // Estado para el evento de la arena
  const [arenaEvent, setArenaEvent] = useState(null);
  
  // Función para tirar un dado de 20 caras
  const rollD20 = () => {
    return Math.floor(Math.random() * 20) + 1;
  };
  
  // Función para añadir mensajes al log
  const logMessage = (message) => {
    console.log(message); // También loguea en consola para debugging
    setGameLog(prevLog => [message, ...prevLog]); // Añade al principio del array
  };
  
  // Función auxiliar para aplicar daño a un jugador
  const applyDamage = (targetPlayerId, damageAmount, damageType = 'normal') => {
    const targetData = targetPlayerId === player1Data.id ? player1Data : player2Data;
    const setTargetData = targetPlayerId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    let isGameOver = false;

    logMessage(`Aplicando ${damageAmount} de daño base (Tipo: ${damageType}) a ${targetData.name}...`);

    let damageToPa = 0;
    let damageToPv = 0;
    let currentPA = targetData.stats.currentPA;
    let currentPV = targetData.stats.currentPV;
    let finalPA = currentPA;
    let finalPV = currentPV;

    if (damageType === 'directPV') {
        damageToPv = damageAmount;
        logMessage(`${targetData.name} recibe ${damageToPv} daño directo a PV.`);
    } else if (damageType === 'directPA') {
        damageToPa = damageAmount;
        finalPA = currentPA - damageToPa;
        if (finalPA < 0) {
            if (currentPA > 0) logMessage(`¡Armadura rota por el daño directo a PA!`);
            damageToPv = -finalPA; // Daño excedente a PV
            finalPA = 0;
             logMessage(`${targetData.name} recibe ${currentPA} daño a PA y ${damageToPv} daño a PV.`);
        } else {
             logMessage(`${targetData.name} recibe ${damageToPa} daño directo a PA.`);
        }
    } else { // damageType === 'normal'
        damageToPa = Math.ceil(damageAmount / 2);
        damageToPv = Math.floor(damageAmount / 2);
        finalPA = currentPA - damageToPa;
        if (finalPA < 0) {
            if (currentPA > 0) logMessage(`¡Armadura rota por el daño!`);
            damageToPv += (-finalPA);
            finalPA = 0;
        }
         logMessage(`${targetData.name} recibe ${damageToPv} daño a PV y ${damageToPa} daño a PA.`);
    }

    // Aplicar daño a PV calculado
    finalPV -= damageToPv;
    if (finalPV <= 0) {
      finalPV = 0;
      isGameOver = true;
      logMessage(`¡¡¡ ${targetData.name} ha sido derrotado !!!`);
    }

    // Actualizar estado del jugador
    setTargetData(prevData => ({
      ...prevData,
      stats: { ...prevData.stats, currentPV: finalPV, currentPA: finalPA }
    }));

    logMessage(`${targetData.name} - PV: ${finalPV}/${targetData.stats.pv_max}, PA: ${finalPA}/${targetData.stats.pa_max}`);

    if (isGameOver) {
      setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: 'game_over' });
    }
    return isGameOver;
  };
  
  // Función para reiniciar el juego
  const handlePlayAgain = () => {
    logMessage("Reiniciando el juego...");
    setPlayer1Data(initialPlayer1Data);
    setPlayer2Data(initialPlayer2Data);
    setCurrentPlayerId(initialPlayer1Data.id); // Reinicia al jugador 1 (Seiya)
    setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
    setGameLog([]); // Limpia el log
  };
  
  // Función para manejar la iniciación de una acción
  const handleActionInitiate = (actionName) => {
    if (!actionState.active) { // Solo iniciar si no hay otra acción activa
      const attacker = currentPlayerId === player1Data.id ? player1Data : player2Data;
      const defender = currentPlayerId === player1Data.id ? player2Data : player1Data;

      if (actionName === 'golpe') {
        logMessage(`${attacker.name} inicia Acción: Golpe`);
        setActionState({
          active: true,
          type: 'Golpe',
          attackerId: attacker.id,
          defenderId: defender.id,
          stage: 'awaiting_defense'
        });
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Golpe',
          attackerName: attacker.name,
          defenderName: defender.name
        });
      } else if (actionName === 'llave') {
        logMessage(`${attacker.name} intenta una Llave contra ${defender.name}!`);
        
        let attackerRoll = 0;
        let defenderRoll = 0;
        let ties = 0;
        let currentDamage = attacker.actions.llave; // Daño base (60)
        let winnerId = null;
        let loserId = null;
        let gameOver = false;

        // Bucle para manejar empates (máximo 3)
        while (ties < 3) {
          // Realizar tiradas (Atacante +2 por iniciar)
          const attackerBaseRoll = rollD20();
          const defenderBaseRoll = rollD20();
          attackerRoll = attackerBaseRoll + 2; // Bono +2 iniciador
          defenderRoll = defenderBaseRoll;

          logMessage(`Tirada Llave: ${attacker.name} (${attackerBaseRoll}+2 = ${attackerRoll}) vs ${defender.name} (${defenderRoll})`);

          if (attackerRoll > defenderRoll) {
            winnerId = attacker.id;
            loserId = defender.id;
            logMessage(`${attacker.name} gana la llave!`);
            break; // Salir del bucle de empates
          } else if (defenderRoll > attackerRoll) {
            winnerId = defender.id;
            loserId = attacker.id;
            logMessage(`${defender.name} gana la llave!`);
            break; // Salir del bucle de empates
          } else {
            // Empate
            ties++;
            if (ties < 3) {
              currentDamage += 10; // Aumentar daño por forcejeo
              logMessage(`¡Empate ${ties}! Forcejeo... Daño aumenta a ${currentDamage}. Volviendo a tirar...`);
            } else {
              logMessage("¡Empate por tercera vez! La llave se anula.");
              setArenaEvent({
                id: Date.now(),
                type: 'action_effect',
                actionName: 'Llave',
                outcome: 'tie',
                message: `¡Empate final (${attackerRoll} vs ${defenderRoll})! La llave se anula.`
              });
              break; // Salir del bucle
            }
          }
        }

        // Aplicar daño si hubo un ganador
        if (winnerId && loserId) {
          gameOver = applyDamage(loserId, currentDamage);
          
          // Actualizar el evento de la arena con el resultado
          const winner = winnerId === attacker.id ? attacker : defender;
          const loser = loserId === attacker.id ? attacker : defender;
          setArenaEvent({
            id: Date.now(),
            type: 'action_effect',
            actionName: 'Llave',
            winnerName: winner.name,
            loserName: loser.name,
            damage: currentDamage,
            message: `${winner.name} gana (${attackerRoll} vs ${defenderRoll}). ${loser.name} recibe ${currentDamage} daño.`
          });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
          logMessage(`Turno de ${nextPlayerName}`);
        }
        return;
      } else if (actionName === 'presa') {
        logMessage(`${attacker.name} intenta una Presa contra ${defender.name}!`);
        
        let totalDamageAccumulated = 0;
        let successfulHits = 0;
        let successfulRolls = []; // Array para almacenar las tiradas exitosas
        let lastRoll = null; // Variable para guardar la última tirada
        let gameOver = false;

        for (let i = 0; i < 3; i++) { // Máximo 3 intentos/éxitos
            const roll = rollD20();
            lastRoll = roll; // Guardamos la última tirada
            const isOdd = roll % 2 !== 0;

            if (isOdd) {
                successfulHits++;
                const damagePerHit = 15; // Daño Presa según reglas
                totalDamageAccumulated += damagePerHit;
                successfulRolls.push(roll); // Guardar la tirada exitosa
                logMessage(`Tirada ${i + 1}: ${roll} (Impar!) - +${damagePerHit} Daño PV (Total Acumulado: ${totalDamageAccumulated})`);
                if (successfulHits === 3) {
                     logMessage("Máximo de 3 golpes exitosos alcanzado.");
                     break; // Termina después del 3er éxito
                }
            } else {
                logMessage(`Tirada ${i + 1}: ${roll} (Par!) - Presa detenida.`);
                break; // Termina si falla (par)
            }
        }

        // Aplicar daño acumulado si hubo algún éxito
        if (totalDamageAccumulated > 0) {
             logMessage(`Daño total de la Presa: ${totalDamageAccumulated} directo a PV.`);
             gameOver = applyDamage(defender.id, totalDamageAccumulated, 'directPV');
             
             // Actualizar el evento de la arena con el resultado
             setArenaEvent({
               id: Date.now(),
               type: 'action_effect',
               actionName: 'Presa',
               attackerName: attacker.name,
               defenderName: defender.name,
               damage: totalDamageAccumulated,
               hits: successfulHits,
               successfulRolls: successfulRolls,
               message: `${attacker.name} asesta ${successfulHits} golpes (Tiradas: ${successfulRolls.join(', ')}). ${defender.name} recibe ${totalDamageAccumulated} daño PV.`
             });
        } else {
             logMessage("La Presa no hizo daño.");
             
             // Actualizar el evento de la arena con el resultado
             setArenaEvent({
               id: Date.now(),
               type: 'action_effect',
               actionName: 'Presa',
               attackerName: attacker.name,
               defenderName: defender.name,
               outcome: 'failed',
               message: `${attacker.name} falla la Presa (Tirada: ${lastRoll})`
             });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
             setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
             logMessage(`Turno de ${nextPlayerName}`);
        }
        return;
      } else if (actionName === 'destrozar') {
        logMessage(`${attacker.name} intenta Destrozar la armadura de ${defender.name}!`);
        
        // Comprobar si el defensor tiene armadura
        if (defender.stats.currentPA <= 0) {
            logMessage(`¡La armadura de ${defender.name} ya está rota! No se puede usar Destrozar.`);
            
            // Actualizar el evento de la arena con el resultado
            setArenaEvent({
              id: Date.now(),
              type: 'action_effect',
              actionName: 'Destrozar',
              attackerName: attacker.name,
              defenderName: defender.name,
              outcome: 'no_armor',
              message: `¡La armadura de ${defender.name} ya está rota!`
            });
            
            return;
        }

        let totalDamageAccumulated = 0;
        let successfulHits = 0;
        let successfulRolls = []; // Array para almacenar las tiradas exitosas
        let lastRoll = null; // Variable para guardar la última tirada
        let gameOver = false;

        for (let i = 0; i < 3; i++) { // Máximo 3 intentos/éxitos
            const roll = rollD20();
            lastRoll = roll; // Guardamos la última tirada
            const isOdd = roll % 2 !== 0;

            if (isOdd) {
                successfulHits++;
                const damagePerHit = 15; // Daño Destrozar según reglas
                totalDamageAccumulated += damagePerHit;
                successfulRolls.push(roll); // Guardar la tirada exitosa
                logMessage(`Tirada ${i + 1}: ${roll} (Impar!) - +${damagePerHit} Daño PA (Total Acumulado: ${totalDamageAccumulated})`);
                if (successfulHits === 3) {
                     logMessage("Máximo de 3 golpes exitosos alcanzado.");
                     break; // Termina después del 3er éxito
                }
            } else {
                logMessage(`Tirada ${i + 1}: ${roll} (Par!) - Destrozar detenido.`);
                break; // Termina si falla (par)
            }
        }

        // Aplicar daño acumulado si hubo algún éxito
        if (totalDamageAccumulated > 0) {
             logMessage(`Daño total de Destrozar: ${totalDamageAccumulated} directo a PA.`);
             gameOver = applyDamage(defender.id, totalDamageAccumulated, 'directPA');
             
             // Actualizar el evento de la arena con el resultado
             setArenaEvent({
               id: Date.now(),
               type: 'action_effect',
               actionName: 'Destrozar',
               attackerName: attacker.name,
               defenderName: defender.name,
               damage: totalDamageAccumulated,
               hits: successfulHits,
               successfulRolls: successfulRolls,
               message: `${attacker.name} golpea ${successfulHits} veces la armadura (Tiradas: ${successfulRolls.join(', ')}). ${defender.name} recibe ${totalDamageAccumulated} daño PA.`
             });
        } else {
             logMessage("Destrozar no hizo daño.");
             
             // Actualizar el evento de la arena con el resultado
             setArenaEvent({
               id: Date.now(),
               type: 'action_effect',
               actionName: 'Destrozar',
               attackerName: attacker.name,
               defenderName: defender.name,
               outcome: 'failed',
               message: `${attacker.name} falla al Destrozar (Tirada: ${lastRoll}). La armadura de ${defender.name} resiste.`
             });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
             setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
             logMessage(`Turno de ${nextPlayerName}`);
        }
        return;
      } else if (actionName === 'atrapar') {
        logMessage(`${attacker.name} intenta Atrapar a ${defender.name}!`);
        
        // Realizar la tirada y aplicar el bono
        const roll = rollD20();
        const finalRoll = roll + attacker.stats.atrapar_bonus;
        
        // Mostrar el resultado de la tirada
        if (attacker.stats.atrapar_bonus !== 0) {
          logMessage(`${attacker.name} sacó ${roll} + ${attacker.stats.atrapar_bonus} = ${finalRoll} (Necesita 11-20)`);
        } else {
          logMessage(`${attacker.name} sacó ${roll} (Necesita 11-20)`);
        }
        
        // Comprobar el resultado
        if (finalRoll < 11) {
          // Fallo
          logMessage("¡El atrape falló!");
          setArenaEvent({
            id: Date.now(),
            type: 'action_effect',
            actionName: 'Atrapar',
            attackerName: attacker.name,
            defenderName: defender.name,
            outcome: 'failure',
            message: `${attacker.name} falla al intentar atrapar a ${defender.name} (Tirada: ${finalRoll})`
          });
          
          // Pasar turno
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
          logMessage(`Turno de ${nextPlayerName}`);
        } else {
          // Éxito
          logMessage("¡Rival atrapado!");
          setArenaEvent({
            id: Date.now(),
            type: 'action_effect',
            actionName: 'Atrapar',
            attackerName: attacker.name,
            defenderName: defender.name,
            outcome: 'success',
            message: `${attacker.name} atrapa a ${defender.name} (Tirada: ${finalRoll}). ¡Elige una opción de ataque!`
          });
          
          // Actualizar el estado para esperar la elección de seguimiento
          setActionState({
            active: true,
            type: 'Atrapar',
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_followup'
          });
        }
        return;
      } else if (actionName === 'lanzar_obj') {
        // Verificar concentración si fuera necesario en el futuro
        // if (requiredConcentration > 0 && attackerData.concentrationLevel < requiredConcentration) { ... return; }

        logMessage(`${attacker.name} inicia Acción: Lanzar Objeto!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Lanzar Objeto',
          attackerName: attacker.name,
          defenderName: defender.name
        });
        
        // Resetear concentración si la acción la gastara
        // if (requiredConcentration > 0) { setAttackerData... concentrationLevel: 0 ... }

        setActionState({
            active: true,
            type: 'Lanzar Objeto', // Tipo de acción para handleDefenseSelection
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense'
        });
        // No se pasa turno aquí, esperamos la defensa
        return; // Terminar handleActionInitiate
      } else if (actionName === 'embestir') {
        // Verificar/gastar concentración si fuera necesario en el futuro
        logMessage(`${attacker.name} inicia Acción: Embestir!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Embestir',
          attackerName: attacker.name,
          defenderName: defender.name
        });
        
        setActionState({
            active: true,
            type: 'Embestir', // Tipo de acción para handleDefenseSelection
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense'
        });
        return; // Terminar handleActionInitiate
      } else if (actionName === 'cargar') {
        // Verificar/gastar concentración si fuera necesario en el futuro
        logMessage(`${attacker.name} inicia Acción: Cargar!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Cargar',
          attackerName: attacker.name,
          defenderName: defender.name
        });
        
        setActionState({
            active: true,
            type: 'Cargar', // Tipo de acción para handleDefenseSelection
            attackerId: attacker.id,
            defenderId: defender.id,
            stage: 'awaiting_defense'
        });
        return; // Terminar handleActionInitiate
      } else if (actionName === 'poder_ejemplo_1') { // Placeholder para poder
        logMessage(`${attacker.name} intenta usar Poder Ejemplo 1 (lógica no implementada)`);
        // Aquí iría la lógica del poder: restar PC, calcular efecto, etc.
        // Por ahora, solo cambiamos el turno para probar
        // --- Cambio de turno ---
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
      } else {
        logMessage(`Acción ${actionName} no implementada todavía.`);
        // --- Cambio de turno ---
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        logMessage(`Turno de ${nextPlayerId === player1Data.id ? player1Data.name : player2Data.name}`);
      }
    }
  };

  // Función para crear un retraso
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Función para manejar la selección de defensa
  const handleDefenseSelection = (defenseType) => {
    if (!actionState.active || actionState.stage !== 'awaiting_defense') return;

    const attackerId = actionState.attackerId;
    const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data;
    const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data;

    logMessage(`${defender.name} elige defenderse con: ${defenseType}`);
    const roll = rollD20();

    let defenseSuccessful = false;
    let damageToDefender = 0;
    let damageToDefenderPA = 0;
    let damageToAttacker = 0;
    let gameOver = false;
    
    // Variable para guardar los datos de la tirada
    let finalDiceRollData = null;

    console.log(`[DEBUG] Iniciando resolución para ${actionState.type} con defensa ${defenseType}. Roll: ${roll}`);

    // Variable para almacenar el evento de tirada de dados
    let diceRollEvent = null;

    if (actionState.type === 'Golpe') {
      const golpeDamage = attacker.actions.golpe;

      if (defenseType === 'esquivar') {
        const [minRoll, maxRoll] = defender.defenseRanges.esquivar;
        logMessage(`${defender.name} tira 1d20 para Esquivar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
          console.log("[DEBUG] Esquiva de Golpe: ÉXITO");
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = golpeDamage;
          console.log(`[DEBUG] Esquiva de Golpe: FALLO. damageToDefender = ${damageToDefender}`);
        }
      } else if (defenseType === 'bloquear') {
        const [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        logMessage(`${defender.name} tira 1d20 para Bloquear (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = 10;
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = golpeDamage;
        }
      } else if (defenseType === 'contraatacar') {
        const [minRoll, maxRoll] = defender.defenseRanges.contraatacar;
        logMessage(`${defender.name} tira 1d20 para Contraatacar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          const counterDamage = Math.floor(defender.actions.golpe / 2);
          damageToAttacker = counterDamage;
          logMessage(`¡Contraataque exitoso! ${attacker.name} recibe ${damageToAttacker} de daño.`);
        } else {
          logMessage("¡Contraataque fallido!");
          damageToDefender = golpeDamage;
        }
      }
    } else if (actionState.type === 'Lanzar Objeto') {
      const baseDamage = attacker.actions.lanzar_obj; // Daño base del atacante

      if (defenseType === 'esquivar') {
        let [minRoll, maxRoll] = defender.defenseRanges.esquivar;
        // Aplicar bono +2 a Esquivar (restando 2 al mínimo necesario)
        minRoll = Math.max(1, minRoll - 2); // No bajar de 1
        logMessage(`${defender.name} tira 1d20 para Esquivar contra Lanzar Objeto (+2 Bono => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'bloquear') {
        let [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        // Aplicar penalizador -2 a Bloquear (sumando 2 al mínimo necesario)
        minRoll = Math.min(21, minRoll + 2); // No superar 21 (imposible de sacar)
        logMessage(`${defender.name} tira 1d20 para Bloquear contra Lanzar Objeto (-2 Penalizador => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = 20; // Daño específico de bloqueo para Lanzar Objeto
          logMessage(`¡Bloqueo exitoso! Recibe ${damageToDefenderPA} daño sólo a Armadura.`);
          // La lógica de aplicación de daño a PA (incluyendo rotura) está más abajo
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'contraatacar') {
        // Sin modificador para Contraatacar según las reglas
        const [minRoll, maxRoll] = defender.defenseRanges.contraatacar;
        logMessage(`${defender.name} tira 1d20 para Contraatacar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          // Daño = 1/2 del daño de Lanzar Objeto del DEFENSOR
          const counterDamage = Math.floor(defender.actions.lanzar_obj / 2);
          damageToAttacker = counterDamage;
          logMessage(`¡Contraataque exitoso! ${attacker.name} recibe ${damageToAttacker} de daño.`);
        } else {
          logMessage("¡Contraataque fallido!");
          damageToDefender = baseDamage;
        }
      }
    } else if (actionState.type === 'Embestir') {
      const baseDamage = attacker.actions.embestir; // Daño base de Embestir del atacante

      if (defenseType === 'esquivar') {
        // Sin modificador para Esquivar
        const [minRoll, maxRoll] = defender.defenseRanges.esquivar;
        logMessage(`${defender.name} tira 1d20 para Esquivar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'bloquear') {
        // Aplicar bono +2 a Bloquear
        let [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        minRoll = Math.max(1, minRoll - 2); // Más fácil bloquear
        logMessage(`${defender.name} tira 1d20 para Bloquear contra Embestir (+2 Bono => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = 20; // Daño específico de bloqueo para Embestir
          logMessage(`¡Bloqueo exitoso! Recibe ${damageToDefenderPA} daño sólo a Armadura.`);
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'contraatacar') {
        // Sin modificador para Contraatacar
        const [minRoll, maxRoll] = defender.defenseRanges.contraatacar;
        logMessage(`${defender.name} tira 1d20 para Contraatacar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          // Daño = 1/2 del daño de Embestir del DEFENSOR
          const counterDamage = Math.floor(defender.actions.embestir / 2);
          damageToAttacker = counterDamage;
          logMessage(`¡Contraataque exitoso! ${attacker.name} recibe ${damageToAttacker} de daño.`);
        } else {
          logMessage("¡Contraataque fallido!");
          damageToDefender = baseDamage;
        }
      }
    } else if (actionState.type === 'Cargar') {
      const baseDamage = attacker.actions.cargar; // Daño base de Cargar del atacante (80)

      if (defenseType === 'esquivar') {
        // Aplicar bono +2 a Esquivar
        let [minRoll, maxRoll] = defender.defenseRanges.esquivar;
        minRoll = Math.max(1, minRoll - 2); // Más fácil esquivar
        logMessage(`${defender.name} tira 1d20 para Esquivar contra Cargar (+2 Bono => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'bloquear') {
        // Aplicar bono +2 a Bloquear
        let [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        minRoll = Math.max(1, minRoll - 2); // Más fácil bloquear
        logMessage(`${defender.name} tira 1d20 para Bloquear contra Cargar (+2 Bono => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = 20; // Daño específico de bloqueo para Cargar
          logMessage(`¡Bloqueo exitoso! Recibe ${damageToDefenderPA} daño sólo a Armadura.`);
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = baseDamage;
        }
      } else if (defenseType === 'contraatacar') {
        // Aplicar bono +2 a Contraatacar
        let [minRoll, maxRoll] = defender.defenseRanges.contraatacar;
        minRoll = Math.max(1, minRoll - 2); // Más fácil contraatacar
        logMessage(`${defender.name} tira 1d20 para Contraatacar contra Cargar (+2 Bono => Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          // Daño = 1/2 del daño de Cargar del DEFENSOR
          const counterDamage = Math.floor(defender.actions.cargar / 2);
          damageToAttacker = counterDamage;
          logMessage(`¡Contraataque exitoso! ${attacker.name} recibe ${damageToAttacker} de daño.`);
        } else {
          logMessage("¡Contraataque fallido!");
          damageToDefender = baseDamage;
        }
      }
    } else if (actionState.type === 'Atrapar_Opcion2') {
      // Obtener los valores de daño desde el estado de la acción
      const baseDamage = actionState.baseDamage; // 80 daño si falla el bloqueo
      const blockDamagePA = actionState.blockDamagePA; // 20 daño a PA si el bloqueo tiene éxito

      if (defenseType === 'bloquear') {
        // Obtener el rango para bloquear
        const [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        logMessage(`${defender.name} tira 1d20 para Bloquear contra Ataque Potente (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = blockDamagePA; // 20 daño solo a PA si el bloqueo tiene éxito
          logMessage(`¡Bloqueo exitoso! Recibe ${damageToDefenderPA} daño solo a PA.`);
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = baseDamage; // 80 daño normal si el bloqueo falla
        }
      } else if (defenseType === 'esquivar' || defenseType === 'contraatacar') {
        // Defensa inválida para Ataque Potente
        logMessage(`¡Defensa inválida! El Ataque Potente solo puede ser bloqueado.`);
        defenseSuccessful = false;
        damageToDefender = baseDamage; // 80 daño normal si se usa una defensa inválida
        
        // Guardar datos de la tirada inválida
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          defenseType: defenseType === 'esquivar' ? 'Esquivar' : 'Contraatacar',
          outcome: 'invalid',
          message: `¡Defensa inválida! El Ataque Potente solo puede ser bloqueado.`
        };
      }
    } else if (actionState.type === 'Atrapar_Opcion4') {
      // Obtener los valores desde el estado de la acción
      const baseDamage = actionState.baseDamage; // 60 daño si falla la defensa
      const blockDamagePA = actionState.blockDamagePA; // 10 daño a PA si el bloqueo tiene éxito
      const defensePenalty = actionState.defensePenalty; // -2 penalizador para el defensor

      if (defenseType === 'esquivar') {
        // Obtener el rango base para esquivar
        const [minRollBase, maxRoll] = defender.defenseRanges.esquivar;
        // Aplicar el penalizador (hacer más difícil esquivar)
        const minRoll = Math.min(21, minRollBase + 2); // Sumamos 2 para hacerlo más difícil
        
        logMessage(`${defender.name} tira 1d20 para Esquivar contra Ataque Vulnerante (Necesita ${minRoll}-${maxRoll} con penalizador -2): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = baseDamage; // 60 daño normal si la esquiva falla
        }
      } else if (defenseType === 'bloquear') {
        // Obtener el rango base para bloquear
        const [minRollBase, maxRoll] = defender.defenseRanges.bloquear;
        // Aplicar el penalizador (hacer más difícil bloquear)
        const minRoll = Math.min(21, minRollBase + 2); // Sumamos 2 para hacerlo más difícil
        
        logMessage(`${defender.name} tira 1d20 para Bloquear contra Ataque Vulnerante (Necesita ${minRoll}-${maxRoll} con penalizador -2): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = blockDamagePA; // 10 daño solo a PA si el bloqueo tiene éxito
          logMessage(`¡Bloqueo exitoso! Recibe ${damageToDefenderPA} daño solo a PA.`);
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = baseDamage; // 60 daño normal si el bloqueo falla
        }
      } else if (defenseType === 'contraatacar') {
        // Obtener el rango base para contraatacar
        const [minRollBase, maxRoll] = defender.defenseRanges.contraatacar;
        // Aplicar el penalizador (hacer más difícil contraatacar)
        const minRoll = Math.min(21, minRollBase + 2); // Sumamos 2 para hacerlo más difícil
        
        logMessage(`${defender.name} tira 1d20 para Contraatacar contra Ataque Vulnerante (Necesita ${minRoll}-${maxRoll} con penalizador -2): ¡Sacó ${roll}!`);
        
        // Guardar datos de la tirada en lugar de mostrar inmediatamente
        finalDiceRollData = {
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        };
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          // Daño = 1/2 del daño de Golpe del DEFENSOR
          const counterDamage = Math.floor(defender.actions.golpe / 2);
          damageToAttacker = counterDamage;
          logMessage(`¡Contraataque exitoso! ${attacker.name} recibe ${damageToAttacker} de daño.`);
        } else {
          logMessage("¡Contraataque fallido!");
          damageToDefender = baseDamage; // 60 daño normal si el contraataque falla
        }
      }
    } else {
      logMessage(`Resolución para acción tipo ${actionState.type} no implementada.`);
      defenseSuccessful = true;
    }

    // Mostrar la tirada inicial
    if (finalDiceRollData) {
      setArenaEvent(finalDiceRollData);
    }

    console.log(`[DEBUG] Antes de aplicar daño. damageToAttacker: ${damageToAttacker}, damageToDefender: ${damageToDefender}, damageToDefenderPA: ${damageToDefenderPA}`);

    // Aplicar daño al Atacante (si hubo contraataque)
    if (damageToAttacker > 0) {
      console.log("[DEBUG] Aplicando daño al ATACANTE...");
      gameOver = applyDamage(attackerId, damageToAttacker);
      
      // Retrasar la actualización del evento de la arena para permitir que la animación de tirada se complete
      setTimeout(() => {
        let finalEvent = {
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Contraataque',
          damage: damageToAttacker,
          targetName: attacker.name,
          message: `${defender.name} contraataca exitosamente. ${attacker.name} recibe ${damageToAttacker} de daño.`
        };

        // Añadir datos de la tirada si existen
        if (finalDiceRollData) {
          finalEvent = {
            ...finalEvent,
            rollValue: finalDiceRollData.rollValue,
            targetMin: finalDiceRollData.targetMin,
            targetMax: finalDiceRollData.targetMax,
            rollOutcome: finalDiceRollData.outcome,
            defenseType: finalDiceRollData.defenseType,
            rollerName: finalDiceRollData.rollerName
          };
        }
        
        setArenaEvent(finalEvent);
      }, 2000);
      
      console.log(`[DEBUG] Después de aplicar daño al ATACANTE. gameOver = ${gameOver}`);
    }

    // Aplicar daño al Defensor (si la defensa falló o fue bloqueo exitoso)
    if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) {
      console.log("[DEBUG] Aplicando daño al DEFENSOR...");
      if (damageToDefender > 0) {
        console.log("[DEBUG] Defensa fallida - Llamando applyDamage...");
        gameOver = applyDamage(defenderId, damageToDefender);
        
        // Retrasar la actualización del evento de la arena para permitir que la animación de tirada se complete
        setTimeout(() => {
          let finalEvent = {
            id: Date.now(),
            type: 'action_effect',
            actionName: actionState.type,
            damage: damageToDefender,
            targetName: defender.name,
            message: `${attacker.name} impacta a ${defender.name} (${damageToDefender} daño).`
          };

          // Añadir datos de la tirada si existen
          if (finalDiceRollData) {
            finalEvent = {
              ...finalEvent,
              rollValue: finalDiceRollData.rollValue,
              targetMin: finalDiceRollData.targetMin,
              targetMax: finalDiceRollData.targetMax,
              rollOutcome: finalDiceRollData.outcome,
              defenseType: finalDiceRollData.defenseType,
              rollerName: finalDiceRollData.rollerName
            };
          }
          
          setArenaEvent(finalEvent);
        }, 2000);
        
      } else {
        console.log("[DEBUG] Bloqueo exitoso - Aplicando daño a PA...");
        logMessage(`¡Bloqueo exitoso! ${defender.name} recibe ${damageToDefenderPA} daño a PA.`);
        let currentDefenderPA = defender.stats.currentPA;
        let finalPA = currentDefenderPA - damageToDefenderPA;
        let finalPV = defender.stats.currentPV;
        if (finalPA < 0) {
          if (currentDefenderPA > 0) logMessage("¡Armadura rota por el bloqueo!");
          let overflowDamage = -finalPA;
          finalPA = 0;
          finalPV = defender.stats.currentPV - overflowDamage;
          if (finalPV <= 0) {
            finalPV = 0;
            gameOver = true;
            logMessage(`¡¡¡ ${defender.name} ha sido derrotado por daño de bloqueo !!!`);
          }
        }
        setDefenderData(prevData => ({
          ...prevData,
          stats: { ...prevData.stats, currentPV: finalPV, currentPA: finalPA }
        }));
        logMessage(`${defender.name} - PV: ${finalPV}/${defender.stats.pv_max}, PA: ${finalPA}/${defender.stats.pa_max}`);
        
        // Retrasar la actualización del evento de la arena para permitir que la animación de tirada se complete
        setTimeout(() => {
          let finalEvent = {
            id: Date.now(),
            type: 'action_effect',
            actionName: 'Bloqueo',
            damage: damageToDefenderPA,
            targetName: defender.name,
            message: `${defender.name} bloquea exitosamente pero recibe ${damageToDefenderPA} daño a PA.`
          };

          // Añadir datos de la tirada si existen
          if (finalDiceRollData) {
            finalEvent = {
              ...finalEvent,
              rollValue: finalDiceRollData.rollValue,
              targetMin: finalDiceRollData.targetMin,
              targetMax: finalDiceRollData.targetMax,
              rollOutcome: finalDiceRollData.outcome,
              defenseType: finalDiceRollData.defenseType,
              rollerName: finalDiceRollData.rollerName
            };
          }
          
          setArenaEvent(finalEvent);
        }, 2000);
        
        if (gameOver) {
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: 'game_over' });
        }
      }
      console.log(`[DEBUG] Después de aplicar daño al DEFENSOR. gameOver = ${gameOver}`);
    } else {
      console.log("[DEBUG] No se aplica daño al defensor (Esquiva/Contraataque exitoso O juego ya terminado).");
    }

    // --- Finalizar Acción y Cambiar Turno (si no acabó el juego) ---
    console.log(`[DEBUG] Antes de finalizar acción/cambiar turno. gameOver = ${gameOver}`);

    if (!gameOver) {
      console.log("[DEBUG] Juego NO terminado. Reseteando estado y cambiando turno...");

      // Para otras acciones, mantener el comportamiento actual con setTimeout
      setTimeout(() => {
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
        logMessage(`Turno de ${nextPlayerName}`);
      }, 2500);
    }
  };

  // Función para manejar la selección de opción de seguimiento de Atrapar
  const handleAtraparFollowupSelect = (optionId) => {
    const attacker = actionState.attackerId === player1Data.id ? player1Data : player2Data;
    const defender = actionState.defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = actionState.defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data; // Necesario para applyDamage
    let gameOver = false;

    logMessage(`${attacker.name} elige la opción de Atrapar: ${optionId}`);

    switch (optionId) {
      case 'atrapar_op1': { // Llaves {} para crear un nuevo scope para const/let
        logMessage(`${attacker.name} usa Golpes Múltiples!`);
        const rolls = [rollD20(), rollD20(), rollD20()];
        const oddCount = rolls.filter(r => r % 2 !== 0).length;
        const damage = oddCount * 20; // 20 Ptos Daño por cada Impar

        logMessage(`Tiradas: ${rolls.join(', ')}. Aciertos (impares): ${oddCount}. Daño total: ${damage}`);

        if (damage > 0) {
          // Aplicamos daño normal (asumimos 50/50 PV/PA)
          gameOver = applyDamage(defender.id, damage, 'normal');
          setArenaEvent({
            id: Date.now(), 
            type: 'action_effect', 
            actionName: 'Atrapar: Golpes Múltiples',
            attackerName: attacker.name, 
            defenderName: defender.name,
            damage: damage, 
            hits: oddCount, 
            successfulRolls: rolls.filter(r => r % 2 !== 0), // Pasamos los rolls impares
            message: `${attacker.name} conecta ${oddCount} golpes (${rolls.filter(r => r % 2 !== 0).join(', ')}) causando ${damage} de daño.`
          });
        } else {
          logMessage("Ningún golpe acertó.");
          setArenaEvent({
            id: Date.now(), 
            type: 'action_effect', 
            actionName: 'Atrapar: Golpes Múltiples',
            attackerName: attacker.name, 
            defenderName: defender.name,
            outcome: 'failure', 
            message: `${attacker.name} falla todos los golpes (Tiradas: ${rolls.join(', ')}).`
          });
        }

        // Lógica para pasar turno (INMEDIATA para esta opción)
        if (!gameOver) {
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
          logMessage(`Turno de ${nextPlayerName}`);
        }
        break; // Fin de case 'atrapar_op1'
      }

      case 'atrapar_op2': {
        logMessage(`${attacker.name} usa Ataque Potente (Opción 2)!`);
        
        // Actualizar el estado para pasar a la fase de defensa
        setActionState({
          active: true,
          type: 'Atrapar_Opcion2', // Tipo único
          attackerId: attacker.id,
          defenderId: defender.id,
          stage: 'awaiting_defense',
          baseDamage: 80, // Daño si falla el bloqueo
          blockDamagePA: 20, // Daño especial si el bloqueo tiene éxito
          allowedDefenses: ['bloquear'] // Solo se permite bloquear
        });
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(), 
          type: 'action_effect', 
          actionName: 'Atrapar: Ataque Potente',
          attackerName: attacker.name, 
          defenderName: defender.name,
          message: `${attacker.name} lanza un Ataque Potente (80 Daño). ${defender.name}, ¡solo puedes intentar Bloquear!`
        });
        
        break;
      }

      case 'atrapar_op4': {
        logMessage(`${attacker.name} usa Ataque Vulnerante (Opción 4)!`);
        
        // Actualizar el estado para pasar a la fase de defensa
        setActionState({
          active: true,
          type: 'Atrapar_Opcion4', // Tipo único
          attackerId: attacker.id,
          defenderId: defender.id,
          stage: 'awaiting_defense',
          baseDamage: 60,      // Daño si falla defensa/no bloqueo
          blockDamagePA: 10,   // Daño especial si bloqueo tiene éxito
          defensePenalty: -2   // Penalizador para el defensor
        });
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(), 
          type: 'action_effect', 
          actionName: 'Atrapar: Ataque Vulnerante',
          attackerName: attacker.name, 
          defenderName: defender.name,
          message: `${attacker.name} lanza un Ataque Vulnerante (60 Daño). ¡${defender.name} defiende con -2 a sus tiradas!`
        });
        
        break;
      }

      case 'atrapar_op3': {
        logMessage(`${attacker.name} inicia Ataques Rápidos (Opción 3)!`);
        
        // Inicializar acumuladores para el resumen final
        let successfulDamageHits = 0;
        let successfulBlocks = 0;
        let totalNormalDamage = 0;
        let totalPADamage = 0;
        let gameOver = false;
        
        // Procesar los 3 golpes en un solo bucle
        for (let i = 0; i < 3; i++) {
          const hitNumber = i + 1;
          logMessage(`--- Golpe Rápido #${hitNumber} ---`);
          
          // Simular la tirada de bloqueo del defensor
          const [minRoll, maxRoll] = defender.defenseRanges.bloquear;
          const roll = rollD20();
          const blocked = (roll >= minRoll && roll <= maxRoll);
          
          logMessage(`${defender.name} intenta Bloquear (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
          
          if (blocked) {
            // Bloqueo exitoso
            successfulBlocks++;
            const damagePA = 10;
            totalPADamage += damagePA;
            logMessage(`¡Bloqueado! Recibe ${damagePA} daño PA.`);
            gameOver = applyDamage(defender.id, damagePA, 'directPA');
          } else {
            // Bloqueo fallido
            successfulDamageHits++;
            const damageNormal = 20;
            totalNormalDamage += damageNormal;
            logMessage(`¡Impacto! Recibe ${damageNormal} daño.`);
            gameOver = applyDamage(defender.id, damageNormal, 'normal');
          }
          
          // Si el juego terminó, salir del bucle
          if (gameOver) {
            break;
          }
        }
        
        // Construir mensaje resumen final
        let finalMessage = `${attacker.name} usó Ataques Rápidos. `;
        let details = [];
        
        if (successfulDamageHits > 0) {
          details.push(`${successfulDamageHits} impactos (${totalNormalDamage} Daño Normal)`);
        }
        
        if (successfulBlocks > 0) {
          details.push(`${successfulBlocks} bloqueados (${totalPADamage} Daño PA)`);
        }
        
        if (details.length === 0) {
          finalMessage += "¡Todos los golpes fallaron o fueron bloqueados sin efecto!";
        } else {
          finalMessage += details.join(', ') + '.';
        }
        
        // Mostrar resumen final en ArenaDisplay
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Atrapar: Ataques Rápidos',
          message: finalMessage,
          hitsLanded: successfulDamageHits,
          hitsBlocked: successfulBlocks,
          totalNormalDmg: totalNormalDamage,
          totalPADmg: totalPADamage
        });
        
        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
          logMessage(`Turno de ${nextPlayerName}`);
        }
        
        break;
      }

      default: {
        // Caso por defecto si algo va mal, o para lógica placeholder
        logMessage(`Lógica para opción ${optionId} pendiente.`);
        // Placeholder MUY BÁSICO (reemplazar con lógica real después):
        setArenaEvent({
            id: Date.now(), 
            type: 'action_effect', 
            actionName: 'Atrapar',
            message: `Se ejecutó ${optionId} (Lógica Pendiente)`
        });
        // Resetear y pasar turno (Temporal)
        setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
        const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
        setCurrentPlayerId(nextPlayerId);
        const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
        logMessage(`Turno de ${nextPlayerName}`);
        break;
      }
    }
  };

  return (
    <div className="app-container">
      {actionState.stage === 'game_over' ? (
        <div className="game-over-screen">
          <h2>¡Fin del Combate!</h2>
          <button onClick={handlePlayAgain} className="play-again-button">
            Jugar de Nuevo
          </button>
          <GameLog log={gameLog} />
        </div>
      ) : (
        <div className="game-container">
          <PlayerArea 
            characterData={player1Data} 
            isCurrentPlayer={currentPlayerId === player1Data.id}
            handleActionInitiate={handleActionInitiate}
            actionState={actionState}
            handleDefenseSelection={handleDefenseSelection}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            atraparOptions={atraparFollowupOptions}
          />
          <div className="center-column">
            <ArenaDisplay event={arenaEvent} />
            <GameLog log={gameLog} />
          </div>
          <PlayerArea 
            characterData={player2Data} 
            isCurrentPlayer={currentPlayerId === player2Data.id}
            handleActionInitiate={handleActionInitiate}
            actionState={actionState}
            handleDefenseSelection={handleDefenseSelection}
            handleAtraparFollowupSelect={handleAtraparFollowupSelect}
            atraparOptions={atraparFollowupOptions}
          />
        </div>
      )}
    </div>
  )
}

export default App
