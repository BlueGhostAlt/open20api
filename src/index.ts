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
    ws.on("message", message => {
        try {
            const request = message.toString()

            const parsed: Context = JSON.parse(request)

            const response = handlers[parsed.type](ws, parsed.data, state)

            ws.send(response)
        } catch {
            console.info("Oops! Something went wrong")

            ws.send("Something went wrong ):")
        }
    })

    ws.send("Hello world!")
})
