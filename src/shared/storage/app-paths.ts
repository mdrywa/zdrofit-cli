import {homedir} from "node:os";
import {join} from "node:path";

const APP_NAME = "zdrofit-cli";

export function getAppDataDir(): string {
    switch (process.platform) {
        case "darwin":
            return join(homedir(), "Library", "Application Support", APP_NAME);
        case "win32":
            return join(process.env.APPDATA ?? join(homedir(), "AppData", "Roaming"), APP_NAME);
        default:
            return join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), APP_NAME);
    }
}