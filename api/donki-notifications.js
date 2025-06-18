import axios from 'axios';
import { handleError, getFormattedDate, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;

  const { type = 'all' } = req.query;

  console.log(`Fetching /api/donki-notifications for type: ${type}`);

  try {
    const API_KEY = process.env.NASA_API_KEY;
    
    if (!API_KEY) {
      console.error('NASA API key not found in environment variables');
      return res.status(500).json({ 
        success: false,
        error: 'NASA API key not configured' 
      });
    }

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const formattedToday = getFormattedDate(today);
    const formattedStartDate = getFormattedDate(sevenDaysAgo);

    const response = await axios.get(
      `https://api.nasa.gov/DONKI/notifications?startDate=${formattedStartDate}&endDate=${formattedToday}&type=${type}&api_key=${API_KEY}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'cosmic-watchtower-proxy/1.0.0'
        }
      }
    );

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(res, error);
  }
}
