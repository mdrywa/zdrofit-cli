import type {Account} from "./account.types.ts";


export function getAccountShortName(account: Account) {
    return account.name;
}

export function getAccountLongName(account: Account) {
    return `${account.name} - ${account.email}`;
}