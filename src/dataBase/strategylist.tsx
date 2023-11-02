import React from 'react'
import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client'

interface Strategy {
  id: string
  address: string
}

interface StrategyList {
  id: string
  list: Strategy[] // 嵌套 Strategy 类型
}

interface QueryResult {
  strategyLists: StrategyList[]
}

export function StrategyList() {
  const GET_STRATEGY_LIST = gql`
    query {
      strategyLists {
        id
        list {
          id
        }
      }
    }
  `

  const { loading, error, data } = useQuery<QueryResult>(GET_STRATEGY_LIST)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  const strategyLists = data?.strategyLists

  return (
    <div>
      <h1>Strategy List</h1>
      {strategyLists?.map((strategyList) => (
        <div key={strategyList.id}>
          <h2>List ID: {strategyList.id}</h2>
          <ul>
            {strategyList.list.map((strategy) => (
              <li key={strategy.id}>
                <p>ID: {strategy.id}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
