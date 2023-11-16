import { Select, Input, Flex, Box, Text, Button, Divider } from '@chakra-ui/react'
import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { ethers } from 'ethers'
import { useUserBalance } from 'hooks/useUserBalance'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce } from 'usehooks-ts'
import { CONTRACTS_ALL } from 'utils/config'
import { parseEther } from 'viem'
import { erc20ABI, useAccount, useContractWrite } from 'wagmi'

interface SubmitProps {
  user: string
  debouncedValue: string
  token: string
  strategy: string
}

function Submit(props: SubmitProps) {
  const { user, debouncedValue, token, strategy } = props
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACTS_ALL.VAULT_MANAGEMENT as `0x{string}`,
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
    address: CONTRACTS_ALL.VAULT_MANAGEMENT as `0x{string}`,
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
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const [selectedSetStrategy, setSelectedSetStrategy] = useState(CONTRACTS_ALL.STRATEGIES.COMPOUND_WETH)
  const debouncedSetStrategy = useDebounce(selectedSetStrategy, 500)
  const [inputValue, setInputValue] = useState('')
  const [token, setToken] = useState<string>(CONTRACTS_ALL.TOKENS.WETH9)
  const [inputUser, setInputUser] = useState(flag ? '' : address)

  const debouncedValue = useDebounce(inputValue, 500)
  const [accountBalance, setAccountBalance] = useState('')
  const [symbol, setSymbol] = useState('')
  const [userShare, setUserShare] = useState('')
  const strategyOptions = [
    { label: 'compoundWETH', value: CONTRACTS_ALL.STRATEGIES.COMPOUND_WETH },
    { label: 'compoundUSDC', value: CONTRACTS_ALL.STRATEGIES.COMPOUND_USDC },
    { label: 'lido', value: CONTRACTS_ALL.STRATEGIES.LIDO },
    { label: 'balancingPool', value: CONTRACTS_ALL.STRATEGIES.BALANCING_POOL },
  ]
  const tokenOptions = useMemo<{ [key: string]: string | undefined }>(() => {
    switch (selectedSetStrategy) {
      case CONTRACTS_ALL.STRATEGIES.COMPOUND_USDC:
        return { [CONTRACTS_ALL.STRATEGIES.COMPOUND_USDC]: CONTRACTS_ALL.TOKENS.USDC }
      case CONTRACTS_ALL.STRATEGIES.COMPOUND_WETH:
        return { [CONTRACTS_ALL.STRATEGIES.COMPOUND_WETH]: CONTRACTS_ALL.TOKENS.WETH9 }
      case CONTRACTS_ALL.STRATEGIES.LIDO:
        return { [CONTRACTS_ALL.STRATEGIES.LIDO]: CONTRACTS_ALL.TOKENS.WETH9 }
      case CONTRACTS_ALL.STRATEGIES.BALANCING_POOL:
        return { [CONTRACTS_ALL.STRATEGIES.BALANCING_POOL]: CONTRACTS_ALL.TOKENS.USDC }
      default:
        return {}
    }
  }, [selectedSetStrategy])
  // get user's balance of coin in vault

  useEffect(() => {
    const selectedToken = tokenOptions[selectedSetStrategy]

    if (selectedToken !== undefined) {
      setToken(selectedToken)
    }

    if (!inputUser?.trim()) {
      return
    }

    if (!inputUser || !/^0x[a-fA-F0-9]{40}$/.test(inputUser)) {
      return
    }
    const fetchData = async () => {
      const instance = new ethers.Contract(
        CONTRACTS_ALL.VAULT_MANAGEMENT,
        VAULT_MANAGEMENT_ABI,
        new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli')
      )

      try {
        // Fetch account balance
        console.log('token', token)
        console.log('set', selectedSetStrategy)
        const result = await instance.getAccountBalance(inputUser ? inputUser : address, token)
        const erc20 = new ethers.Contract(token, erc20ABI, new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli'))
        const symbol = await erc20.symbol()
        const decimals = await erc20.decimals()
        setAccountBalance(parseFloat(ethers.utils.formatUnits(result, decimals)).toFixed(4))
        console.log(parseFloat(ethers.utils.formatUnits(result, decimals)).toFixed(4))
        setSymbol(symbol)
      } catch (error) {
        console.error('An error occurred:', error)
        setAccountBalance('0')
        return
      }
      // Fetch user share
      try {
        const share = await instance.getAccountStrategyShares(inputUser ? inputUser : address, selectedSetStrategy)
        setUserShare(parseFloat(ethers.utils.formatUnits(share, 18)).toFixed(4))
      } catch (error) {
        console.error('An error occurred:', error)
        setUserShare('0')
        return
      }
    }

    fetchData()
  }, [accountBalance, address, inputUser, selectedSetStrategy, token, tokenOptions])

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
        <Input
          mb={2}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const input = e.target.value
            if (/^\d*\.?\d*$/.test(input)) {
              setInputValue(input)
            }
          }}
          placeholder="Amount"
        />
        {flag && <Input mb={2} type="text" value={inputUser} onChange={(e) => setInputUser(e.target.value)} placeholder="User" />}

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">
            Balance: {accountBalance} {symbol}
          </Text>
          <Submit user={address as string} debouncedValue={debouncedValue} token={token} strategy={debouncedSetStrategy} />
        </Flex>
        <Divider my={2} />
        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">Shares:{userShare}</Text>
          <Withdraw user={flag ? inputUser! : (address as string)} strategy={selectedSetStrategy} withdrawAmount={debouncedValue} />
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
