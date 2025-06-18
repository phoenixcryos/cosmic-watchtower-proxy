$content = @'
import axios from 'axios';
import { handleError, setCORSHeaders, handleOptions } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ 
      success: false,
      error: 'Latitude (lat) and Longitude (lon) query parameters are required.' 
    });
  }
  
  console.log(`Fetching /api/user-weather for lat=${lat}, lon=${lon}`);
  
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,visibility,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean&timezone=auto`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'cosmic-watchtower-proxy/1.0.0'
        }
      }
    );

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(res, error);
  }
}
'@
Set-Content -Path "api\user-weather.js" -Value $content