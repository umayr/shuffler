import React, { useState, useEffect } from 'react'

import { Box, Text, Heading, Button, Flex } from 'rebass'
import shortid from 'shortid'
import { useParams, useHistory } from 'react-router-dom'

import * as base64 from './base64'

function Preview() {
  const { state } = useParams()
  const history = useHistory()

  const [list, setList] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    try {
      setList(base64.from(state))
    } catch (err) {
      setError(err)
    }
  }, [state])

  const onClick = e => {
    e.preventDefault()

    const params = new URLSearchParams()
    list.forEach(item => params.append('item', item))

    history.push(`/?${params.toString()}`)
  }

  return (
    <Flex
      width={[1, 1, 1 / 2]}
      flexWrap="wrap"
      flexDirection="column"
      p={[4, 4, 5]}
    >
      <Box>
        {error === null && (
          <>
            <Box>
              {list.length > 0 &&
                list.map(item => (
                  <Heading
                    fontSize={[5, 6, 7]}
                    color="primary"
                    key={shortid.generate()}
                  >
                    {item}
                  </Heading>
                ))}
            </Box>
            <Box width={[1, 1, 1 / 2]} my={3}>
              <Button variant="primary" mr={2} onClick={onClick} width={1}>
                Shuffle
              </Button>
            </Box>
          </>
        )}
        {error !== null && (
          <>
            <Text fontSize={[3, 4, 5]} fontWeight="bold" color="primary">
              Invalid URL
            </Text>
            <Button variant="primary" mt={2}>
              Try Again
            </Button>
          </>
        )}
      </Box>
    </Flex>
  )
}

export default Preview
