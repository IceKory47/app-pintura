'use client';

import { useEditorStore } from '@/store/canvas-store';
import { Youtube, Video, Instagram, Image as ImageIcon } from 'lucide-react';
import type { Platform } from '@/lib/types';

interface Template {
  id: Platform;
  name: string;
  width: number;
  height: number;
  description: string;
  icon: any;
  gradient: string;
}

const templates: Template[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    width: 1280,
    height: 720,
    description: '1280 × 720px',
    icon: Youtube,
    gradient: 'from-red-600 to-red-700',
  },
  {
    id: 'youtube-shorts',
    name: 'YouTube Shorts',
    width: 1080,
    height: 1920,
    description: '1080 × 1920px',
    icon: Video,
    gradient: 'from-red-500 to-pink-600',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    width: 1080,
    height: 1920,
    description: '1080 × 1920px',
    icon: Video,
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    width: 1080,
    height: 1080,
    description: '1080 × 1080px',
    icon: Instagram,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    width: 1080,
    height: 1920,
    description: '1080 × 1920px',
    icon: ImageIcon,
    gradient: 'from-orange-500 to-pink-600',
  },
];

export function TemplatesPanel() {
  const { platform, setPlatform } = useEditorStore();

  return (
    <div className="w-72 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-r border-gray-800/50 p-6 overflow-y-auto shadow-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-200 mb-2">Templates</h2>
        <p className="text-xs text-gray-500">Escolha o formato ideal para sua rede social</p>
      </div>

      <div className="space-y-3">
        {templates.map((template) => {
          const Icon = template.icon;
          const isActive = platform === template.id;

          return (
            <button
              key={template.id}
              onClick={() => setPlatform(template.id)}
              className={`w-full p-4 rounded-xl transition-all text-left group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r ' + template.gradient + ' shadow-lg'
                  : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:from-gray-800/70 hover:to-gray-900/70 border border-gray-700/50'
              }`}
            >
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-r ${template.gradient} blur-2xl opacity-30 -z-10`}></div>
              )}
              
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? 'bg-white/20' 
                    : 'bg-gray-700/50 group-hover:bg-gray-700'
                } transition-colors`}>
                  <Icon className={`w-5 h-5 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <h3 className={`font-semibold text-sm mb-1 ${
                    isActive ? 'text-white' : 'text-gray-300 group-hover:text-gray-200'
                  }`}>
                    {template.name}
                  </h3>
                  <p className={`text-xs ${
                    isActive ? 'text-white/80' : 'text-gray-500 group-hover:text-gray-400'
                  }`}>
                    {template.description}
                  </p>
                </div>

                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-white shadow-lg"></div>
                )}
              </div>

              {/* Aspect ratio preview */}
              <div className="mt-3 flex items-center justify-center">
                <div 
                  className={`border-2 ${
                    isActive ? 'border-white/40' : 'border-gray-600/40'
                  } rounded`}
                  style={{
                    width: template.width > template.height ? '60px' : '40px',
                    height: template.width > template.height ? '40px' : '60px',
                  }}
                ></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl">
        <p className="text-xs text-gray-400 leading-relaxed">
          💡 <span className="text-gray-300 font-semibold">Dica:</span> Cada template já vem com as dimensões ideais para cada plataforma.
        </p>
      </div>
    </div>
  );
}
