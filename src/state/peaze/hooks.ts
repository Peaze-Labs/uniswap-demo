import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'

import { peazeStore } from './store'

export function usePeazeReact() {
  const { isPeazeSigning, lockedChainId } = peazeStore()
  const original = useWeb3React()

  // console.log({ isPeazeSigning, lockedChainId, original })

  return useMemo(() => {
    return isPeazeSigning
      ? {
          ...original,
          // When switching to source chain back, we should keep returning the same chain id
          // We may also have to override other states, like isConnecting or isActivating, to avoid FE make any changes based on that
          chainId: lockedChainId,
        }
      : original
  }, [original, isPeazeSigning, lockedChainId])
}
