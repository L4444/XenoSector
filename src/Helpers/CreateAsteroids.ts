import Asteroid from "../GameObjects/Asteroid";

export function CreateAstroids(
  scene: Phaser.Scene,
  totalAsteroids: number,
  spacing: number,
): Array<Phaser.Physics.Matter.Image> {
  let asteroids = [];

  let sqrtOfTotal = Math.sqrt(totalAsteroids);

  for (let i = 0; i < totalAsteroids; i++) {
    let x: number = i % sqrtOfTotal;
    let y: number = Math.floor(i / sqrtOfTotal);

    asteroids.push(new Asteroid(scene, x * spacing, y * spacing));
  }

  return asteroids;
}
