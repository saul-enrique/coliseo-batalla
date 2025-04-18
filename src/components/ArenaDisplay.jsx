import React from 'react';
import './ArenaDisplay.css';

function ArenaDisplay({ event }) {
  if (!event) {
    return (
      <div className="arena-display">
        <div className="arena-message">Coliseo de la Batalla</div>
      </div>
    );
  }

  // Renderizar diferentes tipos de eventos
  switch (event.type) {
    case 'dice_roll':
      return (
        <div className="arena-display">
          <div className="arena-event">
            <div className="event-header">{event.rollerName} intenta {event.defenseType}</div>
            <div className="dice-roll">
              <div className="roll-value">Tirada: {event.rollValue}</div>
              <div className="roll-target">Necesita: {event.targetMin}-{event.targetMax}</div>
            </div>
            <div className={`event-outcome ${event.outcome}`}>
              {event.outcome === 'success' && '¡Éxito!'}
              {event.outcome === 'failure' && '¡Fallo!'}
              {event.outcome === 'blocked' && '¡Bloqueado!'}
              {event.outcome === 'countered' && '¡Contraatacado!'}
            </div>
          </div>
        </div>
      );
    
    case 'action_effect':
      return (
        <div className="arena-display">
          <div className="arena-event">
            <div className="event-header">{event.actionName}</div>
            <div className="effect-details">
              {event.damage > 0 && <div className="damage-info">Daño: {event.damage}</div>}
              {event.targetName && <div className="target-info">Objetivo: {event.targetName}</div>}
            </div>
          </div>
        </div>
      );
    
    default:
      return (
        <div className="arena-display">
          <div className="arena-message">Coliseo de la Batalla</div>
        </div>
      );
  }
}

export default ArenaDisplay; 