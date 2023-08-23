import { erc20ABI, useAccount, useBalance, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

export default function useDeposit() {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const TokenContract = ''
  const balance = useBalance({
    address,
    token: TokenContract as `0x{string}`,
  })

  const prepareContractWrite = usePrepareContractWrite({
    address: TokenContract as `0x{string}`,
    abi: erc20ABI,
    functionName: 'transfer',
    args: ['0x11', BigInt(10)],
  })
  const contractWrite = useContractWrite(prepareContractWrite.config)
  const waitForTransaction = useWaitForTransaction({ hash: contractWrite.data?.hash, onSettled: () => balance.refetch() })

  const handleSendTransaction = () => {
    contractWrite.write?.()
  }
}
