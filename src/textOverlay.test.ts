import { blendColors, getContrastRatio, getTextOverlay } from "./textOverlay";

const WHITE = "#ffffff";
const INK = "#18181b";

// the palette of "Wheat Field with Cypresses": dark greens and mid tones
const wheatField = ["#37412E", "#8D7332", "#838665", "#718F98", "#9DA59E"];
// a light, cream-colored image
const lightImage = ["#F2EEE3", "#E8DCC0", "#D9C9A3"];
// a very dark, night-blue image
const darkImage = ["#1A1A2E", "#16213E", "#0F3460"];

// the text must be readable (4.5:1) on every color of the image, once the
// overlay lies on it
function expectReadableOnEveryColor(colors: string[]) {
  const { textColor, overlayColor, overlayOpacity } = getTextOverlay(colors);
  for (const color of colors) {
    const background = blendColors(overlayColor, color, overlayOpacity);
    expect(getContrastRatio(textColor, background)).toBeGreaterThanOrEqual(4.5);
  }
}

describe("getContrastRatio", () => {
  test("is 21 for white on black", () => {
    expect(getContrastRatio(WHITE, "#000000")).toBeCloseTo(21);
  });

  test("is 1 for a color on itself", () => {
    expect(getContrastRatio("#8D7332", "#8D7332")).toBe(1);
  });

  test("does not depend on the order of the colors", () => {
    expect(getContrastRatio(INK, WHITE)).toBe(getContrastRatio(WHITE, INK));
  });
});

describe("blendColors", () => {
  test("lays a color with an opacity over another color", () => {
    expect(blendColors("#000000", WHITE, 0.5)).toBe("#808080");
    expect(blendColors("#000000", WHITE, 1)).toBe("#000000");
    expect(blendColors("#000000", WHITE, 0)).toBe(WHITE);
  });
});

describe("getTextOverlay", () => {
  test("uses white text on a layer of the darkest color of a dark image", () => {
    expect(getTextOverlay(wheatField)).toEqual({
      textColor: WHITE,
      overlayColor: "#37412E",
      overlayOpacity: 0.45,
    });
    expectReadableOnEveryColor(wheatField);
  });

  test("uses dark text on a layer of the lightest color of a light image", () => {
    const overlay = getTextOverlay(lightImage);

    expect(overlay.textColor).toBe(INK);
    expect(overlay.overlayColor).toBe("#F2EEE3");
    expectReadableOnEveryColor(lightImage);
  });

  test("covers an image only as much as the text needs", () => {
    // a dark image needs almost no layer for white text
    expect(getTextOverlay(darkImage).overlayOpacity).toBeLessThan(
      getTextOverlay(wheatField).overlayOpacity
    );
    expectReadableOnEveryColor(darkImage);
  });

  test("uses a black layer when the image colors cannot make it readable", () => {
    // a middle gray: neither white nor dark text reaches 4.5:1 on it,
    // and a layer of the same gray does not change that
    expect(getTextOverlay(["#777777"])).toEqual({
      textColor: WHITE,
      overlayColor: "#000000",
      overlayOpacity: 0.75,
    });
    expectReadableOnEveryColor(["#777777"]);
  });

  test("uses white text on a black layer without colors", () => {
    const { textColor, overlayColor, overlayOpacity } = getTextOverlay([]);

    expect(textColor).toBe(WHITE);
    expect(overlayColor).toBe("#000000");
    // readable even on a completely white image
    expect(
      getContrastRatio(
        textColor,
        blendColors(overlayColor, WHITE, overlayOpacity)
      )
    ).toBeGreaterThanOrEqual(4.5);
  });

  test("ignores colors that are no six-digit hex colors", () => {
    expect(getTextOverlay(["#fff", "red", ...lightImage])).toEqual(
      getTextOverlay(lightImage)
    );
  });
});
