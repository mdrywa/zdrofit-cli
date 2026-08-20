import React from "react";
import type {TableColumn} from "./SelectableTable.tsx";
import {Box, Text} from "ink";
import {colors} from "../../theme/colors.ts";

type TableRowProps<T> = {
    row: T;
    columns: TableColumn<T>[];
    isSelected: boolean;
}

export function TableRow<T>({
    row,
    columns,
    isSelected,
}: TableRowProps<T>) {
    return (
        <Box>
            <Box width={3}>
                <Text color={isSelected ? colors.brand : colors.text.primary}>
                    {isSelected ? ">" : " "}
                </Text>
            </Box>

            {columns.map(column => (
                <Box key={column.id} width={column.width}>
                    <Text
                        color={isSelected ? colors.brand : colors.text.primary}
                        bold={isSelected}
                        wrap="truncate-end"
                    >
                        {column.render(row)}
                    </Text>
                </Box>
            ))}
        </Box>
    )
}
