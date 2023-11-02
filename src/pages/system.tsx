import React, { useState } from 'react'
import { ChakraProvider, Box, FormControl, FormLabel, Input, Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import { useQuery, gql } from '@apollo/client'

function AccountList() {
  const GET_ALL_ACCOUNTS = gql`
    query {
      accounts {
        id
        address
        erc20Balances {
          id
          amount
          tokenInfo {
            id
            symbol
            decimals
            name
          }
        }
        shares {
          id
          value
          strategy {
            id
          }
        }
        manager
        lowStrategyStatus
        midStrategyStatus
        swapStatus
      }
    }
  `
  const { loading, error, data } = useQuery(GET_ALL_ACCOUNTS)

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  // Access the data and iterate over the list of accounts
  const accounts = data.accounts

  return (
    <div>
      <h1>Account List</h1>
      <ul>
        {accounts.map((account: any) => (
          <li key={account.id}>
            <p>ID: {account.id}</p>
            <p>Address: {account.address}</p>
            {/* Access and display other fields here */}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function System() {
  const data = [
    { id: 1, name: 'CompoundWETH', totalDeposit: '/', apy: '/' },
    { id: 2, name: 'CompoundUSDT', totalDeposit: '/', apy: '/' },
    { id: 3, name: 'Lido', totalDeposit: '/', apy: '/' },
  ]

  return (
    <ChakraProvider>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Status</Th>
            <Th>TotalDeposit</Th>
            <Th>Apy</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.name}</Td>
              <Td>{item.totalDeposit}</Td>
              <Td>{item.apy}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ChakraProvider>
  )
}
