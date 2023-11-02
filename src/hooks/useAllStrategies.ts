import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

interface Strategy {
  id: string
  baseToken: {
    id: string
    symbol: string
  }
}

interface QueryResult {
  strategies: Strategy[]
}

const GET_STRATEGIES = gql`
  query {
    strategies {
      id
      baseToken {
        id
        symbol
      }
    }
  }
`

export function useAllStrategies() {
  const { loading, error, data } = useQuery<QueryResult>(GET_STRATEGIES)

  if (loading) {
    return { loading: true, error: null, strategies: [] }
  }

  if (error) {
    return { loading: false, error, strategies: [] }
  }

  const strategies = data?.strategies || []

  return { loading: false, error: null, strategies }
}
