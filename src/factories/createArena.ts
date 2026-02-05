import Wall from "../objects/Wall";
/**
 * Creates a rectangular arena bounded by four static wall bodies.
 *
 * The arena is centered on the origin (0, 0). Walls are positioned at
 * the edges defined by `arenaSize` and extend inward.
 *
 * @param scene - The Phaser scene the walls will be added to.
 * @param arenaSize - Half the width and height of the arena, measured
 * from the center to each wall.
 * @param wallThickness - Thickness of each boundary wall.
 *
 * @returns An array of matter images....
 *
 * @remarks
 * - Assumes the physics world origin is at (0, 0).
 * - Walls are static and intended to act as collision boundaries only.
 */
export default function createArena(
  scene: Phaser.Scene,
  arenaSize: number,
  wallThickness: number,
): Array<Phaser.Physics.Matter.Image> {
  const walls: Array<Wall> = [];

  console.log(arenaSize);

  // Create the "walls", for out of bounds
  walls.push(new Wall(scene, 0, 0 - arenaSize, arenaSize * 2, wallThickness)); ///Top
  walls.push(new Wall(scene, 0 + arenaSize, 0, wallThickness, arenaSize * 2)); // Right
  walls.push(new Wall(scene, 0, 0 + arenaSize, arenaSize * 2, wallThickness)); // Bottom
  walls.push(new Wall(scene, 0 - arenaSize, 0, wallThickness, arenaSize * 2)); // Left

  return walls;
}
