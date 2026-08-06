import React from "react";
import {Box, Text, useInput} from "ink";
import {Logo} from "../../shared/components/Logo.tsx";
import {colors} from "../../theme/colors.ts";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {SelectionList} from "../../shared/components/SelectionList.tsx";
import {SettingRow} from "../../shared/components/SettingRow.tsx";

type MainMenuScreenProps = {
    activeAccount: string;
    sessionActive: string;
    sessionError: string | null;
    onAccountClick: () => void;
    onSessionRefresh: () => Promise<boolean>;
    onExit: () => void;
}

export function MainMenuScreen({
    activeAccount,
    sessionActive,
    sessionError,
    onAccountClick,
    onSessionRefresh,
    onExit,
}: MainMenuScreenProps): React.ReactElement {
    useInput((input) => {
        if (input.toLowerCase() === "a") {
            onAccountClick();
        }

        if (input.toLowerCase() === "r") {
            void onSessionRefresh();
        }

        if (input.toLowerCase() === "q") {
            onExit();
        }
    });

    return (
        <Box flexDirection="column">
            <Logo/>

            <Box flexDirection="column" marginTop={1} paddingX={1} borderStyle="round" borderColor={colors.border.active}>
                <SettingRow
                    label={"Konto"}
                    value={activeAccount}
                    shortcut={"A"}
                    actionLabel={"zmień"}
                />
                <SettingRow
                    label={"Klub"}
                    value={"Zdrofit Klub Nieborowska 10 Gdańsk"}
                    shortcut={"C"}
                    actionLabel={"zmień"}
                />
                <SettingRow
                    label={"Sesja"}
                    value={sessionActive}
                    shortcut={"R"}
                    actionLabel={"odśwież"}
                />
            </Box>

            {sessionError ? (
                <Text color={colors.status.error}>{sessionError}</Text>
            ) : null}



            <SelectionList
                items={[
                {
                    id: "classes",
                    label: "Przeglądaj zajęcia",
                    onSelect: () => console.log("Przeglada zajecia"),
                },
                {
                    id: "reservations",
                    label: "Zaplanowane rezerwacje",
                    onSelect: () => console.log("Zaplanowane rezerwacje"),
                },
                {
                    id: "settings",
                    label: "Ustawienia",
                    onSelect: () => console.log("Ustawienia"),
                },
            ]}
            />

            <Divider/>

            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz"},
                    {key: "Enter", label: "otwórz"},
                    {key: "A", label: "konto"},
                    {key: "C", label: "klub"},
                    {key: "R", label: "odśwież sesję"},
                    {key: "Q", label: "wyjdź"},
                ]}
            />
        </Box>
    )
}
