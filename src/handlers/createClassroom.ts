import WebSocket from "ws"

import { Context } from "../"

export const createClassroom = (
    ws: WebSocket,
    data: Context["data"]
): string => {
    const { name } = data as { name: string }

    const code = [...name].reverse().join("")

    return code
}
