import WebSocket from "ws"

import { Context } from "../.."
import { State, Code, ID } from "../../State"

interface useCodeOptions {
    code: Code
    state: State
    id: ID
}
interface joinClassroomOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

const useCode = ({ code, state, id }: useCodeOptions): boolean => {
    if (state.codes[code]) {
        state.codes[code].guests.push(id)
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
    | { hasJoined: true; code: Code; name: string } => {
    const { code: strCode } = data as { code: string }

    const code = Number(strCode)
    const hasJoined = useCode({ code, state, id })

    if (!hasJoined) {
        return { hasJoined }
    }

    const name = state.codes[code].name

    return { hasJoined, code, name }
}
