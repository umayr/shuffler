import { useState } from 'react'
import {
    Grommet,
    Main,
    TextInput,
    Box,
    Button,
    List,
    DropButton,
    Keyboard,
} from 'grommet'
import { grommet } from 'grommet/themes'
import {
    Add as AddIcon,
    Group as GroupIcon,
    ClearOption as ClearIcon,
    Sign as PickIcon,
    Down as DownIcon,
    Cycle as ShuffleIcon,
    TreeOption as SeedIcon,
    Keyboard as ShortcutIcon,
} from 'grommet-icons'

import { Group, Pick, Help } from './Modals'

import useMode from './useMode'
import useShuffle from './useShuffle'

const KEY_MAPPING = [
    {
        key: 'ctrl + h or ?',
        text: 'Shows the help screen',
    },
    {
        key: 'ctrl + g',
        text: 'Opens the screen to group items together',
    },
    {
        key: 'ctrl + p',
        text: 'Opens the screen to pick items',
    },
    {
        key: 'ctrl + s',
        text: 'Shuffles items',
    },
    {
        key: 'ctrl + c',
        text: 'Clears all previous data',
    },
    {
        key: 'ctrl + d',
        text: 'Toggles between light and dark mode',
    },
]

function App() {
    const [value, setValue] = useState('')

    const [showPick, setShowPick] = useState(false)
    const [showGroup, setShowGroup] = useState(false)
    const [showHelp, setShowHelp] = useState(false)

    const [mode, toggleMode] = useMode()
    const { list, push, shuffle, clear, seed, isEmpty } = useShuffle()

    const handleAdd = () => {
        push(value)
        setValue('')
    }

    const handleKey = event => {
        if (!event.ctrlKey && event.key !== '?') {
            return
        }

        const key = event.key.toLowerCase()

        if (!['?', 'h', 'd'].includes(key) && isEmpty) {
            // prevent shuffle actions in case of the source being empty
            return
        }

        switch (key) {
            case 'h':
            case '?':
                setShowHelp(true)
                return

            case 'd':
                toggleMode()
                return

            case 'p':
                setShowPick(true)
                return

            case 'g':
                setShowGroup(true)
                return

            case 'c':
                clear()
                return

            case 's':
                shuffle()
                return

            default:
                return
        }
    }

    return (
        <Grommet
            theme={grommet}
            themeMode={mode}
            style={{ minHeight: '100vh' }}
        >
            {showPick && (
                <Pick source={list} onClose={() => setShowPick(false)} />
            )}

            {showGroup && (
                <Group source={list} onClose={() => setShowGroup(false)} />
            )}

            {showHelp && (
                <Help source={KEY_MAPPING} onClose={() => setShowHelp(false)} />
            )}

            <Keyboard onKeyDown={handleKey} target="document">
                <Main pad="large">
                    <Box direction="column" gap="medium">
                        <Keyboard onEnter={handleAdd}>
                            <Box direction="row" gap="medium">
                                <TextInput
                                    placeholder="Anything goes here"
                                    value={value}
                                    onChange={event =>
                                        setValue(event.target.value)
                                    }
                                />

                                <Button
                                    primary
                                    icon={<AddIcon />}
                                    label="Add"
                                    disabled={value.length === 0}
                                    onClick={handleAdd}
                                />
                            </Box>
                        </Keyboard>
                        <List data={list} pad="small" />
                        <Box
                            direction="row-reverse"
                            gap="medium"
                            height="xxsmall"
                        >
                            <DropButton
                                label="More"
                                icon={<DownIcon />}
                                dropAlign={{ top: 'bottom', right: 'right' }}
                                dropContent={
                                    <Box pad="medium" gap="medium">
                                        <Button
                                            primary
                                            icon={<ClearIcon />}
                                            label="Clear"
                                            disabled={isEmpty}
                                            onClick={clear}
                                        />
                                        <Button
                                            primary
                                            icon={<PickIcon />}
                                            label="Pick"
                                            disabled={isEmpty}
                                            onClick={() => setShowPick(true)}
                                        />
                                        <Button
                                            primary
                                            icon={<GroupIcon />}
                                            label="Group"
                                            disabled={isEmpty}
                                            onClick={() => setShowGroup(true)}
                                        />
                                        <Button
                                            primary
                                            icon={<ShortcutIcon />}
                                            label="Shortcuts"
                                            onClick={() => setShowHelp(true)}
                                        />
                                        <TextInput
                                            name="seed"
                                            placeholder="seed"
                                            icon={<SeedIcon />}
                                            value={seed.current}
                                            onChange={event =>
                                                seed.update(event.target.value)
                                            }
                                        />
                                    </Box>
                                }
                            />

                            <Button
                                primary
                                icon={<ShuffleIcon />}
                                label="Shuffle"
                                disabled={isEmpty}
                                onClick={shuffle}
                            />
                        </Box>
                    </Box>
                </Main>
            </Keyboard>
        </Grommet>
    )
}

export default App
