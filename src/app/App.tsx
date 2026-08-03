import React, {useState} from "react";
import {Box, useApp, useInput} from "ink";
import type {AppScreen} from "./app.types.ts";
import {MainMenuScreen} from "./screens/MainMenuScreen.tsx";


export function App(){
    // Exit app function
    const {exit} = useApp();
    // Current screen
    const [currentScreen, setCurrentScreen] = useState<AppScreen>("main-menu");

    useInput((input) => {
        if (input.toLowerCase() === "q") {
            exit();
        }
    });

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
