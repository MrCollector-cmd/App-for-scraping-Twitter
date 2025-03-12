import { startBrowser, openNewPage, closeBrowser } from '../scraper/puppeteerSetup';
import { extractTweets } from '../scraper/tweetEctractor';
import { createInfoDirectory, loadExistingData, saveData } from '../utils/fileHandle';

export async function SearchTweetsFromUsers(usernames: string[]): Promise<void> {
    await createInfoDirectory();
    const fileName = 'infoKOLs.json'; // Define el archivo específico a usar
    let existingData = await loadExistingData(fileName);
    let browser;

    try {
        browser = await startBrowser();
        const page = await openNewPage(browser);

        for (const username of usernames) {
            try {
                const formattedUsername = username.startsWith('@') ? username.slice(1) : username;
                const tweetsData = await extractTweets(page, formattedUsername);

                existingData[formattedUsername] = tweetsData;
                await saveData(existingData, fileName); // Guarda en el archivo correcto
            } catch (pageError) {
                console.error(`Error al procesar el usuario ${username}:`, pageError);
            }
        }
    } catch (browserError) {
        console.error('Error al iniciar Puppeteer:', browserError);
    } finally {
        if (browser) {
            await await closeBrowser(browser)
        }
    }
}