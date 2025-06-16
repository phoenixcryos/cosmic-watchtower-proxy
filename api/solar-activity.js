import axios from 'axios';
import { runMiddleware, cors, handleError, getFormattedDate } from './_helpers';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  console.log("Fetching /api/solar-activity");

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const formattedToday = getFormattedDate(today);
  const formattedYesterday = getFormattedDate(yesterday);

  const NASA_API_KEY = process.env.NASA_API_KEY;

  const endpoints = {
    ace_swepam: 'https://services.swpc.noaa.gov/json/ace_swepam_1m.json',
    ace_mag: 'https://services.swpc.noaa.gov/json/ace_mag_1m.json',
    goes_xray: 'https://services.swpc.noaa.gov/json/goes_xray_1m.json',
    donki_flr: `https://api.nasa.gov/DONKI/FLR?startDate=${formattedYesterday}&endDate=${formattedToday}&api_key=${NASA_API_KEY}`,
    donki_cme: `https://api.nasa.gov/DONKI/CMEAnalysis?startDate=${formattedYesterday}&endDate=${formattedToday}&mostAccurateOnly=true&api_key=${NASA_API_KEY}`,
  };

  try {
    const [swepamRes, magRes, xrayRes, flrRes, cmeRes] = await Promise.all([
      axios.get(endpoints.ace_swepam),
      axios.get(endpoints.ace_mag),
      axios.get(endpoints.goes_xray),
      axios.get(endpoints.donki_flr),
      axios.get(endpoints.donki_cme),
    ]);

    const responseData = {
      solarWind: {
          source: 'NOAA ACE SWepam',
          data: swepamRes.data,
      },
      interplanetaryMagneticField: {
          source: 'NOAA ACE MAG',
          data: magRes.data,
      },
      solarXRayFlux: {
          source: 'NOAA GOES X-ray',
          data: xrayRes.data,
      },
      solarFlares: {
          source: 'NASA DONKI FLR',
          data: flrRes.data,
      },
      cmeAnalyses: {
          source: 'NASA DONKI CME Analysis',
          data: cmeRes.data,
      }
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate'); // Cache for 5 minutes
    res.status(200).json(responseData);
  } catch (error) {
    handleError(res, error);
  }
}