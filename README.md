# Weather API

This Weather API project allows you to fetch weather data for a specific city using the Visual Crossing Weather API, with caching implemented via Redis to optimize performance. It also includes rate limiting to control the number of requests per IP.

## Features

- **Fetch Weather Data**: Retrieves weather data based on the city code provided in the request.
- **Caching with Redis**: Reduces redundant API calls by caching weather data for 1 hour.
- **Rate Limiting**: Limits requests to 100 per 15 minutes per IP.
- **Environment Variables**: Uses environment variables for secure configuration.

## Prerequisites

- Node.js installed on your system.
- Redis server running and accessible.
- Visual Crossing API key.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weather-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the project root and add the following:
   ```env
   REDIS_USER=<your-redis-username>
   REDIS_PASSWORD=<your-redis-password>
   REDIS_HOST=<your-redis-host>
   REDIS_PORT=<your-redis-port>
   VISUAL_CROSSING_API_KEY=<your-visual-crossing-api-key>
   ```

4. Start your Redis server if it's not already running.

## Usage

1. Start the server:
   ```bash
   npm run dev
   ```

2. Make a GET request to the endpoint:
   ```
   http://localhost:5000/api/weather/<cityCode>
   ```
   Replace `<cityCode>` with the code of the city you want weather data for.

## Project Structure

- `app.ts`: Main application logic.
- `.env`: Environment variables configuration.

## Dependencies

- **express**: For creating the API server.
- **ioredis**: For Redis integration.
- **axios**: For making API requests to Visual Crossing.
- **express-rate-limit**: For rate limiting requests.
- **dotenv**: For managing environment variables.

## Error Handling

The app handles the following errors:
- Redis connection issues.
- API request failures.
- Missing or incorrect environment variables.

## Troubleshooting

- **ERR_HTTP_HEADERS_SENT**: Ensure you don't send multiple responses for the same request.
- **Redis Connection Issues**: Verify Redis server configuration and credentials.

## Project Inspired By Roadmap.sh
https://roadmap.sh/projects/weather-api-wrapper-service
