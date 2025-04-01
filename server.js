const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const WS_PORT = 5001;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Sirve archivos estáticos (HTML, CSS, JS)

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'numbers.json');

// Inicializa el archivo de datos si no existe
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// API endpoint para obtener números
app.get('/api/numbers', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data);
});

// API endpoint para actualizar números
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

// Iniciar el servidor HTTP
const server = app.listen(PORT, () => {
    console.log(`Servidor HTTP corriendo en el puerto ${PORT}`);
});

// Servidor WebSocket
const wss = new WebSocket.Server({ port: WS_PORT });

wss.on('connection', (ws) => {
    console.log('Nuevo cliente WebSocket conectado');
    
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

console.log(`Servidor WebSocket corriendo en el puerto ${WS_PORT}`);
