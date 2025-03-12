import { Page } from 'puppeteer';
import { delay } from '../utils/delay';
import { checkRateLimit } from '../managErrors/limitRate'; // Asegúrate de importar checkRateLimit
import { retryRequest } from '../managErrors/retryRequest'; // Asegúrate de importar retryRequest

export async function extractTweets(page: Page, username: string): Promise<any[]> {
    const url = `https://nitter.net/${encodeURIComponent(username)}`;
    const urlAux1 = `nitter.poast.org/${encodeURIComponent(username)}`;
    const urlAux2 = `https://xcancel.com/${encodeURIComponent(username)}`;
    const urlAux3 = `https://nitter.space/${encodeURIComponent(username)}`;

    console.log(`Buscando tweets del usuario: ${url}`);

    let currentUrlUsed: string;
    try {
        // Intentamos cargar la página usando las URLs en orden de prioridad
        currentUrlUsed = await retryRequest(page, url, urlAux1, urlAux2, urlAux3);
    } catch (error) {
        console.error(`Error al cargar la página: ${error}`);
        return [];
    }

    // Comprobamos si estamos bloqueados por límite de tasa antes de proceder
    const isRateLimited = await checkRateLimit(page);
    if (isRateLimited) {
        console.log("Ejecución detenida debido a limitaciones de tasa.");
        return []; // Retornamos un arreglo vacío si hemos alcanzado el límite
    }

    await page.goto(currentUrlUsed, { waitUntil: 'domcontentloaded', timeout: 50000 });

    // Espera hasta que se hayan cargado al menos 5 tweets (máximo 5 intentos).
    let tweetCount = await page.$$eval('.tweet-body', tweets => tweets.length);
    let attempts = 0;
    while (tweetCount < 5 && attempts < 5) {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await delay(600);
        tweetCount = await page.$$eval('.tweet-body', tweets => tweets.length);
        attempts++;
    }

    return await page.evaluate(() => {
        const tweetNodes = Array.from(document.querySelectorAll('.tweet-body')).slice(0, 5);
        return tweetNodes.map(tweet => {
            const elapsedElement = tweet.querySelector('.tweet-date a');
            const elapsed = elapsedElement ? elapsedElement.textContent?.trim() : '';
            const date = elapsedElement ? elapsedElement.getAttribute('title') : '';
            const usernameElement = tweet.querySelector('.tweet-header .username');
            const username = usernameElement ? usernameElement.textContent?.trim() : '';
            const messageElement = tweet.querySelector('.tweet-content');
            const message = messageElement ? messageElement.textContent?.trim() : '';

            let hearts = 0;
            const tweetStats = tweet.querySelector('.tweet-stats');
            if (tweetStats) {
                const heartContainer = Array.from(tweetStats.querySelectorAll('.tweet-stat'))
                    .find(stat => stat.innerHTML.includes('icon-heart'));
                if (heartContainer) {
                    const text = heartContainer.textContent?.replace(/\D/g, '');
                    hearts = text ? parseInt(text) : 0;
                }
            }
            return { elapsed, date, username, message, hearts };
        });
    });
}
