// Core types for thumbnail editor

export type Tool = 
  | 'select'
  | 'text' 
  | 'image'
  | 'shape'
  | 'crop'
  | 'filter';

export type Platform = 
  | 'youtube'
  | 'tiktok'
  | 'instagram-post'
  | 'instagram-story'
  | 'youtube-shorts';

export interface PlatformTemplate {
  id: Platform;
  name: string;
  width: number;
  height: number;
  description: string;
  icon: string;
}

export interface TextElement {
  id: string;
  type: 'text';
  content: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  fontWeight: 'normal' | 'bold' | '600' | '700' | '800';
  textAlign: 'left' | 'center' | 'right';
  rotation: number;
  opacity: number;
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
}

export interface ShapeElement {
  id: string;
  type: 'shape';
  shape: 'rectangle' | 'circle' | 'triangle';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  rotation: number;
  opacity: number;
}

export type CanvasElement = TextElement | ImageElement | ShapeElement;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  element: CanvasElement;
}

export interface ColorFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  blur: number;
}

export interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
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
