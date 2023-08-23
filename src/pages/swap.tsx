import { Box, Select, Input, Button, Text, Flex, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FaArrowDown } from 'react-icons/fa'
import React, { useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { ETH, VAULT_MANAGEMENT } from 'utils/config'
import { useAccount, useContractWrite } from 'wagmi'
import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { parseEther } from 'viem'

interface SwapProps {
  exchange: string
  pool: string
  user: string
  inCoin: string
  outCoin: string
  inAmount: string
  outAmount: string
}

function SwapButton(props: SwapProps) {
  const { exchange, pool, user, inCoin, outCoin, inAmount, outAmount } = props
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'swapTokenFor',
    args: [
      exchange as `0x{string}`,
      pool as `0x{string}`,
      user as `0x{string}`,
      inCoin as `0x{string}`,
      outCoin as `0x{string}`,
      inAmount ? parseEther(inAmount as `${number}`) : parseEther('0'),
      outAmount ? parseEther(outAmount as `${number}`) : parseEther('0'),
    ],
  })

  return (
    <Button
      size="sm"
      mt={2}
      w="100%"
      colorScheme="blue"
      onClick={() => {
        write()
      }}>
      Swap
    </Button>
  )
}
export default function SwapComponent() {
  const [selectedTokenA, setSelectedTokenA] = useState('0x42a71137C09AE83D8d05974960fd607d40033499')
  const [selectedTokenB, setSelectedTokenB] = useState(ETH)
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)

  const tokenOptions = [
    { label: 'WETH9', value: '0x42a71137C09AE83D8d05974960fd607d40033499' },
    { label: 'ETH', value: ETH },
  ]
  const exchangeOptions = [
    { label: 'uniswap', value: 'uniswap' },
    { label: 'curve', value: 'curve' },
  ]

  const [selectExchange, setSelectExchange] = useState('')

  const { isConnected } = useAccount()
  const { address } = useAccount()

  const handleSwapTokens = () => {
    setSelectedTokenA(selectedTokenB)
    setSelectedTokenB(selectedTokenA)
  }
  if (isConnected) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Flex alignItems="center" mb={2}>
          <InputGroup borderWidth="1px" borderRadius="lg" borderColor="gray.200" h="40px">
            <Input
              size="sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              pr="4.5rem"
              border="none"
              _focus={{ boxShadow: 'none' }}
            />
            <Select
              size="sm"
              value={selectedTokenA}
              onChange={(e) => setSelectedTokenA(e.target.value)}
              width="200px"
              border="none"
              _focus={{ boxShadow: 'none' }}>
              {tokenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </InputGroup>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" my={2}>
          <Select width="auto" value={selectExchange} onChange={(e) => setSelectExchange(e.target.value)}>
            {exchangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
          <IconButton icon={<FaArrowDown />} aria-label="Swap Tokens" onClick={handleSwapTokens} />
        </Flex>

        <Flex alignItems="center" mb={2}>
          <InputGroup borderWidth="1px" borderRadius="lg" borderColor="gray.200" h="40px">
            <Input
              size="sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              pr="4.5rem"
              border="none"
              _focus={{ boxShadow: 'none' }}
            />
            <Select
              size="sm"
              value={selectedTokenB}
              onChange={(e) => setSelectedTokenB(e.target.value)}
              width="200px"
              border="none"
              _focus={{ boxShadow: 'none' }}>
              {tokenOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </InputGroup>
        </Flex>
        <SwapButton exchange={selectExchange} pool="" user="" inCoin="" outCoin="" inAmount="" outAmount="" />
      </Box>
    )
  }
  return (
    <Text textAlign="center" fontWeight="bold" color="red">
      Connect your wallet first.
    </Text>
  )
}
