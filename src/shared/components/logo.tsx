import React from "react";
import {Box, Text} from "ink";
import figlet = require("figlet");
import gradient from "gradient-string";

export function Logo(): React.ReactElement {
    const logo: string = figlet.textSync("ZDROFIT-CLI", {
        font: "ANSI Shadow",
        horizontalLayout: "default",
        verticalLayout: "default",
    });

    const coloredLogo: string = gradient(["cyan", "pink"])(logo);

    return (
        <Box flexDirection="column">
            <Text>{coloredLogo}</Text>
        </Box>
    )
}