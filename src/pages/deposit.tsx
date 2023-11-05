import React, { useState } from 'react'
import { Box, Select, Input, Button, Text, Flex } from '@chakra-ui/react' // 导入 Chakra UI 组件
import { useAccount, useBalance, useContractWrite } from 'wagmi'
import { ETH, WETH9, VAULT_MANAGEMENT } from 'utils/config'
import { VAULT_MANAGEMENT_ABI } from 'abis/index'
import { useApprove, useGetAllowance } from 'hooks/useERC20'
import { useCurrentBalance } from 'hooks/useCurrentBalance'
import { useDebounce } from 'usehooks-ts'
import { parseEther } from 'viem'
import { BigNumber } from 'bignumber.js'
import { useAllTokens } from '../hooks/useAllTokens'

function DepositETH({ debouncedToken, debouncedValue }: { debouncedToken: string; debouncedValue: string }) {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
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
  const approveResults = useGetAllowance(debouncedToken, user, VAULT_MANAGEMENT)

  const approve = useApprove(debouncedToken, VAULT_MANAGEMENT, parseEther(debouncedValue as `${number}`))

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
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
  const [selectedToken, setSelectedToken] = useState('0x42a71137C09AE83D8d05974960fd607d40033499')
  const debouncedToken = useDebounce(selectedToken, 500)
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)
  const { loading, error, tokens } = useAllTokens()
  const tokenOptions = tokens?.map((token) => ({
    value: token.id,
    label: token.symbol,
  }))
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const balance = useCurrentBalance(address as `0x${string}`, debouncedToken === ETH ? '' : debouncedToken)
  let balanceInfo = null
  let symbol = null
  if (selectedToken === ETH) {
    const ethFormatted = balance.data?.formatted
    const ethValue = ethFormatted !== undefined ? new BigNumber(ethFormatted) : new BigNumber(0)
    balanceInfo = <>余额: {ethValue.toFixed(4)} ETH</>
    symbol = 'ETH'
  } else {
    const ercFormatted = balance.data?.formatted
    const ercSymbol = balance.data?.symbol
    const ercValue = ercFormatted !== undefined ? new BigNumber(ercFormatted) : new BigNumber(0)
    balanceInfo = <>余额: {`${ercValue.toFixed(4)} ${ercSymbol}`}</>
    symbol = ercSymbol
  }
  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  if (isConnected) {
    const depositButton =
      debouncedToken === ETH ? (
        <DepositETH debouncedToken={debouncedToken} debouncedValue={debouncedValue} />
      ) : (
        <DepositERC20 debouncedToken={debouncedToken} user={address as `0x${string}`} debouncedValue={debouncedValue} />
      )

    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="gray.200">
        <Select mb={2} value={selectedToken} onChange={(e) => setSelectedToken(e.target.value)}>
          {tokenOptions?.map((option) => (
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
          <Text color="gray">{balanceInfo}</Text>
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
