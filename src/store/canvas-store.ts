import { create } from 'zustand';
import type { Tool, Platform, Layer, CanvasElement, ColorFilter, TextElement, ImageElement, ShapeElement, BrushSettings } from '@/lib/types';

interface EditorStore {
  // Canvas state
  platform: Platform;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  
  // Tool state
  currentTool: Tool;
  
  // Elements & Layers
  layers: Layer[];
  selectedLayerId: string | null;
  currentLayer: string;
  
  // Filters
  filters: ColorFilter;
  
  // Paint mode - Brush settings
  brushSettings: BrushSettings;
  currentColor: string;
  
  // History
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  setPlatform: (platform: Platform) => void;
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  
  // Layer actions
  addTextLayer: (text: string) => void;
  addImageLayer: (src: string) => void;
  addShapeLayer: (shape: 'rectangle' | 'circle' | 'triangle') => void;
  removeLayer: (id: string) => void;
  setSelectedLayer: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  duplicateLayer: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  
  // Filter actions
  updateFilters: (filters: Partial<ColorFilter>) => void;
  resetFilters: () => void;
  
  // Brush actions
  updateBrushSettings: (settings: Partial<BrushSettings>) => void;
  setCurrentColor: (color: string) => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
}

const platformDimensions: Record<Platform, { width: number; height: number }> = {
  'youtube': { width: 1280, height: 720 },
  'tiktok': { width: 1080, height: 1920 },
  'instagram-post': { width: 1080, height: 1080 },
  'instagram-story': { width: 1080, height: 1920 },
  'youtube-shorts': { width: 1080, height: 1920 },
};

const defaultFilters: ColorFilter = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  blur: 0,
};

const defaultBrushSettings: BrushSettings = {
  size: 10,
  opacity: 100,
  flow: 100,
  hardness: 50,
  spacing: 10,
  jitter: 0,
  scatter: 0,
  pressureSensitivity: true,
};

export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  platform: 'youtube',
  canvasWidth: 1280,
  canvasHeight: 720,
  zoom: 1,
  
  currentTool: 'brush',
  
  layers: [],
  selectedLayerId: null,
  currentLayer: 'layer-1',
  
  filters: defaultFilters,
  
  brushSettings: defaultBrushSettings,
  currentColor: '#000000',
  
  canUndo: false,
  canRedo: false,
  
  // Actions
  setPlatform: (platform) => {
    const dimensions = platformDimensions[platform];
    set({
      platform,
      canvasWidth: dimensions.width,
      canvasHeight: dimensions.height,
      layers: [], // Clear layers when changing platform
      selectedLayerId: null,
    });
  },
  
  setTool: (tool) => set({ currentTool: tool }),
  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(3, zoom)) }),
  
  // Layer actions
  addTextLayer: (text) => {
    const id = `text-${Date.now()}`;
    const element: TextElement = {
      id,
      type: 'text',
      content: text,
      x: get().canvasWidth / 2 - 100,
      y: get().canvasHeight / 2 - 25,
      fontSize: 48,
      fontFamily: 'Inter',
      color: '#FFFFFF',
      fontWeight: 'bold',
      textAlign: 'center',
      rotation: 0,
      opacity: 1,
    };
    
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id,
          name: `Text ${state.layers.filter(l => l.element.type === 'text').length + 1}`,
          visible: true,
          locked: false,
          element,
        },
      ],
      selectedLayerId: id,
    }));
  },
  
  addImageLayer: (src) => {
    const id = `image-${Date.now()}`;
    const element: ImageElement = {
      id,
      type: 'image',
      src,
      x: get().canvasWidth / 2 - 200,
      y: get().canvasHeight / 2 - 200,
      width: 400,
      height: 400,
      rotation: 0,
      opacity: 1,
    };
    
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id,
          name: `Image ${state.layers.filter(l => l.element.type === 'image').length + 1}`,
          visible: true,
          locked: false,
          element,
        },
      ],
      selectedLayerId: id,
    }));
  },
  
  addShapeLayer: (shape) => {
    const id = `shape-${Date.now()}`;
    const element: ShapeElement = {
      id,
      type: 'shape',
      shape,
      x: get().canvasWidth / 2 - 100,
      y: get().canvasHeight / 2 - 100,
      width: 200,
      height: 200,
      fill: '#3B82F6',
      rotation: 0,
      opacity: 1,
    };
    
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id,
          name: `${shape.charAt(0).toUpperCase() + shape.slice(1)} ${state.layers.filter(l => l.element.type === 'shape').length + 1}`,
          visible: true,
          locked: false,
          element,
        },
      ],
      selectedLayerId: id,
    }));
  },
  
  removeLayer: (id) =>
    set((state) => ({
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    })),
  
  setSelectedLayer: (id) => set({ selectedLayerId: id }),
  
  updateElement: (id, updates) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id
          ? { ...layer, element: { ...layer.element, ...updates } }
          : layer
      ),
    })),
  
  duplicateLayer: (id) =>
    set((state) => {
      const layer = state.layers.find((l) => l.id === id);
      if (!layer) return state;
      
      const newId = `${layer.element.type}-${Date.now()}`;
      const newElement = {
        ...layer.element,
        id: newId,
        x: layer.element.x + 20,
        y: layer.element.y + 20,
      };
      
      return {
        layers: [
          ...state.layers,
          {
            ...layer,
            id: newId,
            name: `${layer.name} copy`,
            element: newElement,
          },
        ],
        selectedLayerId: newId,
      };
    }),
  
  moveLayerUp: (id) =>
    set((state) => {
      const index = state.layers.findIndex((l) => l.id === id);
      if (index === state.layers.length - 1) return state;
      
      const newLayers = [...state.layers];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      
      return { layers: newLayers };
    }),
  
  moveLayerDown: (id) =>
    set((state) => {
      const index = state.layers.findIndex((l) => l.id === id);
      if (index === 0) return state;
      
      const newLayers = [...state.layers];
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
      
      return { layers: newLayers };
    }),
  
  // Filter actions
  updateFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  
  resetFilters: () => set({ filters: defaultFilters }),
  
  // Brush actions
  updateBrushSettings: (settings) =>
    set((state) => ({
      brushSettings: { ...state.brushSettings, ...settings },
    })),
  
  setCurrentColor: (color) => set({ currentColor: color }),
  
  // History actions
  undo: () => {
    console.log('Undo');
  },
  redo: () => {
    console.log('Redo');
  },
}));
