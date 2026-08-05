import React from "react";
import {Box, useInput} from "ink";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";
import {SettingRow} from "../../../shared/components/SettingRow.tsx";
import {colors} from "../../../theme/colors.ts";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";
import type {NewAccountScreenProps} from "../account.types.ts";
import {RegisterForm} from "../components/RegisterForm.tsx";



export function NewAccountScreen({
    activeAccount,
    sessionActive,
    returnClick,
    onSubmit
}: NewAccountScreenProps) {


    useInput((_input, key) => {
        if (key.escape) {
            returnClick();
        }
    });

    return (
        <Box flexDirection={"column"}>
            <ScreenLogo screenName={"Nowe konto"}/>

            <Box
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={1}
                borderStyle={"round"}
                borderColor={colors.border.active}
            >
                <SettingRow label={"Konto"} value={activeAccount} />
                <SettingRow label={"Sesja"} value={sessionActive} />
            </Box>

            <RegisterForm onSubmit={onSubmit}/>

            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓/Tab", label: "wybierz"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}
