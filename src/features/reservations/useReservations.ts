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
import {useTranslations} from "../../i18n/useTranslations.ts";

export function useReservations(
    activeAccount: Account | undefined,
    isSessionActive: boolean,
) {
    const {messages} = useTranslations();
    const errors = messages.errors.reservations;
    const classErrors = messages.errors.classes;
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
                        await synchronizeSavedReservations(activeAccount, classErrors);

                    if (!cancelled) {
                        setReservations(synchronizedReservations);
                    }
                }
            }
            catch (error) {
                if (!cancelled) {
                    setReservationsError(error instanceof Error
                        ? error.message
                        : errors.loadFailed);
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
    }, [activeAccount?.id, isSessionActive, errors, classErrors]);

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
                errors.createFailed,
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
                errors.removeFailed,
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
                : errors.operationFailed
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
