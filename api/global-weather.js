import axios from 'axios';
import { runMiddleware, cors, handleError } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  console.log("Fetching /api/global-weather");
  
  const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max&timezone=auto';

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // Cache for 15 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}