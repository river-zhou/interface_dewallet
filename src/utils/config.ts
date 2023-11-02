import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli } from '@wagmi/chains'

export const SITE_NAME = 'DeFiWallet'
export const SITE_DESCRIPTION = ''
export const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const WETH9 = '0x42a71137C09AE83D8d05974960fd607d40033499'
export const USDC = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
export const UniSwap = '0x025b2Dc04812d229B07Ea5dAE9486b5e8F1FcD13'
export const COMPOUND_WETH = '0xAD49E2F6116e9AE6325D79C17EeC5EdcC992892D'
export const COMPOUND_USDC = '0xf4187003F9483aD2E89C48273bC01de5a3aDCE9B'
export const LIDO = '0x4674b29F5eb81bf003fd3f91Ae4b3e80c10611b6'
export const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const SITE_URL = 'https://dewallet.vercel.app/'
export const VAULT_MANAGEMENT = '0x511AcbE385452e1fa3203Cd8f69418081D8C5F2F'
export const GRAPH_URL = 'https://api.studio.thegraph.com/query/55639/dewallet/version/latest'
export const BLOCK_CHAIN_RPC = 'https://mainnet.infura.io/v3/6f804e3283134db0bf2e735e0e1cf1c4'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = ''
export const SOCIAL_GITHUB = ''

export const ETH_CHAINS = [mainnet, goerli]
