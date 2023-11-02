import React, { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel, Text, Box } from '@chakra-ui/react'
import { publicProvider } from 'wagmi/providers/public'
const Test: React.FC = () => {
  console.log(publicProvider())
  return <>hello</>
}

export default Test
