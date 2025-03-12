import { Page, Cookie } from 'puppeteer';
import fs from 'fs';

// Function to load cookies if they exist
export async function loadCookies(page: Page) {
    try {
        // Read cookies from the file
        const cookies: Cookie[] = JSON.parse(await fs.promises.readFile('./cookies.json', 'utf-8'));
        const context = page.browserContext();  // Get the browser context

        // Set cookies one by one
        for (const cookie of cookies) {
            await context.setCookie(cookie);  // Use setCookie to set individual cookies
        }
        console.log("Cookies loaded.");
    } catch (error) {
        console.log("Could not load cookies.");
    }
}

export async function saveCookies(page: Page) {
    const cookies = await page.cookies();
    fs.writeFileSync('./cookies.json', JSON.stringify(cookies));  // Guardamos las cookies en un archivo JSON
    console.log("Cookies guardadas.");
}
