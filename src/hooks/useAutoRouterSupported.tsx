import { isSupportedChain } from 'constants/chains'
import { usePeazeReact } from 'state/peaze/hooks'

export default function useAutoRouterSupported(): boolean {
  const { chainId } = usePeazeReact()
  return isSupportedChain(chainId)
}
