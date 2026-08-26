import React, {useMemo, useState} from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import type {Class} from "./classes.types.ts";
import {colors} from "../../theme/colors.ts";
import {SelectableTable} from "../../shared/components/Table/SelectableTable.tsx";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import type {Club} from "../clubs/clubs.types.ts";
import {getClubLongName} from "../clubs/clubs.utils.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";

type ClassesScreenProps = {
    classes: Class[];
    activeClub: Club | undefined;
    classesLoading: boolean;
    classesError: string | null;
    onSelect: (oneCLass: Class) => void;
    returnClick: () => void;
}

export function ClassesScreen({
    classes,
    activeClub,
    classesLoading,
    classesError,
    onSelect,
    returnClick,
}:ClassesScreenProps) {
    const {messages} = useTranslations();
    const text = messages.screens.classes;

    const avaliableDates = useMemo(() =>
        [...new Set(classes.map(oneClass => oneClass.date))].sort(),
        [classes]
    );

    const [dateIndex, setDateIndex] = useState(0);

    const filteredClasses = classes.filter(oneClass => oneClass.date === avaliableDates[dateIndex]);

    useInput((_input, key) => {
        if (key.escape) {
            returnClick();
        }

        if (key.rightArrow) {
            setDateIndex(currentIndex => currentIndex === avaliableDates.length - 1 ? 0 : currentIndex + 1);
        }

        if (key.leftArrow) {
            setDateIndex(currentIndex => currentIndex === 0 ? avaliableDates.length - 1 : currentIndex - 1);
        }
    })


    return (
        <Box flexDirection="column">
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

                <SettingRow
                    label={messages.common.labels.date}
                    value={`◀ ${avaliableDates[dateIndex]} ▶`}
                />
            </Box>

            {classesLoading ? <Text color={colors.text.secondary}>{text.loading}</Text> : null}

            {classesError ? <Text color={colors.status.error}>{classesError}</Text> : null}


            {!classesLoading
            ? (
                <SelectableTable
                    rows={filteredClasses}
                    columns={[
                        {
                            id: "hour",
                            header: messages.common.labels.time,
                            width: 10,
                            render: row=> row.time,
                        },
                        {
                            id: "name",
                            header: messages.common.labels.name,
                            width: 30,
                            render: row=> row.name,
                        },
                        {
                            id: "trainer",
                            header: text.columns.trainer,
                            width: 25,
                            render: row=> row.trainer,
                        },
                        {
                            id: "status",
                            header: messages.common.labels.status,
                            width: 20,
                            render: row => messages.common.classStatuses[row.status],
                            color: row => {
                                switch (row.status) {
                                    case "available":
                                        return colors.status.info;
                                        case "booked":return colors.status.success;
                                        case "fully-booked":return colors.status.error;
                                        case "too-early":return colors.status.warning;
                                        case "booking-closed":case "cancellation-closed":return colors.text.muted;
                                        default:return colors.text.muted;
                                }
                            }},
                        {
                            id: "spots",
                            header: text.columns.spots,
                            width: 10,
                            render: row=> row.spots,
                        },
                    ]}
                    getRowId={row => row.id}
                    onSelect={onSelect}
                    isActive={true}
                />
                )
            : null}


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "←→", label: text.selectDate},
                    {key: "↑↓", label: text.selectClass},
                    {key: "Enter", label: messages.common.actions.confirm},
                    {key: "ESC", label: messages.common.actions.goBack},
                ]}
            />
        </Box>
    )
}
