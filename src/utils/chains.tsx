import { getChainInfo, NetworkType } from 'constants/chainInfo'
import { SupportedL2ChainId } from 'constants/chains'

export function isL2ChainId(chainId: number | undefined): chainId is SupportedL2ChainId {
  const chainInfo = getChainInfo(chainId)
  return chainInfo?.networkType === NetworkType.L2
}

export function getUsdcAddressDstChain(dstChainId: number): string {
  switch (dstChainId) {
    case 1:
      return '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
    case 137:
      return '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    case 10:
      return '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'
    case 8453:
      return '0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca'
    case 42161:
      return '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
    default:
      return ''
  }
}
