// api/server.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export default function handler(req, res) {
  const { url, proxy } = req.query;

  // Pastikan ada URL dan proxy yang diberikan
  if (!url || !proxy) {
    return res.status(400).json({ error: 'Missing URL or Proxy' });
  }

  // Setup proxy middleware
  const proxyMiddleware = createProxyMiddleware({
    target: url, // URL tujuan
    changeOrigin: true,
    secure: false,
    headers: {
      'X-Forwarded-For': proxy, // Menyertakan proxy dalam header
    },
  });

  try {
    // Mengarahkan permintaan melalui middleware proxy
    proxyMiddleware(req, res);
  } catch (error) {
    console.error('Error during proxy:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
