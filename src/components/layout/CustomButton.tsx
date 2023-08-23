import { Button, Heading } from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import { NextSeo } from 'next-seo'
import { useState } from 'react'
import WriteContract from '../../components/actives/index'

interface Props {
  activeType: string
  ml?: number // 接受 ml 属性
  children: React.ReactNode
}

function Execute({ type }: { type: string }) {
  WriteContract(type)
}

export function CustomButton(props: Props) {
  const { activeType, children } = props
  const { isConnected } = useAccount()
  const [show, setShow] = useState(false) // 添加状态变量来控制是否显示示例

  const handleButtonClick = () => {
    if (isConnected) {
      setShow(true)

    } 
  }

  return (
    <div>
      <Button colorScheme={'blue'} onClick={handleButtonClick}>
        {children}
      </Button>
      {show && ( // 根据状态来决定是否显示示例
        <div>
          <p>This example shows how to send an ERC20 transaction. You can use this to send any ERC20 to another address.</p>
        </div>
      )}
    </div>
  )
}
