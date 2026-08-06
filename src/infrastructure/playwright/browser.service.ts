import {
    chromium,
    type Browser,
    type BrowserContext,
    type Page,
} from "playwright";

let browser: Browser | null = null;

export async function createBrowserSession(headless: boolean): Promise<{context: BrowserContext; page: Page}> {
    if (!browser) {
        browser = await chromium.launch({
            headless,
        });
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    return {context, page};
}

export async function closeBrowserSession(context: BrowserContext): Promise<void> {
    await context.close();
}

export async function closeBrowser(): Promise<void> {
    if (!browser) {
        return;
    }

    await browser.close();
    browser = null;
}
