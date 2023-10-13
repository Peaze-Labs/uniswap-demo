import { ChainId } from '@uniswap/sdk-core'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

const demoValue = {
  costSummary: {
    tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    tokenSymbol: 'USDC',
    totalAmount: 1.354139,
    baseAmount: 0.1,
    gasUsedOnDst: '274914',
    gasCost: 1.240089,
    gasCostInWei: '2403857106203658301',
    peazeFee: 0.01,
  },
  typedData: {
    td2612: {
      domain: {
        name: 'USD Coin (PoS)',
        version: '1',
        salt: '0x0000000000000000000000000000000000000000000000000000000000000089',
        verifyingContract: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      },
      types: {
        Permit: [
          {
            name: 'owner',
            type: 'address',
          },
          {
            name: 'spender',
            type: 'address',
          },
          {
            name: 'value',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
        ],
      },
      primaryType: 'Permit',
      message: {
        owner: '0x7B2d1AFc06DbeF4b6328e89Ff25ab190f0DdC5dE',
        spender: '0xb7e0d5C63f1733C7C6eBb6CD4723792b5884c132',
        value: '1354139',
        nonce: '0',
        deadline: '1695757060',
      },
    },
    td712: {
      domain: {
        name: 'PeazeProtocol',
        version: '1',
        chainId: 137,
        verifyingContract: '0xb7e0d5C63f1733C7C6eBb6CD4723792b5884c132',
      },
      types: {
        LZSwapParams: [
          {
            name: 'dstChainId',
            type: 'uint16',
          },
          {
            name: 'srcPoolId',
            type: 'uint256',
          },
          {
            name: 'dstPoolId',
            type: 'uint256',
          },
        ],
        LZTxParams: [
          {
            name: 'dstGasForCall',
            type: 'uint256',
          },
          {
            name: 'dstNativeAmount',
            type: 'uint256',
          },
          {
            name: 'dstNativeAddr',
            type: 'bytes',
          },
        ],
        PeazeTxParams: [
          {
            name: 'owner',
            type: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
          },
          {
            name: 'transactionPayload',
            type: 'bytes',
          },
          {
            name: 'fee',
            type: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
          },
          {
            name: 'nonce',
            type: 'uint256',
          },
        ],
        PeazeCrossChainTx: [
          {
            name: 'peazeTxParams',
            type: 'PeazeTxParams',
          },
          {
            name: 'lzSwapParams',
            type: 'LZSwapParams',
          },
          {
            name: 'lzTxParams',
            type: 'LZTxParams',
          },
          {
            name: 'dstChainTo',
            type: 'address',
          },
          {
            name: 'minAmountOut',
            type: 'uint256',
          },
        ],
      },
      primaryType: 'PeazeCrossChainTx',
      message: {
        peazeTxParams: {
          amount: '1354139',
          fee: '1250089',
          deadline: '1695757060',
          nonce: '0',
          owner: '0x7B2d1AFc06DbeF4b6328e89Ff25ab190f0DdC5dE',
          transactionPayload:
            '0x8d80ff0a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000003ab007f5c764cbc14f9669b88837ca1490cca17c3160700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044095ea7b3000000000000000000000000000000000022d473030f116ddee9f6b43ac78ba30000000000000000000000000000000000000000000000000de0b6b3a764000000000000000022d473030f116ddee9f6b43ac78ba30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008487517c450000000000000000000000007f5c764cbc14f9669b88837ca1490cca17c316070000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad0000000000000000000000000000000000000000000000000000000000030d400000000000000000000000000000000000000000000000000000ffffffffffff003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e424856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000186a00000000000000000000000000000000000000000000000000161c4dedf21b97000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002b7f5c764cbc14f9669b88837ca1490cca17c31607000064da10009cbd5d07dd0cecc66161fc93d7c9000da1000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
        },
        lzSwapParams: {
          dstChainId: 111,
          srcPoolId: 1,
          dstPoolId: 1,
        },
        lzTxParams: {
          dstGasForCall: '274914',
          dstNativeAmount: '0',
          dstNativeAddr: '0x7B2d1AFc06DbeF4b6328e89Ff25ab190f0DdC5dE',
        },
        dstChainTo: '0xAaFc6800a20485eAD086FEF58feEc9bf1313a2D6',
        minAmountOut: '1350089',
      },
    },
  },
}

type EstimateResult = typeof demoValue
type EsetimateRequest = {
  transactions: {
    to: string
    data: string
  }[]
  userAddress: string
  // sourceToken: string
  tokenAmount: string
  sourceChain: number
  destinationChain: number
}

interface PeazeStore {
  estimateResult: EstimateResult | null
  estimateRequest: EsetimateRequest | null
  isPeazeSigning: boolean
  sourceChainId?: ChainId
  lockedChainId?: ChainId
  setPeazeSigningState: (ing: boolean, lockedChainId?: ChainId) => unknown
  setSourceChainId: (id?: ChainId) => unknown
}

export const peazeStore = create<PeazeStore>()(
  devtools(
    persist(
      (set) => ({
        estimateResult: null,
        estimateRequest: null,
        isPeazeSigning: false,
        sourceChainId: 137, // optimism
        lockedChainId: undefined,
        setPeazeSigningState: (ing: boolean, lockedChainId?: ChainId) =>
          set((state) => {
            return { ...state, isPeazeSigning: ing, lockedChainId }
          }),
        setSourceChainId: (id) => set((state) => ({ ...state, sourceChainId: id })),
      }),
      {
        name: 'peaze-storage',
      }
    )
  )
)
