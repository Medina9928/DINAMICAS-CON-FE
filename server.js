const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const WS_PORT = 5001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data file path
const DATA_FILE = 'numbers.json';

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// API endpoint to get numbers
app.get('/api/numbers', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// API endpoint to update numbers
app.post('/api/numbers', (req, res) => {
    const { number, selected } = req.body;
    let data = JSON.parse(fs.readFileSync(DATA_FILE));
    
    if (selected) {
        if (!data.some(n => n.number === number)) {
            data.push({ number, selected });
        }
    } else {
        data = data.filter(n => n.number !== number);
    }
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true });
    
    // Broadcast update to all WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ number, selected }));
        }
    });
});

// Start HTTP server
const server = app.listen(PORT, () => {
    console.log(`HTTP Server running on port ${PORT}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket Server running on port ${WS_PORT}`);