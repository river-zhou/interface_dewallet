import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  List,
  ListItem,
  ChakraProvider,
  CSSReset,
  extendTheme,
  theme,
  UnorderedList,
  useColorModeValue,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { useRecentTransactions, QueryType, Deposit, Withdraw, DepositFor, SwapToken } from 'hooks/useHistory'

export default function History() {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [queryType, setQueryType] = useState<QueryType>('Deposit') // 默认查询类型
  const [hasData, setHasData] = useState(false) // 用于跟踪是否有数据
  const [isCollapsed, setIsCollapsed] = useState(true)

  const { loading, error, recentTransactions } = useRecentTransactions(queryType)
  const tabLabels: string[] = ['Deposit', 'DepositFor', 'Withdraw', 'Swap']
  const handleTabChange = (index: number) => {
    setSelectedTab(index)

    // Set queryType based on selectedTab
    switch (index) {
      case 0:
        setQueryType('Deposit')
        break
      case 1:
        setQueryType('DepositFor')
        break
      case 2:
        setQueryType('Withdraw')
        break
      case 3:
        setQueryType('SwapToken')
        break
      default:
        setQueryType('Deposit') // Default to Deposit
    }
  }

  useEffect(() => {
    // 当 recentTransactions change, check if the selected tab is out of bounds and adjust it if necessary
    if (selectedTab >= tabLabels.length) {
      setSelectedTab(tabLabels.length - 1)
    }
  }, [selectedTab, tabLabels.length])

  useEffect(() => {
    setHasData(recentTransactions.length > 0)
  }, [recentTransactions])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error: {error.message}</p>
  }

  return (
    <div>
      <Box p={4} borderWidth={0} borderColor="transparent" borderRadius="md" overflow="auto" maxH={isCollapsed ? '40px' : '400px'}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: 'pointer' }}>
          {isCollapsed ? 'history ▼' : 'history ▲'} {/* Use Unicode down and up arrows */}
        </button>
        <Tabs variant="soft-rounded" colorScheme="teal" onChange={handleTabChange} index={selectedTab}>
          <TabList mb="1rem" justifyContent="center">
            {tabLabels.map((label, index) => (
              <Tab key={index}>
                {index === 0 ? 'Log: ' : ''}
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanels>
            {tabLabels.map((label, index) => (
              <TabPanel key={index}>
                {hasData && renderTabContent(index)}
                {!hasData && <p>No recent transactions found.</p>}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>
    </div>
  )

  function renderTabContent(index: number) {
    switch (index) {
      case 0:
        return queryType === 'Deposit' && <DepositTransactions transactions={recentTransactions} />
      case 1:
        return queryType === 'DepositFor' && <DepositForTransactions transactions={recentTransactions} />
      case 2:
        return queryType === 'Withdraw' && <WithdrawTransactions transactions={recentTransactions} />
      case 3:
        return queryType === 'SwapToken' && <SwapTokenTransactions transactions={recentTransactions} />
      default:
        return null
    }
  }
}

interface WithdrawProps {
  transactions: Withdraw[]
}

const WithdrawTransactions: React.FC<WithdrawProps> = ({ transactions }) => {
  return (
    <div>
      <h2>Withdraw Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>Transaction ID:</strong> {transaction.id}
            <br />
            <strong>User:</strong> {transaction.user.id}
            <br />
            <strong>Strategy:</strong> {transaction.strategy}
            <br />
            <strong>Want:</strong> {transaction.want}
            <br />
            <strong>Out Amount:</strong> {transaction.outAmount}
            <br />
            <strong>To:</strong> {transaction.to}
            <br />
            <strong>Block Number:</strong> {transaction.blockNumber}
            <br />
            <strong>Block Timestamp:</strong> {transaction.blockTimestamp}
            <br />
            <strong>Transaction Hash:</strong> {transaction.transactionHash}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface DepositProps {
  transactions: Deposit[]
}

const DepositTransactions: React.FC<DepositProps> = ({ transactions }) => {
  const listItemBackgroundColor = useColorModeValue('gray.100', 'gray.700')
  return (
    <UnorderedList listStyleType="none" pl={0}>
      {transactions.map((transaction) => (
        <ListItem key={transaction.id} mb={4} bgColor={listItemBackgroundColor} p={2} borderRadius="md">
          <Text fontSize="xl" fontWeight="bold" color="teal.500" mb={2}>
            Deposit Transactions
          </Text>
          <Text>
            <strong>Transaction ID:</strong> {transaction.id}
          </Text>
          <Text>
            <strong>User:</strong> {transaction.user.id}
          </Text>
          <Text>
            <strong>Token:</strong> {transaction.token.id}
          </Text>
          <Text>
            <strong>Amount:</strong> {transaction.amount}
          </Text>
          <Text>
            <strong>Block Number:</strong> {transaction.blockNumber}
          </Text>
          <Text>
            <strong>Block Timestamp:</strong> {transaction.blockTimestamp}
          </Text>
          <Text>
            <strong>Transaction Hash:</strong> {transaction.transactionHash}
          </Text>
        </ListItem>
      ))}
    </UnorderedList>
  )
}

interface DepositForProps {
  transactions: DepositFor[]
}

const DepositForTransactions: React.FC<DepositForProps> = ({ transactions }) => {
  return (
    <div>
      <h2>DepositFor Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>Transaction ID:</strong> {transaction.id}
            <br />
            <strong>Fund Manager:</strong> {transaction.fundManager}
            <br />
            <strong>User:</strong> {transaction.user.id}
            <br />
            <strong>Strategy:</strong> {transaction.strategy}
            <br />
            <strong>Amount:</strong> {transaction.amount}
            <br />
            <strong>Block Number:</strong> {transaction.blockNumber}
            <br />
            <strong>Block Timestamp:</strong> {transaction.blockTimestamp}
            <br />
            <strong>Transaction Hash:</strong> {transaction.transactionHash}
          </li>
        ))}
      </ul>
    </div>
  )
}

interface SwapTokenProps {
  transactions: SwapToken[]
}

const SwapTokenTransactions: React.FC<SwapTokenProps> = ({ transactions }) => {
  return (
    <div>
      <h2>SwapToken Transactions</h2>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <strong>Transaction ID:</strong> {transaction.id}
            <br />
            <strong>Operator:</strong> {transaction.operator}
            <br />
            <strong>User:</strong> {transaction.user.id}
            <br />
            <strong>Exchange:</strong> {transaction.exchange}
            <br />
            <strong>In Coin:</strong> {transaction.inCoin.id}
            <br />
            <strong>Out Coin:</strong> {transaction.outCoin.id}
            <br />
            <strong>In Amount:</strong> {transaction.inAmount}
            <br />
            <strong>Out Amount:</strong> {transaction.outAmount}
            <br />
            <strong>Block Number:</strong> {transaction.blockNumber}
            <br />
            <strong>Block Timestamp:</strong> {transaction.blockTimestamp}
            <br />
            <strong>Transaction Hash:</strong> {transaction.transactionHash}
          </li>
        ))}
      </ul>
    </div>
  )
}
