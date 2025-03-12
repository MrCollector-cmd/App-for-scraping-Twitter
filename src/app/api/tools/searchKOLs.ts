import { startBrowser, openNewPage, closeBrowser } from '../scraper/puppeteerSetup';
import { extractTweets } from '../scraper/tweetEctractor';
import { createInfoDirectory, loadExistingData, saveData } from '../utils/fileHandle';

// Define el tipo para los datos que quieres almacenar (puedes ajustarlo si es necesario)
interface UserTweetsData {
    [key: string]: any; // 'any' es un marcador, puedes especificar un tipo más detallado si lo deseas
}

export async function SearchTweetsFromUsers(usernames: string[]): Promise<void> {
    await createInfoDirectory();
    const fileName = 'infoKOLs.json';
    
    // Cargar los datos existentes con el tipo UserTweetsData
    let existingData: UserTweetsData = await loadExistingData(fileName);
    let browser;

    try {
        browser = await startBrowser();
        // Crea una nueva página para cada tarea
        const page = await openNewPage(browser);

        for (const username of usernames) {
            try {
                const formattedUsername = username.startsWith('@') ? username.slice(1) : username;
                const tweetsData = await extractTweets(page, formattedUsername);

                // Asegúrate de que los datos se guardan correctamente
                existingData[formattedUsername] = tweetsData;
                await saveData(existingData, fileName); 
            } catch (pageError) {
                console.error(`Error al procesar el usuario ${username}:`, pageError);
            }
        }
    } catch (browserError) {
        console.error('Error al iniciar Puppeteer:', browserError);
    } finally {
        if (browser) {
            await closeBrowser(browser);
        }
    }
}
