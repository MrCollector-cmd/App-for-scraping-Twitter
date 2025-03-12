import { Page } from 'puppeteer';
import { delay } from '../utils/delay';
import { checkRateLimit } from '../managErrors/limitRate';

export async function retryRequest(
    page: Page,
    url: string,
    urlAux1: string,
    urlAux2: string,
    urlAux3: string,
    retries = 3,
    delayTime = 10000
): Promise<string> {
    let attempts = 0;
    let currentUrl = url; // Inicia con la URL principal

    while (attempts < retries) {
        try {
            // Consultamos si hay límite de tasa antes de navegar
            const isRateLimited = await checkRateLimit(page);
            console.log('checkRateLimit: ' + isRateLimited);
            if (isRateLimited) {
                if (currentUrl === url) {
                    console.log("Limitación de tasa detectada. Cambiando a URL auxiliar 1...");
                    currentUrl = urlAux1;
                } else if (currentUrl === urlAux1) {
                    console.log("Limitación de tasa detectada en URL auxiliar 1. Cambiando a URL auxiliar 2...");
                    currentUrl = urlAux2;
                } else if (currentUrl === urlAux2) {
                    console.log("Limitación de tasa detectada en URL auxiliar 2. Cambiando a URL auxiliar 3...");
                    currentUrl = urlAux3;
                } else {
                    console.log("Limitación de tasa detectada en URL auxiliar 3. No hay URL alternativa disponible.");
                }
            }

            console.log(`Cargando URL: ${currentUrl}, Intento ${attempts + 1}`);
            await page.goto(currentUrl, { waitUntil: 'networkidle2', timeout: 50000 });
            return currentUrl; // Retornamos la URL final usada
        } catch (error) {
            console.error(`Error en intento ${attempts + 1} al cargar ${currentUrl}: ${error}`);
            // En caso de error, si se estaba usando una URL auxiliar, forzamos el cambio a la siguiente
            if (currentUrl === urlAux1) {
                console.log("Error al cargar URL auxiliar 1. Cambiando a URL auxiliar 2...");
                currentUrl = urlAux2;
            } else if (currentUrl === urlAux2) {
                console.log("Error al cargar URL auxiliar 2. Cambiando a URL auxiliar 3...");
                currentUrl = urlAux3;
            }
            attempts++;
            if (attempts < retries) {
                console.log(`Reintentando en ${delayTime / 1000} segundos...`);
                await delay(delayTime);
                delayTime *= 2; // Incremento exponencial del tiempo de espera
            } else {
                throw new Error('Se alcanzó el máximo de intentos');
            }
        }
    }
    return currentUrl;
}