import React, {useMemo, useState} from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import type {Class} from "./classes.types.ts";
import {SelectionList, type SelectionListItem} from "../../shared/components/SelectionList.tsx";
import {colors} from "../../theme/colors.ts";
import {ClassesTable} from "./components/ClassesTable.tsx";
import {SettingRow} from "../../shared/components/SettingRow.tsx";
import type {Club} from "../clubs/clubs.types.ts";
import {getClubShortName} from "../clubs/clubs.utils.ts";

type ClassesScreenProps = {
    classes: Class[];
    activeClub: Club | undefined;
    returnClick: () => void;
}

export function ClassesScreen({
    classes,
    activeClub,
    returnClick,
}:ClassesScreenProps) {

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
            <ScreenLogo screenName={"Zajęcia"}/>

            <Box
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                paddingX={1}
                borderStyle={"round"}
                borderColor={colors.border.active}
            >
                <SettingRow
                    label={"Klub"}
                    value={activeClub
                        ? getClubShortName(activeClub)
                        : "Brak wybranego klubu"}
                />

                <SettingRow
                    label={"Data"}
                    value={`◀ ${avaliableDates[dateIndex]} ▶`}
                />
            </Box>

            <ClassesTable
                rows={filteredClasses}
                columns={[
                    {
                        id: "hour",
                        header: "Godzina",
                        width: 10,
                        render: row=> row.time,
                    },
                    {
                        id: "name",
                        header: "Nazwa",
                        width: 25,
                        render: row=> row.name,
                    },
                    {
                        id: "trainer",
                        header: "Trener",
                        width: 15,
                        render: row=> row.trainer,
                    },
                ]}
                getRowId={row => row.id}
                onSelect={(row) => console.log("Wybrano: ", row.name)}
                isActive={true}
            />


            <Divider/>
            <NavigationHints
                hints={[
                    {key: "←→", label: "wybierz datę"},
                    {key: "↑↓", label: "wybierz zajęcia"},
                    {key: "Enter", label: "zatwierdź"},
                    {key: "ESC", label: "cofnij"},
                ]}
            />
        </Box>
    )
}