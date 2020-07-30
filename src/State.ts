type Code = number
type ID = number

export type State = {
    codes: Record<Code, { name: string; host: ID; guests: ID[] }>
} & {
    lastId: ID
}
