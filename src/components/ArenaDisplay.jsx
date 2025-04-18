import React, { useState, useEffect } from 'react';
import './ArenaDisplay.css';

// Constantes para la animación
const ANIMATION_DURATION = 1500; // Duración total de la animación en ms
const CYCLE_INTERVAL = 100; // Intervalo entre cambios de número en ms

const ArenaDisplay = ({ event }) => {
  // Estado para el número que se muestra durante la animación
  const [displayedRoll, setDisplayedRoll] = useState('...');
  // Estado para controlar cuándo mostrar el resultado
  const [showOutcome, setShowOutcome] = useState(false);

  useEffect(() => {
    // Si no hay evento o no es una tirada de dados, no hacemos nada
    if (!event || event.type !== 'dice_roll') {
      setDisplayedRoll('...');
      setShowOutcome(false);
      return;
    }

    // Reiniciamos el estado de showOutcome para cada nueva tirada
    setShowOutcome(false);
    
    // Iniciamos la animación de números ciclantes
    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      
      // Si aún no ha terminado la animación, mostramos un número aleatorio
      if (elapsedTime < ANIMATION_DURATION) {
        // Generamos un número aleatorio entre 1 y 20
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        setDisplayedRoll(randomNumber);
      } else {
        // Si terminó la animación, mostramos el valor final y activamos el resultado
        clearInterval(intervalId);
        setDisplayedRoll(event.rollValue);
        setShowOutcome(true);
      }
    }, CYCLE_INTERVAL);

    // Limpieza del intervalo cuando el componente se desmonte o cambie el evento
    return () => clearInterval(intervalId);
  }, [event]);

  // Si no hay evento, mostramos un mensaje por defecto
  if (!event) {
    return (
      <div className="arena-display">
        <div className="arena-message">Coliseo de Batalla</div>
      </div>
    );
  }

  // Renderizamos el evento según su tipo
  return (
    <div className="arena-display">
      {event.type === 'dice_roll' && (
        <div className="arena-event">
          <div className="event-header">
            {event.rollerName} tira 1d20 para {event.defenseType || event.actionName}
          </div>
          <div className="dice-roll">
            <div className="roll-value">{displayedRoll}</div>
            <div className="roll-target">
              {event.targetMin && event.targetMax && 
                `(Necesita ${event.targetMin}-${event.targetMax})`}
            </div>
          </div>
          {/* El outcome solo se muestra si showOutcome es true */}
          {showOutcome && (
            <div className={`event-outcome ${event.outcome}`}>
              {event.outcome === 'success' && '¡Éxito!'}
              {event.outcome === 'failure' && '¡Fallo!'}
              {event.outcome === 'blocked' && '¡Bloqueado!'}
              {event.outcome === 'countered' && '¡Contraatacado!'}
            </div>
          )}
        </div>
      )}
      
      {event.type === 'action_effect' && (
        <div className="arena-event">
          <div className="event-header">
            {event.actionName}
          </div>
          <div className="effect-details">
            {event.damage && (
              <div className="damage-info">
                {event.targetName} recibe {event.damage} de daño
              </div>
            )}
            {event.winnerName && (
              <div className="target-info">
                {event.winnerName} gana la {event.actionName.toLowerCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArenaDisplay; 