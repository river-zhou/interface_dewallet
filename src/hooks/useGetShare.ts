import { VAULT_MANAGEMENT_ABI } from 'abis/'
import { CONTRACTS_ALL } from 'utils/config'
import { useContractRead } from 'wagmi'
import { BigNumber } from 'bignumber.js'

export function useGetShare(user: string, strategy: string) {
  const { data } = useContractRead({
    address: CONTRACTS_ALL.VAULT_MANAGEMENT as `0x${string}`,
    abi: VAULT_MANAGEMENT_ABI,
    functionName: 'getAccountStrategyShares',
    args: [user as `0x${string}`, strategy as `0x${string}`],
  }) as { data: BigNumber }
  return data ? data : 0
}
