import { startBrowser, openNewPage, closeBrowser } from '../scraper/puppeteerSetup';
import { extractTweetsByHashtag } from '../scraper/hashtagExtractor';
import { createInfoDirectory, loadExistingData, saveData } from '../utils/fileHandle';
import { delay } from '../utils/delay';

export async function SearchTweetsInHashtags(hashtags: string[]): Promise<void> {
    await createInfoDirectory();
    let existingData = await loadExistingData('infoHashtag.json');
    let browser;

    try {
        browser = await startBrowser();
        const page = await openNewPage(browser);

        for (const hashtag of hashtags) {
            try {
                const tweetsData = await extractTweetsByHashtag(page, hashtag);
                existingData[hashtag] = tweetsData;
                await saveData(existingData, 'infoHashtag.json');

                // Pequeño delay entre búsquedas para evitar bloqueos
                await delay(3000);
            } catch (pageError) {
                console.error(`Error al procesar el hashtag ${hashtag}:`, pageError);
            }
        }
    } catch (browserError) {
        console.error('Error al iniciar Puppeteer:', browserError);
    } finally {
        if (browser) {
            // cierra el navegador 
            await closeBrowser(browser);
        }
    }
}
