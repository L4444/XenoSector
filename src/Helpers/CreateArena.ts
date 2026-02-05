import Wall from "../GameObjects/Wall";

export function CreateArena(
  scene: Phaser.Scene,
  boundSize: number,
  wallThickness: number,
): Array<Phaser.Physics.Matter.Image> {
  let walls = [];

  // Create the "walls", for out of bounds
  walls.push(new Wall(scene, 0, 0 - boundSize, boundSize * 2, wallThickness)); ///Top
  walls.push(new Wall(scene, 0 + boundSize, 0, wallThickness, boundSize * 2)); // Right
  walls.push(new Wall(scene, 0, 0 + boundSize, boundSize * 2, wallThickness)); // Bottom
  walls.push(new Wall(scene, 0 - boundSize, 0, wallThickness, boundSize * 2)); // Left

  return walls;
}
