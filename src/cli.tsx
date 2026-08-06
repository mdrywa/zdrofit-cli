import React from "react"
import {render} from "ink";
import {App} from "./app/App.tsx";

export async function startCli(): Promise<void> {
    const instance = render(<App/>)

    await instance.waitUntilExit();
}
