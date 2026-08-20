import React, {useState} from "react";
import {Box, useApp} from "ink";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";
import {AccountsScreen} from "../features/account/screens/AccountsScreen.tsx";
import {NewAccountScreen} from "../features/account/screens/NewAccountScreen.tsx";
import {useAccount} from "../features/account/useAccount.ts";
import {ClubsScreen} from "../features/clubs/ClubsScreen.tsx";
import {useClubs} from "../features/clubs/useClubs.ts";
import type {Club} from "../features/clubs/clubs.types.ts";

type AppScreen =
    "main-menu" |
    "accounts" |
    "new-account" |
    "clubs"

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
    } = useAccount();

    const {
        clubs,
        activeClub,
        selectClub,
        isClubsLoading,
        clubsError,
    } = useClubs();

    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    const activeAccountLabel = activeAccount
        ? `${activeAccount.name} - ${activeAccount.email}`
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
                    deleteAccountClick={deleteAccount}
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
        }
    }

    return (
        <Box>
            {renderCurrentScreen()}
        </Box>
    )
}
