import React, { useState, useEffect, useRef } from 'react';
import './ArenaDisplay.css';

// Animation constants
const ANIMATION_DURATION = 1500; // Total animation duration in ms
const CYCLE_INTERVAL = 100; // Interval between number changes in ms
const HIGHLIGHT_DURATION = 1000; // How long the final roll value stays highlighted

const ArenaDisplay = ({ arenaEvent: event }) => {
  // State for the number shown during animation
  const [displayedRoll, setDisplayedRoll] = useState(null);
  // State to control when the final outcome/message is shown
  const [showOutcome, setShowOutcome] = useState(false);
  // State for highlighting the final roll value
  const [isHighlighting, setIsHighlighting] = useState(false);
  // Refs for managing timeouts
  const animationIntervalRef = useRef(null);
  const animationTimeoutRef = useRef(null);
  const highlightTimeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing timeouts/intervals on new event or unmount
    const cleanup = () => {
      clearInterval(animationIntervalRef.current);
      clearTimeout(animationTimeoutRef.current);
      clearTimeout(highlightTimeoutRef.current);
    };
    cleanup();

    // Reset states for a new event
    setDisplayedRoll(null);
    setShowOutcome(false);
    setIsHighlighting(false);

    // Check if the event contains dice roll information
    if (event && event.rollValue !== undefined && event.rollValue !== null) {
      const startTime = Date.now();
      setShowOutcome(false); // Ensure outcome is hidden during animation

      // Start cycling numbers
      animationIntervalRef.current = setInterval(() => {
        const randomNumber = Math.floor(Math.random() * 20) + 1;
        setDisplayedRoll(randomNumber);
      }, CYCLE_INTERVAL);

      // Set timeout to stop cycling and show the final result
      animationTimeoutRef.current = setTimeout(() => {
        cleanup(); // Clear interval first
        setDisplayedRoll(event.rollValue); // Show the actual roll value
        setShowOutcome(true); // Allow outcome/message to be shown
        setIsHighlighting(true); // Start highlighting

        // Set timeout to stop highlighting after a duration
        highlightTimeoutRef.current = setTimeout(() => {
          setIsHighlighting(false);
        }, HIGHLIGHT_DURATION);

      }, ANIMATION_DURATION);

    } else if (event) {
        // If it's an event without a roll (e.g., action start, simple message), show it immediately
        setShowOutcome(true);
        setDisplayedRoll(null); // Ensure no lingering roll number is shown
    }

    // Cleanup function for when the component unmounts or the event changes
    return cleanup;

  }, [event]); // Rerun effect when the event prop changes

  // --- Render Helper Functions ---

  // Renders the dice roll part (value, target, outcome icon)
  const renderDiceInfo = () => (
    <div className="dice-roll-container">
      <div className="dice-roll-info">
        {/* Display roller name if available */}
        {event.rollerName && <div className="roller-name">{event.rollerName}</div>}

        {/* Display the roll value (animated or direct) */}
        <div className={`roll-value ${isHighlighting ? 'final-roll-highlight' : ''}`}>
          {/* Show animated number or final value */}
          Tirada: {displayedRoll !== null ? displayedRoll : event.rollValue}
        </div>

        {/* Display target range if available */}
        {event.targetMin !== undefined && event.targetMin !== null && event.targetMax !== undefined && event.targetMax !== null && (
          <div className="roll-target">
            (Necesita {event.targetMin}-{event.targetMax})
          </div>
        )}
      </div>

      {/* Display the outcome text (Éxito, Fallo, etc.) only when animation is done */}
      {showOutcome && event.rollOutcome && (
        <div className={`roll-outcome ${event.rollOutcome}`}>
          {/* Map outcome keys to display text */}
          {event.rollOutcome === 'success' && '¡Éxito!'}
          {event.rollOutcome === 'failure' && '¡Fallo!'}
          {event.rollOutcome === 'blocked' && '¡Bloqueado!'}
          {event.rollOutcome === 'countered' && '¡Contraatacado!'}
          {event.rollOutcome === 'invalid' && '¡Inválido!'}
          {event.rollOutcome === 'tie' && '¡Empate!'}
          {/* Add more outcomes if needed */}
        </div>
      )}
    </div>
  );

  // Renders the main action/event information (header, messages)
  const renderActionEffectInfo = () => (
    <div className="action-effect-container">
       {/* Display a header/title for the event */}
      <div className="event-header">
        {event.actionName || 'Evento'} {/* Use actionName from event */}
      </div>
      <div className="effect-details">
         {/* Display the primary message (could be finalMessage or message) */}
         {(event.finalMessage || event.message) && (
           <div className="action-message">
             {event.finalMessage || event.message}
           </div>
         )}
         {/* Optionally display specific details like damage, hits etc. */}
         {event.damage !== undefined && event.damage > 0 && (
             <div className="damage-info">Daño: {event.damage}</div>
         )}
         {event.hits !== undefined && (
             <div className="hits-info">Golpes: {event.hits}</div>
         )}
         {/* Add more details as needed based on event properties */}
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="arena-display">
       {/* Show default message if no event */}
       {!event && <div className="arena-message">Coliseo de Batalla</div>}

       {/* Render event details if an event exists */}
       {event && (
          <div className={`arena-event ${event.type || 'default'}`}> {/* Use event type for class */}

            {/* Render dice info section if rollValue is present */}
            {event.rollValue !== undefined && event.rollValue !== null && renderDiceInfo()}

            {/* Render the main action/effect info.
                Show immediately if there's no dice roll,
                or show only after dice animation is complete if there was a roll. */}
            {(event.rollValue === undefined || event.rollValue === null || showOutcome) && renderActionEffectInfo()}

          </div>
       )}
    </div>
  );
};

export default ArenaDisplay;
