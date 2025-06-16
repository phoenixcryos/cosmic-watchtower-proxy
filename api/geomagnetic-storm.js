import axios from 'axios';
import { runMiddleware, cors, handleError, getFormattedDate } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log("Fetching /api/geomagnetic-storm");

  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const formattedToday = getFormattedDate(today);
  const formattedStartDate = getFormattedDate(thirtyDaysAgo);

  const NASA_API_KEY = process.env.NASA_API_KEY;
  const endpoint = `https://api.nasa.gov/DONKI/GST?startDate=${formattedStartDate}&endDate=${formattedToday}&api_key=${NASA_API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}
