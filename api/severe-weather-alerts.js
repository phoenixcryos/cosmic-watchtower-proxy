import axios from 'axios';
import { handleError, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;
  
  console.log("Fetching /api/severe-weather-alerts");
  
  try {
    const response = await axios.get(
      'https://api.weather.gov/alerts/active?status=actual&message_type=alert,update&urgency=Immediate,Expected&severity=Extreme,Severe,Moderate',
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'CosmicWatchtowerProxy/1.0 (phoenixcryos@example.com)'
        }
      }
    );

    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate');
    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(res, error);
  }
}