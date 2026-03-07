export const RenderSpace = {
  WORLD: "WORLD",
  SCREEN: "SCREEN",
  PARALLAX: "PARALLAX",
};

export type RenderSpace = (typeof RenderSpace)[keyof typeof RenderSpace];
