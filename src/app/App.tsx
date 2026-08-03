import React, {useState} from "react";
import {Box, useApp} from "ink";
import type {AppScreen} from "./app.types.ts";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";
import {AccountsScreen} from "../features/account/screens/AccountsScreen.tsx";


export function App(){
    // Exit app function
    const {exit} = useApp();
    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    function renderCurrentScreen(): React.ReactElement {
        switch (currentScreen) {
            case "main-menu":
            return (
                <MainMenuScreen
                    onAccountClick={() => navigateTo("accounts")}
                    onExit={exit}
                />
            )
            case "accounts":
            return (
                <AccountsScreen
                    activeAccount="Test - test@example.com"
                    sessionActive="Aktywna"
                    returnClick={() => navigateTo("main-menu")}
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
