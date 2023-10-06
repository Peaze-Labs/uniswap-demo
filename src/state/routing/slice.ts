import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Protocol } from '@uniswap/router-sdk'
import { Percent, TradeType } from '@uniswap/sdk-core'
import { SwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@uniswap/universal-router-sdk'
import { sendAnalyticsEvent } from 'analytics'
import { isUniswapXSupportedChain } from 'constants/chains'
import { Interface } from 'ethers/lib/utils'
import ms from 'ms'
import { peazeAxios } from 'state/peaze/api'
import { peazeStore } from 'state/peaze/store'
import { logSwapQuoteRequest } from 'tracing/swapFlowLoggers'
import { trace } from 'tracing/trace'
import { getUsdcAddressDstChain } from 'utils/chains'

import {
  GetQuoteArgs,
  INTERNAL_ROUTER_PREFERENCE_PRICE,
  QuoteMethod,
  QuoteState,
  RouterPreference,
  RoutingConfig,
  SwapRouterNativeAssets,
  TradeFillType,
  TradeResult,
  URAQuoteResponse,
  URAQuoteType,
} from './types'
import { isExactInput, transformRoutesToTrade } from './utils'

const UNISWAP_API_URL = process.env.REACT_APP_UNISWAP_API_URL
if (UNISWAP_API_URL === undefined) {
  throw new Error(`UNISWAP_API_URL must be a defined environment variable`)
}

const CLIENT_PARAMS = {
  protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
}

const protocols: Protocol[] = [Protocol.V2, Protocol.V3, Protocol.MIXED]

// routing API quote query params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
const DEFAULT_QUERY_PARAMS = {
  protocols,
}

function getQuoteLatencyMeasure(mark: PerformanceMark): PerformanceMeasure {
  performance.mark('quote-fetch-end')
  return performance.measure('quote-fetch-latency', mark.name, 'quote-fetch-end')
}

function getRoutingAPIConfig(args: GetQuoteArgs): RoutingConfig {
  const {
    account,
    tradeType,
    tokenOutAddress,
    tokenInChainId,
    uniswapXForceSyntheticQuotes,
    uniswapXEthOutputEnabled,
    uniswapXExactOutputEnabled,
    routerPreference,
  } = args

  const uniswapx = {
    useSyntheticQuotes: uniswapXForceSyntheticQuotes,
    // Protocol supports swap+send to different destination address, but
    // for now recipient === swapper
    recipient: account,
    swapper: account,
    routingType: URAQuoteType.DUTCH_LIMIT,
  }

  const classic = {
    ...DEFAULT_QUERY_PARAMS,
    routingType: URAQuoteType.CLASSIC,
  }

  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(tokenOutAddress as SwapRouterNativeAssets)

  // UniswapX doesn't support native out, exact-out, or non-mainnet trades (yet),
  // so even if the user has selected UniswapX as their router preference, force them to receive a Classic quote.
  if (
    (args.userDisabledUniswapX && routerPreference !== RouterPreference.X) ||
    (tokenOutIsNative && !uniswapXEthOutputEnabled) ||
    (!uniswapXExactOutputEnabled && tradeType === TradeType.EXACT_OUTPUT) ||
    !isUniswapXSupportedChain(tokenInChainId) ||
    routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE
  ) {
    return [classic]
  }

  return [uniswapx, classic]
}

export const routingApi = createApi({
  reducerPath: 'routingApi',
  baseQuery: fetchBaseQuery({
    baseUrl: UNISWAP_API_URL,
  }),
  endpoints: (build) => ({
    getQuote: build.query<TradeResult, GetQuoteArgs>({
      async onQueryStarted(args: GetQuoteArgs, { queryFulfilled }) {
        trace(
          'quote',
          async ({ setTraceError, setTraceStatus }) => {
            try {
              await queryFulfilled
            } catch (error: unknown) {
              if (error && typeof error === 'object' && 'error' in error) {
                const queryError = (error as Record<'error', FetchBaseQueryError>).error
                if (typeof queryError.status === 'number') {
                  setTraceStatus(queryError.status)
                }
                setTraceError(queryError)
              } else {
                throw error
              }
            }
          },
          {
            data: {
              ...args,
              isPrice: args.routerPreference === INTERNAL_ROUTER_PREFERENCE_PRICE,
              isAutoRouter: args.routerPreference === RouterPreference.API,
            },
          }
        )
      },
      async queryFn(args, _api, _extraOptions, fetch) {
        logSwapQuoteRequest(args.tokenInChainId, args.routerPreference)
        const quoteStartMark = performance.mark(`quote-fetch-start-${Date.now()}`)

        try {
          const {
            tokenInAddress: mockTokenInAddress,
            tokenInChainId: mockTokenInChainId,
            tokenOutAddress,
            tokenOutChainId,
            amount,
            tradeType,
            account,
          } = args
          const type = isExactInput(tradeType) ? 'EXACT_INPUT' : 'EXACT_OUTPUT'

          const requestBody = {
            tokenInChainId: tokenOutChainId,
            tokenIn: getUsdcAddressDstChain(tokenOutChainId),
            tokenOutChainId,
            tokenOut: tokenOutAddress,
            amount,
            type,
            configs: getRoutingAPIConfig(args),
          }

          const response = await fetch({
            method: 'POST',
            url: '/quote',
            body: JSON.stringify(requestBody),
          })

          if (response.error) {
            try {
              // cast as any here because we do a runtime check on it being an object before indexing into .errorCode
              const errorData = response.error.data as any
              // NO_ROUTE should be treated as a valid response to prevent retries.
              if (
                typeof errorData === 'object' &&
                (errorData?.errorCode === 'NO_ROUTE' || errorData?.detail === 'No quotes available')
              ) {
                sendAnalyticsEvent('No quote received from routing API', {
                  requestBody,
                  response,
                  routerPreference: args.routerPreference,
                })
                return {
                  data: { state: QuoteState.NOT_FOUND, latencyMs: getQuoteLatencyMeasure(quoteStartMark).duration },
                }
              }
            } catch {
              throw response.error
            }
          }

          const uraQuoteResponse = response.data as URAQuoteResponse
          const tradeResult = await transformRoutesToTrade(args, uraQuoteResponse, QuoteMethod.ROUTING_API)

          if (!tradeResult.trade) {
            window.alert('need to figure out how to handle now trade from API')
            throw new Error('need to figure out how to handle no trade from API')
          } else if (tradeResult.trade.fillType !== TradeFillType.Classic) {
            window.alert('trade fill type was not classic')
            throw new Error('trade fill type was not classic')
          }

          const { calldata: data, value } = SwapRouter.swapERC20CallParameters(tradeResult.trade, {
            slippageTolerance: new Percent(5, 1000),
          })

          const permit2Address = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

          const tokenInterface = new Interface(['function approve(address,uint256)'])
          const permit2Interface = new Interface([
            'function approve(address token, address spender, uint160 amount, uint48 expiration)',
          ])

          const sourceChainId = 137
          const targetUSDC = getUsdcAddressDstChain(tokenOutChainId)

          const permit2ApprovalData = permit2Interface.encodeFunctionData('approve', [
            targetUSDC,
            UNIVERSAL_ROUTER_ADDRESS(tokenOutChainId),
            BigInt(amount) * 2n,
            281_474_976_710_655,
          ])

          if (!account || !tokenOutAddress || !targetUSDC) {
            return { data: { ...tradeResult, latencyMs: getQuoteLatencyMeasure(quoteStartMark).duration } }
          }

          const estimateRequestBody = {
            transactions: [
              {
                to: targetUSDC,
                data: tokenInterface.encodeFunctionData('approve', [permit2Address, 10n ** 18n]),
              },
              // Permit universal router to use permit2 contract
              {
                to: permit2Address,
                data: permit2ApprovalData,
              },
              {
                to: UNIVERSAL_ROUTER_ADDRESS(tokenOutChainId),
                data,
              },
            ],
            userAddress: account,
            sourceToken: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on polygon
            tokenAmount: amount,
            sourceChain: sourceChainId,
            destinationChain: tokenOutChainId,
            expectedERC20Tokens: tokenOutChainId !== sourceChainId ? [targetUSDC] : undefined,
          }

          const URL = tokenOutChainId === sourceChainId ? '/v1/single-chain/estimate' : '/v1/cross-chain/estimate'

          const request = await peazeAxios.post(URL, estimateRequestBody)

          peazeStore.setState({ estimateRequest: estimateRequestBody, estimateResult: request.data })

          console.log({ request, estimateRequestBody })

          return { data: { ...tradeResult, latencyMs: getQuoteLatencyMeasure(quoteStartMark).duration } }
        } catch (error: any) {
          console.warn(`GetQuote failed on client: ${error}`)
          return {
            error: { status: 'CUSTOM_ERROR', error: error?.detail ?? error?.message ?? error },
          }
        }
      },
      keepUnusedDataFor: ms(`10s`),
      extraOptions: {
        maxRetries: 0,
      },
    }),
  }),
})

export const { useGetQuoteQuery } = routingApi
export const useGetQuoteQueryState = routingApi.endpoints.getQuote.useQueryState
