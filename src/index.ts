import WebSocket from "ws"

const wss = new WebSocket.Server({ port: 8080 })

import * as handlers from "./handlers"
import { State } from "./State"

export interface Context {
    type: keyof typeof handlers
    data: object
}

const state: State = { codes: {}, lastId: 0 }

wss.on("connection", ws => {
    ws.on("message", message => {
        try {
            const request = message.toString()

            const parsed: Context = JSON.parse(request)

            const response = handlers[parsed.type](ws, parsed.data, state)

            ws.send(response)
        } catch {
            console.info("Oops! Something went wrong")
        }
    })

    ws.send("Hello world!")
})
