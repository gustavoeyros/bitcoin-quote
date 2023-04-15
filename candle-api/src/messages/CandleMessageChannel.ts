import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from "http";
import CandleController from "src/controllers/CandleController";
import { Channel, connect } from "amqplib";
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
  }

  async createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);
      this._channel = await connection.createChannel();
      this._channel.assertQueue(process.env.QUEUE);
    } catch (error) {
      console.log("Connection to RabbitMQ failed!");
      console.log(error);
    }
  }
}
