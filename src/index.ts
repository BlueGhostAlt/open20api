import WebSocket from "ws"

const port = Number(process.env.PORT) || 8080

const wss = new WebSocket.Server({ port }, () =>
    console.log(`WebSockets server started and running on the port ${port}! 🚀`)
)

import * as handlers from "./handlers"
import { State } from "./State"

export interface Context {
    type: keyof typeof handlers
    data: object
}

const state: State = { codes: {}, lastId: 0 }

wss.on("connection", ws => {
    const id = state.lastId++

    ws.on("message", message => {
        try {
            const request = message.toString()

            const parsed: Context = JSON.parse(request)
            const { type, data } = parsed

            const result = handlers[parsed.type]({ ws, data, state, id })

            const response: Context = { type, data: result }

            ws.send(JSON.stringify(response))
        } catch {
            console.info("Oops! Something went wrong")

            ws.send("Something went wrong ):")
        }
    })

    ws.on("close", (_, __) => {
        try {
            const { deleteClassroom } = handlers

            deleteClassroom({ ws, state, id })
        } catch {
            console.info("Oops! Something went wrong")
        }
    })
})
