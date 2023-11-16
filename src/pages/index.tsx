import {
  Box,
  Flex,
  Select,
  Input,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  CSSReset,
  ChakraProvider,
  extendTheme,
  theme,
  Spacer,
} from '@chakra-ui/react'
import { FiChevronRight } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'
import DepositComponent from './deposit'
import StrategyComponent from './strategy'
import SwapComponent from './swap'
import Confirm from './extra'
import History from './history'

import { useQuery, gql } from '@apollo/client'
import { QueryType } from 'hooks/useHistory'
import { PriceProvider } from '../components/PriceContext'

export default function Home() {
  const [activeLink, setActiveLink] = useState('deposit')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userOption, setUserOption] = useState('setManager')
  const [inputAddress, setInputAddress] = useState('')
  const [isManager, setIsManager] = useState(false)
  const [content, setContent] = useState<React.ReactNode | null>(null)

  const userOptions = [
    { label: 'setManager', value: 'setManager' },
    { label: 'swapAllow', value: 'swapAllow' },
    { label: 'lowStrategy', value: 'lowStrategy' },
    { label: 'midStrategy', value: 'midStrategy' },
  ]

  useEffect(() => {
    const updateContent = (flag: boolean) => {
      switch (activeLink) {
        case 'deposit':
          setContent(flag ? <StrategyComponent flag={flag} /> : <DepositComponent />)
          break
        case 'strategy':
          setContent(<StrategyComponent flag={flag} />)
          break
        case 'swap':
          setContent(<SwapComponent flag={flag} />)
          break
        default:
          setContent(null)
      }
    }

    updateContent(isManager)
  }, [isManager, activeLink])

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }
  const handleOperator = () => {
    setIsManager(!isManager)
    if (isManager) {
      setActiveLink('deposit')
    } else {
      setActiveLink('strategy')
    }
  }

  return (
    <>
      <Flex justifyContent="center">
        <Button
          variant={!isManager ? 'solid' : 'outline'}
          colorScheme={!isManager ? 'blue' : 'gray'}
          borderRadius={'50px 0 0 50px'}
          onClick={() => {
            handleOperator()
          }}>
          {'User'}
        </Button>
        <Button
          variant={isManager ? 'solid' : 'outline'}
          colorScheme={isManager ? 'blue' : 'gray'}
          borderRadius={'0 50px 50px 0'}
          onClick={() => {
            handleOperator()
          }}>
          {'Manager'}
        </Button>
      </Flex>

      <Flex justifyContent="center" p={4}>
        <Box borderWidth="1px" borderRadius="3xl" borderColor="gray.200" width="400px" p={4} boxShadow="md">
          <Flex flexDirection="column">
            <Flex justifyContent="space-around" alignItems="center" mb={4}>
              <Flex alignItems="center">
                {!isManager && (
                  <a
                    href="#deposit"
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveLink('deposit')
                    }}
                    style={{
                      textDecoration: 'none',
                      cursor: 'pointer',
                      color: activeLink === 'deposit' ? 'black' : 'gray',
                      marginRight: '16px',
                      fontSize: activeLink === 'deposit' ? '16px' : '14px',
                    }}>
                    Deposit
                  </a>
                )}

                <a
                  href="#strategy"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveLink('strategy')
                  }}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: (activeLink === 'strategy' && isManager) || activeLink === 'strategy' ? 'black' : 'gray',
                    marginRight: '16px',
                    fontSize: (activeLink === 'strategy' && isManager) || activeLink === 'strategy' ? '16px' : '14px',
                  }}>
                  Strategy
                </a>
                <a
                  href="#swap"
                  onClick={(e) => {
                    e.preventDefault()
                    setActiveLink('swap')
                  }}
                  style={{
                    textDecoration: 'none',
                    cursor: 'pointer',
                    color: activeLink === 'swap' ? 'black' : 'gray',
                    marginRight: '16px',
                    fontSize: activeLink === 'swap' ? '16px' : '14px',
                  }}>
                  Swap
                </a>

                {activeLink === 'strategy' && !isManager && (
                  <Icon as={FiChevronRight} color="gray" onClick={openModal} style={{ cursor: 'pointer', marginLeft: '4px' }} />
                )}
              </Flex>
            </Flex>
            <PriceProvider>{content}</PriceProvider>
          </Flex>
        </Box>

        {/* Modal */}
        <Modal isOpen={isModalOpen} onClose={closeModal} size="lg">
          <ModalOverlay />
          <ModalContent bg="gray.100" borderRadius="3xl" maxW="400px">
            <ModalHeader textAlign="center" color="gray.600">
              Options
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Select value={userOption} onChange={(e) => setUserOption(e.target.value)} width="100%" mb={2}>
                {userOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {userOption === 'setManager' ? (
                <Input mb={2} type="text" width="100%" value={inputAddress} onChange={(e) => setInputAddress(e.target.value)} placeholder="address" />
              ) : null}
            </ModalBody>
            <ModalFooter>
              <Confirm type={userOption} manager={inputAddress} />
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <div style={{ borderBottom: '1px solid #e2e8f0', marginBottom: '1rem' }}></div>
      <History />
    </>
  )
}
