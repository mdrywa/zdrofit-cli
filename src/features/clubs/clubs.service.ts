import type {Club} from "./clubs.types.ts";
import * as cheerio from "cheerio";

const CLUBS_URL = "https://zdrofit.pl/kluby-fitness";

export async function getClubs(): Promise<Club[]> {
    const response = await fetch(CLUBS_URL);

    if (!response.ok) {
        throw new Error(`Nie udało się pobrać klubów: HTTP ${response.status}`);
    }

    const html = await response.text();

    return parseClubs(html);
}

function parseClubs(html: string): Club[] {
    const $ = cheerio.load(html);
    const clubs: Club[] = [];

    $("#kluby-list > li[data-club-id]").each((_, element) => {
        const club = $(element);

        const id = club.attr("data-club-id");

        if (!id)
            return;

        const name = club.find("strong")?.text() ?? "";
        const street = club.find("address").text().trim().split(",")[0] ?? "";
        const city = club.attr("data-city")?.trim() ?? "";
        const href = club.find("a").attr("href") ?? "";

        clubs.push({
            id,
            name,
            street,
            city,
            href
        })

    })

    return clubs;
}
