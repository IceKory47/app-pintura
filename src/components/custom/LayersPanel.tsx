'use client';

import { useEditorStore } from '@/store/canvas-store';
import { Layers, Eye, EyeOff, Lock, Unlock, Copy, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface LayersPanelProps {
  mode: 'paint' | 'thumbnail';
}

export function LayersPanel({ mode }: LayersPanelProps) {
  const {
    layers,
    selectedLayerId,
    setSelectedLayer,
    removeLayer,
    duplicateLayer,
    moveLayerUp,
    moveLayerDown,
  } = useEditorStore();

  // Paint mode: Show simplified layer panel or hide
  if (mode === 'paint') {
    return (
      <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-l border-gray-800/50 p-6">
        <h2 className="text-lg font-bold text-gray-200 mb-6">Camadas</h2>
        <div className="text-center text-gray-500 mt-20">
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Sistema de camadas de pintura em desenvolvimento</p>
        </div>
      </div>
    );
  }

  // Thumbnail mode: Full layer management
  if (layers.length === 0) {
    return (
      <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-l border-gray-800/50 p-6">
        <h2 className="text-lg font-bold text-gray-200 mb-6">Camadas</h2>
        <div className="text-center text-gray-500 mt-20">
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Adicione elementos para começar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-l border-gray-800/50 p-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-200 mb-6">Camadas</h2>

      <div className="space-y-2">
        {[...layers].reverse().map((layer, index) => {
          const isSelected = layer.id === selectedLayerId;
          const actualIndex = layers.length - 1 - index;

          return (
            <div
              key={layer.id}
              onClick={() => setSelectedLayer(layer.id)}
              className={`p-3 rounded-xl transition-all cursor-pointer group ${
                isSelected
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50'
                  : 'bg-gray-800/30 hover:bg-gray-800/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Layer icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                  layer.element.type === 'text'
                    ? 'bg-blue-600/20 text-blue-400'
                    : layer.element.type === 'image'
                    ? 'bg-purple-600/20 text-purple-400'
                    : 'bg-green-600/20 text-green-400'
                }`}>
                  {layer.element.type === 'text' ? 'T' : layer.element.type === 'image' ? 'I' : 'S'}
                </div>

                {/* Layer info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-200 truncate">{layer.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{layer.element.type}</p>
                </div>

                {/* Layer controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerUp(layer.id);
                    }}
                    disabled={actualIndex === layers.length - 1}
                    className="p-1 hover:bg-gray-700/50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para cima"
                  >
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerDown(layer.id);
                    }}
                    disabled={actualIndex === 0}
                    className="p-1 hover:bg-gray-700/50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Mover para baixo"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateLayer(layer.id);
                    }}
                    className="p-1 hover:bg-gray-700/50 rounded"
                    title="Duplicar"
                  >
                    <Copy className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLayer(layer.id);
                    }}
                    className="p-1 hover:bg-red-600/20 rounded"
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Layer preview (for text) */}
              {layer.element.type === 'text' && (
                <div className="mt-2 px-2 py-1 bg-gray-900/50 rounded text-xs text-gray-400 truncate">
                  "{layer.element.content}"
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <span className="text-gray-300 font-semibold">Dica:</span> Clique em uma camada para selecioná-la e editar suas propriedades.
        </p>
      </div>
    </div>
  );
}
