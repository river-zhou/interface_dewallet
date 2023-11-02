import React, { ReactNode } from 'react'
import { Box, Container } from '@chakra-ui/react'
import { Header } from './Header'
import { Footer } from './Footer'
import { NetworkStatus } from './NetworkStatus'

interface Props {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Header />
      <Container flex="1" maxW="container.lg">
        {props.children}
      </Container>
      <Box position="fixed" bottom={2} right={2}>
        <NetworkStatus />
      </Box>
      <Footer />
    </Box>
  )
}
