import React, { useState } from 'react'
import { Box, Select, Input, Button, Text, Flex } from '@chakra-ui/react' // 导入 Chakra UI 组件
import { useAccount, useBalance, useContractWrite } from 'wagmi'
import { ETH, VAULT_MANAGEMENT } from 'utils/config'
import { VAULT_MANAGEMENT_ABI } from 'abis/index'
import { useApprove, useGetAllowance } from 'hooks/useERC20'
import { useCurrentBalance } from 'hooks/useCurrentBalance'
import { useDebounce } from 'usehooks-ts'
import { parseEther } from 'viem'

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
    if (approveResults.data === undefined) {
      console.log('approveResults data is undefined')
      return
    }
    if (approveResults.data >= parseEther(debouncedValue as `${number}`)) {
      write()
    } else {
      approve.write()
    }
  }
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
        write()
      }}>
      Deposit
    </Button>
  )
}

export default function DepositComponent() {
  const [selectedToken, setSelectedToken] = useState('0x42a71137C09AE83D8d05974960fd607d40033499')
  const debouncedToken = useDebounce(selectedToken, 500)
  const [inputValue, setInputValue] = useState('')
  const debouncedValue = useDebounce(inputValue, 500)
  const tokenOptions = [
    { label: 'WETH9', value: '0x42a71137C09AE83D8d05974960fd607d40033499' },
    { label: 'ETH', value: ETH },
  ]
  const { isConnected } = useAccount()
  const { address } = useAccount()
  const balance = useCurrentBalance(address as `0x${string}`, debouncedToken === ETH ? '' : debouncedToken)

  let balanceInfo = null
  if (selectedToken === ETH) {
    const ethFormatted = balance.data?.formatted
    balanceInfo = <>余额: {ethFormatted !== undefined ? parseFloat(ethFormatted).toFixed(3) : 'N/A'} ETH</>
  } else {
    const ercFormatted = balance.data?.formatted
    const ercSymbol = balance.data?.symbol
    balanceInfo = <>余额: {ercFormatted !== undefined ? `${parseFloat(ercFormatted).toFixed(3)} ${ercSymbol}` : 'N/A'}</>
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
          {tokenOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <Input mb={2} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} /> {/* 使用 Chakra UI 的样式 */}
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
