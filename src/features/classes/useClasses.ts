import {useEffect, useState} from "react";
import type {Class} from "./classes.types.ts";
import type {Club} from "../clubs/clubs.types.ts";
import {fetchClasses, registerForClass, unregisterFromClass} from "./classes.service.ts";
import type {Account} from "../account/account.types.ts";
import {getClassUrl, getClubScheduler} from "../../zdrofit/zdrofit.urls.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";

type UseClassesProps = {
    selectedClub: Club | undefined;
    activeAccount: Account | undefined;
    isSessionActive: boolean | null;
    addReservation: (account: Account, club: Club, classItem: Class) => Promise<void>;
    removeReservation: (account: Account, club: Club, classItem: Class) => Promise<void>;
}

export function useClasses({
    selectedClub,
    activeAccount,
    isSessionActive,
    addReservation,
    removeReservation,
}: UseClassesProps) {
    const {messages} = useTranslations();
    const errors = messages.errors.classes;
    const [classes, setClasses] = useState<Class[]>([]);
    const [isClassesLoading, setIsClassesLoading] = useState<boolean>(true);
    const [classesError, setClassesError] = useState<string | null>(null);

    useEffect(() => {
        async function loadClasses(): Promise<void> {
            if (isSessionActive === null) {
                return;
            }

            if (!selectedClub) {
                setClasses([]);
                setIsClassesLoading(false);
                return;
            }

            try {
                setIsClassesLoading(true);
                setClassesError(null);

                const clubScheduleUrl = getClubScheduler(selectedClub.href);
                const loadedClasses = await fetchClasses(
                    clubScheduleUrl,
                    isSessionActive ? activeAccount : undefined,
                    errors,
                );
                setClasses(loadedClasses);
            }
            catch (error) {
                setClassesError(error instanceof Error
                    ? error.message
                    : errors.loadFailed);
            }
            finally {
                setIsClassesLoading(false);
            }
        }

        void loadClasses();
    }, [selectedClub?.id, activeAccount?.id, isSessionActive, errors]);

    async function toggleClassRegistration(classItem: Class): Promise<void> {
        if (!activeAccount) {
            setClassesError(errors.noActiveAccount);
            return;
        }

        if (!selectedClub) {
            setClassesError(errors.noActiveClub);
            return;
        }

        if (classItem.status !== "available" && classItem.status !== "booked") {
            setClassesError(errors.actionUnavailable);
            return;
        }

        try {
            setClassesError(null);

            if (classItem.status === "available") {
                await signUpForClass(classItem, activeAccount, selectedClub);
            }
            else {
                await withdrawFromClass(classItem, activeAccount, selectedClub);
            }

            await refreshClasses();
        }
        catch (error) {
            setClassesError(
                error instanceof Error
                    ? error.message
                    : errors.updateFailed,
            );
        }
    }

    async function signUpForClass(classItem: Class, account: Account, club: Club): Promise<void> {
        const classUrl = getClassUrl(classItem.href);

        await registerForClass(classUrl, classItem.id, account, errors);
        await addReservation(account, club, classItem);
    }

    async function withdrawFromClass(classItem: Class, account: Account, club: Club): Promise<void> {
        const classUrl = getClassUrl(classItem.href);

        await unregisterFromClass(classUrl, classItem.id, account, errors);
        await removeReservation(account, club, classItem);
    }

    async function refreshClasses(): Promise<void> {
        if (!selectedClub) {
            setClasses([]);
            return;
        }

        const clubScheduleUrl = getClubScheduler(selectedClub.href);
        const updatedClasses = await fetchClasses(clubScheduleUrl, activeAccount, errors);
        setClasses(updatedClasses);
    }

    return {
        classes,
        isClassesLoading,
        classesError,
        toggleClassRegistration,
        withdrawFromClass,
        refreshClasses,
    };
}
