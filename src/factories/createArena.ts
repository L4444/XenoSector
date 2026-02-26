import Wall from "../entities/Wall";

import type XenoGame from "../XenoGame";

/**
 * Creates a rectangular arena bounded by four static wall bodies.
 *
 * The arena is centered on the origin (0, 0). Walls are positioned at
 * the edges defined by both arenaWidth and arenaHeight
 *
 * @param xenoGame - XenoGAME
 * @param arenaWidth - The width of the arena
 * @param arenaHeight - The width of the arena
 * @param wallThickness - Thickness of each boundary wall.
 *
 * @returns An array of the created walls
 *
 * @remarks
 * - Assumes the physics world origin is at (0, 0).
 * - Walls are static and intended to act as collision boundaries only.
 */
export default function createArena(
  xenoGame: XenoGame,
  arenaWidth: number,
  arenaHeight: number,
  wallThickness: number,
): Array<Wall> {
  const walls: Array<Wall> = [];

  // Create the "walls", for out of bounds
  walls.push(
    new Wall(
      xenoGame,
      "Wall Top",
      0,
      0 - arenaHeight,
      arenaWidth * 2,
      wallThickness,
    ),
  ); ///Top
  walls.push(
    new Wall(
      xenoGame,
      "Wall Right",
      0 + arenaWidth,
      0,
      wallThickness,
      arenaHeight * 2,
    ),
  ); // Right
  walls.push(
    new Wall(
      xenoGame,
      "Wall Bottom",
      0,
      0 + arenaHeight,
      arenaWidth * 2,
      wallThickness,
    ),
  ); // Bottom
  walls.push(
    new Wall(
      xenoGame,
      "Wall Left",
      0 - arenaWidth,
      0,
      wallThickness,
      arenaHeight * 2,
    ),
  ); // Left

  return walls;
}
