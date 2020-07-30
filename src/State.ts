type Code = number
type ID = number

export type State = { codes?: Record<Code, { host: ID; guests: ID[] }> } & {
    lastId: ID
}
