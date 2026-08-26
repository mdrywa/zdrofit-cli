import type {Class} from "./classes.types.ts";
import type {Account} from "../account/account.types.ts";
import {getSessionId} from "../account/services/auth.service.ts";
import {parseClasses} from "./classes.parser.ts";
import * as cheerio from "cheerio";
import {ZDROFIT_SESSION_COOKIE_NAME} from "../../zdrofit/zdrofit.constants.ts";

export async function fetchClasses(clubScheduleUrl: string, account?: Account): Promise<Class[]> {
    const headers: Record<string, string> = {};

    const sessionId = account ? await getSessionId(account.id) : null;

    if (sessionId)
        headers.Cookie = `${ZDROFIT_SESSION_COOKIE_NAME}=${sessionId}`;

    const response = await fetch(clubScheduleUrl, {
        headers,
    });

    if (!response.ok) {
        throw new Error(`Nie udało się pobrać zajęć: HTTP ${response.status}`);
    }

    const html = await response.text();

    return parseClasses(html);
}


export async function registerForClass(classHref: string, classId: string, account: Account): Promise<void> {
    const sessionId = await getSessionId(account.id);

    if (!sessionId) {
        throw new Error("Brak aktywnej sesji");
    }

    const headers = {
        Cookie: `${ZDROFIT_SESSION_COOKIE_NAME}=${sessionId}`,
    }

    const token = await getClassRegistrationFormToken(classHref, headers);

    const body = new URLSearchParams({
        "schedule_register_form[id]": classId,
        "schedule_register_form[_redirect]": "",
        "schedule_register_form[_token]": token,
    });

    const registrationResponse = await fetch(classHref, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!registrationResponse.ok) {
        throw new Error(`Rejestracja na zajęcia nie powiodła się: ${registrationResponse.status}`);
    }
}


async function getClassRegistrationFormToken(classHref: string, headers: {}): Promise<string> {
    const response = await fetch(classHref, {headers});

    if (!response.ok) {
        throw new Error(`Nie udało się pobrać formulkarza rezerwacji`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const token = $('input[name="schedule_register_form[_token]"]').attr("value")?.trim();

    if (!token) {
        throw new Error("Nie znaleziono tokenu rezerwacji");
    }

    return token;
}


export async function unregisterFromClass(classHref: string, classId: string, account: Account): Promise<void> {
    const sessionId = await getSessionId(account.id);

    if (!sessionId) {
        throw new Error("Brak aktywnej sesji");
    }

    const headers = {
        Cookie: `${ZDROFIT_SESSION_COOKIE_NAME}=${sessionId}`,
    }

    const token = await getClassUnregistrationFormToken(classHref, headers);

    const body = new URLSearchParams({
        "schedule_unregister_form[id]": classId,
        "schedule_unregister_form[_redirect]": "",
        "schedule_unregister_form[_token]": token,
    });

    const unregistrationResponse = await fetch(classHref, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
    });

    if (!unregistrationResponse.ok) {
        throw new Error(`Wypisanie z zajęć nie powiodło się: ${unregistrationResponse.status}`);
    }
}


async function getClassUnregistrationFormToken(classHref: string, headers: {}): Promise<string> {
    const response = await fetch(classHref, {headers});

    if (!response.ok) {
        throw new Error(`Nie udało się pobrać formularza anulowania rezerwacji`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const token = $('input[name="schedule_unregister_form[_token]"]').attr("value")?.trim();

    if (!token) {
        throw new Error("Nie znaleziono tokenu anulowania rezerwacji");
    }

    return token;
}



