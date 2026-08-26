import React, {useEffect, useMemo, useState} from "react";
import {Box, Text, useInput} from "ink";
import {TableHeader} from "./TableHeader.tsx";
import {TableRow} from "./TableRow.tsx";
import {useTranslations} from "../../../i18n/useTranslations.ts";

export type TableColumn<T> = {
    id: string;
    header: string;
    width: number;
    render: (row: T) => string;
    color?: (row:T) => string;
}

type ClassesTablePops<T> = {
    rows: T[];
    columns: TableColumn<T>[];
    getRowId: (row: T) => string;
    onSelect: (row: T) => void;
    onDelete?: (row: T) => void;
    isActive: boolean;
}

export function SelectableTable<T>({
    rows,
    columns,
    getRowId,
    onSelect,
    onDelete,
    isActive,
}: ClassesTablePops<T>) {
    const {messages} = useTranslations();
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        setSelectedIndex(currentIndex => {
            if (rows.length === 0) {
                return 0;
            }

            return Math.min(currentIndex, rows.length - 1);
        });
    }, [rows.length]);

    useInput((_input, key) => {
        if (rows.length === 0) {
            return;
        }

        if (key.upArrow) {
            setSelectedIndex(currentIndex => currentIndex === 0 ? rows.length - 1 : currentIndex - 1);
        }

        if (key.downArrow) {
            setSelectedIndex(currentIndex => currentIndex === rows.length - 1 ? 0 : currentIndex + 1);
        }

        if (key.return) {
            const selectedRow = rows[selectedIndex];

            if (selectedRow) {
                onSelect(selectedRow);
            }
        }

        if ((key.delete || key.backspace) && onDelete) {
            const selectedRow = rows[selectedIndex];

            if (selectedRow) {
                onDelete(selectedRow);
            }
        }
    }, {isActive})

    return (
        <Box flexDirection={"column"}>
            <TableHeader columns={columns}/>

            {rows.length === 0 ?
                (<Text dimColor>{messages.common.emptyState.noData}</Text>) :
                (
                    rows.map((row, index) => (
                        <TableRow key={getRowId(row)} row={row} columns={columns} isSelected={isActive && index === selectedIndex}/>
                    ))
                )}

        </Box>
    )
}
