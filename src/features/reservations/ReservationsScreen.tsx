import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import type {Reservation} from "./reservations.types.ts";
import {colors} from "../../theme/colors.ts";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import {SelectableTable} from "../../shared/components/Table/SelectableTable.tsx";
import {useTranslations} from "../../i18n/useTranslations.ts";
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
    const {messages} = useTranslations();
    const text = messages.screens.reservations;

    useInput((_input, key) => {
        if (key.escape) {
            onReturn();
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
                <SettingRow
                    label={messages.common.labels.account}
                    value={activeAccount}
                />
            </Box>

            {reservationLoading ? <Text color={colors.text.secondary}>{text.loading}</Text> : null}

            {reservationError ? <Text color={colors.status.error}>{reservationError}</Text> : null}

            {!reservationLoading
            ? (
                <SelectableTable
                    rows={reservations}
                    columns={[
                        {
                            id: "hour",
                            header: messages.common.labels.time,
                            width: 10,
                            render: row=> row.classItem.time,
                        },
                        {
                            id: "date",
                            header: messages.common.labels.date,
                            width: 15,
                            render: row=> row.classItem.date,
                        },
                        {
                            id: "club",
                            header: messages.common.labels.club,
                            width: 20,
                            render: row=> row.club.name,
                        },
                        {
                            id: "name",
                            header: messages.common.labels.name,
                            width: 30,
                            render: row=> row.classItem.name,
                        },
                        {
                            id: "status",
                            header: messages.common.labels.status,
                            width: 20,
                            render: row => messages.common.classStatuses[row.classItem.status],
                            color: row => {
                                switch (row.classItem.status) {
                                    case "available": return colors.status.info;
                                    case "booked": return colors.status.success;
                                    case "fully-booked": return colors.status.error;
                                    case "too-early": return colors.status.warning;
                                    case "booking-closed":case "cancellation-closed": return colors.text.muted;
                                    default: return colors.text.muted;
                                }
                            }}
                    ]}
                    getRowId={row => row.id}
                    onSelect={onWithdraw}
                    isActive={true}/>
                )
            : null}


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "↑↓", label: text.selectReservation},
                    {key: "Enter", label: text.cancelReservation},
                    {key: "ESC", label: messages.common.actions.goBack},
                ]}
            />
        </Box>
    )
}
