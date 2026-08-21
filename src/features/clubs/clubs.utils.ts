import type {Club} from "./clubs.types.ts";


export function getClubShortName(club: Club): string {
    return club.name;
}

export function getClubLongName(club: Club): string {
    return `${club.name} - ${club.street}, ${club.city}`;
}