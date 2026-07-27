import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          color: '#f8f8f8',
          fontSize: 22,
          fontWeight: 700,
          fontFamily: 'serif',
        }}
      >
        S
      </div>
    ),
    { ...size },
  )
}
