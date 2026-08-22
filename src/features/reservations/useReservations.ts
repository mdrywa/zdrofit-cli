import {useEffect, useState} from "react";
import type {Reservation} from "./reservations.types.ts";
import type {Account} from "../account/account.types.ts";
import {
    deleteReservation as deleteReservationService,
    getReservations,
    saveReservation,
} from "./reservations.service.ts";


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

                const loadedReservations = (await getReservations()).filter(
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

    async function createReservation(reservation: Reservation): Promise<void> {
        setReservationsError(null);

        try {
            await saveReservation(reservation);
            await reloadReservations();
        }
        catch (error: unknown) {
            setReservationsError(getErrorMessage(
                error,
                "Nie udało się utworzyć rezerwacji",
            ));
            throw error;
        }
    }

    async function deleteReservation(reservation: Reservation): Promise<void> {
        setReservationsError(null);

        try {
            await deleteReservationService(reservation);
            await reloadReservations();
        }
        catch (error: unknown) {
            setReservationsError(getErrorMessage(
                error,
                "Nie udało się usunąć rezerwacji",
            ));
            throw error;
        }
    }

    async function reloadReservations(): Promise<void> {
        if (!activeAccount) {
            setReservations([]);
            return;
        }

        const loadedReservations = (await getReservations()).filter(
            reservation => reservation.account.id === activeAccount.id,
        );
        setReservations(loadedReservations);
    }


    return {
        reservations,
        reservationsLoading,
        reservationsError,
        createReservation,
        deleteReservation,
    }
}

function getErrorMessage(error: unknown, fallbackMessage: string): string {
    return error instanceof Error ? error.message : fallbackMessage;
}
