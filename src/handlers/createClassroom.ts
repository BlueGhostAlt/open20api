import WebSocket from "ws"

import { Context } from ".."
import { State } from "../State"

import { randomInt } from "../utils/randomInt"

const freeCodes = Array(1000000)
    .fill(undefined)
    .map((_, i) => i)

const createCode = (name: string, state: State): number => {
    const code = freeCodes[randomInt(0, freeCodes.length)]

    freeCodes.splice(code, 1)
    state.codes[code] = { name, host: state.lastId++, guests: [] }

    return code
}

const useCode = (code: number, state: State): boolean => {
    if (state.codes[code]) {
        state.codes[code].guests.push(state.lastId++)
        return true
    }

    return false
}

export const createClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State
): { code: string; name: string } => {
    const { name } = data as { name: string }

    const numCode = createCode(name, state)

    const code = String(numCode).padStart(6, "0")

    return { code, name }
}

export const joinClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State
): { hasJoined: boolean } => {
    const { code } = data as { code: number }

    const hasJoined = useCode(code, state)

    return { hasJoined }
}
