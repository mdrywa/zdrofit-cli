import {
    chromium,
    type Browser,
    type BrowserContext,
    type Page,
} from "playwright";

const browsers = new Map<boolean, Browser>();

export async function createBrowserSession(headless: boolean): Promise<{ context: BrowserContext; page: Page }> {
    let browser = browsers.get(headless);

    if (!browser || !browser.isConnected()) {
        browser = await chromium.launch({
            headless,
        });

        browsers.set(headless, browser);
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    return {context, page};
}

export async function closeBrowserSession(context: BrowserContext): Promise<void> {
    await context.close();
}

export async function closeBrowser(): Promise<void> {
    const browserInstances = [...browsers.values()];

    browsers.clear();

    await Promise.all(
        browserInstances.map(browser => browser.close()),
    );
}
