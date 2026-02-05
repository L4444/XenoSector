import Asteroid from "../GameObjects/Asteroid";

export default function createAsteroids(
  scene: Phaser.Scene,
  totalAsteroids: number,
  gridSize: number,
  spacing: number,
): Array<Phaser.Physics.Matter.Image> {
  const asteroids: Array<Asteroid> = [];

  for (let i = 0; i < totalAsteroids; i++) {
    const gridX: number = i % gridSize;
    const gridY: number = Math.floor(i / gridSize);

    const tintValue: number = (i / totalAsteroids) * 255;

    const tintColour: number = Phaser.Display.Color.GetColor32(
      255,
      tintValue,
      tintValue,
      255,
    );

    asteroids.push(
      new Asteroid(scene, gridX * spacing, gridY * spacing, tintColour),
    );
  }

  return asteroids;
}
