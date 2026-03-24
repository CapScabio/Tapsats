# 🎤 Pitch TapSats - FOUNDATIONS Hackathon 2026

**Duración estimada:** ~3 Minutos (Aprox. 400 palabras)
**Tono:** Enérgico, técnico pero accesible, enfocado en resolver fricción real.

---

### 1. El Gancho y el Problema (0:00 - 0:40)
"¡Hola a todos! Somos el equipo La Crypta. 
La Lightning Network ya nos dio pagos instantáneos y comisiones casi nulas, pero seamos sinceros... a la hora de pagar un café en el mundo real, la experiencia se rompe. 

Sacar el teléfono, desbloquearlo, abrir la wallet, esperar que cargue la cámara, encuadrar un código QR, confirmar el monto... Todo eso genera fricción en un mostrador lleno de gente. La gente en los comercios está acostumbrada a 'apoyar la tarjeta y listo'. ¿Por qué con Bitcoin es más difícil? 

¡No tiene por qué serlo!"

### 2. La Solución y el Producto (0:40 - 1:20)
"Les presentamos **TapSats**. La forma más rápida de cobrar en persona sobre la Lightning Network.

TapSats convierte cualquier teléfono Android del comerciante en una terminal POS ultrarrápida. No hay que instalar apps nativas ni comprar hardware costoso, funciona directamente en el navegador del celular como una PWA.

Pero la verdadera magia está en la experiencia del cliente: el comerciante ingresa el monto, el cliente simplemente **acerca su anillo NFC (o tarjeta)** al teléfono, y el pago se completa en menos de 2 segundos. Silencioso, sin cámaras, sin friction."

### 3. ¿Cómo funciona la Magia? (Tech & Arq) (1:20 - 2:00)
"Técnicamente, estamos combinando la magia de la **API Web NFC** en el navegador y el poder del estándar **Nostr Wallet Connect (NWC)** a través del SDK de Alby. 

El anillo del cliente funciona como un portador pasivo de una cadena segura de NWC. Cuando lo acercás a TapSats, nuestra terminal levanta esa conexión, genera un Invoice BOLT11 apuntando a la Lightning Address del local, y le pide a la billetera del cliente que lo pague automáticamente por detrás.

Todo manteniendo una filosofía 100% *Non-Custodial*. El comerciante cobra directo a su nodo o wallet preferida. Y para mayor seguridad, el cliente configura su anillo con un límite de gasto diario a través de NWC, por lo que si pierde el anillo sus fondos principales están a salvo."

### 4. Edge Cases y Escalabilidad (2:00 - 2:30)
"En esta hackathon no nos quedamos solo con el MVP ideal. Sabemos que la calle es otra cosa.
Por eso abstrajimos la lógica de la Interfaz en una pequeña máquina de estados robusta. Tenemos Timeouts controlados si la conexión falla o el internet está lento. Y fundamental: tenemos un plan B." *(Acá mostrás la pantalla de la app)*. "Si un cliente no tiene anillo NFC, con un solo botón la app genera en pantalla completa el QR de toda la vida para que nadie se quede sin pagar."


### 5. Visión a Futuro y Cierre (2:30 - 3:00)
"Este es el paso 1 de nuestro roadmap en las Hackathons de 2026. Los próximos meses implementaremos delegación para empleados usando cuentas npub de Nostr y Zaps sociales integrados.

Democratizar los pagos es hacerlos más humanos y veloces. Con TapSats, estamos listos para que cada negocio del mundo pueda aceptar sats como si fuera magia. 

Muchas gracias al jurado."

---

## 📝 Tips para la demostración en vivo (Opcional):
- Si lográs conseguir algún anillo o tarjeta NFC durante tu ronda, **mostralo visualmente al jurado** mientras hablás de NWC.
- Al llegar a la parte del *"Plan B"*, agarrá el celular y tocá el botón **"Mostrar QR"** frente a ellos para evidenciar que construiste un producto completo y preparado para edge-cases.
