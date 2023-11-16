import React, { useEffect, useMemo, useState } from 'react'
import { Box, Select, Input, Button, Text, Flex } from '@chakra-ui/react' // 导入 Chakra UI 组件
import { erc20ABI, useAccount, useBalance, useContractWrite } from 'wagmi'
import { BLOCK_CHAIN_RPC, CONTRACTS_ALL } from 'utils/config'
import { VAULT_MANAGEMENT_ABI } from 'abis/index'
import { useApprove, useGetAllowance } from 'hooks/useERC20'
import { useCurrentBalance } from 'hooks/useCurrentBalance'
import { useDebounce } from 'usehooks-ts'
import { parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useAllTokens } from '../hooks/useAllTokens'
import { ethers } from 'ethers'

function DepositETH({ debouncedToken, debouncedValue }: { debouncedToken: string; debouncedValue: string }) {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACTS_ALL.VAULT_MANAGEMENT as `0x{string}`,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'deposit',
    args: [debouncedToken, parseEther('0')],
    value: parseEther(debouncedValue),
  })
  const { address } = useAccount()
  const balance = useBalance({
    address: address as `0x{string}`,
  })
  const isBalanceZero = parseEther(balance.data?.formatted || '0')
  return (
    <Button
      disabled={!write || isBalanceZero === parseEther('0')}
      colorScheme="blue"
      onClick={() => {
        write()
      }}>
      Deposit
    </Button>
  )
}

function DepositERC20({ debouncedToken, user, debouncedValue }: { debouncedToken: string; user: string; debouncedValue: string }) {
  const approveResults = useGetAllowance(debouncedToken, user, CONTRACTS_ALL.VAULT_MANAGEMENT)

  const approve = useApprove(debouncedToken, CONTRACTS_ALL.VAULT_MANAGEMENT, parseEther(debouncedValue as `${number}`))

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: CONTRACTS_ALL.VAULT_MANAGEMENT as `0x{string}`,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'deposit',
    args: [debouncedToken, debouncedValue ? parseEther(debouncedValue as `${number}`) : parseEther('0')],
  })
  const handleSendTransaction = () => {
    if (approveResults.data != undefined && approveResults.data >= parseEther(debouncedValue as `${number}`)) {
      write()
    } else {
      approve.write()
    }
  }
  const SDButton = approveResults.data === BigInt(0) || approveResults.data === undefined ? 'Approve' : 'Deposit'
  const { address } = useAccount()
  const balance = useBalance({
    address: address as `0x{string}`,
    token: debouncedToken as `0x{string}`,
  })
  const isBalanceZero = parseEther(balance.data?.formatted || '0')
  return (
    <Button
      disabled={!write || isBalanceZero === parseEther('0')}
      colorScheme="blue"
      onClick={() => {
        handleSendTransaction()
      }}>
      {SDButton}
    </Button>
  )
}

export default function DepositComponent() {
  const [selectedToken, setSelectedToken] = useState(CONTRACTS_ALL.TOKENS.ETH[0])
  const debouncedToken = useDebounce(selectedToken, 500)
  const [selectedTokenBalance, setSelectTokenBalance] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)
  const { loading, error, tokens } = useAllTokens()
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const tokenOptions = tokens.map((token) => {
    return {
      value: token.id,
      label: token.symbol,
    }
  })
  const fixedOptions = [
    {
      value: CONTRACTS_ALL.TOKENS.ETH,
      label: 'ETH',
    },
  ]
  const allOptions = [...fixedOptions, ...tokenOptions]

  useEffect(() => {
    const fetchBalance = async () => {
      if (CONTRACTS_ALL.TOKENS.ETH === debouncedToken) {
        const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli')
        const balanceETH = await provider.getBalance(address as string)
        const formattedBalance = parseFloat(ethers.utils.formatUnits(balanceETH, 18)).toFixed(4)
        setSelectTokenBalance(formattedBalance)
      } else {
        const ERC20 = new ethers.Contract(debouncedToken, erc20ABI, new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_goerli'))
        const balanceERC = await ERC20.balanceOf(address)
        const decimals = await ERC20.decimals()
        // const ercSymbol = await ERC20.symbol()
        const ercFormatted = balanceERC.data?.formatted
        const ercValue = ercFormatted !== undefined ? parseFloat(ethers.utils.formatUnits(ercFormatted, decimals)).toFixed(4) : '0'
        setSelectTokenBalance(ercValue)
      }
    }
    fetchBalance()
  }, [address, debouncedToken])
  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  if (isConnected) {
    const depositButton = CONTRACTS_ALL.TOKENS.ETH.includes(debouncedToken) ? (
      <DepositETH debouncedToken={debouncedToken} debouncedValue={debouncedValue} />
    ) : (
      <DepositERC20 debouncedToken={debouncedToken} user={address as `0x${string}`} debouncedValue={debouncedValue} />
    )

    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Select mb={2} value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
          {allOptions?.map((option) => (
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

        <Flex justifyContent="space-between" alignItems="center">
          <Text color="gray">Balance：{selectedTokenBalance}</Text>
          {depositButton}
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
