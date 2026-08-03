import React from "react";
import {Box, Text} from "ink";

export type NavigationHint = {
    key: string
    label: string
}

type NavigationProps = {
    hints: NavigationHint[];
}


export function NavigationHints({hints}: NavigationProps) {
    return (
        <Box flexDirection="row" justifyContent="space-between">
            {hints.map((hint) => (
                <Box key={`${hint.key}-${hint.label}`}>
                    <Text bold color="cyan">
                        {hint.key}
                    </Text>

                    <Text dimColor> {hint.label}</Text>
                </Box>
            ))}
        </Box>
    )
}