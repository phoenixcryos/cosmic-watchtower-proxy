import axios from 'axios';
import { handleError, setCORSHeaders, handleOptions, validateGETMethod } from './_helpers.js';

export default async function handler(req, res) {
  setCORSHeaders(res);
  
  if (handleOptions(req, res)) return;
  if (!validateGETMethod(req, res)) return;

  console.log("Fetching /api/geomagnetic-activity");

  try {
    const endpoints = {
      kpIndex: 'https://services.swpc.noaa.gov/products/noaa-estimated-kp.json',
      auroraForecast: 'https://services.swpc.noaa.gov/json/ovation_aurora_latest.json',
    };

    const [kpRes, auroraRes] = await Promise.all([
      axios.get(endpoints.kpIndex, {
        timeout: 10000,
        headers: { 'User-Agent': 'cosmic-watchtower-proxy/1.0.0' }
      }),
      axios.get(endpoints.auroraForecast, {
        timeout: 10000,
        headers: { 'User-Agent': 'cosmic-watchtower-proxy/1.0.0' }
      }),
    ]);
    
    const responseData = {
      kpIndex: kpRes.data,
      auroraForecast: auroraRes.data,
    };

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    res.status(200).json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleError(res, error);
  }
}