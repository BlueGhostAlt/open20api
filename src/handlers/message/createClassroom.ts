import WebSocket from "ws"

import { Context } from "../.."
import { State, ID, User } from "../../State"

import { randomInt } from "../../utils/randomInt"

interface createCodeOptions {
    name: string
    state: State
    user: User
}
interface createClassroomOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

const createCode = ({
    name,
    state,
    user: { id, username }
}: createCodeOptions): number => {
    const { freeCodes } = state

    const code = freeCodes[randomInt(0, freeCodes.length)]

    freeCodes.splice(code, 1)
    state.codes[code] = { name, host: { id, username }, guests: [], memes: [] }

    return code
}

export const createClassroom = ({
    ws,
    data,
    state,
    id
}: createClassroomOptions): { code: string; name: string } => {
    const { name, username } = data as { name: string; username: string }

    const numCode = createCode({ name, state, user: { id, username } })

    const code = String(numCode).padStart(6, "0")

    return { code, name }
}
