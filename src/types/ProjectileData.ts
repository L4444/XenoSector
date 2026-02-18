export default class ProjectileData {
  range!: number;
  speed!: number;
  textureName!: string;
  damage!: number;
  mass!: number;

  constructor(
    range: number,
    speed: number,
    textureName: string,
    damage: number,
    mass: number,
  ) {
    this.range = range;
    this.speed = speed;
    this.textureName = textureName;
    this.damage = damage;
    this.mass = mass;
  }
}
