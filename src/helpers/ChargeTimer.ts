import Timer from "./Timer";

export default class ChargeTimer extends Timer {
  private readonly maxCharges!: number;
  private currentCharges!: number;
  constructor(maxticks: number, maxCharges: number) {
    super(maxticks);
    this.maxCharges = maxCharges;
    this.currentCharges = maxCharges;
  }

  getCharges(): number {
    return this.currentCharges;
  }

  getMaxCharges(): number {
    return this.maxCharges;
  }

  useCharge() {
    this.currentCharges--;
    super.start();
  }

  update(): void {
    super.update();

    if (!this.isActive()) {
      if (this.currentCharges < this.maxCharges) {
        this.currentCharges++;
        super.start();
      }
    }
  }
}
