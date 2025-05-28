const { createProxyMiddleware } = require('http-proxy-middleware');

// Proxy statis untuk uji coba
const proxy = createProxyMiddleware({
  target: 'http://5.44.42.166:2053', // Uji dengan proxy manual
  changeOrigin: true,
  pathRewrite: {
    '^/api/server': '',  // Menghilangkan '/api/server' dari path URL
  },
});

export default function handler(req, res) {
  proxy(req, res);
}
