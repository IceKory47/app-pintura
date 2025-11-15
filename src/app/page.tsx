'use client';

import { Toolbar } from '@/components/custom/Toolbar';
import { Canvas } from '@/components/custom/Canvas';
import { LayersPanel } from '@/components/custom/LayersPanel';
import { PropertiesPanel } from '@/components/custom/PropertiesPanel';
import { TemplatesPanel } from '@/components/custom/TemplatesPanel';
import { ImageLibrary } from '@/components/custom/ImageLibrary';
import { Sparkles, Paintbrush, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

type EditorMode = 'paint' | 'thumbnail';

export default function HybridEditor() {
  const [mode, setMode] = useState<EditorMode>('paint');
  const [showTemplates, setShowTemplates] = useState(true);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#1a1a1a] overflow-hidden">
      {/* Top header */}
      <header className="h-16 bg-gradient-to-r from-[#1a1a1a] to-[#252525] border-b border-gray-800/50 backdrop-blur-xl flex items-center justify-between px-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sparkles className="w-7 h-7 text-blue-500" />
              <div className="absolute inset-0 blur-xl bg-blue-500/30"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                ArtStudio Pro
              </h1>
              <p className="text-xs text-gray-500">Editor Profissional Completo</p>
            </div>
          </div>
        </div>
        
        {/* Mode switcher */}
        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg">
          <button
            onClick={() => setMode('paint')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
              mode === 'paint'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Paintbrush className="w-4 h-4" />
            <span className="text-sm font-medium">Pintura Digital</span>
          </button>
          <button
            onClick={() => setMode('thumbnail')}
            className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
              mode === 'thumbnail'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Editor de Thumbnails</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          {mode === 'thumbnail' && (
            <>
              <button 
                onClick={() => setShowTemplates(!showTemplates)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm rounded-lg transition-all shadow-lg hover:shadow-purple-500/50"
              >
                {showTemplates ? 'Ocultar' : 'Mostrar'} Templates
              </button>
              <button 
                onClick={() => setShowImageLibrary(!showImageLibrary)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm rounded-lg transition-all shadow-lg hover:shadow-blue-500/50"
              >
                {showImageLibrary ? 'Fechar' : 'Banco de'} Imagens
              </button>
            </>
          )}
          <button className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm rounded-lg transition-all shadow-lg hover:shadow-green-500/50 font-semibold">
            Exportar
          </button>
        </div>
      </header>
      
      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Templates panel (only in thumbnail mode) */}
        {mode === 'thumbnail' && showTemplates && <TemplatesPanel />}
        
        {/* Left toolbar */}
        <Toolbar mode={mode} />
        
        {/* Center canvas */}
        <div className="flex-1 relative">
          <Canvas mode={mode} />
          {mode === 'thumbnail' && showImageLibrary && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
              <ImageLibrary onClose={() => setShowImageLibrary(false)} />
            </div>
          )}
        </div>
        
        {/* Right panels */}
        <div className="flex">
          <PropertiesPanel mode={mode} />
          <LayersPanel mode={mode} />
        </div>
      </div>
      
      {/* Quick tips */}
      <div className="absolute bottom-6 left-6 bg-gradient-to-br from-[#1a1a1a]/95 to-[#252525]/95 backdrop-blur-xl border border-gray-800/50 rounded-xl px-4 py-3 max-w-sm shadow-2xl">
        <div className="text-xs text-gray-400 space-y-1.5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-gray-300 font-semibold">
              {mode === 'paint' ? 'Atalhos de Pintura' : 'Atalhos de Thumbnails'}
            </span>
          </div>
          {mode === 'paint' ? (
            <>
              <div className="flex justify-between gap-6">
                <span>Pincel:</span>
                <span className="text-gray-300 font-mono">B</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Borracha:</span>
                <span className="text-gray-300 font-mono">E</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Pan:</span>
                <span className="text-gray-300 font-mono">Espaço</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Zoom:</span>
                <span className="text-gray-300 font-mono">Scroll</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between gap-6">
                <span>Texto:</span>
                <span className="text-gray-300 font-mono">T</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Imagem:</span>
                <span className="text-gray-300 font-mono">I</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Forma:</span>
                <span className="text-gray-300 font-mono">S</span>
              </div>
              <div className="flex justify-between gap-6">
                <span>Zoom:</span>
                <span className="text-gray-300 font-mono">Scroll</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
