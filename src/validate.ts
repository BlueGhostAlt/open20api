// eslint-disable-next-line import/no-cycle
import { Context } from "."

const hasLength = (str: string): boolean => str.length >= 2 && str.length <= 32
const isSafeNumber = (num: number): boolean =>
    num >= Number.MIN_SAFE_INTEGER && num <= Number.MAX_SAFE_INTEGER

export const validate = (ctx: Context): boolean => {
    const { type, data } = ctx

    if (type === "createClassroom") {
        const { name } = data as { name: string }

        return hasLength(name)
    } else if (type === "joinClassroom") {
        const { code: strCode, username } = data as {
            code: string
            username: string
        }

        const hasCodeLength = (str: string): boolean => str.length === 6

        return hasLength(username) && hasCodeLength(strCode)
    } else if (type === "uploadMeme") {
        const { url, title } = data as { url: string; title: string }

        const hasImageLength = (str: string): boolean => str.length <= 68000

        return hasLength(title) && hasImageLength(url)
    } else if (type === "deleteMeme") {
        const { id } = data as { id: number }

        return isSafeNumber(id)
    }

    return false
}
