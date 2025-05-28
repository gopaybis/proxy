// api/server.js
import axios from 'axios';

const proxyListUrl = 'https://raw.githubusercontent.com/gopaybis/Proxylist/refs/heads/main/proxyiplengkap1.txt';

async function getProxyList() {
  try {
    console.log('Fetching proxy list...');
    const response = await axios.get(proxyListUrl);
    const proxies = response.data.split('\n').filter(line => line.trim() !== '');
    console.log('Proxy list fetched, number of proxies:', proxies.length);

    // Ambil proxy pertama untuk testing
    const randomProxy = proxies[0].split(',');
    const [proxyIp, port] = randomProxy;

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

  if (!query.url) {
    return res.status(400).json({ error: "Missing target URL in query parameter" });
  }

  try {
    const { url } = await getProxyList(); // Ambil proxy acak
    console.log('Using proxy:', url);

    // Mengirimkan respons dengan proxy yang digunakan
    res.status(200).json({ message: 'Proxy request received', url: query.url, proxy: url });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch proxy list', details: error.message });
  }
}
