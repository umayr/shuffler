import { useState } from 'react'

// Durstenfeld's Shuffle Algorithm
// The modern version of the Fisher–Yates shuffle
export const shuffler = (list = []) => {
  const array = [...list]

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }

  return array
}

const useShuffler = (initialList = []) => {
  const [list, setList] = useState(shuffler(initialList))

  return [
    list,
    target => setList(shuffler(target)),
    () => setList(shuffler(list)),
  ]
}

export default useShuffler
