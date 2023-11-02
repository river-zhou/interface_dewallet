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
import BigNumber from 'bignumber.js'
import { useCurrentBalance } from 'hooks/useCurrentBalance'
import { useGetShare } from 'hooks/useGetShare'
import { useUserBalance } from 'hooks/useUserBalance'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { VAULT_MANAGEMENT, USDC, WETH9, COMPOUND_USDC, COMPOUND_WETH, LIDO } from 'utils/config'
import { parseEther } from 'viem'
import { useAccount, useContractWrite } from 'wagmi'

interface SubmitProps {
  user: string
  debouncedValue: string
  token: string
  strategy: string
}

function Submit(props: SubmitProps) {
  const { user, debouncedValue, token, strategy } = props
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'depositFor',
    args: [strategy as `0x{string}`, user as `0x{string}`, debouncedValue ? parseEther(debouncedValue as `${number}`) : parseEther('0')],
  })
  const balance = useUserBalance(user, token)
  const isDisabled = (balance as number) < parseEther(debouncedValue as `${number}`)
  return (
    <>
      <Button
        disabled={isDisabled}
        colorScheme="blue"
        width="100px"
        onClick={() => {
          write()
        }}>
        Submit
      </Button>
    </>
  )
}

interface WithdrawProps {
  user: string
  strategy: string
  withdrawAmount: string
}

function Withdraw(props: WithdrawProps) {
  const { user, strategy, withdrawAmount } = props
  const [inputAmount, setInputAmount] = useState()
  const debouncedAmount = useDebounce(inputAmount, 50)
  const [flag, setFlag] = useState(0)
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'withdrawFor',
    args: [user as `0x{string}`, strategy as `0x{string}`, debouncedAmount ? parseEther(debouncedAmount as `${number}`) : parseEther('0'), flag],
  })
  return (
    <Button
      disabled={false}
      colorScheme="blue"
      width="100px"
      onClick={() => {
        write()
      }}>
      Withdraw
    </Button>
  )
}

export default function StrategyComponent(props: { flag: any }) {
  const flag = props.flag
  const [selectedSetStrategy, setSelectedSetStrategy] = useState(COMPOUND_WETH)
  const debouncedSetStrategy = useDebounce(selectedSetStrategy, 500)
  const [inputValue, setInputValue] = useState('')
  const [token, setToken] = useState(WETH9)
  const [inputUser, setInputUser] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)
  const strategyOptions = [
    { label: 'compoundUSDC', value: COMPOUND_USDC },
    { label: 'compoundWETH', value: COMPOUND_WETH },
    { label: 'lido', value: LIDO },
  ]
  const tokenOptions = useMemo(
    () =>
      ({
        COMPOUND_USDC: USDC,
        COMPOUND_WETH: WETH9,
        LIDO: WETH9,
      } as { [key: string]: string }),
    []
  )
  const { isConnected } = useAccount()
  const { address } = useAccount()
  let result = useUserBalance(inputUser, token)
  let tokenInfo = useCurrentBalance(inputUser, token)
  let share = useGetShare(inputUser, selectedSetStrategy)
  useEffect(() => {
    setToken(tokenOptions[selectedSetStrategy])
  }, [selectedSetStrategy, tokenOptions])
  let shareFormatted = new BigNumber(share).div(new BigNumber(10).pow(18)).toFixed(4)
  let balanceInfo = null
  let symbol = tokenInfo.data?.symbol
  let decimals = tokenInfo.data?.decimals
  let formattedBalance
  if (decimals !== undefined) {
    formattedBalance = new BigNumber(result).div(BigNumber(10).pow(decimals)).toString()
  }
  balanceInfo = (
    <>
      余额: {formattedBalance} {symbol}
    </>
  )
  let shareInfo = null
  shareInfo = <>份额: {shareFormatted}</>

  if (isConnected) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Select
          mb={2}
          value={selectedSetStrategy}
          onChange={(e) => {
            setSelectedSetStrategy(e.target.value)
          }}>
          {strategyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input mb={2} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Amount" />
        {flag && <Input mb={2} type="text" value={inputUser} onChange={(e) => setInputUser(e.target.value)} placeholder="User" />}

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">{balanceInfo}</Text>
          <Submit user={address as string} debouncedValue={debouncedValue} token={token} strategy={debouncedSetStrategy} />
        </Flex>
        <Divider my={2} />
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">{shareInfo}</Text>
          <Withdraw user={flag ? inputUser : (address as string)} strategy={selectedSetStrategy} withdrawAmount={debouncedValue} />
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
