export class AssetManager {
  private static images: Map<string, HTMLImageElement> = new Map();

  public static async loadImages(sources: { [id: string]: string }): Promise<void> {
    const promises = Object.keys(sources).map((id) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = sources[id];
        img.onload = () => {
          this.images.set(id, img);
          resolve();
        };
        img.onerror = (e) => {
          console.error(`Failed to load image: ${sources[id]}`);
          reject(e);
        };
      });
    });
    await Promise.all(promises);
  }

  public static getImage(id: string): HTMLImageElement {
    const img = this.images.get(id);
    if (!img) {
      throw new Error(`Image with id ${id} not loaded!`);
    }
    return img;
  }
}
