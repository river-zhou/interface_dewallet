import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

interface TokenInfo {
  id: string
  symbol: string
}

interface Erc20Balance {
  id: string
  amount: number
  tokenInfo: TokenInfo
}

interface Account {
  id: string
  erc20Balances: Erc20Balance[]
  manager: string
  lowStrategyStatus: boolean
  midStrategyStatus: boolean
  swapStatus: boolean
}

interface QueryResult {
  account: Account
}

const GET_ACCOUNT = gql`
  query GetAccount($accountId: ID!) {
    account(id: $accountId) {
      id
      manager
      lowStrategyStatus
      midStrategyStatus
      swapStatus
    }
  }
`
console.log(GET_ACCOUNT.definitions)
export function useAccountDetails(accountId: string) {
  const { loading, error, data } = useQuery<QueryResult>(GET_ACCOUNT, {
    variables: { accountId },
  })

  if (loading) {
    return { loading: true, error: null, account: null }
  }

  if (error) {
    return { loading: false, error: error.message, account: null }
  }

  return { loading: false, error: null, account: data?.account }
}
