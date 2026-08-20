import {chromium} from "playwright";

const LOGIN_URL = "https://zdrofit.pl/#logowanie";
const SESSION_CHECK_URL = "https://zdrofit.pl";
const SESSION_COOKIE_NAME = "SULUSESSID";
const BROWSER_LAUNCH_TIMEOUT_MS = 30_000;
const PAGE_LOAD_TIMEOUT_MS = 30_000;
const LOGIN_TIMEOUT_MS = 150_000;
const SESSION_CHECK_TIMEOUT_MS = 15_000;

async function readRequest() {
    let input = "";

    for await (const chunk of process.stdin) {
        input += chunk;
    }

    return JSON.parse(input);
}

async function waitForSuccessfulLogin(context, page) {
    await page.waitForURL(
        url => !url.hash.includes("logowanie"),
        {
            timeout: LOGIN_TIMEOUT_MS,
            waitUntil: "domcontentloaded",
        },
    );

    const sessionCookie = (await context.cookies()).find(
        cookie => cookie.name === SESSION_COOKIE_NAME,
    );

    if (!sessionCookie?.value) {
        throw new Error(
            `Po zalogowaniu nie znaleziono cookie ${SESSION_COOKIE_NAME}`,
        );
    }

    return sessionCookie.value;
}

async function login({email, password}) {
    const browser = await chromium.launch({
        headless: false,
        timeout: BROWSER_LAUNCH_TIMEOUT_MS,
    });

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(LOGIN_URL, {
            waitUntil: "domcontentloaded",
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });

        await page.locator("#member_login_form_email").fill(email, {
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });
        await page.locator("#member_login_form_password").fill(password, {
            timeout: PAGE_LOAD_TIMEOUT_MS,
        });

        // Zdrofit creates SULUSESSID for anonymous visitors too. A successful
        // login is indicated by leaving the #logowanie route after the user
        // solves CAPTCHA (if present) and clicks the login button.
        const sessionId = await waitForSuccessfulLogin(context, page);

        return {sessionId};
    }
    finally {
        await browser.close();
    }
}

async function checkSession({sessionId}) {
    const browser = await chromium.launch({
        headless: true,
        timeout: BROWSER_LAUNCH_TIMEOUT_MS,
    });

    try {
        const context = await browser.newContext();
        const page = await context.newPage();

        await context.addCookies([
            {
                name: SESSION_COOKIE_NAME,
                value: sessionId,
                url: SESSION_CHECK_URL,
            },
        ]);

        await page.goto(SESSION_CHECK_URL, {
            waitUntil: "domcontentloaded",
            timeout: SESSION_CHECK_TIMEOUT_MS,
        });

        const loginText = page.getByText("Loguję się", {exact: true});
        const loginTextCount = await loginText.count();

        for (let index = 0; index < loginTextCount; index++) {
            if (await loginText.nth(index).isVisible()) {
                return {active: false};
            }
        }

        return {active: true};
    }
    finally {
        await browser.close();
    }
}

function serializeError(error) {
    if (error instanceof Error) {
        return {
            name: error.name,
            message: error.message,
        };
    }

    return {
        name: "Error",
        message: String(error),
    };
}

try {
    const request = await readRequest();
    const data = request.operation === "login"
        ? await login(request.payload)
        : request.operation === "check-session"
            ? await checkSession(request.payload)
            : (() => {
                throw new Error(`Nieznana operacja Playwright: ${request.operation}`);
            })();

    process.stdout.write(JSON.stringify({ok: true, data}));
}
catch (error) {
    process.stdout.write(JSON.stringify({
        ok: false,
        error: serializeError(error),
    }));
    process.exitCode = 1;
}
