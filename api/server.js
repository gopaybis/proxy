// api/server.js

export default async function handler(req, res) {
  const { query } = req;

  // Memastikan ada parameter yang valid dalam query
  if (!query.url) {
    return res.status(400).json({ error: "Missing target URL in query parameter" });
  }

  try {
    console.log('Received URL:', query.url); // Debugging

    // Mengirimkan respons sederhana tanpa proxy
    res.status(200).json({ message: 'Proxy request received', url: query.url });
  } catch (error) {
    console.error('Error in serverless function:', error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
}
