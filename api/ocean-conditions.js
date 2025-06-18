import axios from 'axios';
import { handleError, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;

  console.log("Fetching /api/ocean-conditions");
  
  try {
    const response = await axios.get(
      'https://marine-api.open-meteo.com/v1/marine?latitude=45.0&longitude=-30.0&current=sea_surface_temperature,wave_height,wave_period,wave_direction&timezone=auto',
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