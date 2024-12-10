import express, { Request, Response } from "express";
import Redis from "ioredis";
import axios from "axios";
import { config } from "dotenv";
config();

// const redisClient = new Redis();
const API_KEY = process.env.VISUAL_CROSSING_API_KEY;

const app = express();
app.use(express.json());

app.get("/:cityCode", async (req, res) => {
  const cityCode = req.params.cityCode;
  try {
    const response = await axios.get(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode}?unitGroup=metric&key=${process.env.VISUAL_CROSSING_API_KEY}&contentType=json`
    );
    const weatherData = response.data;
    res.json(weatherData);
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
