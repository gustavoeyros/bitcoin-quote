import CandleColor from "../enums/CandleColor";

export default class Candle {
  low: number;
  high: number;
  open: number;
  close: number;
  color: CandleColor;
  finalDateTime: Date;
  values: number[];
  currency: string;

  constructor(currency: string) {
    this.currency = currency;
    this.low = Infinity;
    this.high = 0;
    this.close = 0;
    this.open = 0;
    this.values = [];
    this.color = CandleColor.UNDETERMINED;
  }

  addValue(value: number) {
    this.values.push(value);
    if (this.values.length == 1) {
      this.open = value;
    }
    if (this.low > value) {
      this.low = value;
    }
    if (this.high < value) {
      this.high = value;
    }
  }
}
