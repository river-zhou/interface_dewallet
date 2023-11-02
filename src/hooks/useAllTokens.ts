import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

interface Token {
  id: string
  symbol: string
}

interface QueryResult {
  tokens: Token[]
}

const GET_TOKENS = gql`
  query {
    tokens {
      id
      symbol
    }
  }
`

export function useAllTokens() {
  const { loading, error, data } = useQuery<QueryResult>(GET_TOKENS)

  if (loading) {
    return { loading: true, error: null, tokens: [] }
  }

  if (error) {
    return { loading: false, error, tokens: [] }
  }

  const tokens = data?.tokens || []

  return { loading: false, error: null, tokens }
}
