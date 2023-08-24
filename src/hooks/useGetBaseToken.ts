import { Abi } from 'viem'
import { useContractRead } from 'wagmi'

export function useGetBaseToken(strategy: string, abi: Abi) {
  const { data } = useContractRead({
    address: strategy as `0x${string}`,
    abi: abi,
    functionName: 'want',
  }) as { data: number }
  return data ? data : ''
}
