import axios from 'axios';
import { runMiddleware, cors, handleError } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log("Fetching /api/ocean-conditions");
  
  const endpoint = 'https://marine-api.open-meteo.com/v1/marine?latitude=45.0&longitude=-30.0&current=sea_surface_temperature,wave_height,wave_period,wave_direction&timezone=auto';

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // Cache for 15 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}