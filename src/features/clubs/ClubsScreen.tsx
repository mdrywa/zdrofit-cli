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

type ClubsScreenProps = {
    clubs: Club[];
    activeClub: Club | undefined;
    isLoading: boolean;
    error: string | null;
    returnClick: () => void;
    clubSelectClick: (club: Club) => void;
}

function clubToSelectionListItem(club: Club, onSelect: (club: Club) => void): SelectionListItem {
    const location = [club.street, club.city].filter(Boolean).join(", ");

    return {
        id: club.id,
        label: location ? `${club.name} - ${location}` : club.name,
        onSelect: () => onSelect(club),
    };
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
            <ScreenLogo screenName={"Kluby"}/>

            <Box
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={1}
                borderStyle={"round"}
                borderColor={colors.border.active}
            >
                <SettingRow
                    label={"Konto"}
                    value={activeClub
                    ? `${activeClub.name} - ${activeClub.street}, ${activeClub.city}`
                    : "Brak wybranego klubu"}
                />
            </Box>

            {isLoading ? (<Text color={colors.text.secondary}>Pobieranie klubów ...</Text>) : null}
            {error ? (<Text color={colors.status.error}>{error}</Text>) : null}

            {!isLoading ? (<SelectionList items={clubItems} maxItems={10}/>) : null}


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz zajecia"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    );
}
