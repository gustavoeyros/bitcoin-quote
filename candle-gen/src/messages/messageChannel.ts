import { config } from "dotenv";
import { Channel, connect } from "amqplib";

export const createMessageChannel = async (): Promise<Channel> => {
  config();
  try {
    const connection = await connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME);
    console.log("Connected to RabbitMQ!");
    return channel;
  } catch (error) {
    console.log("Error to connect to RabbitMQ");
    console.log(error);
    return null;
  }
};