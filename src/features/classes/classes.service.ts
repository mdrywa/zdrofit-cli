import type {Class} from "./classes.types.ts";
import type {Account} from "../account/account.types.ts";
import {getSessionId} from "../account/services/auth.service.ts";
import {parseClasses} from "./classes.parser.ts";

const SESSION_COOKIE_NAME = "SULUSESSID";

export async function getClasses(clubScheduleUrl: string, account?: Account): Promise<Class[]> {
    const headers: Record<string, string> = {};

    if (account) {
        const sessionId = await getSessionId(account.id);

        if (!sessionId) {
            throw new Error("Brak aktywnej sesji zalogowanego konta");
        }

        headers.Cookie = `${SESSION_COOKIE_NAME}=${sessionId}`;
    }

    const response = await fetch(clubScheduleUrl, {
        headers,
    });

    if (!response.ok) {
        throw new Error(`Nie udało się pobrać zajęć: HTTP ${response.status}`);
    }

    const html = await response.text();

    return parseClasses(html);
}



