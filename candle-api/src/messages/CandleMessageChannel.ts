import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from "http";
import CandleController from "src/controllers/CandleController";
import { Channel, connect } from "amqplib";
import { Candle } from "src/models/CandleModel";
config();

export default class CandleMessageChannel {
  private _channel: Channel;
  private _candleCtrl: CandleController;
  private _io: Server;

  constructor(server: http.Server) {
    this._candleCtrl = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: process.env.SOCKET_CLIENT_SERVER,
        methods: ["GET", "POST"],
      },
    });
    this._io.on("connection", () => console.log("websocket on!"));
    this._createMessageChannel();
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);
      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE);
    } catch (error) {
      console.log("Connection to RabbitMQ failed!");
      console.log(error);
    }
  }

  consumeMessages() {
    this._channel.consume(process.env.QUEUE, async (msg) => {
      const candleObj = JSON.parse(msg.content.toString());
      console.log("Message received");
      console.log(candleObj);
      this._channel.ack(msg);

      const candle: Candle = candleObj;
      await this._candleCtrl.save(candle);
      console.log("Candle saved to db");
      this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
      console.log("New candle emited!");
    });
    console.log("Consumer started.");
  }
}
