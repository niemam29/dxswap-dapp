import { getAddress } from '@ethersproject/address'
import { nanoid } from '@reduxjs/toolkit'
import { TokenList } from '@uniswap/token-lists'
import { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from '.'
import { immediateCarrotSubgraphClients } from '../apollo/client'
import { getNetworkLibrary } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { gql } from 'graphql-request'
import carrotListLogoUrl from '../assets/images/carrot.png'
import { KPI_TOKEN_CREATORS } from '../constants'

export function useFetchListCallback(): (listUrl: string, sendDispatch?: boolean) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback(
    async (ensName: string) => {
      if (!library || chainId !== 1) {
        const networkLibrary = getNetworkLibrary()
        const network = await networkLibrary.getNetwork()
        if (networkLibrary && network.chainId === 1) {
          return resolveENSContentHash(ensName, networkLibrary)
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (listUrl: string, sendDispatch = true) => {
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then((tokenList: TokenList) => {
          sendDispatch && dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error: Error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          sendDispatch && dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          throw error
        })
    },
    [dispatch, ensResolver]
  )
}

const KPI_TOKENS_QUERY = gql`
  query kpiTokens($creators: [Bytes!]) {
    kpiTokens(first: 1000, where: { creator_in: $creators }) {
      address: id
      symbol
      name
    }
  }
`

interface KpiTokensQueryResult {
  kpiTokens: {
    address: string
    symbol: string
    name: string
  }[]
}

export function useFetchCarrotListCallback(): (sendDispatch?: boolean) => Promise<TokenList> {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const validCreators = useMemo(
    () =>
      chainId && KPI_TOKEN_CREATORS[chainId] ? KPI_TOKEN_CREATORS[chainId].map(creator => creator.toLowerCase()) : [],
    [chainId]
  )

  // note: prevent dispatch if using for list search or unsupported list
  return useCallback(
    async (sendDispatch = true) => {
      if (!chainId || !validCreators || validCreators.length === 0)
        throw new Error(`no chain id or valid creators available`)
      const client = immediateCarrotSubgraphClients[chainId]
      if (!client) throw new Error(`no carrot subgraph client available`)
      const requestId = nanoid()
      sendDispatch && dispatch(fetchTokenList.pending({ requestId, url: 'CARROT' }))
      try {
        const response = await client.request<KpiTokensQueryResult>(KPI_TOKENS_QUERY, { creators: validCreators })
        const listAndTokensUrl = `${window.location.origin}${
          carrotListLogoUrl.startsWith('.') ? carrotListLogoUrl.substring(1) : carrotListLogoUrl
        }`
        const tokenList = {
          name: 'DXdao Carrot KPI tokens',
          timestamp: Math.floor(Date.now() / 1000).toString(),
          version: {
            major: 1,
            minor: 0,
            patch: 0,
          },
          tokens: response.kpiTokens.map(kpiToken => ({
            ...kpiToken,
            chainId,
            decimals: 18,
            address: getAddress(kpiToken.address),
            logoURI: listAndTokensUrl,
          })),
          logoURI: listAndTokensUrl,
        }
        sendDispatch &&
          dispatch(
            fetchTokenList.fulfilled({
              url: 'CARROT',
              tokenList,
              requestId,
            })
          )
        return tokenList
      } catch (error) {
        sendDispatch &&
          dispatch(
            fetchTokenList.rejected({
              url: 'CARROT',
              errorMessage: 'Failed to fetch Carrot token list',
              requestId,
            })
          )
        throw error
      }
    },
    [chainId, validCreators, dispatch]
  )
}
