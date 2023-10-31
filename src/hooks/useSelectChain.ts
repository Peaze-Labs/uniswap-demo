import { ChainId } from '@uniswap/sdk-core'
import { getConnection } from 'connection'
import { didUserReject } from 'connection/utils'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'constants/chains'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { addPopup, PopupType } from 'state/application/reducer'
import { useAppDispatch } from 'state/hooks'
import { usePeazeReact } from 'state/peaze/hooks'
import { peazeStore } from 'state/peaze/store'

import { useSwitchChain } from './useSwitchChain'

export default function useSelectChain() {
  const dispatch = useAppDispatch()
  const { connector } = usePeazeReact()
  const switchChain = useSwitchChain()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isPeazeSigning } = peazeStore()

  return useCallback(
    async (targetChain: ChainId) => {
      if (!connector) return

      const connection = getConnection(connector)

      try {
        await switchChain(connector, targetChain)
        if (isSupportedChain(targetChain) && !isPeazeSigning) {
          searchParams.set('chain', CHAIN_IDS_TO_NAMES[targetChain])

          setSearchParams(searchParams)
        }
      } catch (error) {
        if (!didUserReject(connection, error) && error.code !== -32002 /* request already pending */) {
          console.error('Failed to switch networks', error)
          dispatch(
            addPopup({
              content: { failedSwitchNetwork: targetChain, type: PopupType.FailedSwitchNetwork },
              key: 'failed-network-switch',
            })
          )
        }
      }
    },
    [connector, dispatch, searchParams, setSearchParams, switchChain, isPeazeSigning]
  )
}
