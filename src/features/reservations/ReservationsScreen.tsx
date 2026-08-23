import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {SelectionList} from "../../shared/components/SelectionList.tsx";
import type {Reservation} from "./reservations.types.ts";
import {colors} from "../../theme/colors.ts";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
type ReservationsScreenProps = {
    reservations: Reservation[];
    activeAccount: string;
    reservationLoading: boolean;
    reservationError: string | null;
    onReturn: () => void;
    onWithdraw: (reservation: Reservation) => Promise<void>;
}

export function ReservationsScreen({
    reservations,
    activeAccount,
    reservationLoading,
    reservationError,
    onReturn,
    onWithdraw,
}: ReservationsScreenProps) {

    const reservationItems = reservations.map(reservation => ({
        id: reservation.id,
        label: `${reservation.classItem.date} ${reservation.classItem.time} | ${reservation.classItem.name} | ${reservation.club.name}`,
        onSelect: () => onWithdraw(reservation),
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

            {reservationLoading ? <Text color={colors.text.secondary}>Ładowanie rezerwacji...</Text> : null}

            {reservationError ? <Text color={colors.status.error}>{reservationError}</Text> : null}

            {!reservationLoading
            ? (
                <SelectionList
                    items={reservationItems}
                />
                )
            : null}


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: "wybierz rezerwację"},
                    {key: "Enter", label: "Anuluj rezerwację"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}
