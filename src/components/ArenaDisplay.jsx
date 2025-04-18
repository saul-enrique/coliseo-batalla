import React, { useState, useEffect, useRef } from 'react';
import './ArenaDisplay.css';

// Constantes para la animación
const ANIMATION_DURATION = 1500; // Duración total de la animación en ms
const CYCLE_INTERVAL = 100; // Intervalo entre cambios de número en ms

const ArenaDisplay = ({ event }) => {
  // Estado para el número que se muestra durante la animación
  const [displayedRoll, setDisplayedRoll] = useState(null);
  // Estado para controlar cuándo mostrar el resultado
  const [showOutcome, setShowOutcome] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightTimeoutRef = useRef(null);

  useEffect(() => {
    // Si no hay evento o no es una tirada de dados, no hacemos nada
    if (!event || (event.type !== 'dice_roll' && !event.rollValue)) {
      setDisplayedRoll(null);
      setShowOutcome(false);
      setIsHighlighting(false);
      clearTimeout(highlightTimeoutRef.current);
      return;
    }

    // Resetear estados al inicio de una nueva tirada
    setShowOutcome(false);
    setIsHighlighting(false);
    clearTimeout(highlightTimeoutRef.current);
    
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
        setIsHighlighting(true);

        // Programar DESACTIVACIÓN del resaltado
        highlightTimeoutRef.current = setTimeout(() => {
          setIsHighlighting(false);
        }, 1000);
      }
    }, CYCLE_INTERVAL);

    // Timeout para FINALIZAR el ciclado
    const endCycleTimeoutId = setTimeout(() => {
      clearInterval(intervalId);
      setDisplayedRoll(event.rollValue);
      setShowOutcome(true);
      setIsHighlighting(true);

      // Programar DESACTIVACIÓN del resaltado
      highlightTimeoutRef.current = setTimeout(() => {
        setIsHighlighting(false);
      }, 1000);
    }, ANIMATION_DURATION);

    // Limpieza del intervalo cuando el componente se desmonte o cambie el evento
    return () => {
      clearInterval(intervalId);
      clearTimeout(endCycleTimeoutId);
      clearTimeout(highlightTimeoutRef.current);
    };
  }, [event]);

  // Si no hay evento, mostramos un mensaje por defecto
  if (!event) {
    return (
      <div className="arena-display">
        <div className="arena-message">Coliseo de Batalla</div>
      </div>
    );
  }

  // Helper para renderizar la información de la tirada
  const renderDiceInfo = () => (
    <div className="dice-roll-container">
      <div className="dice-roll-info">
        <div className="roller-name">{event.rollerName}</div>
        <div className={`roll-value ${isHighlighting ? 'final-roll-highlight' : ''}`}>
          Tirada: {event.type === 'dice_roll' ? displayedRoll : event.rollValue}
        </div>
        {event.targetMin !== undefined && event.targetMax !== undefined && (
          <div className="roll-target">
            Necesita {event.targetMin}-{event.targetMax}
          </div>
        )}
      </div>
      {(showOutcome || event.type === 'action_effect') && event.rollOutcome && (
        <div className={`roll-outcome ${event.rollOutcome}`}>
          {event.rollOutcome === 'success' && '¡Éxito!'}
          {event.rollOutcome === 'failure' && '¡Fallo!'}
          {event.rollOutcome === 'blocked' && '¡Bloqueado!'}
          {event.rollOutcome === 'countered' && '¡Contraatacado!'}
          {event.rollOutcome === 'invalid' && '¡Defensa Inválida!'}
        </div>
      )}
    </div>
  );

  // Helper para renderizar la información del efecto
  const renderActionEffectInfo = () => (
    <div className="action-effect-container">
      <div className="event-header">
        {event.actionName}
      </div>
      <div className="effect-details">
        {event.damage !== undefined && event.damage > 0 && (
          <div className="damage-info">
            {event.targetName} recibe {event.damage} de daño
          </div>
        )}
        {event.message && (
          <div className="action-message">
            {event.message}
          </div>
        )}
      </div>
    </div>
  );

  // Renderizamos el evento según su tipo
  return (
    <div className="arena-display">
      <div className={`arena-event ${event.type}`}>
        {/* Mostrar SIEMPRE info de dados si está presente */}
        {(event.type === 'dice_roll' || event.rollValue !== undefined) && renderDiceInfo()}

        {/* Mostrar info de efecto SÓLO si el evento es de ese tipo */}
        {event.type === 'action_effect' && renderActionEffectInfo()}
      </div>
    </div>
  );
};

export default ArenaDisplay; 