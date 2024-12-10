import express from "express";
import Redis from "ioredis";
import axios from "axios";
import { rateLimit } from "express-rate-limit";
import { config } from "dotenv";
config();

//Rate limiter to reduce the request per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();

app.use(limiter);
app.use(express.json());

//Redis client for caching
const redisClient = new Redis({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

//endpoint to fetch weather based on city
app.get("/api/weather/:cityCode", async (req, res): Promise<any> => {
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
