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
