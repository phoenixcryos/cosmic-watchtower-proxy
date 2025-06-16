import axios from 'axios';
import { runMiddleware, cors, handleError } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  console.log("Fetching /api/severe-weather-alerts");
  
  const endpoint = 'https://api.weather.gov/alerts/active?status=actual&message_type=alert,update&urgency=Immediate,Expected&severity=Extreme,Severe,Moderate';
  
  // This API requires a specific User-Agent header
  const axiosConfig = {
    headers: {
      'User-Agent': 'CosmicWatchtowerProxy/1.0 (contact@yourdomain.com)' // <-- Replace with your actual contact email
    }
  };

  try {
    const response = await axios.get(endpoint, axiosConfig);
    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate'); // Cache for 3 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}