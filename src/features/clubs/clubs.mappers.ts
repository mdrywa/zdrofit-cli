import type {Club} from "./clubs.types.ts";
import type {SelectionListItem} from "../../shared/components/SelectionList.tsx";
import {getClubLongName} from "./clubs.utils.ts";


export function clubToSelectionListItem(club: Club, onSelect: (club: Club) => void): SelectionListItem {
    return {
        id: club.id,
        label: getClubLongName(club),
        onSelect: () => onSelect(club),
    };
}