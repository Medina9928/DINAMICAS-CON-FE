// Importa el componente SpeedInsights de Vercel
import { SpeedInsights } from "@vercel/speed-insights/next";
import '../styles/globals.css';  // Si tienes estilos globales

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* Aquí agregamos el componente SpeedInsights */}
      <SpeedInsights />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
