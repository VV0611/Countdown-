import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { PixelIconDef } from '../data/pixelIcons';

interface Props {
  icon: PixelIconDef;
  size?: number;
}

export default function PixelIcon({ icon, size = 48 }: Props) {
  const rows = icon.grid.length;
  const cols = icon.grid[0].length;
  const pw = size / cols;
  const ph = size / rows;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {icon.grid.map((row, y) =>
        [...row].map((cell, x) => {
          if (cell === '0') return null;
          const idx = parseInt(cell, 10);
          const color = icon.palette[idx];
          if (!color) return null;
          return (
            <Rect
              key={`${y}-${x}`}
              x={x * pw}
              y={y * ph}
              width={pw}
              height={ph}
              fill={color}
            />
          );
        })
      )}
    </Svg>
  );
}
