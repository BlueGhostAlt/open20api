import WebSocket from "ws"

import { State, Code, ID } from "../../State"

interface freeCodeOptions {
    code: Code
    state: State
}
interface deleteClassroomOptions {
    ws: WebSocket
    state: State
    id: ID
}

const freeCode = ({ code, state }: freeCodeOptions): void => {
    delete state.codes[code]

    state.freeCodes.push(code)
}

export const deleteClassroom = ({
    ws,
    state,
    id
}: deleteClassroomOptions): number[] => {
    const ownedCodes = Object.entries(state.codes)
        .filter(([_, { host }]) => host.id === id)
        .map(([code, _]) => Number(code))

    const affectedGuests = Object.keys(state.codes)
        .map(Number)
        .filter(e => ownedCodes.includes(e))
        .map(code => state.codes[code].guests)
        .reduce((acc, val) => acc.concat(val), [])

    ownedCodes.forEach(code => freeCode({ code, state }))

    return affectedGuests.map(g => g.id)
}
