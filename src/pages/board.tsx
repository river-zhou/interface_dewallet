import React, { useState } from 'react'
import { ChakraProvider, Box, FormControl, FormLabel, Input, Button, Table, Tbody, Td, Th, Thead, Tr, Flex } from '@chakra-ui/react'
import System from './system'
import User from './user'

export default function Board() {
  const [isSystem, setSystem] = useState(true)

  const handleClick = () => {
    setSystem(!isSystem)
  }
  return (
    <>
      <Flex justifyContent="center">
        <Button
          variant={isSystem ? 'solid' : 'outline'}
          colorScheme={isSystem ? 'blue' : 'gray'}
          borderRadius={'50px 0 0 50px'}
          onClick={() => {
            handleClick()
          }}>
          {'System'}
        </Button>
        <Button
          variant={!isSystem ? 'solid' : 'outline'}
          colorScheme={!isSystem ? 'blue' : 'gray'}
          borderRadius={'0 50px 50px 0'}
          onClick={() => {
            handleClick()
          }}>
          {'User'}
        </Button>
      </Flex>
      {isSystem && <System></System>}
      {!isSystem && <User></User>}
    </>
  )
}
