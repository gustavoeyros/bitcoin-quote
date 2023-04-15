import { Candle, CandleModel } from "src/models/CandleModel";

export default class CandleController {
  async save(candle: Candle): Promise<Candle> {
    const newCandle = await CandleModel.create(candle);
    return newCandle;
  }
}
