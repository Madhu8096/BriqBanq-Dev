/**
 * Simple production server with SPA fallback.
 * Run after `npm run build`: node server.js
 * Then open http://localhost:3000/ and http://localhost:3000/lawyer
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const MIMES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  const hasExtension = path.extname(url);
  // SPA: serve index.html for any path without a file extension (/, /lawyer, /borrower, etc.)
  const serveIndex = url === '/' || !hasExtension;
  const filePath = serveIndex
    ? path.join(DIST, 'index.html')
    : path.join(DIST, url.startsWith('/') ? url.slice(1) : url);

  fs.readFile(filePath, (err, data) => {
    if (err && !serveIndex) {
      fs.readFile(path.join(DIST, 'index.html'), (err2, indexData) => {
        if (err2) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexData);
      });
      return;
    }
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIMES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving dist at http://localhost:${PORT}`);
  console.log('  Home: http://localhost:' + PORT + '/');
  console.log('  Lawyer: http://localhost:' + PORT + '/lawyer');
  console.log('  Borrower: http://localhost:' + PORT + '/borrower');
});
