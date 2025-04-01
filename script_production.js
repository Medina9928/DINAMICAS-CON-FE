// Configuración WebSocket para producción/desarrollo
const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
const socket = new WebSocket(`${wsProtocol}${window.location.host}/ws`);

// Manejo de reconexión
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 5000; // 5 segundos

function setupWebSocket() {
  socket.onclose = (e) => {
    console.log('Conexión WebSocket cerrada. Intentando reconectar...');
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        reconnectAttempts++;
        setupWebSocket();
      }, reconnectDelay);
    }
  };

  socket.onerror = (err) => {
    console.error('Error en WebSocket:', err);
  };
}

// Resto del código original...
const numberButtons = document.querySelectorAll('.number-button');
let selectedNumbers = [];
let adminMode = false;
let soldNumbers = JSON.parse(localStorage.getItem('soldNumbers')) || [];

// Cargar números vendidos desde el servidor al inicio
async function loadSoldNumbers() {
    try {
        const response = await fetch('/api/numbers');
        if (!response.ok) throw new Error('Error al cargar números');
        const numbers = await response.json();
        soldNumbers = numbers.filter(num => num.selected).map(num => num.number);
        localStorage.setItem('soldNumbers', JSON.stringify(soldNumbers));
        updateNumberStates();
    } catch (err) {
        console.error('Error al cargar números vendidos:', err);
        // Usar localStorage como respaldo
        const localNumbers = JSON.parse(localStorage.getItem('soldNumbers')) || [];
        soldNumbers = localNumbers;
        updateNumberStates();
    }
}

// Iniciar conexión y cargar datos
setupWebSocket();
loadSoldNumbers();

// Resto del código original permanece igual...
[Rest of the original script.js content would follow here]