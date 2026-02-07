import Wall from "../objects/Wall";
/**
 * Creates a rectangular arena bounded by four static wall bodies.
 *
 * The arena is centered on the origin (0, 0). Walls are positioned at
 * the edges defined by both arenaWidth and arenaHeight
 *
 * @param scene - The Phaser scene the walls will be added to.
 * @param arenaWidth - The width of the arena
 * @param arenaHeight - The width of the arena
 * @param wallThickness - Thickness of each boundary wall.
 *
 * @returns An array of staticPhysicsObjects???
 *
 * @remarks
 * - Assumes the physics world origin is at (0, 0).
 * - Walls are static and intended to act as collision boundaries only.
 */
export default function createArena(
  scene: Phaser.Scene,
  arenaWidth: number,
  arenaHeight: number,
  wallThickness: number,
): Array<Phaser.Physics.Matter.Image> {
  const walls: Array<Wall> = [];

  // Create the "walls", for out of bounds
  walls.push(
    new Wall(scene, 0, 0 - arenaHeight, arenaWidth * 2, wallThickness),
  ); ///Top
  walls.push(
    new Wall(scene, 0 + arenaWidth, 0, wallThickness, arenaHeight * 2),
  ); // Right
  walls.push(
    new Wall(scene, 0, 0 + arenaHeight, arenaWidth * 2, wallThickness),
  ); // Bottom
  walls.push(
    new Wall(scene, 0 - arenaWidth, 0, wallThickness, arenaHeight * 2),
  ); // Left

  return walls;
}
