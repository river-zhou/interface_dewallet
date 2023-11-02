import React from 'react'
import { ChakraProvider, Table, Thead, Tbody, Td, Th, Tr } from '@chakra-ui/react'
import { useAccountDetails } from '../hooks/useUserInfo'
import { useAccount } from 'wagmi'

export default function User() {
  const { address } = useAccount()
  const { loading, error, account } = useAccountDetails((address as string).toLowerCase())

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  // 定义默认值
  const defaultData = [
    { id: 1, name: 'swapAllowed', target: 'false' },
    { id: 2, name: 'lowStrategy', target: 'false' },
    { id: 3, name: 'midStrategy', target: 'false' },
    { id: 4, name: 'manager', target: '0X0000' },
    { id: 5, name: 'reward', target: 'details' },
  ]

  // 使用account或默认值
  const data = account
    ? [
        { id: 1, name: 'swapAllowed', target: account.swapStatus ? 'true' : 'false' },
        { id: 2, name: 'lowStrategy', target: account.lowStrategyStatus ? 'true' : 'false' },
        { id: 3, name: 'midStrategy', target: account.midStrategyStatus ? 'true' : 'false' },
        { id: 4, name: 'manager', target: account.manager },
      ]
    : defaultData
  return (
    <ChakraProvider>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Info</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.id}>
              <Td>{item.id}</Td>
              <Td>{item.name}</Td>
              <Td>{item.target}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </ChakraProvider>
  )
}
