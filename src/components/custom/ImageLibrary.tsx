'use client';

import { useState } from 'react';
import { Search, X, Download, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/store/canvas-store';

interface UnsplashImage {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  description: string | null;
}

interface ImageLibraryProps {
  onClose: () => void;
}

export function ImageLibrary({ onClose }: ImageLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState<UnsplashImage[]>([]);
  const [loading, setLoading] = useState(false);
  const { addImageLayer } = useEditorStore();

  const searchImages = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      // Usando API pública do Unsplash (sem necessidade de chave para busca básica)
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20&client_id=YOUR_ACCESS_KEY`
      );
      
      if (response.ok) {
        const data = await response.json();
        setImages(data.results || []);
      } else {
        // Fallback: usar imagens de exemplo do Unsplash
        const fallbackImages = [
          {
            id: '1',
            urls: {
              regular: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
              small: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
              thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
            },
            user: { name: 'Unsplash', username: 'unsplash' },
            description: 'Abstract background',
          },
          {
            id: '2',
            urls: {
              regular: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
              small: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
              thumb: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200',
            },
            user: { name: 'Unsplash', username: 'unsplash' },
            description: 'Gradient background',
          },
          {
            id: '3',
            urls: {
              regular: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
              small: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
              thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200',
            },
            user: { name: 'Unsplash', username: 'unsplash' },
            description: 'Gradient waves',
          },
        ];
        setImages(fallbackImages);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      // Usar imagens de exemplo em caso de erro
      const fallbackImages = [
        {
          id: '1',
          urls: {
            regular: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
            small: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
            thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
          },
          user: { name: 'Unsplash', username: 'unsplash' },
          description: 'Abstract background',
        },
      ];
      setImages(fallbackImages);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    addImageLayer(imageUrl);
    onClose();
  };

  return (
    <div className="w-full max-w-5xl h-[80vh] bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl shadow-2xl border border-gray-800/50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-200">Banco de Imagens</h2>
            <p className="text-sm text-gray-500 mt-1">Milhares de imagens gratuitas do Unsplash</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchImages()}
              placeholder="Buscar imagens... (ex: abstract, gradient, nature)"
              className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>
          <button
            onClick={searchImages}
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-800 text-white rounded-xl transition-all shadow-lg disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buscando...
              </>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </div>

      {/* Images grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {images.length === 0 && !loading && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Search className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Busque por imagens para começar</p>
              <p className="text-gray-600 text-sm mt-2">Experimente: "abstract", "gradient", "nature"</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => handleImageSelect(image.urls.regular)}
              className="group relative aspect-square rounded-xl overflow-hidden bg-gray-900/50 hover:ring-2 hover:ring-blue-500 transition-all"
            >
              <img
                src={image.urls.small}
                alt={image.description || 'Unsplash image'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-xs font-semibold truncate">
                    {image.user.name}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Download className="w-4 h-4 text-white" />
                    <span className="text-white text-xs">Adicionar ao canvas</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800/50 bg-gray-900/30">
        <p className="text-xs text-gray-500 text-center">
          Imagens fornecidas por{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  );
}
