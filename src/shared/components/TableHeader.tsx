import React from "react";
import type {TableColumn} from "./SelectableTable.tsx";
import {Box, Text} from "ink";

type TableHeaderProps<T> = {
    columns: TableColumn<T>[];
}

export function TableHeader<T>({
    columns,
}: TableHeaderProps<T>) {
    return (
        <Box>
            <Box width="3">
                <Text> </Text>
            </Box>

            {columns.map(column => (
                <Box key={column.id} width={column.width}>
                   <Text bold underline>{column.header}</Text>
                </Box>
            ))}
        </Box>
    )
}
