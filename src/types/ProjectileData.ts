export default class ProjectileData {
  range!: number;
  speed!: number;
  textureName!: string;

  constructor(range: number, speed: number, textureName: string) {
    this.range = range;
    this.speed = speed;
    this.textureName = textureName;
  }
}
