import WebSocket from "ws"

import { Context } from "../.."
import { State, ID } from "../../State"

interface deleteMemeOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

export const deleteMeme = ({
    ws,
    data,
    state,
    id: userId
}: deleteMemeOptions): { id: number } => {
    const { id } = data as { id: number }

    const classroomCode = Object.entries(state.codes)
        .map(([code, { memes }]) => {
            const numCode = Number(code)

            return [numCode, memes] as const
        })
        .find(([_, memes]) => memes.find(m => m.id === id))

    if (!classroomCode) {
        throw new Error("A user tried deleting a meme that doesn't exist!")
    }

    const { "0": code } = classroomCode

    if (state.codes[code].host.id !== userId) {
        throw new Error("A user who's not a host tried deleting a meme!")
    }

    const classroom = state.codes[code]
    const index = classroom.memes.findIndex(m => m.id === id)
    classroom.memes.splice(index, 1)

    const users = classroom.guests
        .concat(classroom.host)
        .filter(u => u.id !== id)
        .map(u => u.id)
    const sockets = users.map(u => state.sockets.get(u)) as WebSocket[]

    sockets.forEach(ws =>
        ws.send(
            JSON.stringify({
                type: "deleteMeme",
                data: { id }
            })
        )
    )

    return { id }
}
