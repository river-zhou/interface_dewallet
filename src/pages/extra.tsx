import { Button } from '@chakra-ui/react'
import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { useState } from 'react'
import { VAULT_MANAGEMENT } from 'utils/config'
import { useAccount, useContractWrite } from 'wagmi'

interface ConfirmProps {
  type: string
  manager: string
}

export default function Confirm(props: ConfirmProps) {
  const { type, manager } = props

  let functionName
  let args

  if (type == 'setManager') {
    functionName = 'hireFundManager'
    args = [manager as `0x{string}`]
  } else if (type == 'lowStrategy') {
    functionName = 'setLowStrategyAllowedStatus'
  } else if (type == 'midStrategy') {
    functionName = 'setMidStrategyAllowedStatus'
  } else if (type == 'swapAllow') {
    functionName = 'setSwapAllowedStatus'
  }

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: VAULT_MANAGEMENT,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: functionName,
    args: args,
  })

  return (
    <Button
      colorScheme="blue"
      mr={3}
      onClick={() => {
        write()
      }}>
      Confirm
    </Button>
  )
}
