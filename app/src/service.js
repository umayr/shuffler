import {
    uniqueNamesGenerator,
    adjectives,
    colors,
    animals,
} from 'unique-names-generator'

const DEFAULT_SEED = `
   "Have you ever had shoes without shoe strings?"
   –– Kanye West
`

export const shuffle = async (list, seed = DEFAULT_SEED) => {
    if (!Array.isArray(list)) {
        throw new Error(`invalid value for argument list: ${list}`)
    }

    if (seed === null || typeof seed === 'undefined') {
        throw new Error(`invalid value for argument seed: ${seed}`)
    }

    const { shuffle: func } = await import('@wasm')

    return func(list, seed)
}

const extract =
    name =>
    async (list, count = 0, seed = DEFAULT_SEED) => {
        if (!Array.isArray(list)) {
            throw new Error(`invalid value for argument list: ${list}`)
        }

        if (
            !Number.isInteger(count) ||
            (Number.isInteger(count) && count <= 0)
        ) {
            throw new Error(`invalid value for argument count: ${count}`)
        }

        if (seed === null || typeof seed === 'undefined') {
            throw new Error(`invalid value for argument seed: ${seed}`)
        }

        const { [name]: func } = await import('@wasm')

        return func(list, count, seed)
    }

export const pick = async (...args) => extract('pick')(...args)

export const group = async (...args) => extract('group')(...args)

export const generate = () =>
    uniqueNamesGenerator({
        separator: ' ',
        dictionaries: [adjectives, colors, animals],
    })
