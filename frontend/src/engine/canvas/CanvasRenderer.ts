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

    // Line base style (Realistic copper wire look)
    ctx.lineWidth = isSelected ? 4 : 3;
    ctx.strokeStyle = isSelected ? '#2563eb' : '#3b82f6';

    // Draw connection wire with drop shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(posA.x, posA.y);
    ctx.lineTo(posB.x, posB.y);
    ctx.stroke();

    ctx.shadowColor = 'transparent'; // Reset shadow for internal apparatus

    const midX = (posA.x + posB.x) / 2;
    const midY = (posA.y + posB.y) / 2;

    if (type === 'battery') {
      // Metallic Battery Casing with Gradients
      const batGrad = ctx.createLinearGradient(midX - 25, midY - 15, midX - 25, midY + 15);
      batGrad.addColorStop(0, '#334155');
      batGrad.addColorStop(0.5, '#475569');
      batGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = batGrad;
      ctx.fillRect(midX - 25, midY - 15, 50, 30);
      ctx.strokeStyle = isSelected ? '#2563eb' : '#0f172a';
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.strokeRect(midX - 25, midY - 15, 50, 30);

      // Brass Terminal Caps
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(midX + 25, midY - 6, 4, 12);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(midX - 29, midY - 6, 4, 12);

      // Metallic Spec Sheet Label
      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+ ${value}V`, midX, midY + 4);
    } else if (type === 'resistor') {
      // Realistic Ceramic Resistor Body with Bands
      const resGrad = ctx.createLinearGradient(midX - 30, midY - 12, midX - 30, midY + 12);
      resGrad.addColorStop(0, '#f8fafc');
      resGrad.addColorStop(0.5, '#e2e8f0');
      resGrad.addColorStop(1, '#cbd5e1');

      ctx.fillStyle = resGrad;
      ctx.fillRect(midX - 30, midY - 12, 60, 24);
      ctx.strokeStyle = isSelected ? '#2563eb' : '#475569';
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.strokeRect(midX - 30, midY - 12, 60, 24);

      // Color Code Bands
      ctx.fillStyle = '#b91c1c'; ctx.fillRect(midX - 20, midY - 12, 5, 24);
      ctx.fillStyle = '#15803d'; ctx.fillRect(midX - 10, midY - 12, 5, 24);
      ctx.fillStyle = '#b45309'; ctx.fillRect(midX + 0, midY - 12, 5, 24);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${value} Ω`, midX + 16, midY + 4);
    } else if (type === 'bulb') {
      // Incandescent Glass Bulb with Realistic Filament Glow
      if (brightness > 0.05) {
        const radius = 22 + brightness * 28;
        const glowGrad = ctx.createRadialGradient(midX, midY, 4, midX, midY, radius);
        glowGrad.addColorStop(0, `rgba(251, 191, 36, ${0.95 * brightness})`);
        glowGrad.addColorStop(0.5, `rgba(245, 158, 11, ${0.5 * brightness})`);
        glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(midX, midY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glass Bulb Sphere with Reflection Sheen
      const bulbGrad = ctx.createRadialGradient(midX - 5, midY - 5, 2, midX, midY, 18);
      bulbGrad.addColorStop(0, '#ffffff');
      bulbGrad.addColorStop(0.7, brightness > 0.1 ? '#fef08a' : '#e2e8f0');
      bulbGrad.addColorStop(1, brightness > 0.1 ? '#fde047' : '#94a3b8');

      ctx.fillStyle = bulbGrad;
      ctx.beginPath();
      ctx.arc(midX, midY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#2563eb' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glass Reflection Specular Sheen Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(midX - 5, midY - 5, 10, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();

      // Tungsten Filament Wire Loop
      ctx.strokeStyle = brightness > 0.1 ? '#ea580c' : '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(midX - 6, midY + 6);
      ctx.lineTo(midX - 2, midY - 4);
      ctx.lineTo(midX + 2, midY - 4);
      ctx.lineTo(midX + 6, midY + 6);
      ctx.stroke();
    } else if (type === 'switch') {
      // 3D Switch Base Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(midX - 22, midY - 11, 44, 22);
      ctx.strokeStyle = isSelected ? '#2563eb' : '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(midX - 22, midY - 11, 44, 22);

      // Terminal Brass Contacts
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(midX - 12, midY, 4, 0, Math.PI * 2);
      ctx.arc(midX + 12, midY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Metallic Knife Switch Lever
      ctx.strokeStyle = isOpen ? '#dc2626' : '#16a34a';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(midX - 12, midY);
      if (isOpen) {
        ctx.lineTo(midX + 4, midY - 16);
      } else {
        ctx.lineTo(midX + 12, midY);
      }
      ctx.stroke();
    } else if (type === 'ammeter') {
      // Precision Round Ammeter Meter Base
      const meterGrad = ctx.createRadialGradient(midX - 4, midY - 4, 3, midX, midY, 22);
      meterGrad.addColorStop(0, '#ffffff');
      meterGrad.addColorStop(0.8, '#f0f9ff');
      meterGrad.addColorStop(1, '#bae6fd');

      ctx.fillStyle = meterGrad;
      ctx.beginPath();
      ctx.arc(midX, midY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#2563eb' : '#0284c7';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glass Cover Sheen
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(midX - 6, midY - 6, 12, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();

      ctx.fillStyle = '#0369a1';
      ctx.font = 'extrabold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs(current).toFixed(2)} A`, midX, midY + 4);
    } else if (type === 'voltmeter') {
      // Precision Round Voltmeter Meter Base
      const vGrad = ctx.createRadialGradient(midX - 4, midY - 4, 3, midX, midY, 22);
      vGrad.addColorStop(0, '#ffffff');
      vGrad.addColorStop(0.8, '#fffbeb');
      vGrad.addColorStop(1, '#fde68a');

      ctx.fillStyle = vGrad;
      ctx.beginPath();
      ctx.arc(midX, midY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#2563eb' : '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Glass Cover Sheen
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(midX - 6, midY - 6, 12, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();

      ctx.fillStyle = '#b45309';
      ctx.font = 'extrabold 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${Math.abs(comp.voltageDrop ?? 0).toFixed(2)} V`, midX, midY + 4);
    }

    // Draw Brass Terminal Screws (Nodes A and B)
    ctx.fillStyle = isSelected ? '#2563eb' : '#475569';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.arc(posA.x, posA.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(posB.x, posB.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

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
