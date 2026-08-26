import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import type {Club} from "./clubs.types.ts";
import {
    SelectionList,
    type SelectionListItem,
} from "../../shared/components/SelectionList.tsx";
import {colors} from "../../theme/colors.ts";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import {getClubLongName} from "./clubs.utils.ts";
import {clubToSelectionListItem} from "./clubs.mappers.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";

type ClubsScreenProps = {
    clubs: Club[];
    activeClub: Club | undefined;
    isLoading: boolean;
    error: string | null;
    returnClick: () => void;
    clubSelectClick: (club: Club) => void;
}

export function ClubsScreen(
    {
        clubs,
        activeClub,
        isLoading,
        error,
        returnClick,
        clubSelectClick,
    }: ClubsScreenProps
) {
    const {messages} = useTranslations();
    const text = messages.screens.clubs;
    const clubItems = clubs.map(club =>
        clubToSelectionListItem(club, clubSelectClick),
    );

    useInput((_input, key) => {
        if (key.escape) {
            returnClick();
        }
    });

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
                <SettingRow
                    label={messages.common.labels.club}
                    value={activeClub
                    ? getClubLongName(activeClub)
                    : messages.common.emptyState.noSelectedClub}
                />
            </Box>

            {isLoading ? (<Text color={colors.text.secondary}>{text.loading}</Text>) : null}
            {error ? (<Text color={colors.status.error}>{error}</Text>) : null}

            {!isLoading ? (<SelectionList items={clubItems} maxItems={10}/>) : null}


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: text.selectClub},
                    {key: "Enter", label: messages.common.actions.confirm},
                    {key: "ESC", label: messages.common.actions.goBack},
                ]}
            />
        </Box>
    );
}
