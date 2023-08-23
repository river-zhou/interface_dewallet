import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { VAULT_MANAGEMENT } from 'utils/config'
import { useContractRead } from 'wagmi'

export function useUserBalance(user: string, token: string) {
  const { data, isError, isLoading } = useContractRead({
    address: VAULT_MANAGEMENT as `0x${string}`,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'getAccountBalance',
    args: [user as `0x${string}`, token as `0x${string}`],
  }) as { data: number }
  return data ? data : 0
}
