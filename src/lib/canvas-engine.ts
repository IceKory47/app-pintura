import * as PIXI from 'pixi.js';

export class CanvasEngine {
  private app: PIXI.Application | null = null;
  private container: PIXI.Container | null = null;
  private layerTextures: Map<string, PIXI.RenderTexture> = new Map();
  private layerSprites: Map<string, PIXI.Sprite> = new Map();
  
  async initialize(canvas: HTMLCanvasElement, width: number, height: number) {
    this.app = new PIXI.Application();
    
    await this.app.init({
      canvas,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x2a2a2a,
      antialias: false, // Disable for better performance
      resolution: Math.min(window.devicePixelRatio || 1, 2), // Cap at 2x for performance
      autoDensity: true,
      preference: 'webgl', // Force WebGL
      powerPreference: 'high-performance', // Request high-performance GPU
    });
    
    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    
    // Center the container
    this.container.x = this.app.screen.width / 2;
    this.container.y = this.app.screen.height / 2;
    
    // Optimize rendering
    this.app.stage.eventMode = 'static';
    this.container.eventMode = 'static';
    
    return this.app;
  }
  
  createLayer(id: string, width: number, height: number) {
    if (!this.app) return;
    
    const texture = PIXI.RenderTexture.create({ 
      width, 
      height,
      resolution: 1, // Use 1x resolution for layers to save memory
    });
    const sprite = new PIXI.Sprite(texture);
    
    sprite.anchor.set(0.5);
    sprite.x = 0;
    sprite.y = 0;
    sprite.eventMode = 'none'; // Disable events on sprites for performance
    
    this.layerTextures.set(id, texture);
    this.layerSprites.set(id, sprite);
    this.container?.addChild(sprite);
    
    return { texture, sprite };
  }
  
  removeLayer(id: string) {
    const sprite = this.layerSprites.get(id);
    const texture = this.layerTextures.get(id);
    
    if (sprite) {
      this.container?.removeChild(sprite);
      sprite.destroy();
    }
    
    if (texture) {
      texture.destroy(true);
    }
    
    this.layerTextures.delete(id);
    this.layerSprites.delete(id);
  }
  
  getLayerTexture(id: string) {
    return this.layerTextures.get(id);
  }
  
  getLayerSprite(id: string) {
    return this.layerSprites.get(id);
  }
  
  setLayerOpacity(id: string, opacity: number) {
    const sprite = this.layerSprites.get(id);
    if (sprite) {
      sprite.alpha = opacity / 100;
    }
  }
  
  setLayerVisibility(id: string, visible: boolean) {
    const sprite = this.layerSprites.get(id);
    if (sprite) {
      sprite.visible = visible;
    }
  }
  
  setZoom(zoom: number) {
    if (this.container) {
      this.container.scale.set(zoom);
    }
  }
  
  setPan(x: number, y: number) {
    if (this.container) {
      this.container.x = x;
      this.container.y = y;
    }
  }
  
  resize(width: number, height: number) {
    if (this.app) {
      this.app.renderer.resize(width, height);
      if (this.container) {
        this.container.x = width / 2;
        this.container.y = height / 2;
      }
    }
  }
  
  clear() {
    this.layerTextures.forEach((texture) => texture.destroy(true));
    this.layerSprites.forEach((sprite) => sprite.destroy());
    this.layerTextures.clear();
    this.layerSprites.clear();
  }
  
  destroy() {
    this.clear();
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true });
      this.app = null;
    }
  }
  
  getApp() {
    return this.app;
  }
}
