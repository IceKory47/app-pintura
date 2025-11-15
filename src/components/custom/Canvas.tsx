'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useEditorStore } from '@/store/canvas-store';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface CanvasProps {
  mode: 'paint' | 'thumbnail';
}

export function Canvas({ mode }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Paint mode state
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Thumbnail mode state
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    canvasWidth,
    canvasHeight,
    zoom,
    setZoom,
    layers,
    selectedLayerId,
    setSelectedLayer,
    updateElement,
    addImageLayer,
    filters,
    brushSettings,
    currentColor,
  } = useEditorStore();

  // Paint mode: Initialize canvas
  useEffect(() => {
    if (mode !== 'paint' || !paintCanvasRef.current || !containerRef.current) return;

    const canvas = paintCanvasRef.current;
    const container = containerRef.current;
    
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [mode]);

  // Paint mode: Handle resize
  useEffect(() => {
    if (mode !== 'paint') return;

    const handleResize = () => {
      if (paintCanvasRef.current && containerRef.current) {
        const canvas = paintCanvasRef.current;
        const container = containerRef.current;
        
        // Validate dimensions before creating temp canvas
        if (canvas.width === 0 || canvas.height === 0) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          return;
        }
        
        // Save current content
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(canvas, 0, 0);
        }
        
        // Resize
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        // Validate new dimensions
        if (newWidth > 0 && newHeight > 0) {
          canvas.width = newWidth;
          canvas.height = newHeight;
          
          // Restore content
          const ctx = canvas.getContext('2d');
          if (ctx && tempCtx) {
            ctx.drawImage(tempCanvas, 0, 0);
          }
        }
      }
    };

    let resizeTimeout: NodeJS.Timeout;
    const throttledResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', throttledResize);

    return () => {
      window.removeEventListener('resize', throttledResize);
      clearTimeout(resizeTimeout);
    };
  }, [mode]);

  // Paint mode: Drawing handlers
  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'paint') return;

    const canvas = paintCanvasRef.current;
    if (!canvas) return;

    if (e.button === 1 || e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setIsDrawing(true);
    lastPointRef.current = { x, y };

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  }, [mode, panOffset]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    if (mode !== 'paint') return;

    const canvas = paintCanvasRef.current;
    if (!canvas) return;

    if (isPanning) {
      const newX = e.clientX - panStart.x;
      const newY = e.clientY - panStart.y;
      setPanOffset({ x: newX, y: newY });
      return;
    }

    if (!isDrawing || !lastPointRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = brushSettings.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushSettings.opacity / 100;

      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      lastPointRef.current = { x, y };
    }
  }, [mode, isDrawing, isPanning, panStart, brushSettings, currentColor]);

  const handlePointerUp = useCallback(() => {
    if (mode !== 'paint') return;

    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (isDrawing) {
      setIsDrawing(false);
      lastPointRef.current = null;
    }
  }, [mode, isDrawing, isPanning]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (mode !== 'paint') return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoom * delta));
    setZoom(newZoom);
  }, [mode, zoom, setZoom]);

  // Thumbnail mode: File upload handlers
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === 'string') {
            addImageLayer(result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    if (mode === 'thumbnail') {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (mode === 'thumbnail') {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  // Thumbnail mode: Render canvas
  useEffect(() => {
    if (mode !== 'thumbnail') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.filter = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
    `;

    layers.forEach((layer) => {
      if (!layer.visible) return;

      const element = layer.element;
      ctx.save();

      ctx.globalAlpha = element.opacity;
      ctx.translate(element.x, element.y);
      ctx.rotate((element.rotation * Math.PI) / 180);

      if (element.type === 'text') {
        ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
        ctx.fillStyle = element.color;
        ctx.textAlign = element.textAlign;
        ctx.fillText(element.content, 0, 0);
      } else if (element.type === 'image') {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = element.src;
        img.onload = () => {
          ctx.drawImage(img, -element.width / 2, -element.height / 2, element.width, element.height);
        };
      } else if (element.type === 'shape') {
        ctx.fillStyle = element.fill;
        
        if (element.shape === 'rectangle') {
          ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height);
        } else if (element.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, element.width / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (element.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -element.height / 2);
          ctx.lineTo(-element.width / 2, element.height / 2);
          ctx.lineTo(element.width / 2, element.height / 2);
          ctx.closePath();
          ctx.fill();
        }
      }

      if (layer.id === selectedLayerId) {
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        if (element.type === 'text') {
          const metrics = ctx.measureText(element.content);
          ctx.strokeRect(
            -metrics.width / 2 - 5,
            -element.fontSize - 5,
            metrics.width + 10,
            element.fontSize + 10
          );
        } else if (element.type === 'image' || element.type === 'shape') {
          ctx.strokeRect(
            -element.width / 2 - 5,
            -element.height / 2 - 5,
            element.width + 10,
            element.height + 10
          );
        }
        
        ctx.setLineDash([]);
      }

      ctx.restore();
    });
  }, [mode, layers, selectedLayerId, canvasWidth, canvasHeight, filters, addImageLayer]);

  // Thumbnail mode: Mouse handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'thumbnail') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      const element = layer.element;

      const dx = x - element.x;
      const dy = y - element.y;

      let isHit = false;

      if (element.type === 'text') {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = `${element.fontWeight} ${element.fontSize}px ${element.fontFamily}`;
          const metrics = ctx.measureText(element.content);
          isHit = Math.abs(dx) < metrics.width / 2 && Math.abs(dy) < element.fontSize / 2;
        }
      } else if (element.type === 'image' || element.type === 'shape') {
        isHit = Math.abs(dx) < element.width / 2 && Math.abs(dy) < element.height / 2;
      }

      if (isHit) {
        setIsDragging(true);
        setDraggedLayerId(layer.id);
        setDragOffset({ x: dx, y: dy });
        setSelectedLayer(layer.id);
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'thumbnail' || !isDragging || !draggedLayerId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    updateElement(draggedLayerId, {
      x: x - dragOffset.x,
      y: y - dragOffset.y,
    });
  };

  const handleMouseUp = () => {
    if (mode !== 'thumbnail') return;
    setIsDragging(false);
    setDraggedLayerId(null);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/50 to-gray-800/50 overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {mode === 'paint' ? (
        <div className="relative w-full h-full">
          <canvas
            ref={paintCanvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            className="w-full h-full cursor-crosshair touch-none"
            style={{ 
              touchAction: 'none',
              transform: `scale(${zoom}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center'
            }}
          />
          <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white pointer-events-none z-50">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      ) : (
        <>
          {/* Empty state with upload */}
          {layers.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <div className="text-center space-y-6 max-w-md pointer-events-auto">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Comece Seu Projeto
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Arraste imagens aqui ou clique no botão abaixo para fazer upload
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 mx-auto"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Fazer Upload de Imagem</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>JPG, PNG, GIF</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>Até 10MB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Canvas workspace */}
          <div
            className={`relative shadow-2xl transition-all ${
              isDragOver ? 'ring-4 ring-blue-500 ring-opacity-50' : ''
            }`}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center',
            }}
          >
            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="bg-white cursor-move"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />

            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white pointer-events-none z-50">
              {canvasWidth} × {canvasHeight}px
            </div>

            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg text-xs text-white pointer-events-none z-50">
              {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Drag overlay */}
          {isDragOver && (
            <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-sm flex items-center justify-center pointer-events-none z-[100]">
              <div className="bg-blue-600 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3">
                <Upload className="w-6 h-6" />
                <span className="text-lg font-semibold">Solte para adicionar imagem</span>
              </div>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            className="hidden"
          />

          {/* Upload button (floating) */}
          {layers.length > 0 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm rounded-lg transition-all shadow-lg hover:shadow-blue-500/50 flex items-center gap-2 z-[60]"
            >
              <Upload className="w-4 h-4" />
              <span className="font-medium">Upload</span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
