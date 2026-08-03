import React from "react";
import { Box, Text } from "ink";
import figlet from "figlet";
import {colors} from "../../theme/colors.ts";


export function Logo() {
    const logo = figlet.textSync("ZDROFIT CLI", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default"
    });


    return (
        <Box flexDirection="column" marginTop={1}>
            <Text color={colors.brand}>{logo}</Text>
            <Text color={colors.text.muted}>Rezerwuj zajęcia szybciej, bez wychodzenia z terminala</Text>
        </Box>
    );
}