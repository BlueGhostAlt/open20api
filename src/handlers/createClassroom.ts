import WebSocket from "ws"

export const createClassroom = (ws: WebSocket, data: object): string => {
    const { name } = data as { name: string }

    const code = [...name].reverse().join("")

    return code
}
