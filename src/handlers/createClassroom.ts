import WebSocket from "ws"

import { Context } from "../"
import { State } from "../State"

import { randomInt } from "../utils/randomInt"

const freeCodes = Array(1000000)
    .fill(undefined)
    .map((_, i) => i)

const useCode = (name: string, state: State): number => {
    const code = freeCodes[randomInt(0, freeCodes.length)]

    freeCodes.splice(code, 1)
    state.codes[code] = { name, host: state.lastId++, guests: [] }

    return code
}

export const createClassroom = (
    ws: WebSocket,
    data: Context["data"],
    state: State
): string => {
    const { name } = data as { name: string }

    const code = useCode(name, state)

    const strCode = String(code).padStart(6, "0")

    return strCode
}
