
import {mkdir, readFile, writeFile} from "node:fs/promises";
import {join} from "node:path";
import {getAppDataDir} from "../../infrastructure/storage/app-paths.ts";
import type {Account} from "./account.types.ts";

const ACCOUNTS_FILE_NAME = "accounts.json";

function getAccountsFilePath(): string {
    return join(getAppDataDir(), ACCOUNTS_FILE_NAME);
}

export async function getAccounts(): Promise<Account[]> {
    try {
        const fileContent = await readFile(getAccountsFilePath(), "utf-8");

        return JSON.parse(fileContent) as Account[];
    }
    catch (error: unknown) {
        if (isFileNotFoundError(error)) {
            return [];
        }

        throw error;
    }
}

export async function saveAccounts(accounts: Account[]): Promise<void> {
    await mkdir(getAppDataDir(), {recursive: true});

    await writeFile(
        getAccountsFilePath(),
        JSON.stringify(accounts, null, 2),
        "utf-8",
    );
}

function isFileNotFoundError(error: unknown): boolean {
    return (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
    );
}
