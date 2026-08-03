import React from "react";
import {Text} from "ink";

type DividerProps = {
    width?: number;
}

export function Divider({width = 64}:DividerProps): React.ReactElement {
    return <Text dimColor>{"─".repeat(width)}</Text>
}