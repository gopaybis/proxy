// api/server.js
import axios from 'axios';

const proxyListUrl = 'https://raw.githubusercontent.com/gopaybis/Proxylist/refs/heads/main/proxyiplengkap1.txt';

async function getProxyList() {
  try {
    console.log('Fetching proxy list...');
    const response = await axios.get(proxyListUrl);
    console.log('Proxy list fetched successfully:', response.data.slice(0, 100)); // Cek sebagian data
    const proxies = response.data.split('\n').filter(line => line.trim() !== '');
    return proxies;
  } catch (error) {
    console.error('Error fetching proxy list:', error);
    throw new Error('Failed to fetch proxy list');
  }
}

export default async function handler(req, res) {
  const { query } = req;

  if (!query.url) {
    return res.status(400).json({ error: "Missing target URL in query parameter" });
  }

  try {
    const proxies = await getProxyList();
    console.log('Number of proxies fetched:', proxies.length); // Log jumlah proxy yang diambil

    // Kirim respons sederhana
    res.status(200).json({ message: 'Proxy list fetched', proxiesCount: proxies.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proxy list', details: error.message });
  }
}
