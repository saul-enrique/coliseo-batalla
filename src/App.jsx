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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Llave',
          attackerName: attacker.name,
          defenderName: defender.name
        });

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
          // Asumimos modificador de Llave base +0 para ambos por ahora
          const attackerBaseRoll = rollD20();
          const defenderBaseRoll = rollD20();
          attackerRoll = attackerBaseRoll + 2; // Bono +2 iniciador
          defenderRoll = defenderBaseRoll;

          logMessage(`Tirada Llave: ${attacker.name} (${attackerBaseRoll}+2 = ${attackerRoll}) vs ${defender.name} (${defenderRoll})`);
          
          // Actualizar el evento de la arena con la tirada
          setArenaEvent({
            id: Date.now(),
            type: 'dice_roll',
            rollerName: attacker.name,
            rollValue: attackerRoll,
            targetName: defender.name,
            actionName: 'Llave',
            stage: ties + 1
          });

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
              winnerId = null; // Nadie gana
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
            damage: currentDamage
          });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
          // Resetear concentración si aplica (aunque Llave no usa)
          // ...

          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null }); // Resetear por si acaso
          const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
          setCurrentPlayerId(nextPlayerId);
          const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
          logMessage(`Turno de ${nextPlayerName}`);
        }
        return; // Terminar handleActionInitiate aquí para 'llave'
      } else if (actionName === 'presa') {
        logMessage(`${attacker.name} intenta una Presa contra ${defender.name}!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Presa',
          attackerName: attacker.name,
          defenderName: defender.name
        });

        let totalDamageAccumulated = 0;
        let successfulHits = 0;
        let gameOver = false;

        for (let i = 0; i < 3; i++) { // Máximo 3 intentos/éxitos
            const roll = rollD20();
            const isOdd = roll % 2 !== 0;
            
            // Actualizar el evento de la arena con la tirada
            setArenaEvent({
              id: Date.now(),
              type: 'dice_roll',
              rollerName: attacker.name,
              rollValue: roll,
              isOdd: isOdd,
              actionName: 'Presa',
              stage: i + 1
            });

            if (isOdd) {
                successfulHits++;
                const damagePerHit = 15; // Daño Presa según reglas
                totalDamageAccumulated += damagePerHit;
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
               hits: successfulHits
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
               outcome: 'failed'
             });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
             // Resetear concentración si aplica (Presa no usa)
             // ...

             setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
             logMessage(`Turno de ${nextPlayerName}`);
        }
        return; // Terminar handleActionInitiate aquí para 'presa'
      } else if (actionName === 'destrozar') {
        logMessage(`${attacker.name} intenta Destrozar la armadura de ${defender.name}!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Destrozar',
          attackerName: attacker.name,
          defenderName: defender.name
        });

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
              outcome: 'no_armor'
            });
            
            // No se pasa el turno, permitir elegir otra acción
            return;
        }

        let totalDamageAccumulated = 0;
        let successfulHits = 0;
        let gameOver = false;

        for (let i = 0; i < 3; i++) { // Máximo 3 intentos/éxitos
            const roll = rollD20();
            const isOdd = roll % 2 !== 0;
            
            // Actualizar el evento de la arena con la tirada
            setArenaEvent({
              id: Date.now(),
              type: 'dice_roll',
              rollerName: attacker.name,
              rollValue: roll,
              isOdd: isOdd,
              actionName: 'Destrozar',
              stage: i + 1
            });

            if (isOdd) {
                successfulHits++;
                const damagePerHit = 15; // Daño Destrozar según reglas
                totalDamageAccumulated += damagePerHit;
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
             // Usamos 'directPA'. La función applyDamage maneja la rotura y overflow a PV.
             gameOver = applyDamage(defender.id, totalDamageAccumulated, 'directPA');
             
             // Actualizar el evento de la arena con el resultado
             setArenaEvent({
               id: Date.now(),
               type: 'action_effect',
               actionName: 'Destrozar',
               attackerName: attacker.name,
               defenderName: defender.name,
               damage: totalDamageAccumulated,
               hits: successfulHits
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
               outcome: 'failed'
             });
        }

        // Pasar turno si el juego no ha terminado
        if (!gameOver) {
             // Resetear concentración si aplica (Destrozar no usa)
             // ...

             setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
             const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
             setCurrentPlayerId(nextPlayerId);
             const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
             logMessage(`Turno de ${nextPlayerName}`);
        }
        return; // Terminar handleActionInitiate aquí para 'destrozar'
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

  // Función para manejar la selección de defensa
  const handleDefenseSelection = (defenseType) => {
    if (!actionState.active || actionState.stage !== 'awaiting_defense') return;

    const attackerId = actionState.attackerId;
    const defenderId = actionState.defenderId;
    const attacker = attackerId === player1Data.id ? player1Data : player2Data;
    const defender = defenderId === player1Data.id ? player1Data : player2Data;
    const setDefenderData = defenderId === player1Data.id ? setPlayer1Data : setPlayer2Data;
    const setAttackerData = attackerId === player1Data.id ? setPlayer1Data : setPlayer2Data; // Necesario para Contraatacar

    logMessage(`${defender.name} elige defenderse con: ${defenseType}`);
    const roll = rollD20(); // Hacemos la tirada aquí para todas las defensas

    let defenseSuccessful = false;
    let damageToDefender = 0;
    let damageToDefenderPA = 0; // Para daño específico a PA (bloqueos)
    let damageToAttacker = 0;   // Para daño de contraataque
    let gameOver = false; // Asegurarse de que se inicializa aquí

    console.log(`[DEBUG] Iniciando resolución para ${actionState.type} con defensa ${defenseType}. Roll: ${roll}`); // LOG 1

    if (actionState.type === 'Golpe') {
      const golpeDamage = attacker.actions.golpe; // Daño base de Golpe del atacante

      if (defenseType === 'esquivar') {
        const [minRoll, maxRoll] = defender.defenseRanges.esquivar;
        logMessage(`${defender.name} tira 1d20 para Esquivar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        });
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          logMessage("¡Esquivada exitosa!");
          console.log("[DEBUG] Esquiva de Golpe: ÉXITO"); // LOG 2a
        } else {
          logMessage("¡Esquivada fallida!");
          damageToDefender = golpeDamage;
          console.log(`[DEBUG] Esquiva de Golpe: FALLO. damageToDefender = ${damageToDefender}`); // LOG 2b
        }
      } else if (defenseType === 'bloquear') {
        const [minRoll, maxRoll] = defender.defenseRanges.bloquear;
        logMessage(`${defender.name} tira 1d20 para Bloquear (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        });
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          damageToDefenderPA = 10; // Daño de bloqueo para Golpe es 10 a PA
          // Eliminamos el log aquí, lo moveremos después de calcular el daño
        } else {
          logMessage("¡Bloqueo fallido!");
          damageToDefender = golpeDamage;
        }
      } else if (defenseType === 'contraatacar') {
        const [minRoll, maxRoll] = defender.defenseRanges.contraatacar;
        logMessage(`${defender.name} tira 1d20 para Contraatacar (Necesita ${minRoll}-${maxRoll}): ¡Sacó ${roll}!`);
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        });
        
        if (roll >= minRoll && roll <= maxRoll) {
          defenseSuccessful = true;
          // Calcular daño de contraataque: 1/2 del daño de GOLPE del DEFENSOR
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Esquivar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'success' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Bloquear',
          outcome: roll >= minRoll && roll <= maxRoll ? 'blocked' : 'failure'
        });
        
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
        
        // Actualizar el evento de la arena
        setArenaEvent({
          id: Date.now(),
          type: 'dice_roll',
          rollerName: defender.name,
          rollValue: roll,
          targetMin: minRoll,
          targetMax: maxRoll,
          defenseType: 'Contraatacar',
          outcome: roll >= minRoll && roll <= maxRoll ? 'countered' : 'failure'
        });
        
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
    } else {
      logMessage(`Resolución para acción tipo ${actionState.type} no implementada.`);
      defenseSuccessful = true; // Asumir éxito para pasar turno
    }

    // (Después de determinar defenseSuccessful, damageToAttacker, damageToDefender, damageToDefenderPA)

    console.log(`[DEBUG] Antes de aplicar daño. damageToAttacker: ${damageToAttacker}, damageToDefender: ${damageToDefender}, damageToDefenderPA: ${damageToDefenderPA}`); // LOG 3

    // Aplicar daño al Atacante (si hubo contraataque)
    if (damageToAttacker > 0) {
      console.log("[DEBUG] Aplicando daño al ATACANTE..."); // LOG 4
      gameOver = applyDamage(attackerId, damageToAttacker);
      setArenaEvent({
        id: Date.now(),
        type: 'action_effect',
        actionName: 'Contraataque',
        damage: damageToAttacker,
        targetName: attacker.name
      });
      console.log(`[DEBUG] Después de aplicar daño al ATACANTE. gameOver = ${gameOver}`); // LOG 5
    }

    // Aplicar daño al Defensor (si la defensa falló o fue bloqueo exitoso)
    // ¡Solo si el juego no terminó ya por el contraataque!
    if (!gameOver && (damageToDefender > 0 || damageToDefenderPA > 0)) {
      console.log("[DEBUG] Aplicando daño al DEFENSOR..."); // LOG 6
      if (damageToDefender > 0) { // Defensa fallida (Daño normal)
        console.log("[DEBUG] Defensa fallida - Llamando applyDamage..."); // LOG 7a
        gameOver = applyDamage(defenderId, damageToDefender);
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: actionState.type,
          damage: damageToDefender,
          targetName: defender.name
        });
      } else { // Bloqueo exitoso (Daño solo a PA)
        console.log("[DEBUG] Bloqueo exitoso - Aplicando daño a PA..."); // LOG 7b
        // Necesitamos una versión de applyDamage que solo afecte PA
        // O modificamos applyDamage para recibir el tipo de daño
        // Solución simple por ahora: aplicamos daño normal de 0 y luego ajustamos PA
        logMessage(`¡Bloqueo exitoso! ${defender.name} recibe ${damageToDefenderPA} daño a PA.`);
        let currentDefenderPA = defender.stats.currentPA;
        let finalPA = currentDefenderPA - damageToDefenderPA;
        let finalPV = defender.stats.currentPV; // PV no cambia por bloqueo exitoso
        if (finalPA < 0) {
          if (currentDefenderPA > 0) logMessage("¡Armadura rota por el bloqueo!");
          // ¡Importante! Según reglas, daño excedente de bloqueo va a PV
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
        
        // Actualizar el evento de la arena para mostrar el daño del bloqueo
        setArenaEvent({
          id: Date.now(),
          type: 'action_effect',
          actionName: 'Bloqueo',
          damage: damageToDefenderPA,
          targetName: defender.name
        });
        
        if (gameOver) {
          setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: 'game_over' });
        }
      }
      console.log(`[DEBUG] Después de aplicar daño al DEFENSOR. gameOver = ${gameOver}`); // LOG 8
    } else {
      console.log("[DEBUG] No se aplica daño al defensor (Esquiva/Contraataque exitoso O juego ya terminado)."); // LOG 9
    }

    // --- Finalizar Acción y Cambiar Turno (si no acabó el juego) ---
    console.log(`[DEBUG] Antes de finalizar acción/cambiar turno. gameOver = ${gameOver}`); // LOG 10

    if (!gameOver) {
      console.log("[DEBUG] Juego NO terminado. Reseteando estado y cambiando turno..."); // LOG 11
      // (Resetear concentración si aplica...)

      setActionState({ active: false, type: null, attackerId: null, defenderId: null, stage: null });
      const nextPlayerId = currentPlayerId === player1Data.id ? player2Data.id : player1Data.id;
      setCurrentPlayerId(nextPlayerId);
      const nextPlayerName = nextPlayerId === player1Data.id ? player1Data.name : player2Data.name;
      logMessage(`Turno de ${nextPlayerName}`);
      // Quizás limpiar el arenaEvent aquí o con un timer?
      // setArenaEvent(null); // Opcional: limpiar evento inmediatamente
    } else {
      console.log("[DEBUG] Juego TERMINADO. No se cambia turno."); // LOG 12
      // Aquí podrías asegurarte de que el UI refleje el game over si no lo hace ya
      if (actionState.stage !== 'game_over') {
        setActionState(prev => ({ ...prev, stage: 'game_over' }));
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
          />
        </div>
      )}
    </div>
  )
}

export default App
