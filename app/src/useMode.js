import { useState } from 'react'

const MODE_LIGHT = 'light'
const MODE_DARK = 'dark'

const DEFAULT_MODE = MODE_LIGHT

const useMode = () => {
    const [mode, setMode] = useState(DEFAULT_MODE)

    const toggle = () => {
        switch (mode) {
            case MODE_DARK:
                setMode(MODE_LIGHT)
                return
            case MODE_LIGHT:
                setMode(MODE_DARK)
                return
            default:
                setMode(DEFAULT_MODE)
        }
    }

    return [mode, toggle]
}

export default useMode
