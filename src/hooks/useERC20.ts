import { ETH } from 'utils/config'
import { useAccount, useBalance, erc20ABI, useContractRead, useContractWrite } from 'wagmi'

function isERC20(token: string) {
  if (token !== ETH) {
    return true
  }
}

export function useGetAllowance(token: string, user: string, agent: string) {
  const { data, isError, isLoading } = useContractRead({
    address: token as `0x${string}`,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [user as `0x${string}`, agent as `0x${string}`],
  })

  return {
    data: data, // 返回数据
    isError: isError, // 返回是否出错
    isLoading: isLoading, // 返回加载状态
  }
}

export function useApprove(token: string, agent: string, value: bigint) {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: token as `0x${string}`,
    abi: erc20ABI,
    functionName: 'approve',
    args: [agent as `0x${string}`, value],
  })
  return {
    write: write, // 返回是否出错
  }
}
