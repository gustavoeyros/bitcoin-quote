import { config } from "dotenv";
import { app } from "./app";
import { connectToMongoDB } from "./config/db";
import { connection } from "mongoose";

const createServer = async () => {
  config();

  await connectToMongoDB();
  const PORT = process.env.PORT;
  const server = app.listen(PORT, () => console.log("App running!"));
  process.on("SIGINT", async () => {
    await connection.close();
    server.close();
    console.log("Server and connection to Mongo closed!");
  });
};

createServer();
