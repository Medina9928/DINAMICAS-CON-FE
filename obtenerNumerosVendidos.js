const fetch = require('node-fetch');

// URL de la configuración Edge
const EDGE_CONFIG_URL = 'https://edge-config.vercel.com/ecfg_9fhzpvxahkkajukuqgxaxqlfxdmo?token=334aa3f6-336c-468c-bf08-004ffd3f8b35';

// Función para obtener los números vendidos
async function obtenerNumerosVendidos() {
  try {
    const response = await fetch(EDGE_CONFIG_URL);
    if (!response.ok) {
      throw new Error('Error al obtener los números vendidos');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

module.exports = obtenerNumerosVendidos;
