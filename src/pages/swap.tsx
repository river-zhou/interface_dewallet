import { Box, Select, Input, Button, Text, Flex, IconButton, InputGroup, InputRightElement } from '@chakra-ui/react'
import { FaArrowDown } from 'react-icons/fa'
import React, { useContext, useEffect, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { ETH, USDC, VAULT_MANAGEMENT, WETH9, UniSwap } from 'utils/config'
import { useAccount, useContractWrite } from 'wagmi'
import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { parseEther } from 'viem'

import { useAllTokens } from '../hooks/useAllTokens'
import UniPoolPrice from './uniPoolPrice'
import { PriceContext } from './PriceContext'

interface SwapProps {
  exchange: string
  user: string
  inCoin: string
  outCoin: string
  inAmount: string
  outAmount: string
}

function SwapButton(props: SwapProps) {
  const { exchange, user, inCoin, outCoin, inAmount, outAmount } = props
  const pool = '0x334c18D09deebe577e1B5811F6EA94247Fb75015'
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

export default function SwapComponent(props: { flag: any }) {
  const flag = props.flag
  const [inputValueA, setInputValueA] = useState('')
  const [inputValueB, setInputValueB] = useState('')
  const debouncedValueA = useDebounce(inputValueA, 500)
  const debouncedValueB = useDebounce(inputValueB, 500)
  const [inputUser, setInputUser] = useState('')
  const { loading, error, tokens } = useAllTokens()
  const priceContext = useContext(PriceContext)
  console.log('priceContext', priceContext?.priceState)

  const tokenOptions =
    tokens?.map((token) => ({
      value: token.id,
      label: token.symbol,
    })) || []

  const [selectedTokenA, setSelectedTokenA] = useState(tokenOptions[0]?.value || '')
  const [selectedTokenB, setSelectedTokenB] = useState(tokenOptions[1]?.value || '')
  const pool = '0x334c18D09deebe577e1B5811F6EA94247Fb75015'

  const exchangeOptions = [
    { label: 'uniswap', value: UniSwap },
    { label: 'curve', value: 'curve' },
  ]

  const [selectExchange, setSelectExchange] = useState(UniSwap)
  const [isSwapped, setIsSwapped] = useState(false)

  const { isConnected } = useAccount()
  const { address } = useAccount()

  useEffect(() => {
    // 当 inputValueA 发生变化时，更新 inputValueB
    const calculatedValueB = parseFloat(inputValueA) * Number(priceContext?.priceState)
    setInputValueB(isNaN(calculatedValueB) ? '' : calculatedValueB.toString())
  }, [inputValueA, priceContext])

  useEffect(() => {
    // 当 inputValueB 发生变化时，更新 inputValueA
    const calculatedValueA = parseFloat(inputValueB) / Number(priceContext?.priceState)
    setInputValueA(isNaN(calculatedValueA) ? '' : calculatedValueA.toString())
  }, [inputValueB, priceContext])

  const handleSwapTokens = () => {
    setIsSwapped(!isSwapped)
  }

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  if (isConnected) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Flex alignItems="center" mb={2}>
          <InputGroup borderWidth="1px" borderRadius="lg" borderColor="gray.200" h="40px">
            <Input
              size="sm"
              value={inputValueA}
              onChange={(e) => setInputValueA(e.target.value)}
              pr="4.5rem"
              border="none"
              _focus={{ boxShadow: 'none' }}
              placeholder="Amount"
            />
            <Select
              size="sm"
              value={isSwapped ? selectedTokenB : selectedTokenA}
              onChange={(e) => {
                if (isSwapped) {
                  setSelectedTokenB(e.target.value)
                } else {
                  setSelectedTokenA(e.target.value)
                }
              }}
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

          <UniPoolPrice />

          <IconButton icon={<FaArrowDown />} aria-label="Swap Tokens" onClick={handleSwapTokens} />
        </Flex>

        <Flex alignItems="center" mb={2}>
          <InputGroup borderWidth="1px" borderRadius="lg" borderColor="gray.200" h="40px">
            <Input
              size="sm"
              value={inputValueB}
              onChange={(e) => setInputValueB(e.target.value)}
              pr="4.5rem"
              border="none"
              _focus={{ boxShadow: 'none' }}
              placeholder="Amount"
            />
            <Select
              size="sm"
              value={isSwapped ? selectedTokenA : selectedTokenB}
              onChange={(e) => {
                if (isSwapped) {
                  setSelectedTokenA(e.target.value)
                } else {
                  setSelectedTokenB(e.target.value)
                }
              }}
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
        {flag && <Input mb={2} type="text" value={inputUser} onChange={(e) => setInputUser(e.target.value)} placeholder="User" />}

        <SwapButton
          exchange={selectExchange}
          user={flag ? inputUser : (address as string)}
          inCoin={selectedTokenA}
          outCoin={selectedTokenB}
          inAmount={debouncedValueA}
          outAmount={debouncedValueB}
        />
      </Box>
    )
  }
  return (
    <Text textAlign="center" fontWeight="bold" color="red">
      Connect your wallet first.
    </Text>
  )
}
