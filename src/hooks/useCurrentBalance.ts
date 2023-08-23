import { useBalance } from 'wagmi'

export function useCurrentBalance(address: string, selectedToken: string) {
  const balance = useBalance({
    address: address as `0x{string}`,
    token: selectedToken as `0x{string}`,
  })
  return balance
}
