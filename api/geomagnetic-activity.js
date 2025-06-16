import axios from 'axios';
import { runMiddleware, cors, handleError } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log("Fetching /api/geomagnetic-activity");

  const endpoints = {
    kpIndex: 'https://services.swpc.noaa.gov/products/noaa-estimated-kp.json',
    auroraForecast: 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json',
  };

  try {
    const [kpRes, auroraRes] = await Promise.all([
      axios.get(endpoints.kpIndex),
      axios.get(endpoints.auroraForecast),
    ]);
    
    const responseData = {
      kpIndex: kpRes.data,
      auroraForecast: auroraRes.data,
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    res.status(200).json(responseData);
  } catch (error) {
    handleError(res, error);
  }
}