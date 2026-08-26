import React from "react";
import { Box, Text } from "ink";
import figlet from "figlet";
import {colors} from "../../theme/colors.ts";
import {useTranslations} from "../../i18n/useTranslations.ts";


export function Logo() {
    const {messages} = useTranslations();
    const logo = figlet.textSync("ZDROFIT CLI", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default"
    });


    return (
        <Box flexDirection="column" marginTop={1}>
            <Text color={colors.brand}>{logo}</Text>
            <Text color={colors.text.muted}>{messages.screens.mainMenu.tagline}</Text>
        </Box>
    );
}
