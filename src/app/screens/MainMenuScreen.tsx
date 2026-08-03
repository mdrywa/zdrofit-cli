import React from "react";
import {Box, Text} from "ink";
import {Logo} from "../../shared/components/Logo.tsx";
import {colors} from "../../theme/colors.ts";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {SelectionList} from "../../shared/components/SelectionList.tsx";


export function MainMenuScreen(): React.ReactElement {


    return (
        <Box flexDirection="column">
            <Logo/>

            <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor={colors.border.active}>
                <Box flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Text color={colors.text.muted}>Konto: </Text>
                        <Text color={colors.text.primary}>Test - test@example.com</Text>
                    </Box>
                    <Text color={colors.text.muted}>[A] zmień</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Text color={colors.text.muted}>Klub: </Text>
                        <Text color={colors.text.primary}>Zdrofit Klub Nieborowska 10 Gdańsk</Text>
                    </Box>
                    <Text color={colors.text.muted}>[C] zmień</Text>
                </Box>
                <Box flexDirection="row" justifyContent="space-between">
                    <Box>
                        <Text color={colors.text.muted}>Sesja: </Text>
                        <Text color={colors.text.primary}>Aktywna</Text>
                    </Box>
                    <Text color={colors.text.muted}>[R] odświerz</Text>
                </Box>
            </Box>


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
                    {key: "Q", label: "wyjdź"},
                ]}
            />
        </Box>
    )
}