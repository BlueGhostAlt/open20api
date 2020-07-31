import WebSocket from "ws"

import { Context } from "../.."
import { State, ID } from "../../State"

interface uploadMemeOptions {
    ws: WebSocket
    data: Context["data"]
    state: State
    id: ID
}

export const uploadMeme = ({
    ws,
    data,
    state,
    id
}: uploadMemeOptions): {
    id: number
    url: string
    title: string
    username: string
} => {
    const { url, title } = data as { url: string; title: string }

    const classroomCode = Object.entries(state.codes)
        .map(([code, { guests }]) => {
            const numCode = Number(code)

            return [numCode, guests] as const
        })
        .find(([_, guests]) => guests.find(g => g.id === id))

    if (!classroomCode) {
        throw new Error("A guest outside of a classroom tried upoading a meme!")
    }

    const { "0": code } = classroomCode

    const username = state.codes[code].guests.find(g => g.id === id)!.username
    const memeId = state.lastId++

    state.codes[code].memes.push({ id: memeId, url, title, username })

    const classroom = state.codes[code]
    const users = classroom.guests
        .concat(classroom.host)
        .filter(u => u.id !== id)
        .map(u => u.id)
    const sockets = users.map(u => state.sockets.get(u)) as WebSocket[]

    sockets.forEach(ws =>
        ws.send(
            JSON.stringify({
                type: "uploadMeme",
                data: { id: memeId, url, title, username }
            })
        )
    )

    return { id: memeId, url, title, username }
}
