import type {Reservation} from "./reservations.types.ts";
import {getStoredReservations, saveReservations} from "./reservations.repository.ts";

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
