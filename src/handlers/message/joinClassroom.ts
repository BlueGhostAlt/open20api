import WebSocket from "ws"

import { Context } from "../.."
import { State, Code, ID, User, Meme } from "../../State"

interface useCodeOptions {
    code: Code
    state: State
    user: User
}
interface joinClassroomOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

const useCode = ({
    code,
    state,
    user: { id, username }
}: useCodeOptions): boolean => {
    if (state.codes[code]) {
        state.codes[code].guests.push({ id, username })
        return true
    }

    return false
}

export const joinClassroom = ({
    ws,
    data,
    state,
    id
}: joinClassroomOptions):
    | { hasJoined: false }
    | { hasJoined: true; code: Code; name: string; memes: Meme[] } => {
    const { code: strCode, username } = data as {
        code: string
        username: string
    }

    const code = Number(strCode)
    const hasJoined = useCode({ code, state, user: { id, username } })

    if (!hasJoined) {
        return { hasJoined }
    }

    const name = state.codes[code].name

    const memes = state.codes[code].memes

    return { hasJoined, code, name, memes }
}
