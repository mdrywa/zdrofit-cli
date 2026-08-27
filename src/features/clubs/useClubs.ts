import {useEffect, useState} from "react";
import type {Club} from "./clubs.types.ts";
import {fetchClubs, getActiveClub, saveActiveClub} from "./clubs.service.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";


export function useClubs() {
    const {messages} = useTranslations();
    const errors = messages.errors.clubs;
    const [clubs, setClubs] = useState<Club[]>([]);
    const [activeClub, setActiveClub] = useState<Club>();
    const [isClubsLoading, setIsClubsLoading] = useState(true);
    const [clubsError, setClubsError] = useState<string | null>(null);

    useEffect(() => {
        async function loadClubs(): Promise<void> {
            try {
                setIsClubsLoading(true);
                setClubsError(null);

                const savedClub = await getActiveClub();
                setActiveClub(savedClub);

                const loadedClubs = await fetchClubs(errors);
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
                setClubsError(error instanceof Error
                    ? error.message
                    : errors.loadFailed);
            }
            finally {
                setIsClubsLoading(false);
            }
        }

        void loadClubs();
    }, [errors])


    async function selectClub(club: Club): Promise<void> {
        await saveActiveClub(club);
        setActiveClub(club);
    }

    return {
        clubs,
        activeClub,
        selectClub,
        isClubsLoading,
        clubsError
    }
}
