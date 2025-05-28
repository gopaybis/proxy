// api/server.js
import axios from 'axios';
import { createProxyMiddleware } from 'http-proxy-middleware';

// URL daftar proxy
const proxyListUrl = 'https://raw.githubusercontent.com/gopaybis/Proxylist/refs/heads/main/proxyiplengkap1.txt';

// Fungsi untuk mengambil daftar proxy dan memilih proxy acak
async function getRandomProxy() {
  try {
    const response = await axios.get(proxyListUrl);
    const proxies = response.data.split('\n').filter(line => line.trim() !== '');

    // Pilih proxy acak
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)].split(',');

    const [proxyIp, port, countryCode, isp] = randomProxy;

    return {
      ip: proxyIp,
      port: port,
      url: `http://${proxyIp}:${port}`
    };
  } catch (error) {
    console.error('Error fetching proxy list:', error);
    throw new Error('Failed to fetch proxy list');
  }
}

export default async function handler(req, res) {
  const { query } = req;

  // Memastikan ada parameter yang valid dalam query
  if (!query.url) {
    return res.status(400).json({ error: "Missing target URL in query parameter" });
  }

  try {
    // Ambil proxy acak
    const { url } = await getRandomProxy();

    // Buat middleware proxy
    const proxy = createProxyMiddleware({
      target: url,  // Menggunakan proxy yang dipilih
      changeOrigin: true,
      pathRewrite: {
        '^/api/server': '',  // Menghilangkan '/api/server' dari path URL
      },
      onProxyReq: (proxyReq, req, res) => {
        // Menambahkan query string target URL
        const targetUrl = query.url; // Ambil URL target dari query parameter
        proxyReq.path = targetUrl;
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: "Proxy error", details: err.message });
      },
    });

    proxy(req, res);
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
