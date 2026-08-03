import React from "react";
import {Box, Text, useInput} from "ink";
import {colors} from "../../../theme/colors.ts";
import {SettingRow} from "../../../shared/components/SettingRow.tsx";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";
import {SelectionList} from "../../../shared/components/SelectionList.tsx";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";


type AccountScreenProps = {
    activeAccount: string;
    sessionActive: string;
    returnClick: () => void;
}

export function AccountsScreen({activeAccount, sessionActive, returnClick}: AccountScreenProps) {

    useInput((_input, key)=>{
        if (key.escape){
            returnClick();
        }
    })

    return (
        <Box flexDirection={"column"}>
            <ScreenLogo screenName={"Konta"}/>

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

            <SelectionList
                items={[
                    {
                        id: "konto1",
                        label: "Konto numer 1",
                        onSelect: () => console.log("konto 1"),
                    },
                    {
                        id: "konto2",
                        label: "Konto numer 2",
                        onSelect: () => console.log("konto 2"),
                    },
                    {
                        id: "konto3",
                        label: "Konto numer 3",
                        onSelect: () => console.log("konto 3"),
                    },
                ]}
            />

            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}