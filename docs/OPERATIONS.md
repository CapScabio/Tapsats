# Documentación Operativa: TapSats

## 1. Intro & Conceptos

TapSats convierte un smartphone con NFC en un terminal POS para recibir pagos vía Lightning Network.

- **Non-Custodial:** Los satoshis van directamente a la Lightning Address configurada.
- **NWC (Nostr Wallet Connect):** Utiliza este protocolo estándar para que el NFC asuma instrucciones de pago autorizadas por la wallet del usuario, en lugar de manejar firmas o llaves localmente.

---

## 2. Puesta en Producción (Despliegue)

TapSats es una PWA (Progressive Web App) y aplicación _Mobile First_ sin un backend complejo, ideal para hospedaje estático.

1. **Vercel / Netlify / Cloudflare Pages:**
   El proyecto utiliza `vite`. Para desplegar:
   ```bash
   npm run build
   ```
   Sube la carpeta `dist/` a tu proveedor de hosting favorito. Por defecto, funciona 'Plug and Play' en Vercel.
2. **Requisitos de Sistema:**
   La aplicación requiere ser servida bajo **HTTPS**. La API Web NFC no funcionará sin un contexto seguro.
   Asegúrate de probar en **Google Chrome para Android** (actualmente Safary en iOS no soporta la API Web NFC para *escritura* de la misma forma libre que Chrome).

---

## 3. Pruebas sin Hardware NFC (Testing)

Si no cuentas con un anillo NFC o un teléfono compatible a mano durante el desarrollo:

- **Modo Manual:** Puedes usar el botón "Pegar NWC manualmente" (icono de teclado) dentro de la interfaz. Esto simula que el NFC proporcionó correctamente la cadena nostr+walletconnect.
- **Mock Service:** En los tests (usando `vitest`) emulamos el API de `window.NDEFReader` para validar la lógica del frontend sin hardware.

---

## 4. Gestión de Riesgos y NWC

**Seguridad del Usuario (Cliente):**
- Cuando configuras el anillo NFC con una conexión NWC obtenida desde un proveedor (como Alby o Mutiny), es **crucial** configurar límites de gasto (*Budgets*). Por ejemplo: Límite diario de 5.000 o 20.000 sats.
- Si el anillo NFC es extraviado, el ladrón solo puede gastar (contactless) hasta el límite diario establecido en NWC. 
- Puedes desconectar o revocar el NWC desde la app de tu billetera principal instantáneamente en caso de robo.

**Manejo de Estados de Red y Fallas:**
- La interfaz ahora cuenta con _Timeouts_ en el escaneo y manejo de errores granulares.
- Si la conexión falla, se le notifica al comerciante en pantalla y no se emite el pago de la wallet NFC hasta confirmar el invoice.
