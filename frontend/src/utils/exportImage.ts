export function exportCanvasToPNG(canvas: HTMLCanvasElement, filename = 'edulab-physics-circuit.png') {
  const imageURI = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = imageURI;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
