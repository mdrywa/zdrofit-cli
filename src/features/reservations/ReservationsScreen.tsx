import React from "react";
import {Box, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {SelectionList} from "../../shared/components/SelectionList.tsx";
import type {Reservation} from "./reservations.types.ts";
import {colors} from "../../theme/colors.ts";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import {getClubLongName} from "../clubs/clubs.utils.ts";
import type {Account} from "../account/account.types.ts";



type ReservationsScreenProps = {
    reservations: Reservation[];
    activeAccount: string;
    onReturn: () => void;
}

export function ReservationsScreen({
    reservations,
    activeAccount,
    onReturn,
}: ReservationsScreenProps) {

    const reservationItems = reservations.map(reservation => ({
        id: reservation.id,
        label: `${reservation.classItem.date} ${reservation.classItem.time} | ${reservation.classItem.name} | ${reservation.club.name}`,
        onSelect: () => {},
    }));

    useInput((_input, key) => {
        if (key.escape) {
            onReturn();
        }
    })

    return (
        <Box flexDirection={"column"}>
            <ScreenLogo screenName={"Rezerwacje"}/>
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
                    value={activeAccount}
                />
            </Box>

            <SelectionList
                items={reservationItems}
            />

            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz rezerwację"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}
