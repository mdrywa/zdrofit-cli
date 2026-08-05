import React, {useState} from "react";
import {Box, useApp} from "ink";
import type {AppScreen} from "./app.types.ts";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";
import {AccountsScreen} from "../features/account/screens/AccountsScreen.tsx";
import {NewAccountScreen} from "../features/account/screens/NewAccountScreen.tsx";
import {useAccount} from "../features/account/hooks/useAccount.ts";


export function App(){
    // Exit app function
    const {exit} = useApp();
    const {accounts, activeAccount, isLoading, error, addAccount, deleteAccount, switchAccount} = useAccount();
    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    const activeAccountLabel = activeAccount
        ? `${activeAccount.name} - ${activeAccount.email}`
        : "Brak aktywnego konta";

    async function handleAddAccount(input: Parameters<typeof addAccount>[0]): Promise<void> {
        await addAccount(input);
        navigateTo("accounts");
    }

    async function handleAccountChange(accountId: string): Promise<void> {
        await switchAccount(accountId);
        navigateTo("main-menu");
    }


    function renderCurrentScreen(): React.ReactElement {
        switch (currentScreen) {
            case "main-menu":
            return (
                <MainMenuScreen
                    activeAccount={activeAccountLabel}
                    onAccountClick={() => navigateTo("accounts")}
                    onExit={exit}
                />
            )
            case "accounts":
            return (
                <AccountsScreen
                    accounts={accounts}
                    isLoading={isLoading}
                    error={error}
                    activeAccount={activeAccountLabel}
                    sessionActive="Aktywna"
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
                        sessionActive="Aktywna"
                        returnClick={() => navigateTo("accounts")}
                        onSubmit={handleAddAccount}
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
