import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";
import {SettingRow} from "../../../shared/components/SettingRow.tsx";
import {colors} from "../../../theme/colors.ts";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";
import type {AccountInput} from "../account.types.ts";
import {RegisterForm} from "../components/RegisterForm.tsx";

type NewAccountScreenProps = {
    activeAccount: string;
    sessionActive: string;
    error: string | null;
    returnClick: () => void;
    onSubmit: (input: AccountInput) => Promise<void>;
}

export function NewAccountScreen({
    activeAccount,
    sessionActive,
    error,
    returnClick,
    onSubmit
}: NewAccountScreenProps) {


    useInput((_input, key) => {
        if (key.escape) {
            returnClick();
        }
    });

    async function handleSubmit(input: AccountInput): Promise<void> {
        try {
            await onSubmit(input);
        }
        catch {
            // useAccount stores the error and it is rendered below.
        }
    }

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

            {error ? <Text color={colors.status.error}>{error}</Text> : null}

            <RegisterForm onSubmit={handleSubmit}/>

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
