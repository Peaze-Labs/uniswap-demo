import { useEffect } from 'react'
import { usePeazeReact } from 'state/peaze/hooks'

import { useRemovePopup } from '../../state/application/hooks'
import { PopupContent, PopupType } from '../../state/application/reducer'
import { FailedNetworkSwitchPopup, TransactionPopupContent, UniswapXOrderPopupContent } from './PopupContent'

export default function PopupItem({
  removeAfterMs,
  content,
  popKey,
}: {
  removeAfterMs: number | null
  content: PopupContent
  popKey: string
}) {
  const removePopup = useRemovePopup()
  const onClose = () => removePopup(popKey)

  useEffect(() => {
    if (removeAfterMs === null) return undefined

    const timeout = setTimeout(() => {
      removePopup(popKey)
    }, removeAfterMs)

    return () => {
      clearTimeout(timeout)
    }
  }, [popKey, removeAfterMs, removePopup])

  const { chainId } = usePeazeReact()

  switch (content.type) {
    case PopupType.Transaction: {
      return chainId ? <TransactionPopupContent hash={content.hash} chainId={chainId} onClose={onClose} /> : null
    }
    case PopupType.Order: {
      return <UniswapXOrderPopupContent orderHash={content.orderHash} onClose={onClose} />
    }
    case PopupType.FailedSwitchNetwork: {
      return <FailedNetworkSwitchPopup chainId={content.failedSwitchNetwork} onClose={onClose} />
    }
  }
}
