import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { VAULT_MANAGEMENT } from 'utils/config'
import { useContractRead } from 'wagmi'
import { BigNumber } from 'bignumber.js'

export function useUserBalance(user: string, token: string) {
  const { data } = useContractRead({
    address: VAULT_MANAGEMENT as `0x${string}`,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'getAccountBalance',
    args: [user as `0x${string}`, token as `0x${string}`],
  }) as { data: BigNumber }
  return data ? data : 0
}
