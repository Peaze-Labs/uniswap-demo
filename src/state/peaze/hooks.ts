import { useWeb3React } from '@web3-react/core'
import React from 'react'

import { peazeStore } from './store'

function usePrevious<T>(value: T) {
  const [current, setCurrent] = React.useState<T>(value)
  const [previous, setPrevious] = React.useState<T | null>(null)

  if (value !== current) {
    setPrevious(current)
    setCurrent(value)
  }

  return previous
}

export function usePeazeReact() {
  const { isPeazeSigning } = peazeStore()
  const original = useWeb3React()
  const prevChainId = usePrevious(original.chainId)

  return isPeazeSigning
    ? {
        ...original,
        // When switching to source chain back, we should keep returning the same chain id
        // We may also have to override other states, like isConnecting or isActivating, to avoid FE make any changes based on that
        chainId: prevChainId,
      }
    : original
}
