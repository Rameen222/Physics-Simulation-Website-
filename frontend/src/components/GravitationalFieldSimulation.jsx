import React, { useEffect, useState } from 'react';
import '../styles/solar-system.css';

const SolarSystem = () => {
  const [time, setTime] = useState(0);
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [gravityModifiers, setGravityModifiers] = useState({});

  const planets = [
    { name: 'Mercury', color: '#A9A9A9', radius: 3.8, distance: 50, orbitalPeriod: 88, gravity: 3.70, angularVelocity: 4.09, 
      orbitalVelocity: 47.9, mass: "3.30 × 10^23 kg" },
    { name: 'Venus', color: '#E6E6FA', radius: 9.5, distance: 75, orbitalPeriod: 225, gravity: 8.87, angularVelocity: 1.60, 
      orbitalVelocity: 35.0, mass: "4.87 × 10^24 kg" },
    { name: 'Earth', color: '#1E90FF', radius: 10, distance: 100, orbitalPeriod: 365, gravity: 9.81, angularVelocity: 0.99, 
      orbitalVelocity: 29.8, mass: "5.97 × 10^24 kg" },
    { name: 'Mars', color: '#CD5C5C', radius: 5.3, distance: 150, orbitalPeriod: 687, gravity: 3.72, angularVelocity: 0.52, 
      orbitalVelocity: 24.1, mass: "6.42 × 10^23 kg" },
    { name: 'Jupiter', color: '#F4A460', radius: 25, distance: 220, orbitalPeriod: 4333, gravity: 24.79, angularVelocity: 0.083, 
      orbitalVelocity: 13.1, mass: "1.90 × 10^27 kg" },
    { name: 'Saturn', color: '#DAA520', radius: 20, distance: 290, orbitalPeriod: 10759, gravity: 10.44, angularVelocity: 0.033, 
      orbitalVelocity: 9.7, mass: "5.68 × 10^26 kg" },
    { name: 'Uranus', color: '#ADD8E6', radius: 17, distance: 350, orbitalPeriod: 30687, gravity: 8.87, angularVelocity: 0.012, 
      orbitalVelocity: 6.8, mass: "8.68 × 10^25 kg" },
    { name: 'Neptune', color: '#4169E1', radius: 16, distance: 400, orbitalPeriod: 60190, gravity: 11.15, angularVelocity: 0.006, 
      orbitalVelocity: 5.4, mass: "1.02 × 10^26 kg" }
  ];

  useEffect(() => {
    const timer = setInterval(() => setTime(prev => prev + 1), 50);
    return () => clearInterval(timer);
  }, []);

  const getGravityOptions = (g) => [
    (g * 0.5).toFixed(2),
    g.toFixed(2),
    (g * 1.5).toFixed(2),
    (g * 2).toFixed(2)
  ];

  const getPlanetPosition = (planet, time) => {
    const modifier = gravityModifiers[planet.name] || 1;
    const adjustedPeriod = planet.orbitalPeriod / Math.sqrt(modifier);
    const angle = (2 * Math.PI / adjustedPeriod) * time;
    return {
      x: Math.cos(angle) * planet.distance,
      y: Math.sin(angle) * planet.distance
    };
  };

  const togglePlanet = (name) => {
    setSelectedPlanets(prev => {
      const updated = prev.includes(name)
        ? prev.filter(p => p !== name)
        : [...prev, name];
      if (!updated.includes(name)) {
        const copy = { ...gravityModifiers };
        delete copy[name];
        setGravityModifiers(copy);
      }
      return updated;
    });
  };

  const handleGravityChange = (name, value) => {
    setGravityModifiers(prev => ({ ...prev, [name]: value }));
  };

  const resetView = () => {
    setSelectedPlanets([]);
    setGravityModifiers({});
  };

  const getAdjustedOrbitalVelocity = (base, mod) => (base * Math.sqrt(mod)).toFixed(1);
  const getAdjustedAngularVelocity = (base, mod) => (base * Math.sqrt(mod)).toFixed(3);

  const leftPanelPlanets = selectedPlanets.slice(0, 4);
  const rightPanelPlanets = selectedPlanets.slice(4);

  const PlanetCard = ({ planetName }) => {
    const p = planets.find(pl => pl.name === planetName);
    const mod = gravityModifiers[planetName] || 1;
    return (
      <div className="planet-card">
        <h4 style={{ color: p.color }}>{p.name}</h4>
        <div>
          <div>Adjust Gravity:</div>
          <div className="gravity-btn-container">
            {getGravityOptions(p.gravity).map((gVal, i) => (
              <button
                key={i}
                className={`gravity-btn ${mod === parseFloat(gVal) / p.gravity ? 'active' : ''}`}
                onClick={() => handleGravityChange(p.name, parseFloat(gVal) / p.gravity)}
              >
                {gVal} m/s²
              </button>
            ))}
          </div>
        </div>
        <div className="planet-stats">
          <p><strong>Mass:</strong> <span>{p.mass}</span></p>
          <p><strong>Gravity:</strong> <span>{(p.gravity * mod).toFixed(2)} m/s²</span></p>
          <p><strong>Orbital Period:</strong> <span>{(p.orbitalPeriod / Math.sqrt(mod)).toFixed(0)} days</span></p>
          <p><strong>Orbital Velocity:</strong> <span>{getAdjustedOrbitalVelocity(p.orbitalVelocity, mod)} km/s</span></p>
          <p><strong>Angular Velocity:</strong> <span>{getAdjustedAngularVelocity(p.angularVelocity, mod)} °/day</span></p>
        </div>
      </div>
    );
  };

  return (
    <div className="solar-container">
      <div className="header-container">
        <p className="solar-header">Press planet to focus and adjust gravity</p>
        {selectedPlanets.length > 0 && (
          <button className="reset-button" onClick={resetView}>Reset View</button>
        )}
      </div>

      {/* Orbit system */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 800, height: 800 }}>
        <div className="orbit-container">
          <div className="sun"></div>

          {planets.map((p, i) => (
            <div key={`orbit-${i}`} className="orbit"
              style={{
                width: `${p.distance * 2}px`,
                height: `${p.distance * 2}px`,
                left: `calc(50% - ${p.distance}px)`,
                top: `calc(50% - ${p.distance}px)`,
                opacity: selectedPlanets.length && !selectedPlanets.includes(p.name) ? 0.2 : 1,
                zIndex: selectedPlanets.includes(p.name) ? 20 : 1
              }}></div>
          ))}

          {planets.map((p, i) => {
            const pos = getPlanetPosition(p, time);
            const selected = selectedPlanets.includes(p.name);
            return (
              <div key={`planet-${i}`} className="planet"
                style={{
                  left: `calc(50% + ${pos.x}px - ${p.radius}px)`,
                  top: `calc(50% + ${pos.y}px - ${p.radius}px)`,
                  zIndex: selected ? 20 : 1,
                  opacity: selectedPlanets.length && !selected ? 0.2 : 1
                }}
              >
                <div
                  className="planet-label"
                  style={{
                    width: `${p.radius * 4}px`,
                    left: `${-p.radius * 1.5}px`,
                    bottom: `${p.radius * 2.5}px`,
                    fontSize: p.radius > 15 ? '14px' : '10px',
                    cursor: 'pointer'
                  }}
                  onClick={() => togglePlanet(p.name)}
                >
                  {p.name}<br />
                  g: {(p.gravity * (gravityModifiers[p.name] || 1)).toFixed(2)} m/s²
                </div>
                <div
                  className="rounded-full"
                  style={{
                    width: `${p.radius * 2}px`,
                    height: `${p.radius * 2}px`,
                    backgroundColor: p.color,
                    borderRadius: '50%',
                    boxShadow: p.name === 'Saturn'
                      ? `0 0 5px 2px rgba(255,255,255,0.5), 0 0 0 4px rgba(218,165,32,0.3)`
                      : `0 0 5px 2px rgba(255,255,255,0.5)`,
                    cursor: 'pointer'
                  }}
                  onClick={() => togglePlanet(p.name)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-gray-400 text-center mt-4">
        Planetary orbits and sizes are not to scale.
      </p>

      {/* ✅ Planet detail panels moved out of orbit layout */}
      {leftPanelPlanets.length > 0 && (
        <div className="details-side-panel left-panel">
          <h3>Planet Details</h3>
          <div className="planet-info-vertical">
            {leftPanelPlanets.map(name => (
              <PlanetCard key={name} planetName={name} />
            ))}
          </div>
        </div>
      )}

      {rightPanelPlanets.length > 0 && (
        <div className="details-side-panel right-panel">
          <h3>Planet Details</h3>
          <div className="planet-info-vertical">
            {rightPanelPlanets.map(name => (
              <PlanetCard key={name} planetName={name} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SolarSystem;
