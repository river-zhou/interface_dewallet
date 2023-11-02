import React from 'react'
import { Flex, useColorModeValue, Spacer, Heading, Button } from '@chakra-ui/react'
import { SITE_NAME } from 'utils/config'
import { LinkComponent } from './LinkComponent'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Web3Button } from '@web3modal/react'

interface Props {
  className?: string
}

export function Header(props: Props) {
  const className = props.className ?? ''

  return (
    <Flex as="header" className={className} bg={useColorModeValue('gray.100', 'gray.900')} px={4} py={2} mb={8} alignItems="center">
      <Flex alignItems="center">
        <LinkComponent href="/">
          <Heading as="h1" size="md">
            {SITE_NAME}
          </Heading>
        </LinkComponent>
      </Flex>
      <Spacer />
      <Flex alignItems="center" gap={4}>
        <LinkComponent href="/board">
          <Heading as="h1" size="md">
            Board
          </Heading>
        </LinkComponent>
        <Web3Button icon="hide" label="Connect" />
        <ThemeSwitcher />
      </Flex>
    </Flex>
  )
}
