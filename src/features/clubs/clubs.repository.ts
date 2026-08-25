import {mkdir, readFile, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {getAppDataDir} from "../../infrastructure/storage/app-paths.ts";
import type {Club} from "./clubs.types.ts";

const CLUBS_SETTINGS_FILE_NAME = "clubs.json"

type ClubSettings = {
    activeClub?: Club;
}

function getClubSettingsPath(): string {
    return join(getAppDataDir(), CLUBS_SETTINGS_FILE_NAME);
}

export async function getStoredActiveClub(): Promise<Club | undefined> {
    try {
        const content = await readFile(getClubSettingsPath(), "utf-8");
        const settings = JSON.parse(content) as ClubSettings;

        return settings.activeClub;
    }
    catch (error){
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return undefined;
        }

        throw error;
    }
}


export async function setActiveClub(club: Club): Promise<void> {
    await mkdir(getAppDataDir(), { recursive: true });

    await writeFile(
        getClubSettingsPath(),
        JSON.stringify({activeClub: club}, null, 2),
        "utf-8",
    );
}