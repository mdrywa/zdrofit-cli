import type {Class} from "../classes/classes.types.ts";
import type {Club} from "../clubs/clubs.types.ts";
import type {Account} from "../account/account.types.ts";

export type Reservation = {
    id: string;
    account: Account;
    club: Club;
    classItem: Class;
}