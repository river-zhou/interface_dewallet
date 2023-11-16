import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli } from '@wagmi/chains'

export const SITE_NAME = 'DeFiWallet'
export const SITE_DESCRIPTION = ''
export const SITE_URL = 'https://dewallet.vercel.app/'
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

export const CONTRACTS_ALL = {
  TOKENS: {
    ETH: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    WETH9: '0x42a71137C09AE83D8d05974960fd607d40033499',
    USDC: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F',
  },
  EXCHANGES: {
    UNISWAP: '0x04E058c4AD767FC31cDe0a38Ba98fb483c673F94',
  },
  STRATEGIES: {
    COMPOUND_WETH: '0x0604403C0700E16538a2FCA1672725e864aCf2a7',
    COMPOUND_USDC: '0x54a005A57cc1f1fAf2e0AdA010Ba71435A834B25',
    LIDO: '0xD0046b7E3BEb29B0AF7e415BAC1C527057e06b99',
    BALANCING_POOL: '0x51B39b3cd8fA9c3e8b68d7560e5d635453932C63',
  },
  QUOTER_CONTRACT_ADDRESS: '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  VAULT_MANAGEMENT: '0xD76FBeeE709039AE0Fb74F6df2E5307cd76B58ea',
}
