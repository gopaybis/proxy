// api/server.js
import { createProxyMiddleware } from 'http-proxy-middleware';
import axios from 'axios';

// Mendapatkan pengaturan proxy manual dari query params
const getProxyConfig = (req) => {
  const { proxy, dns } = req.query;
  return {
    proxy: proxy || 'http://default-proxy.com',  // Ganti dengan proxy default
    dns: dns || 'default-dns.com'  // Ganti dengan DNS default
  };
};

// Middleware untuk mengatur proxy dan DNS
export default async function handler(req, res) {
  const { proxy, dns } = getProxyConfig(req);  // Mengambil proxy dan DNS dari query

  console.log('Using Proxy:', proxy);
  console.log('Using DNS:', dns);

  // Setup proxy middleware
  const proxyMiddleware = createProxyMiddleware({
    target: 'http://example.com',  // Ganti dengan URL tujuan
    changeOrigin: true,
    secure: false,
    headers: {
      'X-Forwarded-For': dns  // Menyertakan DNS di header jika diperlukan
    },
    router: {
      // Kamu bisa menetapkan pengaturan DNS atau routing berbeda di sini jika perlu
      [proxy]: 'http://example.com', // Custom routing berdasarkan proxy yang diberikan
    }
  });

  try {
    // Proses permintaan melalui proxy middleware
    proxyMiddleware(req, res);
  } catch (error) {
    console.error('Error during proxy:', error);
    res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
