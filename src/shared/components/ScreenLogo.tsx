import React from "react";
import {Box, Text} from "ink";
import {colors} from "../../theme/colors.ts";


type ScreenLogoProps = {
    screenName: string;
}

export function ScreenLogo({screenName}: ScreenLogoProps) {
    return (
        <Box flexDirection={"row"} marginTop={1}>
            <Text color={colors.brand}>ZDROFIT CLI</Text>
            <Text color={colors.text.secondary}> · </Text>
            <Text color={colors.text.primary}>{screenName}</Text>
        </Box>
    )
}