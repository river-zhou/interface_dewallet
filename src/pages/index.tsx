import {
  Box,
  Flex,
  Select,
  Input,
  FormControl,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react'
import { FiChevronRight } from 'react-icons/fi'
import React, { useState } from 'react'
import DepositComponent from './deposit'
import StrategyComponent from './strategy'
import SwapComponent from './swap'
import Confirm from './extra'

export default function Home() {
  const [activeLink, setActiveLink] = useState('deposit')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [userOption, setUserOption] = useState('setManager')
  const [inputAddress, setInputAddress] = useState('')
  const userOptions = [
    { label: 'setManager', value: 'setManager' },
    { label: 'swapAllow', value: 'swapAllow' },
    { label: 'lowStrategy', value: 'lowStrategy' },
    { label: 'midStrategy', value: 'midStrategy' },
  ]

  const renderContent = () => {
    switch (activeLink) {
      case 'deposit':
        return <DepositComponent />
      case 'strategy':
        return <StrategyComponent />
      case 'swap':
        return <SwapComponent />
      default:
        return null
    }
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <Flex justifyContent="center" p={4}>
      <Box borderWidth="1px" borderRadius="3xl" borderColor="gray.200" width="400px" p={4} boxShadow="md">
        <Flex flexDirection="column">
          <Flex justifyContent="space-around" alignItems="center" mb={4}>
            <Flex alignItems="center">
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
              <a
                href="#strategy"
                onClick={(e) => {
                  e.preventDefault()
                  setActiveLink('strategy')
                }}
                style={{
                  textDecoration: 'none',
                  cursor: 'pointer',
                  color: activeLink === 'strategy' ? 'black' : 'gray',
                  marginRight: '16px',
                  fontSize: activeLink === 'strategy' ? '16px' : '14px',
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

              {activeLink === 'strategy' && (
                <Icon as={FiChevronRight} color="gray" onClick={openModal} style={{ cursor: 'pointer', marginLeft: '4px' }} />
              )}
            </Flex>
          </Flex>
          {renderContent()}
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
  )
}
