import axios from 'axios';
import { runMiddleware, cors, handleError, getFormattedDate } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log("Fetching /api/earthquakes");

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const formattedStartDate = getFormattedDate(sevenDaysAgo);

  const endpoint = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&minmagnitude=3.0&orderby=time&limit=50`;

  try {
    const response = await axios.get(endpoint);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate'); // Cache for 15 minutes
    res.status(200).json(response.data);
  } catch (error) {
    handleError(res, error);
  }
}