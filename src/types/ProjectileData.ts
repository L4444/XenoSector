export default class ProjectileData {
  range!: number;
  speed!: number;
  textureName!: string;
  damage!: number;

  constructor(
    range: number,
    speed: number,
    textureName: string,
    damage: number,
  ) {
    this.range = range;
    this.speed = speed;
    this.textureName = textureName;
    this.damage = damage;
  }
}
