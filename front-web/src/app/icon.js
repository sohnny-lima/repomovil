/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Tamaño del icono sugerido
export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default function Icon() {
  // Leemos la imagen usando fs.readFileSync
  const file = readFileSync(join(process.cwd(), 'public', 'icono.jpg'));
  const base64Data = file.toString('base64');
  const dataUrl = `data:image/jpeg;base64,${base64Data}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%', // bordes curvos circulares usando CSS como pedido
          overflow: 'hidden',
          backgroundColor: 'white',
        }}
      >
        <img
          src={dataUrl}
          alt="Icono MCP 2026"
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }}
        />
      </div>
    ),
    { ...size }
  );
}
