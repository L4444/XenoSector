export default class ProjectileData {
  range!: number;
  speed!: number;
  textureName!: string;
  weaponFiredFrom!: any;

  constructor(
    range: number,
    speed: number,
    textureName: string,
    weaponFiredFrom: any,
  ) {
    this.range = range;
    this.speed = speed;
    this.textureName = textureName;
    this.weaponFiredFrom = weaponFiredFrom;
  }
}
