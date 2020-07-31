import WebSocket from "ws"

const port = Number(process.env.PORT) || 8080

const wss = new WebSocket.Server({ port }, () =>
    console.log(`WebSockets server started and running on the port ${port}! 🚀`)
)

import * as handlers from "./handlers"
import { state } from "./State"

// eslint-disable-next-line import/no-cycle
import { validate } from "./validate"

export interface Context {
    type: keyof typeof handlers
    data: object
}

const isAlive = new Map<WebSocket, boolean>()
const noop = () => {}

wss.on("connection", ws => {
    const id = state.lastId++
    state.sockets.set(id, ws)

    isAlive.set(ws, true)

    ws.on("message", message => {
        try {
            const request = message.toString()

            const parsed: Context = JSON.parse(request)
            const { type, data } = parsed

            const isValid = validate(parsed)
            if (!isValid) {
                ws.terminate()
            }

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

    ws.on("pong", () => isAlive.set(ws, true))
})

const interval = setInterval(() => {
    wss.clients.forEach(ws => {
        if (!isAlive.get(ws)) return ws.terminate()

        isAlive.set(ws, false)
        ws.ping(noop)
    })
}, 30 * 1000)

wss.on("close", () => {
    clearInterval(interval)
})
