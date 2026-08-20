import type {Class} from "./classes.types.ts";
import * as cheerio from "cheerio";


export async function getClasses(clubScheduleUrl: string): Promise<Class[]> {
    const response = await fetch(clubScheduleUrl);

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
        const href = item.find("a[data-fetch-fragments='#rezerwacja']").attr("href")?.trim() ?? "";

        classes.push({
            id,
            name,
            date,
            time,
            trainer,
            href
        })
    })

    return classes;
}