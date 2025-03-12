import puppeteer, { Browser, Page } from 'puppeteer';
import { loadCookies } from '../navigationTools/loadCookis';

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.109 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:53.0) Gecko/20100101 Firefox/53.0',
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134'
];

let browserInstance: Browser | null = null;

export async function startBrowser(): Promise<Browser> {
    if (browserInstance) {
        console.log('El navegador ya está en ejecución.');
        return browserInstance;
    }

    try {
        browserInstance = await puppeteer.launch({
            headless: false,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-software-rasterizer'
            ],
            slowMo: 200,
        });

        console.log('Navegador iniciado correctamente.');
        return browserInstance;
    } catch (error) {
        console.error('Error al iniciar el navegador:', error);
        throw error;
    }
}

export async function openNewPage(browser: Browser): Promise<Page> {
    const page = await browser.newPage();
    const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    await page.setUserAgent(userAgent);

    // Carga las cookies si ya existen
    await loadCookies(page);
    return page;
}

export async function closeBrowser(browser: Browser) {
    try {
        if (browser && browser.process()) {
            console.log('Cerrando el navegador...');
            process.kill(browser.process()?.pid as number, 'SIGTERM');
        }
        await browser.close();
        browserInstance = null;
    } catch (error) {
        console.error('Error cerrando el navegador:', error);
    }
}

// Maneja la salida del proceso y cierra Puppeteer correctamente
process.on('exit', async () => {
    console.log('Cerrando navegador debido a la salida del proceso.');
    if (browserInstance) {
        await closeBrowser(browserInstance);
    }
});

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, async () => {
        console.log(`Recibida señal ${signal}, cerrando navegador.`);
        if (browserInstance) {
            await closeBrowser(browserInstance);
        }
        process.exit(0);
    });
});
