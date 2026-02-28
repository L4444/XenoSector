export const RenderDepth = {
  BACKGROUND: -2,
  SHIPS: 0,
  PROJECTILES: 1,
  TURRETS: 2,
  SHIELDS: 3,
  TEXT_ALERT: 4,
  UI: 5,
};

export type RenderDepth = (typeof RenderDepth)[keyof typeof RenderDepth];
