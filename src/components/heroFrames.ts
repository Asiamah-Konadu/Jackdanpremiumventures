export const HERO_FRAME_COUNT = 180;

const frameUrl = (index: number) => `/hero-frames/ezgif-frame-${String(index).padStart(3, '0')}.jpg`;
let cachedFrames: HTMLImageElement[] | null = null;

/** Share decoded frame images between the hero canvas and homepage WebGL scene. */
export function getHeroFrameImages() {
  if (!cachedFrames) {
    cachedFrames = Array.from({ length: HERO_FRAME_COUNT }, (_, index) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = frameUrl(index + 1);
      return image;
    });
  }
  return cachedFrames;
}
