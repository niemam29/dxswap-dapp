import { gql, useQuery } from '@apollo/client'
import Decimal from 'decimal.js-light'
import { Price, USD } from '@swapr/sdk'
import { parseUnits } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { useNativeCurrency } from './useNativeCurrency'

const QUERY = gql`
  query {
    bundle(id: "1") {
      nativeCurrencyPrice
    }
  }
`

export function useNativeCurrencyUSDPrice(): { loading: boolean; nativeCurrencyUSDPrice: Price } {
  const nativeCurrency = useNativeCurrency()
  const { loading, error, data } = useQuery<{ bundle: { nativeCurrencyPrice: string } }>(QUERY)

  return useMemo(() => {
    if (loading)
      return {
        loading: true,
        nativeCurrencyUSDPrice: new Price({
          baseCurrency: nativeCurrency,
          quoteCurrency: USD,
          denominator: '1',
          numerator: '0',
        }),
      }
    if (!data || error || !data.bundle)
      return {
        loading: false,
        nativeCurrencyUSDPrice: new Price({
          quoteCurrency: nativeCurrency,
          baseCurrency: USD,
          denominator: '1',
          numerator: '0',
        }),
      }
    return {
      loading: false,
      nativeCurrencyUSDPrice: new Price({
        baseCurrency: nativeCurrency,
        quoteCurrency: USD,
        denominator: parseUnits('1', USD.decimals).toString(),
        numerator: parseUnits(new Decimal(data.bundle.nativeCurrencyPrice).toFixed(18), USD.decimals).toString(),
      }),
    }
  }, [data, error, loading, nativeCurrency])
}
