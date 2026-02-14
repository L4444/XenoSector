import Asteroid from "../objects/Asteroid";

/**
 *
 * Creates a grid of asteroids, if you want a grid that is not square, simply increate the totalAstroids.
 *
 * @param scene The Phaser scene object where the asteroids will be placed
 * @param x The **Top left** X position of the start of the grid
 * @param y The **Top left** Y position of the start of the grid
 * @param totalAsteroids The total number of asteroids in the grid
 * @param gridWidth The number of asteroids wide the grid will be
 * @param spacing The distance between each asteroid
 * @returns The created asteroid array
 */
export default function createAsteroidGrid(
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
      new Asteroid(
        scene,
        "Astroid" + i,
        x + gridX * spacing,
        y + gridY * spacing,
        tintColour,
      ),
    );
  }

  return asteroids;
}
