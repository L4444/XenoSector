export default class Timer {
  private ticksRemaining: number = 0;
  private maxTicks!: number;

  constructor() {}
  start(maxTicks: number) {
    this.maxTicks = maxTicks;
    this.ticksRemaining = this.maxTicks;
  }

  isActive(): boolean {
    return this.ticksRemaining > 0;
  }

  update() {
    if (this.ticksRemaining > 0) this.ticksRemaining--;
  }

  getTicksRemaining(): number {
    return this.ticksRemaining;
  }

  getRemainingRatio(): number {
    return this.ticksRemaining / this.maxTicks;
  }

  getMaxTicks(): number {
    return this.maxTicks;
  }
}
