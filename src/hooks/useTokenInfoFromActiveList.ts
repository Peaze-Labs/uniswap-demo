import { Currency } from '@uniswap/sdk-core'
import { useMemo } from 'react'
import { useCombinedActiveList } from 'state/lists/hooks'
import { usePeazeReact } from 'state/peaze/hooks'

/** Returns a WrappedTokenInfo from the active token lists when possible, or the passed token otherwise. */
export function useTokenInfoFromActiveList(currency: Currency) {
  const { chainId } = usePeazeReact()
  const activeList = useCombinedActiveList()

  return useMemo(() => {
    if (!chainId) return
    if (currency.isNative) return currency

    try {
      return activeList[chainId][currency.wrapped.address].token
    } catch (e) {
      return currency
    }
  }, [activeList, chainId, currency])
}
