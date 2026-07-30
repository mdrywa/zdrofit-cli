import React, {useState} from "react";
import {Box, useApp} from "ink";
import type {AppScreen} from "./app.types.ts";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";


export function App(): React.ReactElement {
    const {exit} = useApp();

    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    function navigateTo(screen: AppScreen): void {
        setCurrentScreen(screen);
    }

    function renderCurrentScreen(): React.ReactElement {
        switch (currentScreen) {
            case "main-menu":
            return (
                <MainMenuScreen/>
            )
        }
    }

    return (
        <Box>
            {renderCurrentScreen()}
        </Box>
    )
}