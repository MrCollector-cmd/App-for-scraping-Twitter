import { startBrowser, openNewPage, closeBrowser } from '../scraper/puppeteerSetup';
import { extractTweetsByHashtag } from '../scraper/hashtagExtractor';
import { createInfoDirectory, loadExistingData, saveData } from '../utils/fileHandle';
import { delay } from '../utils/delay';

// Definir el tipo de datos que esperamos guardar para cada hashtag
interface HashtagData {
    [key: string]: any; // Aquí puedes especificar un tipo más detallado para los datos si lo necesitas
}

export async function SearchTweetsInHashtags(hashtags: string[]): Promise<void> {
    await createInfoDirectory();
    
    // Cargar los datos existentes con el tipo HashtagData
    let existingData: HashtagData = await loadExistingData('infoHashtag.json');
    let browser;

    try {
        browser = await startBrowser();
        const page = await openNewPage(browser);

        // Procesar cada hashtag
        for (const hashtag of hashtags) {
            try {
                // Extraer los tweets asociados al hashtag
                const tweetsData = await extractTweetsByHashtag(page, hashtag);

                // Guardar los datos de tweets asociados al hashtag
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
            // Cerrar el navegador
            await closeBrowser(browser);
        }
    }
}
