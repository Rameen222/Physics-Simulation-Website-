import React, { useState, useEffect, useRef } from 'react';
import "../styles/MagneticField.css";

const MagneticFieldVisualization = () => {
  const [magnetStrength, setMagnetStrength] = useState(1.5);
  const [magnetPosition, setMagnetPosition] = useState({ x: 200, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [showInternalField, setShowInternalField] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const canvasRef = useRef(null);
  
  // Constants for magnet size
  const MAGNET_WIDTH = 100;
  const MAGNET_HEIGHT = 40;

  // Handle magnet strength change
  const handleStrengthChange = (e) => {
    setMagnetStrength(Number(e.target.value));
  };

  // Handle internal field view toggle
  const handleInternalViewChange = (e) => {
    setShowInternalField(e.target.value === 'on');
  };

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
  };

  // Mouse event handlers for dragging
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoomLevel;
    const mouseY = (e.clientY - rect.top) / zoomLevel;
    
    // Check if click is on the magnet
    if (
      mouseX >= magnetPosition.x - MAGNET_WIDTH/2 && 
      mouseX <= magnetPosition.x + MAGNET_WIDTH/2 && 
      mouseY >= magnetPosition.y - MAGNET_HEIGHT/2 && 
      mouseY <= magnetPosition.y + MAGNET_HEIGHT/2
    ) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      setMagnetPosition({
        x: (e.clientX - rect.left) / zoomLevel,
        y: (e.clientY - rect.top) / zoomLevel
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Draw the magnetic field
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / zoomLevel;
    const height = canvas.height / zoomLevel;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply zoom transform
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    
    // Draw black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw field lines
    drawMagneticField(ctx, width, height, magnetPosition, magnetStrength, showInternalField);
    
    // Draw magnet
    drawMagnet(ctx, magnetPosition, showInternalField);
    
    // Draw instruction
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('Drag the magnet to move it', 10, 20);
    
    // Restore transform
    ctx.restore();
    
  }, [magnetPosition, magnetStrength, showInternalField, zoomLevel]);

  const drawMagnet = (ctx, position, showInternal) => {
    const halfWidth = MAGNET_WIDTH / 2;
    const halfHeight = MAGNET_HEIGHT / 2;
    
    if (!showInternal) {
      // Draw solid magnet body
      ctx.fillStyle = '#666666';
      ctx.fillRect(
        position.x - halfWidth, 
        position.y - halfHeight, 
        MAGNET_WIDTH, 
        MAGNET_HEIGHT
      );
      
      // Draw north pole (red)
      ctx.fillStyle = 'red';
      ctx.fillRect(
        position.x - halfWidth, 
        position.y - halfHeight, 
        MAGNET_WIDTH / 2, 
        MAGNET_HEIGHT
      );
      
      // Draw south pole (blue)
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        position.x, 
        position.y - halfHeight, 
        MAGNET_WIDTH / 2, 
        MAGNET_HEIGHT
      );
    } else {
      // Draw just the outline for internal view
      // North pole outline (red)
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        position.x - halfWidth, 
        position.y - halfHeight, 
        MAGNET_WIDTH / 2, 
        MAGNET_HEIGHT
      );
      
      // South pole outline (blue)
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        position.x, 
        position.y - halfHeight, 
        MAGNET_WIDTH / 2, 
        MAGNET_HEIGHT
      );
    }
    
    // Label poles (moved above the magnet)
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', position.x - halfWidth/2, position.y - halfHeight - 5);
    ctx.fillText('S', position.x + halfWidth/2, position.y - halfHeight - 5);
  };

  // Helper function to draw an arrow at a specific point along a line
  const drawArrow = (ctx, fromX, fromY, toX, toY, color) => {
    const headLength = 8;
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI/6),
      toY - headLength * Math.sin(angle - Math.PI/6)
    );
    ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI/6),
      toY - headLength * Math.sin(angle + Math.PI/6)
    );
    ctx.closePath();
    ctx.fill();
  };

  const drawMagneticField = (ctx, width, height, position, strength, showInternal) => {
    const halfWidth = MAGNET_WIDTH / 2;
    const halfHeight = MAGNET_HEIGHT / 2;
    const fieldDensity = Math.max(3, Math.floor(strength * 4)); // Adjust field line density based on strength
    const fieldStrength = strength * 80; // Scale for visualization
    
    // Draw internal field lines only if toggled on (draw first so they appear behind external lines)
    if (showInternal) {
      drawInternalFieldLines(ctx, position, halfWidth, halfHeight, fieldDensity);
    }
    
    // Draw external field lines
    drawExternalFieldLines(ctx, position, halfWidth, halfHeight, fieldDensity, fieldStrength, width, height);
  };
  
  const drawExternalFieldLines = (ctx, position, halfWidth, halfHeight, fieldDensity, fieldStrength, width, height) => {
    // Start points along the edges of the magnet
    const startPoints = [];
    
    // Points along the north pole (left edge)
    for (let i = 0; i <= fieldDensity; i++) {
      startPoints.push({
        x: position.x - halfWidth,
        y: position.y - halfHeight + (MAGNET_HEIGHT * i / fieldDensity),
        isNorth: true
      });
    }
    
    // Points along the south pole (right edge)
    for (let i = 0; i <= fieldDensity; i++) {
      startPoints.push({
        x: position.x + halfWidth,
        y: position.y - halfHeight + (MAGNET_HEIGHT * i / fieldDensity),
        isNorth: false
      });
    }
    
    // Draw lines from each start point
    startPoints.forEach(point => {
      ctx.beginPath();
      ctx.strokeStyle = point.isNorth ? '#ff6666' : '#6666ff';
      ctx.lineWidth = 1;
      
      let x = point.x;
      let y = point.y;
      ctx.moveTo(x, y);
      
      // Store points to draw arrows later
      const arrowPoints = [];
      
      // Trace the field line
      for (let j = 0; j < 150; j++) {
        // Calculate vector to north and south poles
        const northPoleX = position.x - halfWidth/2;
        const northPoleY = position.y;
        const southPoleX = position.x + halfWidth/2;
        const southPoleY = position.y;
        
        // Vector from current point to north pole
        const toNorthX = northPoleX - x;
        const toNorthY = northPoleY - y;
        const northDistSq = toNorthX * toNorthX + toNorthY * toNorthY;
        const northDist = Math.sqrt(northDistSq);
        
        // Vector from current point to south pole
        const toSouthX = southPoleX - x;
        const toSouthY = southPoleY - y;
        const southDistSq = toSouthX * toSouthX + toSouthY * toSouthY;
        const southDist = Math.sqrt(southDistSq);
        
        // Calculate direction based on both poles (dipole field)
        // From north pole to south pole outside the magnet
        let fieldX = (toSouthX / southDistSq - toNorthX / northDistSq) * fieldStrength;
        let fieldY = (toSouthY / southDistSq - toNorthY / northDistSq) * fieldStrength;
        
        // For south pole arrows, we'll keep the original fieldX and fieldY
        // but reverse the drawing direction for arrows
        // This change makes blue arrows point toward the S pole
        const actualFieldX = fieldX;
        const actualFieldY = fieldY;
        
        // Reverse direction if starting from south pole to maintain line paths
        if (!point.isNorth) {
          fieldX = -fieldX;
          fieldY = -fieldY;
        }
        
        // Normalize and scale
        const fieldMag = Math.sqrt(fieldX * fieldX + fieldY * fieldY);
        if (fieldMag < 0.001) break; // Stop if field is too weak
        
        const stepSize = 2;
        fieldX = (fieldX / fieldMag) * stepSize;
        fieldY = (fieldY / fieldMag) * stepSize;
        
        // Store points for arrows (every ~30 steps)
        if (j % 30 === 0 && j > 0) {
          // For south pole, reverse the arrow direction to point toward the magnet
          if (!point.isNorth) {
            arrowPoints.push({
              fromX: x + fieldX,  // Reversed for south pole
              fromY: y + fieldY,  // Reversed for south pole
              toX: x,
              toY: y
            });
          } else {
            arrowPoints.push({
              fromX: x - fieldX,
              fromY: y - fieldY,
              toX: x,
              toY: y
            });
          }
        }
        
        // Move along the field line
        x += fieldX;
        y += fieldY;
        
        // Stop if we're out of bounds or too close to a pole
        if (x < 0 || y < 0 || x > width || y > height) break;
        if (
          (Math.abs(x - northPoleX) < 5 && Math.abs(y - northPoleY) < 5) ||
          (Math.abs(x - southPoleX) < 5 && Math.abs(y - southPoleY) < 5)
        ) break;
        
        // Stop if we enter the magnet from outside (except at starting points)
        if (j > 5 && 
            x >= position.x - halfWidth && 
            x <= position.x + halfWidth && 
            y >= position.y - halfHeight && 
            y <= position.y + halfHeight) break;
        
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      
      // Draw arrows on the line
      arrowPoints.forEach(ap => {
        drawArrow(
          ctx, 
          ap.fromX, 
          ap.fromY, 
          ap.toX, 
          ap.toY, 
          point.isNorth ? '#ff6666' : '#6666ff'
        );
      });
    });
  };
  
  const drawInternalFieldLines = (ctx, position, halfWidth, halfHeight, fieldDensity) => {
    // Improved internal field visualization with fewer, more visible lines
    // Increasing line width and using brighter color
    ctx.setLineDash([4, 4]); // Dotted line pattern for internal field
    ctx.strokeStyle = '#ffffff'; // Bright white color for better visibility
    ctx.lineWidth = 2.5; // Thicker line
    
    // Use fewer lines (only draw 3 lines regardless of field density)
    const numLines = 3;
    
    // Draw internal field lines
    for (let i = 1; i <= numLines; i++) {
      const yOffset = -halfHeight + (MAGNET_HEIGHT * i / (numLines + 1));
      
      // Calculate points along the curve for drawing arrows
      const points = [];
      const numPoints = 20; // Fewer points for clearer arrows
      
      // Generate curve points from South pole to North pole (S to N direction)
      for (let t = 0; t <= 1; t += 1/numPoints) {
        // Bezier curve formula - direction S to N
        const x = (1-t)*(1-t)*(1-t) * (position.x + halfWidth/2) + 
                 3*(1-t)*(1-t)*t * (position.x + halfWidth/4) +
                 3*(1-t)*t*t * (position.x - halfWidth/4) +
                 t*t*t * (position.x - halfWidth/2);
                 
        const y = position.y + yOffset;
        points.push({x, y});
      }
      
      // Draw the curve
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      for (let p = 1; p < points.length; p++) {
        ctx.lineTo(points[p].x, points[p].y);
      }
      
      ctx.stroke();
      
      // Draw fewer arrows at evenly spaced intervals
      // Draw 2-3 arrows per line for clarity
      for (let a = 5; a < points.length - 5; a += 7) {
        if (a + 1 < points.length) {
          drawArrow(
            ctx, 
            points[a].x, 
            points[a].y, 
            points[a+1].x, 
            points[a+1].y, 
            '#ffffff'
          );
        }
      }
    }
    
    ctx.setLineDash([]); // Reset to solid line
  };

  return (
    <div className="magnetic-field-container">
      <h2 className="title"> </h2>
      
      <div className="controls-panel">
        <div className="control-group">
          <label htmlFor="strengthSelect">Magnetic Field Strength (Tesla)</label>
          <select 
            id="strengthSelect" 
            className="select-dropdown"
            value={magnetStrength}
            onChange={handleStrengthChange}
          >
            <option value="0.5">0.5 T (Refrigerator Magnet)</option>
            <option value="1.5">1.5 T (MRI Machine)</option>
            <option value="3.0">3.0 T (High-Field MRI)</option>
            <option value="8.0">8.0 T (Research Magnet)</option>
          </select>
        </div>
        
        <div className="control-group">
          <label htmlFor="internalViewSelect">Internal Field View</label>
          <select 
            id="internalViewSelect" 
            className="select-dropdown"
            value={showInternalField ? 'on' : 'off'}
            onChange={handleInternalViewChange}
          >
            <option value="off">Off</option>
            <option value="on">On</option>
          </select>
        </div>
      </div>
      
      <div className="canvas-container">
        <div className="zoom-controls">
          <button className="zoom-button" onClick={handleZoomIn} title="Zoom In">+</button>
          <button className="zoom-button" onClick={handleZoomReset} title="Reset Zoom">↺</button>
          <button className="zoom-button" onClick={handleZoomOut} title="Zoom Out">−</button>
        </div>
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        />
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff6666' }}></span>
          <span>Field lines from North pole</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#6666ff' }}></span>
          <span>Field lines to South pole </span>
        </div>
        <div className="legend-item">
          <span className="legend-line"></span>
          <span>Internal field (South to North, dotted line)</span>
        </div>
      </div>
    </div>
  );
};

export default MagneticFieldVisualization;