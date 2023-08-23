import { useBalance } from 'wagmi'

export function useETHBalance(address: string) {
  const balance = useBalance({
    address: address as `0x{string}`,
  })
  return balance
}
