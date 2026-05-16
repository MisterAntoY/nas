export interface LoadedImage {
  img: HTMLImageElement;
  url: string;
}

export function loadImageFromFile(file: File): Promise<LoadedImage> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

export function revokeObjectUrl(url: string): void {
  try {
    URL.revokeObjectURL(url);
  } catch {
    // ignorar — URL pode já ter sido revogada
  }
}
