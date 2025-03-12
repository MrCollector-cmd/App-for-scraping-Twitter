import { Page } from 'puppeteer';
import { delay } from '../utils/delay';
import { checkRateLimit } from '../managErrors/limitRate';
import { retryRequest } from '../managErrors/retryRequest';

export async function extractTweetsByHashtag(page: Page, hashtag: string): Promise<any[]> {
    const formattedHashtag = hashtag.startsWith('#') ? hashtag.slice(1) : hashtag;
    const url = `https://nitter.net/search?q=%23${encodeURIComponent(formattedHashtag)}`;
    const urlAux1 = `https://nitter.poast.org/search?f=tweets&q=%23${formattedHashtag}`;
    const urlAux2 = `https://xcancel.com/search?f=tweets&q=%23${formattedHashtag}`;
    const urlAux3 = `https://nitter.space/search?f=tweets&q=%23${formattedHashtag}`;

    console.log(`Buscando tweets en: ${url}`);

    let currentUrlUsed: string;
    try {
        // Se intenta cargar la página usando las URLs en orden de prioridad y se guarda la URL final usada
        currentUrlUsed = await retryRequest(page, url, urlAux1, urlAux2, urlAux3);
    } catch (error) {
        console.error(`Error al cargar la página: ${error}`);
        return [];
    }

    // Esperamos a que aparezcan los tweets (aumenta el timeout si es necesario)
    await page.waitForSelector('.tweet-body', { timeout: 5000 }).catch(() => null);

    let tweetCount = 0;
    try {
        tweetCount = await page.$$eval('.tweet-body', tweets => tweets.length);
    } catch (error) {
        console.error('Error al evaluar tweet count:', error);
        tweetCount = 0;
    }
    let attempts = 0;

    while (tweetCount < 10 && attempts < 5) {
        const isRateLimited = await checkRateLimit(page);
        if (isRateLimited) {
            console.log("Limitación de tasa detectada al intentar cargar más tweets. Forzando cambio a URL auxiliar 3...");
            // Forzamos la navegación a urlAux3
            try {
                currentUrlUsed = urlAux3;
                console.log(`Cargando URL: ${currentUrlUsed} (forzado), Intento ${attempts + 1}`);
                await page.goto(currentUrlUsed, { waitUntil: 'networkidle2', timeout: 50000 });
                await page.waitForSelector('.tweet-body', { timeout: 5000 }).catch(() => null);
                tweetCount = await page.$$eval('.tweet-body', tweets => tweets.length);
            } catch (error) {
                console.error("Error al cargar URL auxiliar 3 durante la extracción:", error);
                return [];
            }
        } else {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            await delay(1000);
            try {
                tweetCount = await page.$$eval('.tweet-body', tweets => tweets.length);
            } catch (error) {
                console.error('Error al evaluar tweet count durante el scroll:', error);
                tweetCount = 0;
            }
        }
        attempts++;
    }

    return await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.tweet-body')).slice(0, 10).map(tweet => {
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
