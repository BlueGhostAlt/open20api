import WebSocket from "ws"

import { Context } from "../.."
import { State, ID } from "../../State"

interface setLockedOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

export const setLocked = ({ ws, data, state, id }: setLockedOptions): {} => {
    const { isLocked } = data as { isLocked: boolean }

    const classroomCode = Object.entries(state.codes).find(
        ([_, { host }]) => host.id === id
    )![0]
    const code = Number(classroomCode)

    if (state.codes[code].host.id !== id) {
        throw new Error("A user who's not a host tried locking a channel!")
    }

    const classroom = state.codes[code]

    const users = classroom.guests.map(u => u.id).filter(u => u !== id)
    const sockets = users.map(u => state.sockets.get(u)) as WebSocket[]

    classroom.locked = isLocked

    sockets.forEach(ws =>
        ws.send(
            JSON.stringify({
                type: "setLocked",
                data: { isLocked }
            })
        )
    )

    return {}
}
