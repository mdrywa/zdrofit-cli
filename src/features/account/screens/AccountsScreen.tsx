import React from "react";
import {Box, Text, useInput} from "ink";
import {colors} from "../../../theme/colors.ts";
import {SettingRow} from "../../../shared/components/SettingRow.tsx";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";
import {SelectionList} from "../../../shared/components/SelectionList.tsx";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";
import type {Account} from "../account.types.ts";


export type AccountScreenProps = {
    accounts: Account[];
    isLoading: boolean;
    error: string | null;
    activeAccount: string;
    sessionActive: string;
    returnClick: () => void;
    newAccountClick: () => void;
    accountChangeClick: (accountId: string) => Promise<void>;
    deleteAccountClick: (accountId: string) => Promise<void>;
}


export function AccountsScreen({
    accounts,
    isLoading,
    error,
    activeAccount,
    sessionActive,
    returnClick,
    newAccountClick,
    accountChangeClick,
    deleteAccountClick
}: AccountScreenProps) {

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

            {isLoading ? <Text color={colors.text.secondary}>Ładowanie kont...</Text> : null}

            {error ? <Text color={colors.status.error}>{error}</Text> : null}

            {!isLoading ? (
                <SelectionList
                    items={[
                        {
                            id: "new-account",
                            label: "+ Dodaj nowe konto",
                            onSelect: newAccountClick,
                        },
                        ...accounts.map(account => ({
                            id: account.id,
                            label: `${account.name} - ${account.email}${account.isActive ? " (aktywne)" : ""}`,
                            onSelect: () => {
                                void accountChangeClick(account.id).catch(() => undefined);
                            },
                            onDelete: () => {
                                void deleteAccountClick(account.id).catch(() => undefined);
                            }
                        }))
                    ]}
                />
            ) : null}

            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "Delete", label: "usuń"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}
