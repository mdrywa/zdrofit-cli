import React, {useEffect, useState} from "react";
import {Box, Text, useInput} from "ink";
import {colors} from "../../theme/colors.ts";

export type SelectionListItem = {
    id: string;
    label: string;
    onSelect: () => void;
    onDelete?: () => void;
}

type SelectionListProps = {
    items: SelectionListItem[];
    maxItems?: number;
}

export function SelectionList({items, maxItems = 10}: SelectionListProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        setSelectedIndex(currentIndex => {
            if (items.length === 0) {
                return 0;
            }

            return Math.min(currentIndex, items.length - 1);
        });
    }, [items.length]);

    useInput((_input, key) => {
        if (items.length === 0) {
            return;
        }

        if (key.upArrow) {
            setSelectedIndex((currentIndex) => currentIndex === 0 ? items.length - 1 : currentIndex - 1);
        }

        if (key.downArrow) {
            setSelectedIndex((currentIndex) => currentIndex === items.length - 1 ? 0 : currentIndex + 1);
        }

        if (key.delete || key.backspace) {
            items[selectedIndex]?.onDelete && items[selectedIndex].onDelete();
        }

        if (key.return) {
            items[selectedIndex]?.onSelect();
        }
    })

    const startIndex = Math.min(
        Math.max(0, selectedIndex - maxItems + 1),
        Math.max(0, items.length - maxItems)
    );

    const visibleItems = items.slice(
        startIndex,
        startIndex + maxItems
    );


    return (
        <Box flexDirection="column">
            {visibleItems.map((item, index) => {
                const realIndex = startIndex + index;
                const isSelected = realIndex === selectedIndex;

                return (
                    <Text
                        key={item.id}
                        color={isSelected ? colors.brand : colors.text.primary}
                        bold={isSelected}
                    >
                        {isSelected ? " > " : "   "}
                        {item.label}
                    </Text>
                )
            })}
        </Box>
    )
}
