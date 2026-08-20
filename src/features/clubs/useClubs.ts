import {useEffect, useState} from "react";
import type {Club} from "./clubs.types.ts";
import {getClubs} from "./clubs.service.ts";
import {getActiveClub, saveActiveClub} from "./clubs.repository.ts";


export function useClubs() {
    const [clubs, setClubs] = useState<Club[]>([]);
    const [activeClub, setActiveClub] = useState<Club>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadClubs(): Promise<void> {
            try {
                const savedClub = await getActiveClub();
                setActiveClub(savedClub);

                const loadedClubs = await getClubs();
                setClubs(loadedClubs);

                if (savedClub) {
                    const refreshedClub = loadedClubs.find(
                        club => club.id === savedClub.id
                    );

                    if (refreshedClub) {
                        setActiveClub(refreshedClub);
                        await saveActiveClub(refreshedClub);
                    }
                }
            }
            catch (error) {
                setError(error instanceof Error
                    ? error.message
                    : "Nie udało się pobrać klubów");
            }
            finally {
                setIsLoading(false);
            }
        }

        void loadClubs();
    }, [])


    async function selectClub(club: Club): Promise<void> {
        await saveActiveClub(club);
        setActiveClub(club);
    }

    return {
        clubs,
        activeClub,
        selectClub,
        isLoading,
        error
    }
}