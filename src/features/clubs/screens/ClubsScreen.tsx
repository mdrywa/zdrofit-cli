import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";

type ClubsScreenProps = {
    returnClick: () => void;
}

export function ClubsScreen(
    {
        returnClick,
    }: ClubsScreenProps
) {

    useInput((_input, key) => {
        if (key.escape){
            returnClick();
        }
    })

    return (
        <Box flexDirection={"column"}>
            <ScreenLogo screenName={"Kluby"}/>
            <Text>Tutaj będzie tabela z klubami</Text>
            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz zajecia"},
                    {key: "←→", label: "wybierz datę"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}