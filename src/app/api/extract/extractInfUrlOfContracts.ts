import { Page } from 'puppeteer';
import { checkRateLimit } from '../managErrors/limitRate';

export async function extractInfUrlFromContract(page: Page, contractAddress: string): Promise<{
    imageUrl: string | null;
    nameToken: string | null;
    price: string | null;
    marketCap: string | null;
    currentSupply: string | null;
    holders: string | null;
    creationDate: string | null; 
}> {
    const url = `https://solscan.io/token/${contractAddress}`;
    console.log(`Accediendo a: ${url}`);

    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 50000 });

        const isRateLimited = await checkRateLimit(page);
        if (isRateLimited) {
            console.log("Ejecución detenida debido a limitaciones de tasa.");
            return { imageUrl: null, nameToken: null, price: null, marketCap: null, currentSupply: null, holders: null , creationDate: null };
        }

        await page.waitForSelector('img[alt="image"], img[alt="placeholder"], div.text-neutral5', { timeout: 10000 });

        const { imageUrl, nameToken, price, marketCap, currentSupply, holders, creationDate } = await page.evaluate(() => {
            const imageElement = document.querySelector('img[alt="image"], img[alt="placeholder"]') as HTMLImageElement;
            const tokenElement = document.querySelector('div.truncateWrapper h4 span') as HTMLElement;

            const priceElement = document.querySelector('div.flex.gap-2.flex-row.items-center.justify-start.flex-wrap span');
            const price = priceElement?.textContent?.trim() || null;

            const marketCapElement = document.querySelectorAll('div.max-w-24\\/24.md\\:max-w-14\\/24.flex-24\\/24.md\\:flex-14\\/24.block.relative.box-border.my-0.px-1')[0];
            const marketCap = marketCapElement?.textContent?.trim() || null;

            const currentSupplyElement = document.querySelectorAll('div.max-w-24\\/24.md\\:max-w-14\\/24.flex-24\\/24.md\\:flex-14\\/24.block.relative.box-border.my-0.px-1')[1];
            const currentSupply = currentSupplyElement?.textContent?.trim() || null;

            const holdersElement = document.querySelector('div.flex.gap-2.flex-row.items-stretch.justify-start.flex-wrap div.not-italic.font-normal.text-neutral7.text-\\[14px\\].leading-\\[24px\\]');
            const holders = holdersElement?.textContent?.trim() || null;

            // Selector corregido con escape de caracteres
            const dateElement = document.querySelector('div.not-italic.font-normal.text-neutral7.text-\\[12px\\].leading-\\[16px\\].truncate.w-\\[130px\\].text-left');
            const creationDate = dateElement?.textContent?.trim() || null;

            return {
                imageUrl: imageElement?.src || null,
                nameToken: tokenElement?.textContent?.trim() || null,
                price,
                marketCap,
                currentSupply,
                holders,
                creationDate
            };
        });

        return { imageUrl, nameToken, price, marketCap, currentSupply, holders, creationDate };
    } catch (error) {
        console.error(`Error al acceder o extraer los datos del contrato: ${error}`);
        return { imageUrl: null, nameToken: null, price: null, marketCap: null, currentSupply: null, holders: null, creationDate: null };
    }
}
