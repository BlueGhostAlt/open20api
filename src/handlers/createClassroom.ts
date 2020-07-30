import WebSocket from "ws"

import { Context } from "../"
import { State } from "../State"

export const createClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State
): string => {
    const { name } = data as { name: string }

    const code = [...name].reverse().join("")

    return code
}
