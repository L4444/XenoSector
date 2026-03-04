export default class Timer {
  private ticksRemaining: number = 0;
  private maxTicks!: number;

  constructor(maxTicks: number) {
    this.maxTicks = maxTicks;
  }
  start() {
    this.ticksRemaining = this.maxTicks;
  }

  isActive(): boolean {
    return this.ticksRemaining > 0;
  }

  update() {
    if (this.ticksRemaining > 0) this.ticksRemaining--;
  }

  setMaxTicks(value: number) {
    this.maxTicks = value;
  }

  getRemainingRatio(): number {
    return this.ticksRemaining / this.maxTicks;
  }
}
