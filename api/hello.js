export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new Response('¡Hola desde el borde de Vercel!', {
    status: 200,
  });
}
