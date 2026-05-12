'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * Image focal-point picker with zoom in/out support.
 * - Drag to reposition
 * - Scroll wheel or +/- buttons to zoom
 * - Saves position as "X% Y%" CSS object-position
 */
export default function ImagePositionPicker({ src, position = '50% 50%', onChange, height = 380 }) {
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [pos, setPos] = useState(() => parsePosition(position));
  const [zoom, setZoom] = useState(1); // 1 = 100%, range 1–3

  useEffect(() => { setPos(parsePosition(position)); }, [position]);

  function parsePosition(str) {
    const parts = (str || '50% 50%').split(' ');
    return { x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 };
  }

  const positionFromEvent = useCallback((e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const x = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
    return { x, y };
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    const newPos = positionFromEvent(e);
    setPos(newPos);
    onChange?.(`${newPos.x}% ${newPos.y}%`);
  }, [positionFromEvent, onChange]);

  const handleMove = useCallback((e) => {
    if (!dragging) return;
    e.preventDefault();
    const newPos = positionFromEvent(e);
    setPos(newPos);
    onChange?.(`${newPos.x}% ${newPos.y}%`);
  }, [dragging, positionFromEvent, onChange]);

  const handleEnd = useCallback(() => setDragging(false), []);

  // Scroll wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom((z) => Math.min(3, Math.max(1, +(z - e.deltaY * 0.002).toFixed(2))));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [dragging, handleMove, handleEnd]);

  // Attach wheel listener (non-passive so we can preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const zoomPct = Math.round(zoom * 100);

  return (
    <div className="space-y-2">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 flex items-center gap-1.5">
          <Move className="w-3.5 h-3.5" /> Drag to reposition · Scroll to zoom
        </p>
        <span className="text-xs text-gray-500 font-mono">{pos.x}% {pos.y}% · {zoomPct}%</span>
      </div>

      {/* Preview box */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-xl select-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ height: `${height}px` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <img
          src={src}
          alt="Cover preview"
          draggable={false}
          className="w-full h-full pointer-events-none"
          style={{
            objectFit: 'cover',
            objectPosition: `${pos.x}% ${pos.y}%`,
            transform: `scale(${zoom})`,
            transformOrigin: `${pos.x}% ${pos.y}%`,
            transition: dragging ? 'none' : 'transform 0.15s ease, object-position 0.1s ease',
          }}
        />

        {/* Crosshair */}
        <div
          className="absolute pointer-events-none"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-8 h-8 rounded-full border-2 border-white"
            style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.5)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-px w-4 h-px bg-white/80" />
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-px h-4 w-px bg-white/80" />
        </div>

        {/* Drag hint */}
        {!dragging && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
              <Move className="w-3 h-3" /> Drag to reposition
            </div>
          </div>
        )}

        {/* Zoom badge */}
        {zoom !== 1 && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold text-white pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
            {zoomPct}%
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2">
        {/* Zoom out */}
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
          disabled={zoom <= 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all disabled:opacity-30"
          style={{ background: 'transparent', borderColor: 'var(--border, #e2e8f0)', color: '#6b7280' }}
          title="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        {/* Zoom slider */}
        <div className="flex-1 relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(26,39,68,0.4)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${((zoom - 1) / 2) * 100}%`, background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }}
          />
          <input
            type="range"
            min="1" max="3" step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          />
        </div>

        {/* Zoom in */}
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
          disabled={zoom >= 3}
          className="flex items-center justify-center w-8 h-8 rounded-lg border transition-all disabled:opacity-30"
          style={{ background: 'transparent', borderColor: 'var(--border, #e2e8f0)', color: '#6b7280' }}
          title="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={() => { setPos({ x: 50, y: 50 }); setZoom(1); onChange?.('50% 50%'); }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{ color: '#6b7280', border: '1px solid var(--border, #e2e8f0)' }}
          title="Reset"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>
    </div>
  );
}
