import React from "react";
import {Box, Text, useInput} from "ink";
import {ScreenLogo} from "../../shared/components/ScreenLogo.tsx";
import {Divider} from "../../shared/components/Divider.tsx";
import {NavigationHints} from "../../shared/components/NavigationHints.tsx";
import type {Class} from "./classes.types.ts";
import {SelectionList, type SelectionListItem} from "../../shared/components/SelectionList.tsx";
import {colors} from "../../theme/colors.ts";

type ClassesScreenProps = {
    classes: Class[]
    returnClick: () => void;
}

function classesToSelectionListItem(oneClass: Class): SelectionListItem {

    return {
        id: oneClass.id,
        label: oneClass.name + " " + oneClass.date + " " + oneClass.time + " " + oneClass.trainer,
        onSelect: () => undefined,
    };
}

export function ClassesScreen({
    classes,
    returnClick,
}:ClassesScreenProps) {

    useInput((_input, key) => {
        if (key.escape) {
            returnClick();
        }
    })

    const classesItems = classes.map(oneClass =>
        classesToSelectionListItem(oneClass),
    );

    return (
        <Box flexDirection="column">
            <ScreenLogo screenName={"Zajęcia"}/>
            <Text color={colors.status.error}>Tutaj później będzie tabelas z zajęciami</Text>

            <SelectionList items={classesItems} maxItems={10}/>

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