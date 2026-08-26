import React from "react";
import {Box, Text, useInput} from "ink";
import {Logo} from "../../shared/components/Logo.tsx";
import {colors} from "../../theme/colors.ts";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {SelectionList} from "../../shared/components/SelectionList.tsx";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import type {Club} from "../../features/clubs/clubs.types.ts";
import {getClubShortName} from "../../features/clubs/clubs.utils.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";

type MainMenuScreenProps = {
    activeAccount: string;
    activeClub: Club | undefined;
    sessionActive: string;
    sessionError: string | null;
    onAccountClick: () => void;
    onClubsClick: () => void;
    onSessionRefresh: () => Promise<boolean>;
    onClassesClick: () => void;
    onReservationsClick: () => void;
    onExit: () => void;
}

export function MainMenuScreen({
    activeAccount,
    activeClub,
    sessionActive,
    sessionError,
    onAccountClick,
    onClubsClick,
    onSessionRefresh,
    onClassesClick,
    onReservationsClick,
    onExit,
}: MainMenuScreenProps): React.ReactElement {
    const {messages} = useTranslations();
    const text = messages.screens.mainMenu;

    useInput((input) => {
        if (input.toLowerCase() === "a") {
            onAccountClick();
        }

        if (input.toLowerCase() === "c") {
            onClubsClick();
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
                    label={messages.common.labels.account}
                    value={activeAccount}
                    shortcut={"A"}
                    actionLabel={messages.common.actions.change}
                />
                <SettingRow
                    label={messages.common.labels.club}
                    value={activeClub
                        ? getClubShortName(activeClub)
                        : messages.common.emptyState.noSelectedClub}
                    shortcut={"C"}
                    actionLabel={messages.common.actions.change}
                />
                <SettingRow
                    label={messages.common.labels.session}
                    value={sessionActive}
                    shortcut={"R"}
                    actionLabel={messages.common.actions.refresh}
                />
            </Box>

            {sessionError ? (
                <Text color={colors.status.error}>{sessionError}</Text>
            ) : null}



            <SelectionList
                items={[
                {
                    id: "classes",
                    label: text.browseClasses,
                    onSelect: onClassesClick,
                },
                {
                    id: "reservations",
                    label: text.scheduledReservations,
                    onSelect: onReservationsClick,
                },
                {
                    id: "settings",
                    label: text.settings,
                    onSelect: () => console.log(text.settings),
                },
            ]}
            />

            <Divider/>

            <NavigationHints
                hints={[
                    {key: "↑↓", label: messages.common.actions.select},
                    {key: "Enter", label: messages.common.actions.open},
                    {key: "A", label: messages.common.labels.account},
                    {key: "C", label: messages.common.labels.club},
                    {key: "R", label: text.refreshSession},
                    {key: "Q", label: messages.common.actions.exit},
                ]}
            />
        </Box>
    )
}
