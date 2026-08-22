import type {Reservation} from "./reservations.types.ts";
import {getStoredReservations, saveReservations} from "./reservations.repository.ts";

export async function getReservations(): Promise<Reservation[]> {
    return await getStoredReservations();
}

export async function saveReservation(reservation: Reservation): Promise<void> {
    const currentReservations = await getReservations();

    const alreadyExists = currentReservations.some(
        currentReservation => currentReservation.id === reservation.id,
    );

    if (alreadyExists) {
        return;
    }

    await saveReservations([...currentReservations, reservation]);
}

export async function deleteReservation(reservation: Reservation): Promise<void> {
    const currentReservations = await getReservations();

    const newReservations = currentReservations.filter((res) => res.id !== reservation.id);

    await saveReservations(newReservations);
}