import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist'
  },
  plugins: [
    // El plugin basicSsl genera un certificado falso localmente para habilitar HTTPS.
    // Esto es REQUERIDO por Chrome en Android para habilitar la Web NFC API.
    basicSsl()
  ],
  server: {
    host: true, // Para poder acceder desde otros dispositivos en la red local
    port: 5173
  }
});
