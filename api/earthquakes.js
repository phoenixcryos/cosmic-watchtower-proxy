import axios from 'axios';
import { handleError, getFormattedDate, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;

  console.log("Fetching /api/earthquakes");

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const formattedStartDate = getFormattedDate(sevenDaysAgo);

    const response = await axios.get(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${formattedStartDate}&minmagnitude=3.0&orderby=time&limit=50`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'cosmic-watchtower-proxy/1.0.0'
        }
      }
    );

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(res, error);
  }
}