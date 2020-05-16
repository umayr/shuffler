import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import App from './App'

import { MemoryRouter as Router } from 'react-router-dom'

test('renders app', () => {
  const { container } = render(<App />, { wrapper: Router })

  expect(container).toMatchSnapshot()
})

test('renders app with predefined items in the query params', () => {
  const { container } = render(
    <Router
      initialEntries={[{ pathname: '/', search: 'item=foo&item=bar' }]}
      initialIndex={0}
    >
      <App />
    </Router>,
  )

  expect(container).toHaveTextContent(/foo/)
  expect(container).toHaveTextContent(/bar/)
})

test('populates data from text field', () => {
  const { container, getByPlaceholderText } = render(<App />, {
    wrapper: Router,
  })

  const input = getByPlaceholderText('Anything goes here')
  const form = container.querySelector('form')

  fireEvent.input(input, { target: { value: 'foo' } })
  fireEvent.submit(form)
  expect(container).toHaveTextContent(/foo/)

  fireEvent.input(input, { target: { value: 'bar' } })
  fireEvent.submit(form)
  expect(container).toHaveTextContent(/bar/)

  fireEvent.input(input, { target: { value: 'baz' } })
  fireEvent.submit(form)
  expect(container).toHaveTextContent(/baz/)
})

test('shows preview url', () => {
  const { container, getByPlaceholderText, getByText } = render(
    <App />,
    {
      wrapper: Router,
    },
  )

  const input = getByPlaceholderText('Anything goes here')
  const form = container.querySelector('form')

  fireEvent.input(input, { target: { value: 'foo' } })
  fireEvent.submit(form)
  expect(container).toHaveTextContent(/foo/)

  fireEvent.click(getByText('Share'))

  const preview = container.querySelector('input[name=preview]');

  expect(preview.value).toBe('http://localhost/preview/WyJmb28iXQ==')
})
