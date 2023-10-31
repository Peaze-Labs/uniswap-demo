import { SUPPORTED_V2POOL_CHAIN_IDS } from 'constants/chains'
import { usePeazeReact } from 'state/peaze/hooks'

export function useNetworkSupportsV2() {
  const { chainId } = usePeazeReact()
  return chainId && SUPPORTED_V2POOL_CHAIN_IDS.includes(chainId)
}
