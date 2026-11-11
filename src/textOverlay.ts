// Picks a text color and a see-through layer for text on an image, from the
// colors of that image (the palette of the API), so the text adapts to every
// image. The text reaches 4.5:1 (WCAG for normal text) on every palette
// color; a real image can have lighter or darker spots than its palette,
// so the layer has a minimum strength and the text a soft shadow as well.

const WHITE = "#ffffff";
// the same dark color as --color-ink in styles.css
const INK = "#18181b";
const BLACK = "#000000";
const MIN_CONTRAST = 4.5;
// 0.3, 0.35, … 0.9: the layer is only as strong as the text needs, but at
// least 0.3 for spots of the image that are not in its palette
const OPACITIES = Array.from({ length: 13 }, (_, index) => (index + 6) / 20);
const HEX_COLOR = /^#[\da-f]{6}$/i;

export type TextOverlay = {
  textColor: string;
  // a color of the image, laid over the whole image
  overlayColor: string;
  overlayOpacity: number;
};

function getChannels(hex: string): number[] {
  return [1, 3, 5].map((start) =>
    Number.parseInt(hex.slice(start, start + 2), 16)
  );
}

// the relative luminance of WCAG: 0 for black, 1 for white
function getLuminance(hex: string): number {
  const [red, green, blue] = getChannels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

export function getContrastRatio(first: string, second: string): number {
  const [lighter, darker] = [getLuminance(first), getLuminance(second)].sort(
    (a, b) => b - a
  );
  return (lighter + 0.05) / (darker + 0.05);
}

// the color seen where `top` lies with the opacity over `bottom`
export function blendColors(
  top: string,
  bottom: string,
  opacity: number
): string {
  const bottomChannels = getChannels(bottom);
  const channels = getChannels(top).map((channel, index) =>
    Math.round(channel * opacity + bottomChannels[index] * (1 - opacity))
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function getTextOverlay(colors: string[]): TextOverlay {
  const palette = colors
    .filter((color) => HEX_COLOR.test(color))
    .sort((a, b) => getLuminance(a) - getLuminance(b));
  const darkest = palette[0] ?? BLACK;
  const lightest = palette[palette.length - 1] ?? WHITE;

  // white text on the darkest color of the image, or dark text on the
  // lightest; each must be readable even where the image is closest to the
  // text color (its lightest or darkest color)
  const candidates = [
    { textColor: WHITE, overlayColor: darkest, closestColor: lightest },
    { textColor: INK, overlayColor: lightest, closestColor: darkest },
  ];
  const overlays = candidates.flatMap(
    ({ textColor, overlayColor, closestColor }) => {
      const overlayOpacity = OPACITIES.find(
        (opacity) =>
          getContrastRatio(
            textColor,
            blendColors(overlayColor, closestColor, opacity)
          ) >= MIN_CONTRAST
      );
      return overlayOpacity === undefined
        ? []
        : [{ textColor, overlayColor, overlayOpacity }];
    }
  );

  // the lighter layer changes the image less
  const [best] = overlays.sort((a, b) => a.overlayOpacity - b.overlayOpacity);
  // no color of the image works (for example a middle gray): a black layer
  // with white text always does
  return (
    best ?? { textColor: WHITE, overlayColor: BLACK, overlayOpacity: 0.75 }
  );
}
