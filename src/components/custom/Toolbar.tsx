'use client';

import { useEditorStore } from '@/store/canvas-store';
import { 
  Type, 
  Image, 
  Square, 
  Circle,
  Triangle,
  Sliders,
  Undo2,
  Redo2,
  Paintbrush,
  Eraser,
  Move,
  Hand
} from 'lucide-react';
import type { Tool } from '@/lib/types';

interface ToolbarProps {
  mode: 'paint' | 'thumbnail';
}

const paintTools: Array<{ id: Tool; icon: any; label: string }> = [
  { id: 'select', icon: Move, label: 'Mover (V)' },
  { id: 'brush', icon: Paintbrush, label: 'Pincel (B)' },
  { id: 'eraser', icon: Eraser, label: 'Borracha (E)' },
  { id: 'pan', icon: Hand, label: 'Pan (Espaço)' },
];

const thumbnailTools: Array<{ id: Tool; icon: any; label: string }> = [
  { id: 'select', icon: Square, label: 'Selecionar (V)' },
  { id: 'text', icon: Type, label: 'Texto (T)' },
  { id: 'image', icon: Image, label: 'Imagem (I)' },
  { id: 'shape', icon: Circle, label: 'Formas (S)' },
  { id: 'filter', icon: Sliders, label: 'Filtros (F)' },
];

export function Toolbar({ mode }: ToolbarProps) {
  const { currentTool, setTool, undo, redo, canUndo, canRedo, addTextLayer, addShapeLayer } = useEditorStore();
  
  const tools = mode === 'paint' ? paintTools : thumbnailTools;
  
  const handleToolClick = (toolId: Tool) => {
    setTool(toolId);
    
    // Auto-add elements for certain tools (thumbnail mode only)
    if (mode === 'thumbnail') {
      if (toolId === 'text') {
        addTextLayer('Seu Texto Aqui');
      } else if (toolId === 'shape') {
        addShapeLayer('rectangle');
      }
    }
  };
  
  return (
    <div className="w-20 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 flex flex-col items-center py-6 gap-3 shadow-2xl">
      {/* History controls */}
      <div className="flex flex-col gap-2 pb-4 border-b border-gray-800/50 mb-2 w-full px-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
          title="Desfazer (Ctrl+Z)"
        >
          <Undo2 className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all group"
          title="Refazer (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
        </button>
      </div>
      
      {/* Tools */}
      <div className="flex flex-col gap-2 w-full px-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.id;
          
          return (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              className={`p-3 rounded-lg transition-all relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                  : 'text-gray-400 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 hover:text-blue-400'
              }`}
              title={tool.label}
            >
              <Icon className="w-5 h-5" />
              {isActive && (
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 blur-xl opacity-50 -z-10"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Shape variants (when shape tool is active in thumbnail mode) */}
      {mode === 'thumbnail' && currentTool === 'shape' && (
        <div className="flex flex-col gap-2 pt-4 border-t border-gray-800/50 mt-2 w-full px-2">
          <button
            onClick={() => addShapeLayer('rectangle')}
            className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 text-gray-400 hover:text-blue-400 transition-all"
            title="Retângulo"
          >
            <Square className="w-5 h-5" />
          </button>
          <button
            onClick={() => addShapeLayer('circle')}
            className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 text-gray-400 hover:text-blue-400 transition-all"
            title="Círculo"
          >
            <Circle className="w-5 h-5" />
          </button>
          <button
            onClick={() => addShapeLayer('triangle')}
            className="p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-purple-600/20 text-gray-400 hover:text-blue-400 transition-all"
            title="Triângulo"
          >
            <Triangle className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
