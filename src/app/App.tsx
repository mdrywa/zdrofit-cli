import React, {useState} from "react";
import {Box, useApp} from "ink";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";
import {AccountsScreen} from "../features/account/screens/AccountsScreen.tsx";
import {NewAccountScreen} from "../features/account/screens/NewAccountScreen.tsx";
import {useAccount} from "../features/account/useAccount.ts";
import {ClubsScreen} from "../features/clubs/ClubsScreen.tsx";
import {useClubs} from "../features/clubs/useClubs.ts";
import type {Club} from "../features/clubs/clubs.types.ts";
import {ClassesScreen} from "../features/classes/ClassesScreen.tsx";
import {useClasses} from "../features/classes/useClasses.ts";
import type {Account} from "../features/account/account.types.ts";
import {ReservationsScreen} from "../features/reservations/ReservationsScreen.tsx";
import {getAccountLongName} from "../features/account/account.utils.ts";
import {useReservations} from "../features/reservations/useReservations.ts";

type AppScreen =
    "main-menu" |
    "accounts" |
    "new-account" |
    "clubs" |
    "classes" |
    "reservations"

export function App(){
    // Exit app function
    const {exit} = useApp();
    const {
        accounts,
        activeAccount,
        isLoading,
        isCheckingSession,
        isRefreshingSession,
        isSessionActive,
        error,
        addAccount,
        deleteAccount,
        switchAccount,
        refreshSession,
        deactivateSession,
    } = useAccount();

    const {
        clubs,
        activeClub,
        selectClub,
        isClubsLoading,
        clubsError,
    } = useClubs();

    const {
        reservations,
        createReservation,
        deleteReservation,
    } = useReservations(activeAccount);

    const {
        classes,
        isClassesLoading,
        classesError,
        classBooking
    } = useClasses({
        selectedClub: activeClub,
        activeAccount,
        isSessionActive,
        createReservation,
        deleteReservation,
    })

    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    const activeAccountLabel = activeAccount
        ? `${getAccountLongName(activeAccount)}`
        : "Brak aktywnego konta";

    const sessionStatus = isCheckingSession
        ? "Sprawdzanie..."
        : isRefreshingSession
            ? "Odświeżanie..."
            : isSessionActive
                ? "Aktywna"
                : "Nieaktywna";

    async function handleAddAccount(input: Parameters<typeof addAccount>[0]): Promise<void> {
        navigateTo("accounts");
        await addAccount(input);
    }

    async function handleAccountChange(accountId: string): Promise<void> {
        navigateTo("main-menu");
        await switchAccount(accountId);
    }

    async function handleClubChange(club: Club) {
        navigateTo("main-menu");
        await selectClub(club);
    }

    async function handleDeleteAccount(accountId: string) {
        await deleteAccount(accountId);
        deactivateSession();
    }


    async function handleExit(): Promise<void> {
        exit()
    }


    function renderCurrentScreen(): React.ReactElement {
        switch (currentScreen) {
            case "main-menu":
            return (
                <MainMenuScreen
                    activeAccount={activeAccountLabel}
                    activeClub={activeClub}
                    sessionActive={sessionStatus}
                    sessionError={error}
                    onAccountClick={() => navigateTo("accounts")}
                    onClubsClick={() => navigateTo("clubs")}
                    onSessionRefresh={refreshSession}
                    onClassesClick={() => navigateTo("classes")}
                    onReservationsClick={() => navigateTo("reservations")}
                    onExit={handleExit}
                />
            )
            case "accounts":
            return (
                <AccountsScreen
                    accounts={accounts}
                    isLoading={isLoading}
                    error={error}
                    activeAccount={activeAccountLabel}
                    sessionActive={sessionStatus}
                    returnClick={() => navigateTo("main-menu")}
                    newAccountClick={() => navigateTo("new-account")}
                    accountChangeClick={handleAccountChange}
                    deleteAccountClick={handleDeleteAccount}
                />
            )
            case "new-account":
                return (
                    <NewAccountScreen
                        activeAccount={activeAccountLabel}
                        sessionActive={sessionStatus}
                        error={error}
                        returnClick={() => navigateTo("accounts")}
                        onSubmit={handleAddAccount}
                    />
                )
            case "clubs":
                return (
                    <ClubsScreen
                        clubs={clubs}
                        activeClub={activeClub}
                        isLoading={isClubsLoading}
                        error={clubsError}
                        returnClick={() => navigateTo("main-menu")}
                        clubSelectClick={handleClubChange}
                    />
                )
            case "classes":
                return (
                    <ClassesScreen
                        classes={classes}
                        activeClub={activeClub}
                        onSelect={classBooking}
                        returnClick={() => navigateTo("main-menu")}
                    />
                )
            case "reservations":
                return (
                    <ReservationsScreen
                        reservations={reservations}
                        activeAccount={activeAccountLabel}
                        onReturn={() => navigateTo("main-menu")}
                    />
                )
        }
    }

    return (
        <Box>
            {renderCurrentScreen()}
        </Box>
    )
}
