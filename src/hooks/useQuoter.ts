import { QUOTER_ABI } from 'abis'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { BLOCK_CHAIN_RPC, QUOTER_CONTRACT_ADDRESS } from 'utils/config'

interface QuoteExactInputSingleParams {
  tokenIn: string
  tokenOut: string
  fee: number
  amountIn: string
  sqrtPriceLimitX96: number
}
interface QuoteExactInputSingleResult {
  amountOut: string
}

function useQuoter(params: Partial<QuoteExactInputSingleParams> = {}) {
  const [quotedAmount, setQuotedAmount] = useState<string | null>(null)

  if (!params.tokenIn || !params.tokenOut || params.fee === undefined || !params.amountIn) {
    throw new Error('Missing required parameters')
  }

  const defaultParams: QuoteExactInputSingleParams = {
    tokenIn: '0x...',
    tokenOut: '0x...',
    fee: 500,
    amountIn: '0',
    sqrtPriceLimitX96: 0,
    ...params,
  }

  useEffect(() => {
    async function fetchQuotedAmount() {
      const quoterContract = new ethers.Contract(QUOTER_CONTRACT_ADDRESS, QUOTER_ABI, new ethers.providers.JsonRpcProvider(BLOCK_CHAIN_RPC))

      try {
        const result: QuoteExactInputSingleResult = await quoterContract.callStatic.quoteExactInputSingle(
          params.tokenIn,
          params.tokenOut,
          params.fee,
          params.amountIn,
          params.sqrtPriceLimitX96
        )

        setQuotedAmount(result.amountOut)
      } catch (error) {
        console.error('Error quoting amount:', error)
      }
    }

    fetchQuotedAmount()
  }, [params])

  return quotedAmount
}

export default useQuoter
