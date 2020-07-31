import WebSocket from "ws"

import { State, Code, ID } from "../../State"

import { freeCodes } from "../message/createClassroom"

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

    freeCodes.push(code)
}

export const deleteClassroom = ({
    ws,
    state,
    id
}: deleteClassroomOptions): number[] => {
    const ownedCodes = Object.entries(state.codes)
        .filter(([_, { host }]) => host === id)
        .map(([code, _]) => Number(code))

    const affectedGuests = Object.keys(state.codes)
        .map(Number)
        .filter(e => ownedCodes.includes(e))
        .map(code => state.codes[code].guests)
        .reduce((acc, val) => acc.concat(val), [])

    return affectedGuests
}
