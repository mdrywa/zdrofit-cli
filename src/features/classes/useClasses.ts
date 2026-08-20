import {useEffect, useState} from "react";
import type {Class} from "./classes.types.ts";
import type {Club} from "../clubs/clubs.types.ts";
import {getClasses} from "./classes.service.ts";

type useClassesProps = {
    selectedClub: Club | undefined;
}

export function useClasses({
    selectedClub,
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

                const classesUrl = `https://zdrofit.pl${selectedClub.href}grafik-zajec`

                const loadedClasses = await getClasses(classesUrl);
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
    }, [selectedClub])


    return {
        classes,
        isClassesLoading,
        classesError,
    }
}
