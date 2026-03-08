/**
 * Servicio para manejar la API Web NFC
 * Permite leer y escribir en el anillo (requiere Android Chrome)
 */

export class NFCService {
  constructor() {
    this.supported = 'NDEFReader' in window;
    if (this.supported) {
      this.reader = new window.NDEFReader();
    }
  }

  /**
   * Verifica si el navegador soporta Web NFC
   */
  isSupported() {
    return this.supported;
  }

  /**
   * Inicia el escaneo y lee el contenido NWC del anillo
   * @returns {Promise<string>} La cadena NWC almacenada en el anillo
   */
  async readNWC() {
    if (!this.supported) {
      throw new Error("Web NFC no está soportado en este navegador.");
    }

    try {
      await this.reader.scan();

      return new Promise((resolve, reject) => {
        // Configuramos un timeout por si el usuario cancela (opcional, dejamos que el UI lo maneje)

        this.reader.addEventListener("error", (error) => {
          console.error("NFC Error Event:", error);
          reject(`Error leyendo NFC: ${error.message}`);
        }, { once: true });

        this.reader.addEventListener("reading", ({ message, serialNumber }) => {
          console.log(`NFC leído. Serial: ${serialNumber}`);
          console.log(`Cantidad de records: ${message.records.length}`);

          let foundString = "";

          for (const record of message.records) {
            console.log(`Record encontrado: Type=${record.recordType}, Encoding=${record.encoding}`);
            if (record.recordType === "text" || record.recordType === "url") {
              const textDecoder = new TextDecoder(record.encoding);
              const content = textDecoder.decode(record.data);
              console.log(`Contenido decodificado: ${content}`);

              if (content.startsWith("nostr+walletconnect://") || content.includes("nostr+walletconnect://")) {
                // Si tiene algún prefijo o sufijo, nos quedamos solo con la URI pura
                const nwcMatch = content.match(/nostr\+walletconnect:\/\/[^\s]+/);
                if (nwcMatch) {
                  foundString = nwcMatch[0];
                }
              }
            } else {
              console.log("Record ignorado por no ser texto/url.");
            }
          }

          if (foundString) {
            console.log("¡Se encontró cadena NWC!");
            resolve(foundString);
          } else {
            console.log("No se encontró NWC en ningún record.");
            reject(new Error("El anillo se leyó correctamente, pero no contiene una cadena NWC válida. ¿Lo configuraste bien?"));
          }

        }, { once: true }); // Solo leemos una vez por llamada
      });

    } catch (error) {
      throw new Error(`Permiso denegado o error de NFC: ${error}`);
    }
  }

  /**
   * Escribe la cadena NWC proporcionada en el anillo NFC
   * @param {string} nwcString La cadena NWC de la wallet (obtenida de Alby/Mutiny, etc)
   */
  async writeNWC(nwcString) {
    if (!this.supported) {
      throw new Error("Web NFC no está soportado en este navegador.");
    }

    // Validar string básico
    if (!nwcString.startsWith("nostr+walletconnect://")) {
      throw new Error("El string no parece un NWC válido. Debe empezar con nostr+walletconnect://");
    }

    try {
      // Escribimos como un record tipo texto o URI
      await this.reader.write({
        records: [{ recordType: "url", data: nwcString }]
      });
      return true;
    } catch (error) {
      throw new Error(`Error al escribir en el anillo. ¿Tienes los permisos? Detalle: ${error}`);
    }
  }
}
