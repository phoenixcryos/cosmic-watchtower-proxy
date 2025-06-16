import axios from 'axios';
import { runMiddleware, cors, handleError, getFormattedDate } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type = 'all' } = req.query; // Default to 'all' if no type is specified

  console.log(`Fetching /api/donki-notifications for type: ${type}`);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const formattedToday = getFormattedDate(today);
  const formattedStartDate = getFormattedDate(sevenDaysAgo);

  const NASA_API_KEY = process.env.NASA_API_KEY;
  const endpoint = `https://api.nasa.gov/DONKI/notifications?startDate=${formattedStartDate}&endDate=${formattedToday}&type=${type}&api_key=${NASA_API_KEY}`;

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}
