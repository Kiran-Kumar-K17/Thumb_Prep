import app from "./app.js";
import dotenv from "dotenv";
import { thumbnailQueue } from "./queues/thumbnail.queue.js";
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  const job = await thumbnailQueue.add("generate-thumbnail", {
    message: "Hello, World!",
  });
  console.log(`Job added to thumbnail queue with ID: ${job.id}`);
});
