import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut, Eye, Layers, Compass } from 'lucide-react';

/**
 * Facial mesh wireframe connection pairs (simplified key topology lines for 468 landmarks)
 */
const FACIAL_CONNECTIONS = [
  // Face Contour / Jawline
  [10, 338], [338, 297], [297, 332], [332, 284], [284, 251], [251, 389], [389, 356], [356, 454],
  [454, 323], [323, 361], [361, 288], [288, 397], [397, 365], [365, 379], [379, 378], [378, 400],
  [400, 377], [377, 152], [152, 148], [148, 176], [176, 149], [149, 150], [150, 136], [136, 172],
  [172, 58], [58, 132], [132, 93], [93, 234], [234, 127], [127, 162], [162, 21], [21, 54],
  [54, 103], [103, 67], [67, 109], [109, 10],

  // Left Eye
  [33, 7] , [7, 163], [163, 144], [144, 145], [145, 153], [153, 154], [154, 155], [155, 133],
  [133, 173], [173, 157], [157, 158], [158, 159], [159, 160], [160, 161], [161, 246], [246, 33],

  // Right Eye
  [263, 249], [249, 390], [390, 373], [373, 374], [374, 380], [380, 381], [381, 382], [382, 362],
  [362, 398], [398, 384], [384, 385], [385, 386], [386, 387], [387, 388], [388, 466], [466, 263],

  // Lips Outer
  [61, 146], [146, 91], [91, 181], [181, 84], [84, 17], [17, 314], [314, 405], [405, 321],
  [321, 375], [375, 291], [291, 308], [308, 324], [324, 318], [318, 402], [402, 317], [317, 14],
  [14, 87], [87, 178], [178, 88], [88, 95], [95, 61],

  // Nose Bridge & Tip
  [168, 6], [6, 197], [197, 195], [195, 5], [5, 4], [4, 1], [1, 19], [19, 94], [94, 2]
];

export default function FaceMeshCanvas3D({ landmarks, headPose, height = 360, showControls = true }) {
  const canvasRef = useRef(null);

  // 3D Viewport State (Rotation Pitch/Yaw, Zoom)
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [showWireframe, setShowWireframe] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);

  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Mouse interaction handlers for 3D rotation
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotY((prev) => prev + dx * 0.01);
    setRotX((prev) => prev + dy * 0.01);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetView = () => {
    setRotX(0);
    setRotY(0);
    setZoom(1.0);
  };

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      // Dark futuristic grid background
      const bgGrad = ctx.createLinearGradient(0, 0, width, h);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, h);

      // Radial glowing background grid
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      if (!landmarks || landmarks.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('No 3D Mesh Data Available', width / 2, h / 2);
        return;
      }

      // Auto rotation update
      let currentRotY = rotY;
      if (autoRotate) {
        currentRotY += 0.015;
      }

      // 3D Projection calculations
      const cx = width / 2;
      const cy = h / 2;
      const scale = Math.min(width, h) * 1.5 * zoom;

      // Project 3D landmark array (x, y, z normalized around 0.5)
      const projected = landmarks.map((p) => {
        // Center around (0,0,0)
        let x = (p.x - 0.5);
        let y = (p.y - 0.45);
        let z = p.z || 0;

        // Apply 3D Rotation Y (yaw)
        const cosY = Math.cos(currentRotY);
        const sinY = Math.sin(currentRotY);
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;

        // Apply 3D Rotation X (pitch)
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let y2 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;

        // Perspective scale factor
        const distance = 2.0;
        const perspective = distance / (distance - z2);

        return {
          px: cx + x1 * scale * perspective,
          py: cy + y2 * scale * perspective,
          pz: z2,
          rawZ: p.z || 0
        };
      });

      // 1. Draw Wireframe Topology Lines
      if (showWireframe) {
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.45)';
        ctx.lineWidth = 1;
        FACIAL_CONNECTIONS.forEach(([i1, i2]) => {
          if (projected[i1] && projected[i2]) {
            ctx.beginPath();
            ctx.moveTo(projected[i1].px, projected[i1].py);
            ctx.lineTo(projected[i2].px, projected[i2].py);
            ctx.stroke();
          }
        });
      }

      // 2. Draw 468 3D Landmark Nodes with Depth Color Coding
      projected.forEach((pt) => {
        const radius = Math.max(1, 2.2 * zoom);
        
        // Depth color mapping (closer = bright cyan/emerald, farther = deep indigo)
        const depthAlpha = Math.max(0.3, Math.min(1.0, 0.7 - pt.pz * 2));
        ctx.fillStyle = pt.rawZ < -0.04 ? '#38bdf8' : pt.rawZ > 0.02 ? '#818cf8' : '#34d399';
        ctx.globalAlpha = depthAlpha;

        ctx.beginPath();
        ctx.arc(pt.px, pt.py, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 3. Draw 3D Orientation Axes (RGB = XYZ) from Nose Tip
      if (showAxes && projected[1]) {
        const nose = projected[1];
        const axisLength = 45 * zoom;

        // Pitch / Yaw / Roll orientation vectors
        const pRad = ((headPose?.pitch || 0) * Math.PI) / 180;
        const yRad = ((headPose?.yaw || 0) * Math.PI) / 180;
        const rRad = ((headPose?.roll || 0) * Math.PI) / 180;

        // X Axis (Red) - Pitch
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(nose.px, nose.py);
        ctx.lineTo(nose.px + Math.cos(rRad) * axisLength, nose.py + Math.sin(rRad) * axisLength);
        ctx.stroke();

        // Y Axis (Green) - Yaw
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(nose.px, nose.py);
        ctx.lineTo(nose.px + Math.sin(yRad) * axisLength, nose.py - Math.cos(pRad) * axisLength);
        ctx.stroke();

        // Z Axis (Blue) - Roll/Normal
        ctx.strokeStyle = '#3b82f6';
        ctx.beginPath();
        ctx.moveTo(nose.px, nose.py);
        ctx.lineTo(nose.px - Math.sin(rRad) * axisLength * 0.7, nose.py + Math.cos(rRad) * axisLength * 0.7);
        ctx.stroke();
      }

      // 4. On-canvas overlay info
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Landmarks: ${landmarks.length} | Zoom: ${zoom.toFixed(1)}x`, 12, 20);
      ctx.fillText(`Rotation: X:${(rotX * 57.3).toFixed(0)}° Y:${(currentRotY * 57.3).toFixed(0)}°`, 12, 34);

      if (autoRotate) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [landmarks, rotX, rotY, zoom, showWireframe, showAxes, autoRotate, headPose, height]);

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(99, 102, 241, 0.2)', backgroundColor: '#090d16' }}>
      <canvas
        ref={canvasRef}
        width={540}
        height={height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ width: '100%', height: `${height}px`, display: 'block', cursor: 'grab' }}
      />

      {showControls && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          display: 'flex',
          gap: '6px',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          padding: '6px 10px',
          borderRadius: '8px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <button
            title="Reset View"
            onClick={handleResetView}
            style={btnStyle}
          >
            <RotateCcw size={14} />
          </button>
          <button
            title="Zoom In"
            onClick={() => setZoom(z => Math.min(2.5, z + 0.2))}
            style={btnStyle}
          >
            <ZoomIn size={14} />
          </button>
          <button
            title="Zoom Out"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
            style={btnStyle}
          >
            <ZoomOut size={14} />
          </button>
          <button
            title="Toggle Wireframe"
            onClick={() => setShowWireframe(v => !v)}
            style={{ ...btnStyle, color: showWireframe ? '#818cf8' : '#94a3b8' }}
          >
            <Layers size={14} />
          </button>
          <button
            title="Toggle Orientation Axes"
            onClick={() => setShowAxes(v => !v)}
            style={{ ...btnStyle, color: showAxes ? '#34d399' : '#94a3b8' }}
          >
            <Compass size={14} />
          </button>
          <button
            title="Auto Rotate 360"
            onClick={() => setAutoRotate(v => !v)}
            style={{ ...btnStyle, color: autoRotate ? '#f43f5e' : '#94a3b8' }}
          >
            <Eye size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: 'transparent',
  border: 'none',
  color: '#e2e8f0',
  padding: '4px',
  cursor: 'pointer',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};
