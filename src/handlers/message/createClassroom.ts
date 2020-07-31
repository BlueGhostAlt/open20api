import WebSocket from "ws"

import { Context } from "../.."
import { State, ID, User } from "../../State"

import { randomInt } from "../../utils/randomInt"

interface createCodeOptions {
    name: string
    state: State
    user: Pick<User, "id">
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
    user: { id }
}: createCodeOptions): number => {
    const { freeCodes } = state

    const code = freeCodes[randomInt(0, freeCodes.length)]

    freeCodes.splice(code, 1)
    state.codes[code] = {
        name,
        host: { id },
        guests: [],
        memes: [],
        locked: false
    }

    return code
}

export const createClassroom = ({
    ws,
    data,
    state,
    id
}: createClassroomOptions): { code: string; name: string } => {
    const { name } = data as { name: string; username: string }

    const numCode = createCode({ name, state, user: { id } })

    const code = String(numCode).padStart(6, "0")

    return { code, name }
}
