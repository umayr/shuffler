import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import Preview from './Preview'

import { MemoryRouter as Router, Route } from 'react-router-dom'

test('renders preview', () => {
  const { container } = render(<Preview />, { wrapper: Router })

  expect(container).toMatchSnapshot()
})

test('renders preview with error', () => {
  const { container } = render(<Preview />, { wrapper: Router })

  expect(container).toHaveTextContent('Invalid URL')
  expect(container).toHaveTextContent('Try Again')
})

test('shows preview with data', () => {
  const { container } = render(
    <Router
      initialEntries={[{ pathname: '/preview/WyJmb28iXQ==' }]}
      initialIndex={0}
    >
      <Route exact path="/preview/:state">
        <Preview />
      </Route>
    </Router>,
  )

  expect(container).toHaveTextContent(/foo/)
})
