// api/proxy.js
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
    throw new Error('Gagal mengambil daftar proxy: ' + error.message);
  }
}

export default async function handler(req, res) {
  try {
    // Ambil proxy acak
    const { url } = await getRandomProxy();

    // Buat middleware proxy
    const proxy = createProxyMiddleware({
      target: url,  // Menggunakan proxy yang dipilih
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': '',  // Menghilangkan '/proxy' dari path URL
      },
      onProxyReq: (proxyReq, req, res) => {
        // Menambahkan query string jika diperlukan
        const { originalUrl } = req;
        proxyReq.path = originalUrl;
      },
      onError: (err, req, res) => {
        res.status(500).json({ error: "Proxy error", details: err.message });
      },
    });

    proxy(req, res);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch proxy", details: error.message });
  }
}
