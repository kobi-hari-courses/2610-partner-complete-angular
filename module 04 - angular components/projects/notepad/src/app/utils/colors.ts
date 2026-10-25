/**
 * Returns the gray with the stronger contrast against a browser-supported CSS color.
 * Transparent colors are composited over white. Requires a browser with Canvas 2D.
 * Pass standalone colors, not unresolved CSS variables or element-dependent values.
 * Throws for invalid colors or when Canvas 2D is unavailable.
 */
export function getContrastingGray(color: string): '#333333' | '#eeeeee' {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;

  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    throw new Error('Canvas 2D is required to calculate color contrast.');
  }

  // Invalid assignments leave fillStyle unchanged; two sentinels avoid rejecting either color.
  context.fillStyle = '#010203';
  context.fillStyle = color;
  if (context.fillStyle === '#010203') {
    context.fillStyle = '#040506';
    context.fillStyle = color;
    if (context.fillStyle === '#040506') {
      throw new Error(`Invalid or unsupported CSS color: ${color}`);
    }
  }
  const parsedColor = context.fillStyle;

  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, 1, 1);
  context.fillStyle = parsedColor;
  context.fillRect(0, 0, 1, 1);

  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  const luminance = relativeLuminance(red, green, blue);
  const darkLuminance = relativeLuminance(51, 51, 51);
  const lightLuminance = relativeLuminance(238, 238, 238);
  const darkContrast =
    (Math.max(luminance, darkLuminance) + 0.05) / (Math.min(luminance, darkLuminance) + 0.05);
  const lightContrast =
    (Math.max(luminance, lightLuminance) + 0.05) / (Math.min(luminance, lightLuminance) + 0.05);

  return darkContrast >= lightContrast ? '#333333' : '#eeeeee';
}

function relativeLuminance(red: number, green: number, blue: number): number {
  const linearize = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}
