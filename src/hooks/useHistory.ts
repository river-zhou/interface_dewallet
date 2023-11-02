import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

export type QueryType = 'Withdraw' | 'Deposit' | 'DepositFor' | 'SwapToken'

export interface Transaction {
  log: Deposit | DepositFor | SwapToken | Withdraw
}

export interface Account {
  id: string
}
export interface Token {
  id: string
}

export interface Deposit {
  id: string
  user: Account
  token: Token
  amount: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

export interface DepositFor {
  id: string
  fundManager: string
  user: Account
  strategy: string
  amount: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

export interface Withdraw {
  id: string
  operator: string
  user: Account
  strategy: string
  want: string
  outAmount: string
  to: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

export interface SwapToken {
  id: string
  operator: string
  user: Account
  exchange: string
  inCoin: Token
  outCoin: Token
  inAmount: string
  outAmount: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

interface QueryResult {
  getRecentTransactions: Transaction[]
}

function buildQuery(queryType: QueryType) {
  switch (queryType) {
    case 'Withdraw':
      return gql`
        query GetRecentWithdraws {
          withdraws(limit: 5) {
            id
            operator
            user {
              id
            }
            strategy
            want
            outAmount
            to
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `

    case 'Deposit':
      return gql`
        query GetRecentDeposits {
          deposits(limit: 5) {
            id
            user {
              id
            }
            token {
              id
            }
            amount
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `

    case 'DepositFor':
      return gql`
        query GetRecentDepositFors {
          depositFors(limit: 5) {
            id
            fundManager
            user {
              id
            }
            strategy
            amount
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `

    case 'SwapToken':
      return gql`
        query GetRecentSwapTokens {
          swapTokens(limit: 5) {
            id
            operator
            user {
              id
            }
            exchange
            inCoin {
              id
            }
            outCoin {
              id
            }
            inAmount
            outAmount
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `

    default:
      return null // 处理未知的查询类型
  }
}

export function useRecentTransactions(queryType: QueryType) {
  const query = buildQuery(queryType)

  if (!query) {
    throw new Error(`Unsupported query type: ${queryType}`)
  }

  const { loading, error, data } = useQuery(query)

  if (loading) {
    return { loading: true, error: null, recentTransactions: [] }
  }

  if (error) {
    return { loading: false, error, recentTransactions: [] }
  }

  const recentTransactions = (() => {
    switch (queryType) {
      case 'Deposit':
        return data.deposits
      case 'Withdraw':
        return data.withdraws
      case 'DepositFor':
        return data.depositFors
      case 'SwapToken':
        return data.swapTokens
      default:
        return null // 处理未知的操作类型
    }
  })()

  return { loading: false, error: null, recentTransactions }
}
