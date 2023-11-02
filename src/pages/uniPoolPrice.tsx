import React, { useState, useEffect, useContext } from 'react'
import { Text } from '@chakra-ui/react'
import Web3 from 'web3'
import { PriceContext } from './PriceContext'

// 导入你的 ABI 和区块链 RPC 配置
import { UNI_POOL_ABI_V3 } from 'abis'
import { BLOCK_CHAIN_RPC } from 'utils/config'

const CONTRACT_ADDRESS = '0x11b815efB8f581194ae79006d24E0d814B7697F6'

interface Slot0Result {
  sqrtPriceX96: string
}

export default function UniPoolPrice() {
  const priceContext = useContext(PriceContext)

  useEffect(() => {
    if (priceContext) {
      const { priceState, setPriceState } = priceContext
      const web3 = new Web3(BLOCK_CHAIN_RPC)
      const contract = new web3.eth.Contract(UNI_POOL_ABI_V3, CONTRACT_ADDRESS)

      const getContractState = async () => {
        try {
          const result: Slot0Result = await contract.methods.slot0().call()
          const newPriceBigInt = BigInt(result['sqrtPriceX96'])
          const newPriceScaled = ((newPriceBigInt * newPriceBigInt * BigInt(1e18)) >> (96n * 2n)) / BigInt(10 ** 6)
          if (String(newPriceScaled) !== priceState) {
            setPriceState(`${newPriceScaled}`)
          }
        } catch (error) {
          console.error('获取状态出错:', error)
        }
      }

      getContractState()

      const interval = setInterval(getContractState, 10000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [])

  return <Text> 1ETH:{priceContext ? priceContext.priceState : ''}USDC</Text>
}
