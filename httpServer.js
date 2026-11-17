const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

let foods = [
  { id: 1, foodName: 'Pizza', category: 'Fast Food', price: 250, availability: true },
  { id: 2, foodName: 'Burger', category: 'Fast Food', price: 180, availability: true },
  { id: 3, foodName: 'Salad', category: 'Healthy', price: 140, availability: false },
];

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function isValidFood(data) {
  return (
    data &&
    typeof data.id === 'number' &&
    Number.isInteger(data.id) &&
    data.id > 0 &&
    typeof data.foodName === 'string' && data.foodName.trim() !== '' &&
    typeof data.category === 'string' && data.category.trim() !== '' &&
    typeof data.price === 'number' && data.price > 0 &&
    typeof data.availability === 'boolean'
  );
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>Restaurant Welcome</title></head>
        <body>
          <h1>Welcome to Our Restaurant</h1>
          <p>Enjoy fresh meals and tasty food options.</p>
        </body>
      </html>
    `);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/foods') {
    const availableFoods = foods.filter((food) => food.availability === true);
    sendJson(res, 200, availableFoods);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head><title>About Us</title></head>
        <body>
          <h1>About Our Restaurant</h1>
          <p>We serve delicious food with quality ingredients and quick service.</p>
        </body>
      </html>
    `);
    return;
  }

  if (req.method === 'GET' && url.pathname === '/menu') {
    const menuPath = path.join(__dirname, 'public', 'menu.html');
    fs.readFile(menuPath, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Unable to read menu file.' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (req.method === 'POST' && url.pathname === '/add-food') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);

        if (!isValidFood(parsedBody)) {
          sendJson(res, 400, { message: 'Invalid JSON or missing required fields.' });
          return;
        }

        foods.push(parsedBody);
        sendJson(res, 201, { message: 'Food item added successfully.', food: parsedBody });
      } catch (error) {
        sendJson(res, 400, { message: 'Invalid JSON or missing required fields.' });
      }
    });
    return;
  }

  sendJson(res, 404, { message: 'Route not found.' });
});

server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});
