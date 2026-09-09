import type { ComponentData } from '../physics/CircuitSolver';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private electronOffset = 0;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public drawGrid(width: number, height: number, gridSize = 20) {
    const { ctx } = this;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  public render(
    width: number,
    height: number,
    components: ComponentData[],
    selectedId: string | null = null
  ) {
    const { ctx } = this;
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Grid
    this.drawGrid(width, height);

    // 2. Draw components
    components.forEach(comp => {
      const isSelected = comp.id === selectedId;
      this.drawComponent(comp, isSelected);
    });

    // 3. Update electron flow animation offset
    this.electronOffset = (this.electronOffset + 0.5) % 20;
  }

  private drawComponent(comp: ComponentData, isSelected: boolean) {
    const { ctx } = this;
    const { posA, posB, type, value, current = 0, brightness = 0, isOpen = false } = comp;

    ctx.save();

    // Line base style
    ctx.lineWidth = isSelected ? 4 : 3;
    ctx.strokeStyle = isSelected ? '#2563eb' : '#334155';

    // Draw connection wire
    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
    ctx.stroke();

    const midX = (posA.x + posB.x) / 2;
    const midY = (posA.y + posB.y) / 2;

    // Draw component specific graphics at midpoint
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = isSelected ? '#2563eb' : '#0f172a';
    ctx.lineWidth = 2;

    if (type === 'battery') {
      // Battery symbol
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(midX - 25, midY - 15, 50, 30);
      ctx.strokeRect(midX - 25, midY - 15, 50, 30);

      ctx.fillStyle = '#dc2626'; // Positive +
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+ ${value}V`, midX, midY + 4);
    } else if (type === 'resistor') {
      // Resistor EU box
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(midX - 30, midY - 12, 60, 24);
      ctx.strokeRect(midX - 30, midY - 12, 60, 24);

      ctx.fillStyle = '#1e293b';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${value} Ω`, midX, midY + 4);
    } else if (type === 'bulb') {
      // Light Bulb circle & glow aura
      if (brightness > 0.05) {
        const radius = 20 + brightness * 25;
        const gradient = ctx.createRadialGradient(midX, midY, 5, midX, midY, radius);
        gradient.addColorStop(0, `rgba(253, 224, 71, ${0.8 * brightness})`);
        gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(midX, midY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = brightness > 0.1 ? '#fef08a' : '#ffffff';
      ctx.beginPath();
      ctx.arc(midX, midY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Filament 'X'
      ctx.beginPath();
      ctx.moveTo(midX - 8, midY - 8);
      ctx.lineTo(midX + 8, midY + 8);
      ctx.moveTo(midX + 8, midY - 8);
      ctx.lineTo(midX - 8, midY + 8);
      ctx.stroke();
    } else if (type === 'switch') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(midX - 20, midY - 10, 40, 20);
      ctx.strokeRect(midX - 20, midY - 10, 40, 20);

      ctx.beginPath();
      ctx.arc(midX - 10, midY, 3, 0, Math.PI * 2);
      ctx.arc(midX + 10, midY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Switch lever
      ctx.beginPath();
      ctx.moveTo(midX - 10, midY);
      if (isOpen) {
        ctx.lineTo(midX + 6, midY - 14); // Open
      } else {
        ctx.lineTo(midX + 10, midY); // Closed
      }
      ctx.stroke();
    } else if (type === 'ammeter') {
      ctx.fillStyle = '#e0f2fe';
      ctx.beginPath();
      ctx.arc(midX, midY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs(current).toFixed(2)} A`, midX, midY + 4);
    } else if (type === 'voltmeter') {
      ctx.fillStyle = '#fef3c7';
      ctx.beginPath();
      ctx.arc(midX, midY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs(comp.voltageDrop ?? 0).toFixed(2)} V`, midX, midY + 4);
    }

    // Draw Terminal Nodes (A and B)
    ctx.fillStyle = isSelected ? '#2563eb' : '#64748b';
    ctx.beginPath();
    ctx.arc(posA.x, posA.y, 5, 0, Math.PI * 2);
    ctx.arc(posB.x, posB.y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Electron Flow Dots Animation along wire
    if (Math.abs(current) > 0.001) {
      this.drawElectrons(posA, posB, current);
    }

    ctx.restore();
  }

  private drawElectrons(
    posA: { x: number; y: number },
    posB: { x: number; y: number },
    current: number
  ) {
    const { ctx } = this;
    const dx = posB.x - posA.x;
    const dy = posB.y - posA.y;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) return;

    const numElectrons = Math.floor(distance / 15);
    const speed = Math.sign(current); // Direction of electron movement

    ctx.fillStyle = '#38bdf8'; // Glowing cyan electron

    for (let i = 0; i < numElectrons; i++) {
      let progress = (i / numElectrons + (this.electronOffset * speed) / 20) % 1;
      if (progress < 0) progress += 1;

      const x = posA.x + dx * progress;
      const y = posA.y + dy * progress;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
