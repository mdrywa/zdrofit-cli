import {AsyncEntry} from "@napi-rs/keyring";

export interface SecretStore {
    get(service: string, name: string): Promise<string | null>;
    set(service: string, name: string, value: string): Promise<void>;
    delete(service: string, name: string): Promise<void>;
}

class KeyringSecretStore implements SecretStore {
    async get(service: string, name: string): Promise<string | null> {
        const value = await this.getEntry(service, name).getPassword();

        return value ?? null;
    }

    async set(service: string, name: string, value: string): Promise<void> {
        await this.getEntry(service, name).setPassword(value);
    }

    async delete(service: string, name: string): Promise<void> {
        await this.getEntry(service, name).deleteCredential();
    }

    private getEntry(service: string, name: string): AsyncEntry {
        return new AsyncEntry(service, name);
    }
}

export const secretStore: SecretStore = new KeyringSecretStore();
