import React, { useState } from 'react'
import { Box, Heading, Button, Flex } from 'rebass'
import { Input } from '@rebass/forms'
import shortid from 'shortid'
import { useHistory } from 'react-router-dom'

import useShuffler from './useShuffler'
import useQuery from './useQuery'

import * as base64 from './base64'

const EMPTY = ''

function App() {
  const params = useQuery()
  const history = useHistory()
  const [value, setValue] = useState(EMPTY)
  const [showPreview, setShowPreview] = useState(false)

  const [list, setList, shuffleFn] = useShuffler(params.getAll('item') ?? [])

  const onChange = event => {
    setValue(event.target.value)
  }

  const onSubmit = event => {
    event.preventDefault()

    setList([...list, value])
    setValue(EMPTY)

    params.append('item', value)
    history.push(`/?${params.toString()}`)

    return false
  }

  const onClick = event => {
    event.preventDefault()

    setShowPreview(true)
  }

  const onShuffle = event => {
    event.preventDefault()

    shuffleFn()
  }

  return (
    <Flex
      width={[1, 1, 1 / 2]}
      flexWrap="wrap"
      flexDirection="column"
      p={[4, 4, 5]}
    >
      <Box py={[2, 2, 4]}>
        <form onSubmit={onSubmit}>
          <Input
            id="text"
            name="text"
            type="text"
            value={value}
            onChange={onChange}
            placeholder="Anything goes here"
            autoComplete="off"
          />
        </form>
      </Box>
      {list.length > 0 && (
        <>
          <Box>
            {list.map(item => (
              <Heading
                fontSize={[5, 6, 7]}
                color="primary"
                key={shortid.generate()}
              >
                {item}
              </Heading>
            ))}
          </Box>
          <Box>
            <Flex my={[3, 3, 4]} flexDirection={['column', 'column', 'row']}>
              <Box width={[1, 1, 1 / 2]} mr={[0, 0, 2]} my={[2, 2, 0]}>
                <Button variant="primary" onClick={onShuffle} width={1}>
                  Shuffle
                </Button>
              </Box>
              <Box width={[1, 1, 1 / 2]} mt={[2, 2, 0]}>
                <Button variant="outline" onClick={onClick} width={1}>
                  Share
                </Button>
              </Box>
            </Flex>

            {showPreview && (
              <Input
                id="preview"
                name="preview"
                type="text"
                readOnly
                value={`${window.location.origin}/preview/${base64.to(list)}`}
              />
            )}
          </Box>
        </>
      )}
    </Flex>
  )
}

export default App
