import { getChainInfo, NetworkType } from 'constants/chainInfo'
import { SupportedL2ChainId } from 'constants/chains'

export function isL2ChainId(chainId: number | undefined): chainId is SupportedL2ChainId {
  const chainInfo = getChainInfo(chainId)
  return chainInfo?.networkType === NetworkType.L2
}

export function getUsdcAddressDstChain(dstChainId: number): string {
  switch (dstChainId) {
    case 137:
      return '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    case 10:
      return '0x7F5c764cBc14f9669B88837ca1490cCa17c31607'
    case 8453:
      return '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
    default:
      return ''
  }
}
