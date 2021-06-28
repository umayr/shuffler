jest.mock('./service')

import { render, screen } from '@testing-library/react'

import { Help, Pick, Group } from './Modals'
import { Grommet } from 'grommet'

const setup = component =>
    render(component, {
        wrapper: ({ children }) => <Grommet plain>{children}</Grommet>,
    })

test('renders Help modal', () => {
    const { baseElement } = setup(
        <Help source={[{ key: '1', text: 'also known as one' }]} />,
    )

    expect(screen.getByText(/Shortcuts/)).toBeInTheDocument()
    expect(screen.getByText(/Key/)).toBeInTheDocument()
    expect(screen.getByText(/Action/)).toBeInTheDocument()
    expect(screen.getByText(/1/)).toBeInTheDocument()
    expect(screen.getByText(/also known as one/)).toBeInTheDocument()

    expect(baseElement).toMatchSnapshot()
})

test('renders Pick modal', () => {
    const { baseElement } = setup(<Pick source={[]} />)

    expect(screen.getByText(/Pick/)).toBeInTheDocument()

    expect(baseElement).toMatchSnapshot()
})

test('renders Group modal', () => {
    const { baseElement } = setup(<Group source={[]} />)

    expect(screen.getByText(/Group/)).toBeInTheDocument()

    expect(baseElement).toMatchSnapshot()
})
