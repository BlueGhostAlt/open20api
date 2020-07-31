export type Code = number
export type ID = number
export interface Meme {
    id: number
    title: string
    username: string
    url: string
}

export type State = {
    codes: Record<Code, { name: string; host: ID; guests: ID[]; memes: Meme[] }>
} & {
    lastId: ID
    freeCodes: number[]
}

const freeCodes = Array(1000000)
    .fill(undefined)
    .map((_, i) => i)
export const state: State = { codes: {}, lastId: 0, freeCodes }
