import './App.css'
import { useState } from 'react'
import PlayerArea from './components/PlayerArea'
import GameBoard from './components/GameBoard'
import GameLog from './components/GameLog'

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

const initialPlayer2Data = {
  id: 'player2_char',
  name: 'Oponente Genérico',
  stats: { pv_max: 8000, pa_max: 5000, pc_max: 1000, currentPV: 8000, currentPA: 5000, currentPC: 1000 },
  defenseRanges: { esquivar: [10, 20], bloquear: [8, 20], contraatacar: [14, 20] },
  actions: { golpe: 50, llave: 60 },
  powers: [ { id: 'P201', name: 'Poder Genérico', cost: 120, type: ['R'], damage: 160, description: '...' } ],
  bonuses: {},
  statusEffects: [],
  canConcentrate: true,
  concentrationLevel: 0,
  supportRanges: {
      percepcion: [17, 20],
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
  
  // Función para añadir mensajes al log
  const logMessage = (message) => {
    console.log(message); // También loguea en consola para debugging
    setGameLog(prevLog => [message, ...prevLog]); // Añade al principio del array
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

  return (
    <div className="game-container">
      <PlayerArea 
        characterData={player1Data} 
        isCurrentPlayer={currentPlayerId === player1Data.id}
        handleActionInitiate={handleActionInitiate}
        actionState={actionState}
      />
      <div className="center-column">
        <GameBoard />
        <GameLog log={gameLog} />
      </div>
      <PlayerArea 
        characterData={player2Data} 
        isCurrentPlayer={currentPlayerId === player2Data.id}
        handleActionInitiate={handleActionInitiate}
        actionState={actionState}
      />
    </div>
  )
}

export default App
