import {useEffect, useState} from "react";
import type {Reservation} from "./reservations.types.ts";
import type {Account} from "../account/account.types.ts";
import {
    addSavedReservation,
    getSavedReservations,
    removeSavedReservation,
} from "./reservations.service.ts";
import type {Club} from "../clubs/clubs.types.ts";
import type {Class} from "../classes/classes.types.ts";

export function useReservations(activeAccount: Account | undefined) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [reservationsError, setReservationsError] = useState<string | null>(null);

    useEffect(() => {
        async function loadReservations(): Promise<void> {
            if (!activeAccount) {
                setReservations([]);
                setReservationsError(null);
                setReservationsLoading(false);
                return;
            }

            try {
                setReservationsLoading(true);
                setReservationsError(null);

                const loadedReservations = (await getSavedReservations()).filter(
                    reservation => reservation.account.id === activeAccount.id,
                );
                setReservations(loadedReservations);
            }
            catch (error) {
                setReservationsError(error instanceof Error
                    ? error.message
                    : "Nie udało się pobrać rezerwacji");
            }
            finally {
                setReservationsLoading(false);
            }
        }

        void loadReservations();
    }, [activeAccount?.id]);

    function buildReservation(account: Account, club: Club, classItem: Class): Reservation {
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

    async function addReservation(account: Account, club: Club, classItem: Class): Promise<void> {
        setReservationsError(null);

        const reservation = buildReservation(account, club, classItem);

        try {
            await addSavedReservation(reservation);
            await refreshReservations();
        }
        catch (error: unknown) {
            setReservationsError(getErrorMessage(
                error,
                "Nie udało się utworzyć rezerwacji",
            ));
            throw error;
        }
    }

    async function removeReservation(account: Account, club: Club, classItem: Class): Promise<void> {
        setReservationsError(null);

        const reservation = buildReservation(account, club, classItem);

        try {
            await removeSavedReservation(reservation);
            await refreshReservations();
        }
        catch (error: unknown) {
            setReservationsError(getErrorMessage(
                error,
                "Nie udało się usunąć rezerwacji",
            ));
            throw error;
        }
    }

    async function refreshReservations(): Promise<void> {
        if (!activeAccount) {
            setReservations([]);
            return;
        }

        const loadedReservations = (await getSavedReservations()).filter(
            reservation => reservation.account.id === activeAccount.id,
        );
        setReservations(loadedReservations);
    }


    return {
        reservations,
        reservationsLoading,
        reservationsError,
        addReservation,
        removeReservation,
    }
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
    return error instanceof Error ? error.message : fallbackMessage;
}
