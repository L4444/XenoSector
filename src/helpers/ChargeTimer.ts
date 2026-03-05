import Timer from "./Timer";

export default class ChargeTimer extends Timer {
  private readonly maxCharges!: number;
  private currentCharges!: number;
  private chargeRegenTime!: number;

  constructor(chargeRegenTime: number, maxCharges: number) {
    super();
    this.maxCharges = maxCharges;
    this.currentCharges = maxCharges;
    this.chargeRegenTime = chargeRegenTime;
  }

  getCharges(): number {
    return this.currentCharges;
  }

  getMaxCharges(): number {
    return this.maxCharges;
  }

  useCharge() {
    this.currentCharges--;
    super.start(this.chargeRegenTime);
  }

  update(): void {
    super.update();

    if (!this.isActive()) {
      if (this.currentCharges < this.maxCharges) {
        this.currentCharges++;
        super.start(this.chargeRegenTime);
      }
    }
  }
}
