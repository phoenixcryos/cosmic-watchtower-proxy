$content = @'
import axios from 'axios';
import { runMiddleware, cors, handleError } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude (lat) and Longitude (lon) query parameters are required.' });
  }
  
  console.log(`Fetching /api/user-weather for lat=${lat}, lon=${lon}`);
  
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}¤t=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean&timezone=auto`;

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // Cache for 15 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}
'@
Set-Content -Path "api\user-weather.js" -Value $content