import {useEffect, useState} from "react";
import type {Reservation} from "./reservations.types.ts";
import type {Account} from "../account/account.types.ts";
import {
    addSavedReservation, buildReservation,
    getSavedReservations,
    removeSavedReservation,
    synchronizeSavedReservations,
} from "./reservations.service.ts";
import type {Club} from "../clubs/clubs.types.ts";
import type {Class} from "../classes/classes.types.ts";

export function useReservations(
    activeAccount: Account | undefined,
    isSessionActive: boolean,
) {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [reservationsLoading, setReservationsLoading] = useState(true);
    const [reservationsError, setReservationsError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

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

                if (!cancelled) {
                    setReservations(loadedReservations);
                }

                if (isSessionActive) {
                    const synchronizedReservations =
                        await synchronizeSavedReservations(activeAccount);

                    if (!cancelled) {
                        setReservations(synchronizedReservations);
                    }
                }
            }
            catch (error) {
                if (!cancelled) {
                    setReservationsError(error instanceof Error
                        ? error.message
                        : "Nie udało się pobrać rezerwacji");
                }
            }
            finally {
                if (!cancelled) {
                    setReservationsLoading(false);
                }
            }
        }

        void loadReservations();

        return () => {
            cancelled = true;
        };
    }, [activeAccount?.id, isSessionActive]);

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

    function reportReservationsError(error: unknown) {
        setReservationsError(
            error instanceof Error
                ? error.message
                : "Nie udało się wykonać operacji na rezerwacji"
        );
    }


    return {
        reservations,
        reservationsLoading,
        reservationsError,
        addReservation,
        removeReservation,
        reportReservationsError,
    }
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
    return error instanceof Error ? error.message : fallbackMessage;
}
