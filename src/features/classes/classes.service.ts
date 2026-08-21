import type {Class, ClassStatus} from "./classes.types.ts";
import * as cheerio from "cheerio";
import type { Cheerio } from "cheerio";
import type { Element } from "domhandler";
import type {Account} from "../account/account.types.ts";
import {getSessionId} from "../account/services/auth.service.ts";

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


function parseClasses(html: string): Class[] {
    const $ = cheerio.load(html);
    const classes: Class[] = [];

    $("#schedule-rano > ul > li, #schedule-po-poludniu > ul > li").each((_, element) => {
        const item = $(element);

        const id = item.attr("data-id");

        if (!id)
            return;

        const name = item.find("a.activity").text().trim();
        const date = item.attr("data-day")?.trim() ?? "";
        const time = item.find("time").text().trim();
        const trainer = item.find("a.trainer").text().trim();

        const spots = item.find("div.infos").find("span.users").text().trim();

        const status = checkStatus(item, spots);

        const canBook = checkCanBook(spots, status);


        const href = item.find("a[data-fetch-fragments='#rezerwacja']").attr("href")?.trim() ?? "";

        classes.push({
            id,
            name,
            date,
            time,
            trainer,
            spots,
            canBook,
            status,
            href
        })
    })

    return classes;
}

function checkStatus(item: Cheerio<Element>, spots: string): ClassStatus {
    const registration = item.find("div.registration");
    const text = registration.text().trim();

    if (registration.find("a.minus").length > 0) {
        return "booked";

    }

    const [bookedSpots, totalSpots] = spots.split("/").map(Number);
    if (Number.isFinite(bookedSpots) && Number.isFinite(totalSpots) && bookedSpots === totalSpots) {
        return "fully-booked";

    }

    switch (text) {
        case "Zapisz się":
            return "available";

        case "Termin rejestracji minął":
            return "booking-closed";

        case "Czas na anulowanie rezerwacji minął":
            return "cancellation-closed";

        case "Za wcześnie by zarezerwować":
            return "too-early";

        default:
            return "unknown";
    }
}

function checkCanBook(spots: string, status: ClassStatus): boolean {
    const spotsNumber = spots.split("/");

    return (spotsNumber[0] !== spotsNumber[1]) && status === "available";
}
