import React, { useState, useEffect, useContext } from 'react'
import { Text } from '@chakra-ui/react'
import Web3 from 'web3'
import { PriceContext } from '../components/PriceContext'

import { UNI_POOL_ABI_V3 } from 'abis'
import { BLOCK_CHAIN_RPC } from 'utils/config'
import { ethers } from 'ethers'

const CONTRACT_ADDRESS = '0x11b815efB8f581194ae79006d24E0d814B7697F6'

interface Slot0Result {
  sqrtPriceX96: string
}

export default function UniPoolPrice() {
  const priceContext = useContext(PriceContext)

  useEffect(() => {
    if (priceContext) {
      const { priceState, setPriceState } = priceContext
      const contract = new ethers.Contract(CONTRACT_ADDRESS, UNI_POOL_ABI_V3, new ethers.providers.JsonRpcProvider(BLOCK_CHAIN_RPC))

      const fetchData = async () => {
        try {
          const result: Slot0Result = await contract.slot0()
          const newPriceBigInt = BigInt(result['sqrtPriceX96'])
          const newPriceScaled = ((newPriceBigInt * newPriceBigInt * BigInt(1e18)) >> (96n * 2n)) / BigInt(10 ** 6)
          if (String(newPriceScaled) !== priceState) {
            setPriceState(`${newPriceScaled}`)
          }
        } catch (error) {
          console.error('获取状态出错:', error)
        }
      }

      fetchData()
    }
  }, [priceContext])

  return <Text> 1ETH:{priceContext ? priceContext.priceState : ''}USDC</Text>
}
