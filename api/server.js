// api/server.js
import axios from 'axios';

const proxyListUrl = 'https://raw.githubusercontent.com/gopaybis/Proxylist/refs/heads/main/proxyiplengkap1.txt';

async function getProxyList() {
  try {
    console.log('Fetching proxy list...');
    const response = await axios.get(proxyListUrl);

    // Log sebagian data untuk memverifikasi bahwa data bisa diterima
    console.log('Proxy list fetched:', response.data.slice(0, 100));

    const proxies = response.data.split('\n').filter(line => line.trim() !== '');
    console.log('Number of proxies:', proxies.length);

    if (proxies.length === 0) {
      throw new Error('No proxies found');
    }

    return proxies;
  } catch (error) {
    console.error('Error fetching proxy list:', error);
    throw new Error('Failed to fetch proxy list');
  }
}

export default async function handler(req, res) {
  const { query } = req;

  // Pastikan ada parameter URL
  if (!query.url) {
    return res.status(400).json({ error: "Missing target URL in query parameter" });
  }

  try {
    // Coba ambil proxy list
    const proxies = await getProxyList();
    console.log('Using first proxy:', proxies[0]);  // Log proxy yang pertama

    res.status(200).json({
      message: 'Proxy list fetched successfully',
      proxy: proxies[0], // Menampilkan proxy pertama sebagai contoh
      proxyCount: proxies.length
    });
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: 'Failed to fetch proxy list', details: error.message });
  }
}
