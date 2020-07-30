export const keys = <T extends object>(o: T) => Object.keys(o) as Array<keyof T>
