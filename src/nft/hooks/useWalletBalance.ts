import { BigNumber } from '@ethersproject/bignumber'
import type { Web3Provider } from '@ethersproject/providers'
import { parseEther } from '@ethersproject/units'
import { useNativeCurrencyBalances } from 'state/connection/hooks'
import { usePeazeReact } from 'state/peaze/hooks'

interface WalletBalanceProps {
  address: string
  balance: string
  weiBalance: BigNumber
  provider?: Web3Provider
}

export function useWalletBalance(): WalletBalanceProps {
  const { account: address, provider } = usePeazeReact()
  const balanceString = useNativeCurrencyBalances(address ? [address] : [])?.[address ?? '']?.toSignificant(3) || '0'

  return address == null
    ? {
        address: '',
        balance: '0',
        weiBalance: parseEther('0'),
        provider: undefined,
      }
    : {
        address,
        balance: balanceString,
        weiBalance: parseEther(balanceString),
        provider,
      }
}
