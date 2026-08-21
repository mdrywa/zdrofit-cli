export type Class = {
    id: string;
    name: string;
    date: string;
    time: string;
    trainer: string;

    spots: string;

    canBook: boolean;
    status: ClassStatus;

    href: string
}

export type ClassStatus =
    | "too-early"
    | "available"
    | "booked"
    | "fully-booked"
    | "cancellation-closed"
    | "booking-closed"
    | "unknown";
