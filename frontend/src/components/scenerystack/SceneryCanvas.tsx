import React, { useEffect, useRef } from 'react';
import { SceneryRenderer } from '../../engine/scenerystack/SceneryRenderer';

interface SceneryCanvasProps {
  onRendererReady?: (renderer: SceneryRenderer) => void;
  className?: string;
}

export const SceneryCanvas: React.FC<SceneryCanvasProps> = ({ onRendererReady, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<SceneryRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize renderer
    const renderer = new SceneryRenderer(containerRef.current);
    rendererRef.current = renderer;

    if (onRendererReady) {
      onRendererReady(renderer);
    }

    renderer.start();

    return () => {
      renderer.dispose();
      rendererRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [onRendererReady]);

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-hidden select-none touch-none ${className}`}
      style={{ minHeight: '400px' }}
    />
  );
};
