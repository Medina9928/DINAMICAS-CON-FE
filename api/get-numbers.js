export const config = { runtime: 'edge' };

// Importar el archivo JSON directamente
import numerosVendidos from '../numeros-vendidos.json';

export default async function handler(request) {
  // Devolver los números vendidos como respuesta
  return new Response(JSON.stringify({ vendidos: numerosVendidos.vendidos }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
