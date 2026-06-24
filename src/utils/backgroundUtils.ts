import { GRADIENT_PRESETS, GradientPreset } from '../types';

export type BgInfo =
  | { type: 'none' }
  | { type: 'gradient'; preset: GradientPreset; dark: boolean }
  | { type: 'image'; uri: string; dark: true };

export function parseBg(coverImage?: string): BgInfo {
  if (!coverImage) return { type: 'none' };
  if (coverImage.startsWith('gradient:')) {
    const id = coverImage.slice(9);
    const preset = GRADIENT_PRESETS.find((g) => g.id === id);
    if (preset) return { type: 'gradient', preset, dark: preset.dark };
  }
  return { type: 'image', uri: coverImage, dark: true };
}

export function hasBg(coverImage?: string): boolean {
  return parseBg(coverImage).type !== 'none';
}
