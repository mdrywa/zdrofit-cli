import {useEffect, useState} from "react";
import type {Class} from "./classes.types.ts";
import type {Club} from "../clubs/clubs.types.ts";
import {bookClass, cancelClassBooking, getClasses} from "./classes.service.ts";
import type {Account} from "../account/account.types.ts";
import {getClassUrl, getClubScheduler} from "../../zdrofit/zdrofit.urls.ts";

type useClassesProps = {
    selectedClub: Club | undefined;
    activeAccount: Account | undefined;
    isSessionActive: boolean | null;
}

export function useClasses({
    selectedClub,
    activeAccount,
    isSessionActive,
}: useClassesProps) {
    const [classes, setClasses] = useState<Class[]>([]);
    const [isClassesLoading, setIsClassesLoading] = useState<boolean>(true);
    const [classesError, setClassesError] = useState<string | null>(null);

    useEffect(() => {
        async function loadClasses(): Promise<void> {
            if (!selectedClub) {
                setClasses([]);
                setIsClassesLoading(false);
                return;
            }

            try {
                setIsClassesLoading(true);
                setClassesError(null);

                const clubScheduleUrl = getClubScheduler(selectedClub.href);

                const loadedClasses = await getClasses(clubScheduleUrl, activeAccount);
                setClasses(loadedClasses);
            }
            catch (error) {
                setClassesError(error instanceof Error
                    ? error.message
                    : "Nie udało się pobrać zajęć");
            }
            finally {
                setIsClassesLoading(false);
            }
        }

        void loadClasses();
    }, [selectedClub, activeAccount, isSessionActive])

    async function classBooking(classItem: Class): Promise<void> {
        if (!activeAccount) {
            setClassesError("Brak aktywnego konta");
            return;
        }

        if (!selectedClub) {
            setClassesError("Brak aktywnego klubu");
            return;
        }

        if (classItem.status !== "available" && classItem.status !== "booked") {
            setClassesError("Nie można wykonać tej akcji dla wybranych zajęć");
            return;
        }

        try {
            setClassesError(null);

            const classUrl = getClassUrl(classItem.href);

            if (classItem.status === "available") {
                await bookClass(
                    classUrl,
                    classItem.id,
                    activeAccount,
                );
            }
            else {
                await cancelClassBooking(
                    classUrl,
                    classItem.id,
                    activeAccount,
                );
            }

            const clubScheduleUrl = getClubScheduler(selectedClub.href);
            const updatedClasses = await getClasses(clubScheduleUrl, activeAccount);
            setClasses(updatedClasses);
        } catch (error) {
            setClassesError(
                error instanceof Error
                    ? error.message
                    : "Nie udało się zarezerwować zajęć"
            );
        }
    }


    return {
        classes,
        isClassesLoading,
        classesError,
        classBooking
    }
}
