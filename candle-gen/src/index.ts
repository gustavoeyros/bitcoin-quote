import { config } from "dotenv";
import axios from "axios";
config();

const readMarketPrice = async (): Promise<Number> => {
  const result = await axios.get(process.env.BITCOIN_API);
  const data = result.data;
  const price = data.bitcoin.usd;
  console.log(price);
  return price;
};

readMarketPrice();
