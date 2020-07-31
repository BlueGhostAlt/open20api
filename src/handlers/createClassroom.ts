import WebSocket from "ws"

import { Context } from ".."
import { State, Code, ID } from "../State"

import { randomInt } from "../utils/randomInt"

const freeCodes = Array(1000000)
    .fill(undefined)
    .map((_, i) => i)

const createCode = ({
    name,
    state,
    id
}: {
    name: string
    state: State
    id: ID
}): number => {
    const code = freeCodes[randomInt(0, freeCodes.length)]

    freeCodes.splice(code, 1)
    state.codes[code] = { name, host: id, guests: [] }

    return code
}

const useCode = ({
    code,
    state,
    id
}: {
    code: Code
    state: State
    id: ID
}): boolean => {
    if (state.codes[code]) {
        state.codes[code].guests.push(id)
        return true
    }

    return false
}

export const createClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State,
    id: ID
): { code: string; name: string } => {
    const { name } = data as { name: string }

    const numCode = createCode({ name, state, id })

    const code = String(numCode).padStart(6, "0")

    return { code, name }
}

export const joinClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State,
    id: ID
): { hasJoined: false } | { hasJoined: true; code: Code; name: string } => {
    const { code: strCode } = data as { code: string }

    const code = Number(strCode)
    const hasJoined = useCode({ code, state, id })

    if (!hasJoined) {
        return { hasJoined }
    }

    const name = state.codes[code].name

    return { hasJoined, code, name }
}
