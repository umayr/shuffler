import { useEffect, useState } from 'react'

import { generate, shuffle } from './service'

const prepare = value => {
    if (!value.includes(',')) {
        return [value.toString().trim()]
    }

    return [...new Set(value.split(',').map(v => v.toString().trim()))]
}

const useShuffle = () => {
    const [list, setList] = useState([])
    const [source, setSource] = useState([])
    const [seed, setSeed] = useState(generate())

    useEffect(() => {
        async function effect() {
            setList(source)
        }

        effect()
    }, [source])

    useEffect(() => {
        async function effect() {
            if (source.length === 0) {
                return
            }

            setList(await shuffle(source, seed))
        }

        effect()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [seed])

    return {
        push(value) {
            if (source.includes(value)) {
                return
            }

            setSource(prev => [
                ...prev,
                ...prepare(value).filter(v => v !== '' && !source.includes(v)),
            ])
        },
        shuffle() {
            setSeed(generate())
        },
        clear() {
            setSource([])
        },
        list,
        seed: {
            current: seed,
            update(next = generate()) {
                setSeed(next)
            },
        },

        isEmpty: source.length === 0,
    }
}

export default useShuffle
