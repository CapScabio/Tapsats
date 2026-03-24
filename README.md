<div align="center">
  <img src="https://alby-builds.s3.amazonaws.com/media/bitcoin-lightning-nostr.png" alt="Lightning Logo" width="120" />
  <h1>⚡ TapSats</h1>
  
  <p>
    <strong>La forma más rápida de cobrar en persona usando Lightning Network.</strong>
  </p>

  <p>
    Construido para <b>FOUNDATIONS Hackathon 2026</b> por <i>La Crypta</i>.
  </p>

  <h3>
    📖 <a href="docs/OPERATIONS.md">Documentación Operativa (Manual)</a>
  </h3>

  <h3>
    🌐 <a href="https://tapsats.vercel.app/">Probar Demo en Vivo (Vercel)</a> 🌐
  </h3>

  <!-- Badges -->
  <p>
    <img alt="Lightning Network" src="https://img.shields.io/badge/Lightning_Network-792EE5?style=for-the-badge&logo=lightning&logoColor=white" />
    <img alt="Nostr" src="https://img.shields.io/badge/Nostr-9C27B0?style=for-the-badge&logo=nostr&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" />
    <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
  </p>
</div>

---

## 🎯 ¿Qué es TapSats?

**TapSats** convierte cualquier smartphone Android con NFC en una terminal de cobro ultrarrápida (POS), permitiendo a los comerciantes cobrar en satoshis simplemente acercando el **anillo inteligente NFC** del cliente al celular.

Atrás quedaron los días de escanear códigos QR lentamente. Con la magia de la API **Web NFC** y el estándar **Nostr Wallet Connect (NWC)**, los pagos fluyen de manera silenciosa, nativa y segura.

### ✨ Características Principales

- ⚡ **Cobros con 1-Toque**: El cliente acerca el anillo, el comerciante recibe los sats en 2 segundos.
- 📱 **Sin Apps que Instalar (PWA Ready)**: Funciona directamente en el navegador de tu celular (Chrome Android). 
- 🛡️ **100% Non-Custodial**: El comerciante define dónde recibe sus fondos con cualquier Lightning Address (ej: `el-bar@getalby.com`).
- 🔐 **Control Total**: El usuario configura su propio anillo vinculando su billetera personal gracias a la interoperabilidad de NWC (Nostr Wallet Connect).

---

## 🏗️ Arquitectura y Tecnologías

El proyecto es simple, liviano y poderoso. Está diseñado "Mobile First" y no requiere backend tradicional, aprovechando la infraestructura descentralizada de Lightning.

| Frontend | Hardware | Abstracción Lightning |
| :---: | :---: | :---: |
| Vanilla JS + CSS Moderno + **Vite** | `window.NDEFReader` (Web NFC API) para lectura/escritura asíncrona de Cadenas NWC | `@getalby/sdk` y `@getalby/lightning-tools` para NWC e Invoices (BOLT11) |

> 🔒 **Seguridad (Opcional/Futuro)**: NWC permite crear conexiones limitadas (ej. máximo 50.000 sats al día) asegurando que si pierdes el anillo, tus fondos principales están a salvo.

---

## 📱 Configuración básica para uso

### 🛠️ Paso 1: Configurar un Anillo ("Cliente")
1. Consigue una cadena NWC desde el dashboard de [Alby](https://nwc.getalby.com/). ¡Recomendamos crear una conexión con límite diario estricto!
2. En la app del teléfono, ve a **"Configurar Anillo"**.
3. Pega la URL NWC, presiona escribir y acerca el anillo a la antena de tu teléfono.

### 💰 Paso 2: Cobrar ("Comerciante")
1. Ve a la pestaña **"Cobrar"**.
2. Ingresa el monto (ej. 100 sats) y tu Lightning Address comercial.
3. Presiona **"Escanear"**, acerca el anillo del cliente... ¡y *voilà*! La aplicación se conectará silenciosamente a NWC, resolverá el LNURL del comerciante y ejecutará el pago exitosamente.

> 📸 **Fallback QR (Manual):** ¿El cliente no tiene su anillo a mano o falla la lectura NFC? ¡No hay problema! Pulsa el botón **"Mostrar QR"** para generar instantáneamente un código BOLT11 en pantalla. El cliente podrá pagarlo escaneándolo con su billetera Lightning favorita (Muun, Wallet of Satoshi, etc.), manteniendo a TapSats como tu única terminal POS.

---

## 🏆 Proyecto FOUNDATIONS

Este proyecto responde al desafío **Lightning Payments Basics** de la hackathon *FOUNDATIONS* (Marzo 2026).

**Logros del proyecto:**
* ✅ Integra de forma nativa `@getalby/sdk` para NWC.  
* ✅ Integra de forma nativa `@getalby/lightning-tools`.  
* ✅ Implementa una nueva UX de interacción P2P usando Web NFC reduciendo la fricción de los códigos QR.  

---

## 🚀 Roadmap hacia la Adopción (8 Meses)

**TapSats** está diseñado para evolucionar mes a mes siguiendo el programa oficial de las **Lightning Hackathons 2026**, para llegar a Octubre con un producto PWA _production-ready_.

| Mes | Temática Hackathon | Hito de TapSats ⚡ |
| :---: | :--- | :--- |
| **Marzo**  | `FOUNDATIONS` | **MVP 1-Toque**: Cobro de LNURL via Web NFC hacia un Lighning Address y conectividad básica en JS/Vite. |
| **Abril**  | `IDENTITY` | **Onboarding Nostr**: Login de comerciantes mediante su `npub` para delegar automáticamente su perfil y configuración de pago en la terminal. |
| **Mayo**   | `ZAPS` | **Zap Receipts**: Los cobros se transforman en Zaps sociales y públicos, creando un historial inmutable y de agradecimiento al comprador. |
| **Junio**  | `COMMERCE` | **Smart POS**: Menú básico de productos (precio harcodeado ej: "Café") e integración opcional de propinas antes del tap. |
| **Julio**  | `MEDIA` | **Blossom CDN**: Alojamiento descentralizado de los recibos de las tiendas, banners de perfil e imágenes del menú para evitar servidores estáticos. |
| **Agosto** | `AI AGENTS`| **AI Accountant**: Agente autónomo nocturno que envía al NIP-04 (DM) del comerciante un resumen y sugerencia de precios según inflación y ventas por LN. |
| **Sept.**  | `INFRASTRUCTURE` | **LSP Integrado**: Creación de canales Lightning "just-in-time" en el fondo si el comercio que recibe el pago NFC carece de Inbound Liquidity. |
| **Oct.**   | `INTEGRATION` | **Launch Real**: PWA full-stack instalable desde el navegador. Completa, con métricas de caja y soporte delegado (multi-empleado). |

---

<div align="center">
  <br />
  <p><i>Hecho con ⚡ por CapScabio — ¡Salud y Libertad compañeros! 🇦🇷</i></p>
</div>