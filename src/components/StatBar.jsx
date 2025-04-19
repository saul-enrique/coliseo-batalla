import React from 'react';
import './StatBar.css'; // Asegúrate que la ruta al CSS sea correcta

function StatBar({ label, currentValue, maxValue, color }) {
  // Calcula el porcentaje, asegurando que no sea división por cero
  const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
  // Asegura que el porcentaje no sea negativo si currentValue baja de 0 por alguna razón
  const safePercentage = Math.max(0, percentage);

  return (
    <div className="stat-bar-container">
      {/* Mantenemos el texto para claridad */}
      <div className="stat-bar-label">{label}: {currentValue}/{maxValue}</div>
      <div className="stat-bar-background">
        <div
          className="stat-bar-fill"
          style={{
            width: `${safePercentage}%`, // Ancho dinámico
            backgroundColor: color || '#4CAF50' // Color pasado por prop o verde por defecto
          }}
          // Atributo opcional si quieres mostrar texto encima via CSS ::after
          // data-text={`${currentValue}/${maxValue}`}
        ></div>
      </div>
    </div>
  );
}

export default StatBar; 