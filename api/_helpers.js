// api/_helpers.js
import Cors from 'cors';

// Initialize the cors middleware
// The `origin` array should be updated with your frontend's production URL
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://cosmic-watchtower.vercel.app' // <-- Replace with your actual production URL
];

export const cors = Cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'HEAD'],
});

// Helper function to run middleware
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// Helper function for robust error responses
export function handleError(res, error) {
  console.error("Upstream API Error:", error.message);
  
  // Axios error provides more details
  if (error.response) {
    return res.status(error.response.status || 502).json({
      success: false,
      error: "Failed to fetch data from upstream API.",
      details: error.message,
      upstreamStatus: error.response.status,
      upstreamResponse: error.response.data
    });
  }
  
  // Network timeout errors
  if (error.code === 'ECONNABORTED') {
    return res.status(504).json({
      success: false,
      error: 'Request timeout - API took too long to respond'
    });
  }
  
  // Generic network or other errors
  return res.status(500).json({
    success: false,
    error: "An internal server error occurred.",
    details: error.message
  });
}

// Helper for dynamic date formatting (YYYY-MM-DD)
export function getFormattedDate(date) {
  return date.toISOString().split('T')[0];
}

// Helper function to set CORS headers
export function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Helper function to handle OPTIONS requests
export function handleOptions(req, res) {
  if (req.method === 'OPTIONS') {
    setCORSHeaders(res);
    res.status(200).end();
    return true;
  }
  return false;
}

// Helper function to validate GET method
export function validateGETMethod(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return false;
  }
  return true;
}