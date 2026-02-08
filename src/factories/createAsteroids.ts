import Asteroid from "../objects/Asteroid";

export default function createAsteroids(
  scene: Phaser.Scene,
  x: number,
  y: number,
  totalAsteroids: number,
  gridWidth: number,
  spacing: number,
): Array<Asteroid> {
  const asteroids: Array<Asteroid> = [];

  for (let i = 0; i < totalAsteroids; i++) {
    const gridX: number = i % gridWidth;
    const gridY: number = Math.floor(i / gridWidth);

    const tintValue: number = (i / totalAsteroids) * 255;

    const tintColour: number = Phaser.Display.Color.GetColor32(
      255,
      tintValue,
      tintValue,
      255,
    );

    asteroids.push(
      new Asteroid(scene, x + gridX * spacing, y + gridY * spacing, tintColour),
    );
  }

  return asteroids;
}
