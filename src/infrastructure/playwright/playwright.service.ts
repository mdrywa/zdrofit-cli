import {chromium} from "playwright";
import type {BrowserContext, Page} from "playwright";
import {
    ZDROFIT_LOGIN_TIMEOUT_MS,
    ZDROFIT_SESSION_CHECK_TIMEOUT_MS,
    ZDROFIT_SESSION_COOKIE_NAME,
} from "../../zdrofit/zdrofit.constants.ts";
import {ZDROFIT_URLS} from "../../zdrofit/zdrofit.urls.ts";

const BROWSER_LAUNCH_TIMEOUT_MS = 30_000;
const PAGE_LOAD_TIMEOUT_MS = 30_000;

export async function loginInBrowser(email: string, password: string): Promise<string> {
    const browser = await chromium.launch({
        headless: false,
        timeout: BROWSER_LAUNCH_TIMEOUT_MS,
    });

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(ZDROFIT_URLS.login, {
            waitUntil: "domcontentloaded",
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });

        await page.locator("#member_login_form_email").fill(email, {
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });
        await page.locator("#member_login_form_password").fill(password, {
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });

        return await waitForSuccessfulLogin(context, page);
    }
    finally {
        await browser.close();
    }
}

export async function checkSessionInBrowser(sessionId: string): Promise<boolean> {
    const browser = await chromium.launch({
        headless: true,
        timeout: BROWSER_LAUNCH_TIMEOUT_MS,
    });

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await context.addCookies([
            {
                name: ZDROFIT_SESSION_COOKIE_NAME,
                value: sessionId,
                url: ZDROFIT_URLS.home,
            },
        ]);

        await page.goto(ZDROFIT_URLS.home, {
            waitUntil: "domcontentloaded",
            timeout: ZDROFIT_SESSION_CHECK_TIMEOUT_MS,
        });

        const loginText = page.getByText("Loguję się", {exact: true});
        const loginTextCount = await loginText.count();

        for (let index = 0; index < loginTextCount; index++) {
            if (await loginText.nth(index).isVisible()) {
                return false;
            }
        }

        return true;
    }
    finally {
        await browser.close();
    }
}

async function waitForSuccessfulLogin(context: BrowserContext, page: Page): Promise<string> {
    await page.waitForURL(
        url => !url.hash.includes("logowanie"),
        {
            timeout: ZDROFIT_LOGIN_TIMEOUT_MS,
            waitUntil: "domcontentloaded",
        },
    );

    const sessionCookie = (await context.cookies()).find(
        cookie => cookie.name === ZDROFIT_SESSION_COOKIE_NAME,
    );

    if (!sessionCookie?.value) {
        throw new Error(
            `Po zalogowaniu nie znaleziono cookie ${ZDROFIT_SESSION_COOKIE_NAME}`,
        );
    }

    return sessionCookie.value;
}
