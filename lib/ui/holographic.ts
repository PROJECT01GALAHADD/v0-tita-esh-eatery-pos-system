export interface MousePosition {
  x: number
  y: number
}

export interface HolographicConfig {
  hue: number
  saturation: number
  brightness: number
  rotation: number
  intensity: number
}

export const DEFAULT_HOLOGRAPHIC_CONFIG: HolographicConfig = {
  hue: 200,
  saturation: 70,
  brightness: 50,
  rotation: 20,
  intensity: 80,
}

const CENTER: MousePosition = { x: 0.5, y: 0.5 }

export function createHolographicStyle(
  config: HolographicConfig = DEFAULT_HOLOGRAPHIC_CONFIG,
  mousePos: MousePosition = CENTER,
) {
  const { hue, saturation, brightness, rotation, intensity } = config

  return {
    backgroundImage: `
      linear-gradient(
        ${rotation + (mousePos.x - 0.5) * 45}deg,
        hsl(${(hue + mousePos.x * 60) % 360}, ${saturation}%, ${brightness}%) 0%,
        hsl(${(hue + 60 + mousePos.y * 30) % 360}, ${saturation}%, ${brightness}%) 16.66%,
        hsl(${(hue + 120 + mousePos.x * 40) % 360}, ${saturation}%, ${brightness}%) 33.33%,
        hsl(${(hue + 180 + mousePos.y * 50) % 360}, ${saturation}%, ${brightness}%) 50%,
        hsl(${(hue + 240 + mousePos.x * 35) % 360}, ${saturation}%, ${brightness}%) 66.66%,
        hsl(${(hue + 300 + mousePos.y * 45) % 360}, ${saturation}%, ${brightness}%) 83.33%,
        hsl(${(hue + mousePos.x * 60) % 360}, ${saturation}%, ${brightness}%) 100%
      ),
      radial-gradient(
        ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%,
        rgba(255, 255, 255, 0.1) 0%,
        transparent 50%
      )
    `,
    backgroundSize: "200% 200%, 100% 100%",
    opacity: intensity / 100,
  } as React.CSSProperties
}

export function createPrismaticEffect(mousePos: MousePosition = CENTER) {
  return {
    background: `
      conic-gradient(
        from ${mousePos.x * 360}deg at ${mousePos.x * 100}% ${mousePos.y * 100}%,
        transparent 0deg,
        rgba(255, 0, 0, 0.2) ${mousePos.x * 60}deg,
        rgba(255, 255, 0, 0.2) ${mousePos.x * 120}deg,
        rgba(0, 255, 0, 0.2) ${mousePos.x * 180}deg,
        rgba(0, 255, 255, 0.2) ${mousePos.x * 240}deg,
        rgba(0, 0, 255, 0.2) ${mousePos.x * 300}deg,
        rgba(255, 0, 255, 0.2) ${mousePos.x * 360}deg,
        transparent 360deg
      )
    `,
    opacity: 0.5,
    mixBlendMode: "color-dodge" as const,
  } as React.CSSProperties
}
