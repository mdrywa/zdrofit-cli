import {mkdir, readFile, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {getAppDataDir} from "../../infrastructure/storage/app-paths.ts";
import type {Reservation} from "./reservations.types.ts";

const RESERVATIONS_FILE_NAME = "reservations.json";

function getReservationsPath(): string {
    return join(getAppDataDir(), RESERVATIONS_FILE_NAME);
}

export async function getStoredReservations(): Promise<Reservation[]> {
    try {
        const content = await readFile(getReservationsPath(), "utf-8");
        return JSON.parse(content) as Reservation[];
    }
    catch (error) {
        if (error instanceof Error && "code" in error && error.code === "ENOENT") {
            return [];
        }

        throw error;
    }
}

export async function saveReservations(reservations: Reservation[]): Promise<void> {
    await mkdir(getAppDataDir(), { recursive: true });

    await writeFile(
        getReservationsPath(),
        JSON.stringify(reservations, null, 2),
        "utf-8",
    );
}