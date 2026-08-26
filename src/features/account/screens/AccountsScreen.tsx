import React from "react";
import {Box, Text, useInput} from "ink";
import {colors} from "../../../theme/colors.ts";
import {SettingRow} from "../../../shared/components/SettingRow.tsx";
import {Divider} from "../../../shared/components/Divider.tsx";
import {NavigationHints} from "../../../shared/components/NavigationHints.tsx";
import {SelectionList} from "../../../shared/components/SelectionList.tsx";
import {ScreenLogo} from "../../../shared/components/ScreenLogo.tsx";
import type {Account} from "../account.types.ts";
import {getAccountLongName} from "../account.utils.ts";
import {useTranslations} from "../../../i18n/useTranslations.ts";


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
    const {messages} = useTranslations();
    const text = messages.screens.accounts;

    useInput((_input, key)=>{
        if (key.escape){
            returnClick();
        }
    })

    return (
        <Box flexDirection={"column"}>
            <ScreenLogo screenName={text.title}/>

            <Box
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={1}
                borderStyle={"round"}
                borderColor={colors.border.active}
            >
                <SettingRow label={messages.common.labels.account} value={activeAccount} />
                <SettingRow label={messages.common.labels.session} value={sessionActive} />
            </Box>

            {isLoading ? <Text color={colors.text.secondary}>{text.loading}</Text> : null}

            {error ? <Text color={colors.status.error}>{error}</Text> : null}

            {!isLoading ? (
                <SelectionList
                    items={[
                        {
                            id: "new-account",
                            label: `+ ${text.addAccount}`,
                            onSelect: newAccountClick,
                        },
                        ...accounts.map(account => ({
                            id: account.id,
                            label: `${getAccountLongName(account)}${account.isActive ? ` (${text.activeIndicator})` : ""}`,
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
                    {key: "↑↓", label: messages.common.actions.select},
                    {key: "Enter", label: messages.common.actions.confirm},
                    {key: "Delete", label: messages.common.actions.delete},
                    {key: "ESC", label: messages.common.actions.goBack},
                ]}
            />
        </Box>
    )
}
