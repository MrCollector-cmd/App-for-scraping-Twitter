import { Page } from 'puppeteer';

export async function checkRateLimit(page: Page): Promise<boolean> {
    try {
        return await page.evaluate(() => {
            // Verifica el panel de error original
            const errorPanel = document.querySelector('.error-panel');
            // Verifica si existe un encabezado con el texto "403 | Forbidden"
            const header = document.querySelector('.header h1');
            // Verifica si existe algún <h1> que contenga "X Cancelled | Verifying your request"
            const verifyingRequest = document.querySelector('h1')?.textContent?.includes('X Cancelled | Verifying your request') ?? false;
            
            const hasRateLimitError = errorPanel?.textContent?.includes('Instance has no auth tokens, or is fully rate limited.') ?? false;
            const hasForbiddenError = header?.textContent?.includes('403 | Forbidden') ?? false;

            return hasRateLimitError || hasForbiddenError || verifyingRequest;
        });
    } catch {
        return false; // En caso de error, retorna false.
    }
}
