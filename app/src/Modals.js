import { useEffect, useMemo, useState } from 'react'
import {
    Heading,
    List,
    Layer,
    Box,
    Button,
    RangeInput,
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from 'grommet'
import { Close as CloseIcon } from 'grommet-icons'

import { group, pick } from './service'

const Modal = ({ onClose, children }) => (
    <Layer onClickOutside={onClose} onEsc={onClose}>
        <Box
            pad={{
                horizontal: 'xlarge',
                vertical: 'large',
            }}
            gap="large"
            width={{ min: '50vw' }}
        >
            {children}
            <Button
                label="Close"
                icon={<CloseIcon />}
                secondary
                onClick={onClose}
            />
        </Box>
    </Layer>
)

const ACTION_TYPE_PICK = 'pick'
const ACTION_TYPE_GROUP = 'group'

const ACTION_TITLE = {
    [ACTION_TYPE_PICK]: 'Pick',
    [ACTION_TYPE_GROUP]: 'Group',
}

const ACTION_FUNC = {
    [ACTION_TYPE_PICK]: pick,
    [ACTION_TYPE_GROUP]: group,
}

const Action = ({ type, source, seed = '', onClose = () => {} }) => {
    if (type !== ACTION_TYPE_GROUP && type !== ACTION_TYPE_PICK) {
        throw new Error(`unsupported action type: ${type}`)
    }

    const [value, setValue] = useState(1)
    const [list, setList] = useState([])

    useEffect(() => {
        async function effect() {
            if (Array.isArray(source) && source.length === 0) {
                return
            }

            setList(
                await ACTION_FUNC[type](
                    source,
                    Number.parseInt(value, 10),
                    seed,
                ),
            )
        }

        effect()
    }, [source, value, type, seed])

    const data = useMemo(
        () => (type === ACTION_TYPE_GROUP ? list.map(v => v.join(',')) : list),
        [type, list],
    )

    return (
        <Modal onClose={onClose}>
            <Heading level={3} margin="xsmall">
                {ACTION_TITLE[type]} ({value})
            </Heading>
            <RangeInput
                value={value}
                max={source.length}
                min={1}
                onChange={event => setValue(event.target.value)}
            />
            {list.length > 0 && <List data={data} pad="small" />}
        </Modal>
    )
}

export const Pick = props => <Action type={ACTION_TYPE_PICK} {...props} />

export const Group = props => <Action type={ACTION_TYPE_GROUP} {...props} />

export const Help = ({ source, onClose = () => {} }) => (
    <Modal onClose={onClose}>
        <Heading level={3} margin="xsmall">
            Shortcuts
        </Heading>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableCell scope="col" border="bottom">
                        Key
                    </TableCell>
                    <TableCell scope="col" border="bottom">
                        Action
                    </TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {source.map(({ key, text }) => (
                    <TableRow key={key}>
                        <TableCell scope="row">
                            <pre style={{ margin: 0 }}>{key}</pre>
                        </TableCell>
                        <TableCell>{text}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </Modal>
)
