import {
  Select,
  Input,
  Flex,
  Box,
  Text,
  Button,
  Divider,
  InputGroup,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { useCurrentBalance } from 'hooks/useCurrentBalance'
import { useUserBalance } from 'hooks/useUserBalance'
import { useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { ETH, VAULT_MANAGEMENT } from 'utils/config'
import { parseEther } from 'viem'
import { useAccount, useContractWrite } from 'wagmi'

interface SubmitProps {
  user: string
  debouncedValue: string
  token: string
}

function Submit(props: SubmitProps) {
  const { user, debouncedValue, token } = props
  const [strategy, setStrategy] = useState('')
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'depositFor',
    args: [strategy as `0x{string}`, user as `0x{string}`, debouncedValue ? parseEther(debouncedValue as `${number}`) : parseEther('0')],
  })
  const balance = useUserBalance(user, token)

  const isDisabled = balance >= parseEther(debouncedValue as `${number}`)
  return (
    <>
      <Button
        disabled={isDisabled}
        colorScheme="blue"
        onClick={() => {
          write()
        }}>
        Submit
      </Button>
    </>
  )
}

function Withdraw() {
  const [strategy, setStrategy] = useState('')
  const { address } = useAccount()
  const [user, setUser] = useState(address)
  const [inputAmount, setInputAmount] = useState()
  const debouncedAmount = useDebounce(inputAmount, 500)
  const [flag, setFlag] = useState(0)
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'withdrawFor',
    args: [strategy as `0x{string}`, user as `0x{string}`, debouncedAmount ? parseEther(debouncedAmount as `${number}`) : parseEther('0'), flag],
  })
  return (
    <Button
      disabled={false}
      colorScheme="blue"
      onClick={() => {
        write()
      }}>
      Withdraw
    </Button>
  )
}

export default function StrategyComponent() {
  const [selectedToken, setSelectedToken] = useState(ETH)
  const debouncedToken = useDebounce(selectedToken, 500)
  const [inputValue, setInputValue] = useState('')
  const [inputUser, setInputUser] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)
  const tokenOptions = [
    { label: 'lido', value: ETH },
    { label: 'compoundUSDC', value: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F' },
    { label: 'compoundWETH', value: '0x42a71137C09AE83D8d05974960fd607d40033499' },
  ]
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const balance = useCurrentBalance(address as `0x${string}`, debouncedToken === ETH ? '' : debouncedToken)

  let balanceInfo = null
  let symbol = null
  if (selectedToken === ETH) {
    const ethFormatted = balance.data?.formatted
    symbol = 'ETH'
    balanceInfo = (
      <>
        余额: {ethFormatted !== undefined ? parseFloat(ethFormatted).toFixed(3) : 'N/A'} {symbol}
      </>
    )
  } else {
    const ercFormatted = balance.data?.formatted
    const ercSymbol = balance.data?.symbol
    symbol = ercSymbol
    balanceInfo = <>余额: {ercFormatted !== undefined ? `${parseFloat(ercFormatted).toFixed(3)} ${ercSymbol}` : 'N/A'}</>
  }

  if (isConnected) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Select mb={2} value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
          {tokenOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input mb={2} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={symbol} />
        <Input mb={2} type="text" value={inputUser} onChange={(e) => setInputUser(e.target.value)} placeholder="User" />

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">{balanceInfo}</Text>
          <Submit user={address as string} debouncedValue={debouncedValue} token={selectedToken} />
          <Withdraw />
        </Flex>
      </Box>
    )
  }

  return (
    <Text textAlign="center" fontWeight="bold" color="red">
      Connect your wallet first.
    </Text>
  )
}
