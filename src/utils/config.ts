import { ThemingProps } from '@chakra-ui/react'
import { mainnet, goerli } from '@wagmi/chains'

export const SITE_NAME = 'DeFiWallet'
export const SITE_DESCRIPTION = ''
export const ETH = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const SITE_URL = 'https://nexth.vercel.app'
export const VAULT_MANAGEMENT = '0xc90B5D526AC41d597dC88F920FD3cdb39086B1AC'

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
