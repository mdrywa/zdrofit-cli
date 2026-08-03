import React from "react";
import {Box, Text} from "ink";
import {colors} from "../../theme/colors.ts";

type SettingRowProps = {
    label: string;
    value: string;
    shortcut?: string;
    actionLabel?: string;
}

export function SettingRow({label, value, shortcut, actionLabel}: SettingRowProps) {
    return (
        <Box flexDirection="row" justifyContent="space-between">
            <Box>
                <Text color={colors.text.muted}>{label}: </Text>
                <Text color={colors.text.primary}>{value}</Text>
            </Box>

            {shortcut && actionLabel ?
                <Text color={colors.text.muted}>[{shortcut}] {actionLabel}</Text> :
                null
            }

        </Box>
    )
}