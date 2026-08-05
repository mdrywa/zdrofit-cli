import {secrets} from "bun"

const SERVICE_NAME = "com.zdrofit.cli";

function getSecretName(accountId: string): string {
    return `account:${accountId}:password`
}

export async function savePassword(accountId: string, password: string): Promise<void> {
    await secrets.set({
        service: SERVICE_NAME,
        name: getSecretName(accountId),
        value: password,
        allowUnrestrictedAccess: false,
    });
}

export async function getPassword(accountId: string): Promise<string | null> {
    return await secrets.get({
        service: SERVICE_NAME,
        name: getSecretName(accountId),
    });
}

export async function deletePassword(accountId: string): Promise<void> {
    await secrets.delete({
        service: SERVICE_NAME,
        name: getSecretName(accountId),
    })
}