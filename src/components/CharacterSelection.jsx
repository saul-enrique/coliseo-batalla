import React, { useState, useEffect } from 'react';
import './CharacterSelection.css';

const CharacterSelection = ({ personajes, onStartCombat }) => {
  const [selectedCharIdP1, setSelectedCharIdP1] = useState(null);
  const [selectedCharIdP2, setSelectedCharIdP2] = useState(null);
  const [currentPlayerSelecting, setCurrentPlayerSelecting] = useState(1); // 1 for Player 1, 2 for Player 2
  const [hoveredChar, setHoveredChar] = useState(null);

  const handleCharacterSelect = (charId) => {
    if (currentPlayerSelecting === 1) {
      if (charId === selectedCharIdP2) return; // P1 cannot select P2's character
      setSelectedCharIdP1(charId);
      setCurrentPlayerSelecting(2); // Switch to Player 2
    } else {
      if (charId === selectedCharIdP1) return; // P2 cannot select P1's character
      setSelectedCharIdP2(charId);
      setCurrentPlayerSelecting(null); // Both selected, wait for start
    }
  };

  const handleResetSelection = () => {
    setSelectedCharIdP1(null);
    setSelectedCharIdP2(null);
    setCurrentPlayerSelecting(1);
    setHoveredChar(null);
  };

  const handleStartCombat = () => {
    if (selectedCharIdP1 && selectedCharIdP2) {
      const charP1 = personajes.find(p => p.id === selectedCharIdP1);
      const charP2 = personajes.find(p => p.id === selectedCharIdP2);
      onStartCombat(charP1, charP2);
    }
  };

  const getCharacterCardClass = (char) => {
    let className = 'character-card';
    if (char.id === selectedCharIdP1) className += ' selected-p1';
    if (char.id === selectedCharIdP2) className += ' selected-p2';
    if (char.id === selectedCharIdP1 || char.id === selectedCharIdP2) className += ' selected';
    
    // Disable selection if already picked by the other player
    if (currentPlayerSelecting === 1 && char.id === selectedCharIdP2) className += ' disabled';
    if (currentPlayerSelecting === 2 && char.id === selectedCharIdP1) className += ' disabled';
    
    return className;
  };
  
  const getPlayerIndicatorText = () => {
    if (currentPlayerSelecting === 1) return "Turno del Jugador 1: Elige tu caballero";
    if (currentPlayerSelecting === 2) return "Turno del Jugador 2: Elige tu caballero";
    if (selectedCharIdP1 && selectedCharIdP2) return "¡Listos para el combate!";
    return "Selección de Caballeros";
  }

  return (
    <div className="character-selection-container">
      <h1>Selección de Caballeros</h1>
      <div className="player-indicator">
        {getPlayerIndicatorText()}
      </div>

      <div className="selected-characters-preview">
        <div className={`player-preview ${selectedCharIdP1 ? 'filled' : ''}`}>
          <h2>Jugador 1</h2>
          {selectedCharIdP1 ? (
            <div className="preview-card p1-preview">
              <img src={personajes.find(p=>p.id === selectedCharIdP1).image} alt={personajes.find(p=>p.id === selectedCharIdP1).name} />
              <p>{personajes.find(p=>p.id === selectedCharIdP1).name}</p>
            </div>
          ) : <div className="placeholder-card">P1</div>}
        </div>
        <div className="vs-separator">VS</div>
        <div className={`player-preview ${selectedCharIdP2 ? 'filled' : ''}`}>
          <h2>Jugador 2</h2>
          {selectedCharIdP2 ? (
            <div className="preview-card p2-preview">
              <img src={personajes.find(p=>p.id === selectedCharIdP2).image} alt={personajes.find(p=>p.id === selectedCharIdP2).name} />
              <p>{personajes.find(p=>p.id === selectedCharIdP2).name}</p>
            </div>
          ) : <div className="placeholder-card">P2</div>}
        </div>
      </div>
      
      {hoveredChar && (
        <div className="character-details-tooltip">
          <h3>{hoveredChar.name}</h3>
          <p>PV: {hoveredChar.stats.pv_max}</p>
          <p>PA: {hoveredChar.stats.pa_max}</p>
          <p>PC: {hoveredChar.stats.pc_max}</p>
          {/* Add more stats or brief description if desired */}
        </div>
      )}

      <div className="character-grid">
        {personajes.map((char) => (
          <div
            key={char.id}
            className={getCharacterCardClass(char)}
            onClick={() => {
                if (currentPlayerSelecting === 1 && char.id !== selectedCharIdP2) {
                    handleCharacterSelect(char.id);
                } else if (currentPlayerSelecting === 2 && char.id !== selectedCharIdP1) {
                    handleCharacterSelect(char.id);
                } else if (!selectedCharIdP1 || !selectedCharIdP2) { // Allow selection if a slot is open and not disabled
                     handleCharacterSelect(char.id);
                }
            }}
            onMouseEnter={() => setHoveredChar(char)}
            onMouseLeave={() => setHoveredChar(null)}
          >
            <img src={char.image} alt={char.name} />
            <p>{char.name}</p>
          </div>
        ))}
      </div>

      <div className="selection-controls">
        <button 
            onClick={handleStartCombat} 
            disabled={!selectedCharIdP1 || !selectedCharIdP2}
            className="start-combat-button"
        >
          Iniciar Combate
        </button>
        <button 
            onClick={handleResetSelection} 
            className="reset-selection-button"
        >
          Reiniciar Selección
        </button>
      </div>
    </div>
  );
};

export default CharacterSelection; 