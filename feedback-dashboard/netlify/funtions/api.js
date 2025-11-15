const axios = require('axios');

// Your Render backend URL
const RENDER_API_URL = 'https://your-render-app.onrender.com';

exports.handler = async function(event, context) {
  try {
    // Extract the path and remove the '/.netlify/functions/api' prefix
    const path = event.path.replace('/.netlify/functions/api', '');
    
    // Forward the request to your Render backend
    const response = await axios({
      method: event.httpMethod,
      url: `${RENDER_API_URL}${path}`,
      data: event.body,
      headers: {
        'Content-Type': 'application/json',
        ...(event.headers['content-type'] && { 'Content-Type': event.headers['content-type'] })
      },
      params: event.queryStringParameters
    });

    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Proxy error:', error);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data
      })
    };
  }
};