const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('path');

const hostname = 'localhost';
const port = 8080;
const routes = {
  '/': 'index.html',
  '/about': 'about.html',
  '/contact': 'contact-me.html'
};

const server = createServer((req, res) => {
  // Figure out what exactly is being requested
  const requestedURL = new URL(req.url, `http://${hostname}:${port}/`);
  const requestedPath = requestedURL.pathname;

  let normalizedPath = requestedPath;
  if (normalizedPath.length > 1 && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  const responseFilename = routes[normalizedPath] || '404.html';
  const responseFilepath = path.join(__dirname, responseFilename);

  // (attempt to) Read in the requested html file using fs
  fs.readFile(responseFilepath, 'utf8', (err, data) => {
    if (err) {
      res.statusCode = 500;
      res.end('Server Error');
      console.error(err);
      return;
    }

    res.statusCode = responseFilename === '404.html' ? 404 : 200;
    console.log(res.statusCode);
    res.setHeader('Content-Type', 'text/html');
    res.end(data);
  });

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});