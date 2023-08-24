import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli } from '@wagmi/chains'

export const SITE_NAME = 'DeFiWallet'
export const SITE_DESCRIPTION = ''
export const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const WETH9 = '0x42a71137C09AE83D8d05974960fd607d40033499'
export const USDC = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
export const UniSwap = '0x025b2Dc04812d229B07Ea5dAE9486b5e8F1FcD13'
export const compoundWETH = '0xAD49E2F6116e9AE6325D79C17EeC5EdcC992892D'
export const compoundUSDC = '0xf4187003F9483aD2E89C48273bC01de5a3aDCE9B'
export const SITE_URL = 'https://nexth.vercel.app'
export const VAULT_MANAGEMENT = '0x184E62E6a78476E1F12E00F565C724Fb1BEF3565'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_COLOR_SCHEME: ThemingProps['colorScheme'] = 'gray'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = ''
export const SOCIAL_GITHUB = ''

export const ETH_CHAINS = [mainnet, goerli]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
