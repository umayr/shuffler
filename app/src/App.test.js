jest.mock('./service')

import { render, screen, fireEvent } from '@testing-library/react'

import App from './App'

test('renders the empty app', () => {
    render(<App />)

    expect(screen.getByText(/Add/i)).toBeInTheDocument()
    expect(screen.getByText(/Shuffle/i)).toBeInTheDocument()
    expect(screen.getByText(/More/i)).toBeInTheDocument()
})

test('renders the additional options dropdown', () => {
    render(<App />)

    window.scrollTo = () => {} // since jsdom doesn't have it

    fireEvent.click(screen.getByText(/More/i))

    expect(screen.getByText(/Pick/i)).toBeInTheDocument()
    expect(screen.getByText(/Group/i)).toBeInTheDocument()
    expect(screen.getByText(/Clear/i)).toBeInTheDocument()
    expect(screen.getByText(/Shortcuts/i)).toBeInTheDocument()
})

test('adds the items in the list', () => {
    render(<App />)

    const input = screen.getByPlaceholderText('Anything goes here')

    fireEvent.change(input, { target: { value: 'some value' } })
    fireEvent.click(screen.getByText(/Add/))

    expect(screen.getAllByRole('listitem')).toMatchInlineSnapshot(`
        Array [
          <li
            class="StyledBox-sc-13pk1d4-0 gmgUSS List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some value
          </li>,
        ]
    `)

    fireEvent.change(input, { target: { value: 'some other value' } })
    fireEvent.click(screen.getByText(/Add/))

    expect(screen.getAllByRole('listitem')).toMatchInlineSnapshot(`
        Array [
          <li
            class="StyledBox-sc-13pk1d4-0 gmgUSS List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some value
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some other value
          </li>,
        ]
    `)

    fireEvent.change(input, { target: { value: 'lets,try,some,csv' } })
    fireEvent.click(screen.getByText(/Add/))

    expect(screen.getAllByRole('listitem')).toMatchInlineSnapshot(`
        Array [
          <li
            class="StyledBox-sc-13pk1d4-0 gmgUSS List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some value
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some other value
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            lets
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            try
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            csv
          </li>,
        ]
    `)

    fireEvent.change(input, {
        target: {
            value: 'it,should,not,add,any,empty,values,,,,,,,,,,     ,, ,, , , , , , ,',
        },
    })
    fireEvent.click(screen.getByText(/Add/))

    expect(screen.getAllByRole('listitem')).toMatchInlineSnapshot(`
        Array [
          <li
            class="StyledBox-sc-13pk1d4-0 gmgUSS List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some value
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some other value
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            lets
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            try
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            some
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            csv
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            it
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            should
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            not
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            add
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            any
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            empty
          </li>,
          <li
            class="StyledBox-sc-13pk1d4-0 bUcMvs List__StyledItem-sc-130gdqg-1 fxxWMi"
          >
            values
          </li>,
        ]
    `)
})
