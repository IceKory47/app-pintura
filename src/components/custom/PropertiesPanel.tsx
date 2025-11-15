'use client';

import { useEditorStore } from '@/store/canvas-store';
import { Sliders, RotateCcw, Paintbrush } from 'lucide-react';

interface PropertiesPanelProps {
  mode: 'paint' | 'thumbnail';
}

export function PropertiesPanel({ mode }: PropertiesPanelProps) {
  const { 
    selectedLayerId, 
    layers, 
    updateElement, 
    filters, 
    updateFilters, 
    resetFilters,
    currentTool,
    brushSettings,
    updateBrushSettings,
    currentColor,
    setCurrentColor
  } = useEditorStore();

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // Paint mode: Show brush settings
  if (mode === 'paint') {
    return (
      <div className="w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 p-6 overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <Paintbrush className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-gray-200">Configurações do Pincel</h2>
        </div>

        <div className="space-y-6">
          {/* Color picker */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Cor</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="w-16 h-10 bg-gray-900/50 border border-gray-700/50 rounded-lg cursor-pointer"
              />
              <input
                type="text"
                value={currentColor}
                onChange={(e) => setCurrentColor(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          {/* Brush size */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Tamanho: {brushSettings.size}px
            </label>
            <input
              type="range"
              min="1"
              max="200"
              value={brushSettings.size}
              onChange={(e) => updateBrushSettings({ size: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Opacity */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Opacidade: {brushSettings.opacity}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSettings.opacity}
              onChange={(e) => updateBrushSettings({ opacity: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Flow */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Fluxo: {brushSettings.flow}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSettings.flow}
              onChange={(e) => updateBrushSettings({ flow: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Hardness */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Dureza: {brushSettings.hardness}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={brushSettings.hardness}
              onChange={(e) => updateBrushSettings({ hardness: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Spacing */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Espaçamento: {brushSettings.spacing}%
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={brushSettings.spacing}
              onChange={(e) => updateBrushSettings({ spacing: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Jitter */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Jitter: {brushSettings.jitter}
            </label>
            <input
              type="range"
              min="0"
              max="50"
              value={brushSettings.jitter}
              onChange={(e) => updateBrushSettings({ jitter: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Scatter */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Dispersão: {brushSettings.scatter}
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={brushSettings.scatter}
              onChange={(e) => updateBrushSettings({ scatter: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Pressure sensitivity */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={brushSettings.pressureSensitivity}
                onChange={(e) => updateBrushSettings({ pressureSensitivity: e.target.checked })}
                className="w-4 h-4 accent-blue-500"
              />
              <span className="text-xs text-gray-400">Sensibilidade à Pressão</span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Thumbnail mode: Show element/filter properties
  if (!selectedLayer && currentTool !== 'filter') {
    return (
      <div className="w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 p-6">
        <div className="text-center text-gray-500 mt-20">
          <Sliders className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">Selecione um elemento para editar suas propriedades</p>
        </div>
      </div>
    );
  }

  const element = selectedLayer?.element;

  return (
    <div className="w-80 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 p-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-200 mb-6">Propriedades</h2>

      {/* Filter controls */}
      {currentTool === 'filter' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300">Ajustes de Cor</h3>
            <button
              onClick={resetFilters}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors group"
              title="Resetar filtros"
            >
              <RotateCcw className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
            </button>
          </div>

          {/* Brightness */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Brilho: {filters.brightness}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.brightness}
              onChange={(e) => updateFilters({ brightness: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Contrast */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Contraste: {filters.contrast}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.contrast}
              onChange={(e) => updateFilters({ contrast: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Saturation */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Saturação: {filters.saturation}%
            </label>
            <input
              type="range"
              min="0"
              max="200"
              value={filters.saturation}
              onChange={(e) => updateFilters({ saturation: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Hue */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Matiz: {filters.hue}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={filters.hue}
              onChange={(e) => updateFilters({ hue: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          {/* Blur */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Desfoque: {filters.blur}px
            </label>
            <input
              type="range"
              min="0"
              max="20"
              value={filters.blur}
              onChange={(e) => updateFilters({ blur: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Text properties */}
      {element?.type === 'text' && (
        <div className="space-y-6">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Texto</label>
            <textarea
              value={element.content}
              onChange={(e) => updateElement(element.id, { content: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-blue-500/50 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Tamanho da Fonte: {element.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="200"
              value={element.fontSize}
              onChange={(e) => updateElement(element.id, { fontSize: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Fonte</label>
            <select
              value={element.fontFamily}
              onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Georgia">Georgia</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Peso da Fonte</label>
            <select
              value={element.fontWeight}
              onChange={(e) => updateElement(element.id, { fontWeight: e.target.value as any })}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-gray-200 text-sm focus:outline-none focus:border-blue-500/50"
            >
              <option value="normal">Normal</option>
              <option value="600">Semi-Bold</option>
              <option value="bold">Bold</option>
              <option value="800">Extra Bold</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Cor do Texto</label>
            <input
              type="color"
              value={element.color}
              onChange={(e) => updateElement(element.id, { color: e.target.value })}
              className="w-full h-10 bg-gray-900/50 border border-gray-700/50 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Alinhamento</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateElement(element.id, { textAlign: align })}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs transition-all ${
                    element.textAlign === align
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {align === 'left' ? 'Esquerda' : align === 'center' ? 'Centro' : 'Direita'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shape properties */}
      {element?.type === 'shape' && (
        <div className="space-y-6">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Cor de Preenchimento</label>
            <input
              type="color"
              value={element.fill}
              onChange={(e) => updateElement(element.id, { fill: e.target.value })}
              className="w-full h-10 bg-gray-900/50 border border-gray-700/50 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Largura: {element.width}px
            </label>
            <input
              type="range"
              min="50"
              max="800"
              value={element.width}
              onChange={(e) => updateElement(element.id, { width: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Altura: {element.height}px
            </label>
            <input
              type="range"
              min="50"
              max="800"
              value={element.height}
              onChange={(e) => updateElement(element.id, { height: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* Common properties */}
      {element && (
        <div className="space-y-6 mt-6 pt-6 border-t border-gray-800/50">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Opacidade: {Math.round(element.opacity * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={element.opacity * 100}
              onChange={(e) => updateElement(element.id, { opacity: Number(e.target.value) / 100 })}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Rotação: {element.rotation}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              value={element.rotation}
              onChange={(e) => updateElement(element.id, { rotation: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
