import * as PIXI from 'pixi.js';
import type { BrushSettings } from './types';

export class BrushEngine {
  private graphics: PIXI.Graphics;
  private isDrawing = false;
  private lastPoint: { x: number; y: number } | null = null;
  private points: Array<{ x: number; y: number; pressure: number }> = [];
  private strokeGraphics: PIXI.Graphics; // Separate graphics for current stroke
  
  constructor() {
    this.graphics = new PIXI.Graphics();
    this.strokeGraphics = new PIXI.Graphics();
  }
  
  startStroke(x: number, y: number, pressure: number = 1) {
    this.isDrawing = true;
    this.lastPoint = { x, y };
    this.points = [{ x, y, pressure }];
    this.strokeGraphics.clear();
  }
  
  continueStroke(
    x: number,
    y: number,
    pressure: number = 1,
    settings: BrushSettings,
    color: string
  ) {
    if (!this.isDrawing || !this.lastPoint) return;
    
    // Apply pressure sensitivity
    const effectivePressure = settings.pressureSensitivity ? pressure : 1;
    const size = settings.size * effectivePressure;
    const opacity = (settings.opacity / 100) * (settings.flow / 100);
    
    // Convert hex color to number
    const colorNum = parseInt(color.replace('#', ''), 16);
    
    // Only draw interpolated points between last and current
    const dx = x - this.lastPoint.x;
    const dy = y - this.lastPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Optimize: only draw if movement is significant
    if (distance < 1) return;
    
    // Reduce steps for better performance
    const steps = Math.max(1, Math.floor(distance / Math.max(5, settings.spacing / 5)));
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = this.lastPoint.x + dx * t;
      const py = this.lastPoint.y + dy * t;
      
      // Apply jitter (reduced for performance)
      const jitterX = (Math.random() - 0.5) * settings.jitter * 0.5;
      const jitterY = (Math.random() - 0.5) * settings.jitter * 0.5;
      
      this.strokeGraphics.circle(px + jitterX, py + jitterY, size / 2);
      this.strokeGraphics.fill({ color: colorNum, alpha: opacity });
    }
    
    this.lastPoint = { x, y };
  }
  
  endStroke() {
    this.isDrawing = false;
    this.lastPoint = null;
    this.points = [];
  }
  
  renderToTexture(
    renderer: PIXI.Renderer,
    texture: PIXI.RenderTexture,
    offsetX: number = 0,
    offsetY: number = 0
  ) {
    const tempContainer = new PIXI.Container();
    this.strokeGraphics.x = offsetX;
    this.strokeGraphics.y = offsetY;
    tempContainer.addChild(this.strokeGraphics);
    
    renderer.render({
      container: tempContainer,
      target: texture,
      clear: false,
    });
    
    tempContainer.removeChild(this.strokeGraphics);
    tempContainer.destroy();
  }
  
  clear() {
    this.graphics.clear();
    this.strokeGraphics.clear();
  }
  
  getGraphics() {
    return this.strokeGraphics;
  }
  
  destroy() {
    this.graphics.destroy();
    this.strokeGraphics.destroy();
  }
}
