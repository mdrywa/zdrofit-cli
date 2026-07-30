import React from "react";
import {Box} from "ink";
import {Logo} from "../../shared/components/logo.tsx";


export function MainMenuScreen(): React.ReactElement {


    return (
        <Box flexDirection="column">
            <Logo/>
        </Box>
    )
}