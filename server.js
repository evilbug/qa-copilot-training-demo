const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const ROOT = path.join(__dirname, 'app');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

http
  .createServer((req, res) => {
    const requestedPath = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(ROOT, requestedPath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'text/plain' });
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Demo app running at http://localhost:${PORT}`);
  });
