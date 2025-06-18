import axios from 'axios';
import { handleError, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;
  
  console.log("Fetching /api/global-weather");
  
  try {
    const response = await axios.get(
      'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,uv_index_max&timezone=auto',
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