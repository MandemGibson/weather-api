import express, { Request, Response } from "express";
import Redis from "ioredis";
import axios from "axios";
import { config } from "dotenv";
config();

const app = express();
app.use(express.json());
const redisClient = new Redis({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

app.get("/:cityCode", async (req, res): Promise<any> => {
  const cityCode = req.params.cityCode;
  try {
    const cachedData = await redisClient.get(cityCode);
    if (cachedData != null) {
      console.log("Cache Hit");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Cache miss");

    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode}?unitGroup=metric&key=${process.env.VISUAL_CROSSING_API_KEY}&contentType=json`
    );
    const weatherData = response.data;

    await redisClient.setex(cityCode, 3600, JSON.stringify(weatherData));
    res.json(weatherData);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Server error" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
