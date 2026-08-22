import {ZDROFIT_BASE_URL} from "./zdrofit.constants.ts";


export const ZDROFIT_URLS = {
    home: ZDROFIT_BASE_URL,
    login: `${ZDROFIT_BASE_URL}/#logowanie`,
    clubs: `${ZDROFIT_BASE_URL}/kluby-fitness`,
} as const;

export function getClubUrl(clubHref: string): string {
    return new URL(clubHref, ZDROFIT_BASE_URL).toString();
}

export function getClubScheduler(clubHref: string): string{
    return new URL(`${clubHref}grafik-zajec`,ZDROFIT_BASE_URL).toString();
}

export function getClassUrl(classHref: string): string{
    return new URL(classHref, ZDROFIT_BASE_URL).toString();
}