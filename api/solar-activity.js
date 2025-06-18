import axios from 'axios';
import { setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;

  try {
    const API_KEY = process.env.NASA_API_KEY;
    if (!API_KEY) {
      console.error('NASA API key not found in environment variables');
      return res.status(500).json({
        success: false,
        error: 'NASA API key not configured'
      });
    }

    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await axios.get(
      `https://api.nasa.gov/DONKI/FLR?startDate=${startDate}&endDate=${endDate}&api_key=${API_KEY}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'cosmic-watchtower-proxy/1.0.0'
        }
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Solar activity API error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        success: false,
        error: 'Request timeout - NASA API took too long to respond'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        error: `NASA API error: ${error.response.statusText}`
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch solar activity data'
    });
  }
}