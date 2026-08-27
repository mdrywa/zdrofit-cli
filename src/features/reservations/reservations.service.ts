import type {Reservation} from "./reservations.types.ts";
import {getStoredReservations, saveReservations} from "./reservations.repository.ts";
import type {Account} from "../account/account.types.ts";
import type {Club} from "../clubs/clubs.types.ts";
import {getClubScheduler} from "../../zdrofit/zdrofit.urls.ts";
import {fetchClasses} from "../classes/classes.service.ts";
import type {Class} from "../classes/classes.types.ts";
import type {ErrorMessages} from "../../i18n/i18n.types.ts";

type ClassErrorMessages = ErrorMessages["classes"];

type ClubReservations = {
    club: Club;
    reservations: Reservation[];
};

export function buildReservation(account: Account, club: Club, classItem: Class): Reservation {
    return {
        id: `${account.id}:${club.id}:${classItem.id}`,
        account,
        club,
        classItem: {
            ...classItem,
            canBook: false,
            status: "booked",
        },
    };
}

export async function getSavedReservations(): Promise<Reservation[]> {
    return await getStoredReservations();
}

export async function addSavedReservation(reservation: Reservation): Promise<void> {
    const currentReservations = await getSavedReservations();

    const alreadyExists = currentReservations.some(
        currentReservation => currentReservation.id === reservation.id,
    );

    if (alreadyExists) {
        return;
    }

    await saveReservations([...currentReservations, reservation]);
}

export async function removeSavedReservation(reservation: Reservation): Promise<void> {
    const currentReservations = await getSavedReservations();

    const newReservations = currentReservations.filter((res) => res.id !== reservation.id);

    await saveReservations(newReservations);
}

function mapReservationsByClub(reservations: Reservation[]): Map<string, ClubReservations> {
    const reservationsByClub = new Map<string, ClubReservations>();

    for (const reservation of reservations) {
        const clubId = reservation.club.id;
        const clubReservations = reservationsByClub.get(clubId);

        if (clubReservations) {
            clubReservations.reservations.push(reservation);
        }
        else {
            reservationsByClub.set(clubId, {
                club: reservation.club,
                reservations: [reservation],
            });
        }
    }

    return reservationsByClub;
}

async function syncReservations(
    reservations: Reservation[],
    account: Account,
    errors: ClassErrorMessages,
): Promise<Reservation[]> {
    if (reservations.length === 0) {
        return [];
    }

    const reservationsByClub = mapReservationsByClub(reservations);

    const synchronizedGroups = await Promise.all(
        [...reservationsByClub.values()].map(async ({club, reservations}) => {
            const clubSchedulerHref = getClubScheduler(club.href);
            const classes = await fetchClasses(clubSchedulerHref, account, errors);

            const reservedClassIds = new Set(
                classes
                    .filter(classItem => (
                        classItem.status === "booked" ||
                        classItem.status === "cancellation-closed"
                    ))
                    .map(classItem => classItem.id),
            );

            return reservations.filter(reservation =>
                reservedClassIds.has(reservation.classItem.id)
            );
        }),
    );

    return synchronizedGroups.flat();
}

export async function synchronizeSavedReservations(
    account: Account,
    errors: ClassErrorMessages,
): Promise<Reservation[]> {
    const allReservations = await getSavedReservations();

    const accountReservations = allReservations.filter(
        reservation => reservation.account.id === account.id,
    );
    const otherAccountsReservations = allReservations.filter(
        reservation => reservation.account.id !== account.id,
    );

    const synchronizedReservations = await syncReservations(
        accountReservations,
        account,
        errors,
    );

    await saveReservations([
        ...otherAccountsReservations,
        ...synchronizedReservations,
    ]);

    return synchronizedReservations;
}
