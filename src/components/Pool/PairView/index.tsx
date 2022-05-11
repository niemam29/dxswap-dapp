import React, { ReactNode, useEffect, useMemo } from 'react'
import { Box, Flex, Text } from 'rebass'
import { Pair } from '@swapr/sdk'
import { DarkCard } from '../../Card'
import DoubleCurrencyLogo from '../../DoubleLogo'
import styled from 'styled-components'
import FullPositionCard from '../../PositionCard'
import { RowBetween } from '../../Row'
import { ButtonGrey } from '../../Button'
import { useLiquidityMiningFeatureFlag } from '../../../hooks/useLiquidityMiningFeatureFlag'
import Skeleton from 'react-loading-skeleton'
import { usePair24hVolumeUSD } from '../../../hooks/usePairVolume24hUSD'
import { usePairCampaignIndicatorAndLiquidityUSD } from '../../../hooks/usePairCampaignIndicatorAndLiquidityUSD'
import { useActiveWeb3React } from '../../../hooks'
import { useHistory } from 'react-router-dom'
import { usePrevious } from 'react-use'
import { useIsSwitchingToCorrectChain } from '../../../state/multi-chain-links/hooks'
import { formatCurrencyAmount } from '../../../utils'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { TYPE } from '../../../theme'
import { ArrowUpRight } from 'react-feather'
import { ExternalLink } from '../../../theme'

const StyledDarkCard = styled(DarkCard)`
  ::before {
    background: ${props => props.theme.bg1};
  }
`

const StyledStatsLinkIcon = styled(ArrowUpRight)`
  color: ${props => props.theme.text4};
`

const DataText = styled.div`
  font-size: 14px;
  line-height: 17px;
  font-weight: 500;
  color: ${props => props.theme.purple2};
`
const RewardsCampaignsIndicator = styled.div`
  margin-left: 10px;
  font-size: 11.4286px;
  font-weight: 500;
  color: ${props => props.theme.white};
  border-radius: 50%;
  width: 16px;
  height: 16px;
  background: ${props => props.theme.green2};
  text-align: center;
`

interface DataRowProps {
  loading?: boolean
  title: string
  value: ReactNode
}

function DataRow({ title, value, loading }: DataRowProps) {
  return (
    <RowBetween justify="space-between" width="100%" marginBottom="8px">
      <DataText>{title}</DataText>
      <DataText>{loading ? <Skeleton width="36px" /> : value}</DataText>
    </RowBetween>
  )
}

interface PairViewProps {
  loading: boolean
  pair?: Pair | null
}

function PairView({ loading, pair }: PairViewProps) {
  const { account, chainId } = useActiveWeb3React()
  const history = useHistory()
  const previousChainId = usePrevious(chainId)
  const { loading: volumeLoading, volume24hUSD } = usePair24hVolumeUSD(pair?.liquidityToken.address)
  const { loading: liquidityLoading, liquidityUSD, numberOfCampaigns } = usePairCampaignIndicatorAndLiquidityUSD(pair)
  const liquidityMiningEnabled = useLiquidityMiningFeatureFlag()
  const switchingToCorrectChain = useIsSwitchingToCorrectChain()

  const unwrappedToken0 = useMemo(() => unwrappedToken(pair?.token0), [pair])
  const unwrappedToken1 = useMemo(() => unwrappedToken(pair?.token1), [pair])

  const overallLoading = loading || volumeLoading || liquidityLoading

  useEffect(() => {
    // when the chain is switched, and not as a reaction to following a multi chain link
    // (which might require changing chains), redirect to generic pools page
    if (chainId && previousChainId && chainId !== previousChainId && !switchingToCorrectChain) {
      history.push('/pools')
    }
  }, [chainId, history, previousChainId, switchingToCorrectChain])

  return (
    <>
      <StyledDarkCard padding="32px">
        <Flex flexDirection="column">
          <Flex mb="18px" alignItems="center">
            <Box mr="8px">
              <DoubleCurrencyLogo
                loading={overallLoading}
                size={20}
                currency0={unwrappedToken0}
                currency1={unwrappedToken1}
              />
            </Box>
            <Box>
              <Text fontSize="16px" fontWeight="600" lineHeight="20px">
                {pair ? `${unwrappedToken0?.symbol}/${unwrappedToken1?.symbol}` : <Skeleton width="60px" />}
              </Text>
            </Box>
            <Box marginLeft="auto">
              <ButtonGrey
                style={{ padding: '8px 12px' }}
                as={ExternalLink}
                href={
                  pair?.liquidityToken.address
                    ? `https://dxstats.eth.limo/#/pair/${pair?.liquidityToken.address}?chainId=${chainId}`
                    : `https://dxstats.eth.limo/#/pairs?chainId=${chainId}`
                }
              >
                <Flex>
                  <Box mr="4px">
                    <TYPE.small color="text4" fontSize="12px" letterSpacing="0.08em">
                      Stats
                    </TYPE.small>
                  </Box>
                  <Box>
                    <StyledStatsLinkIcon size="12px" />
                  </Box>
                </Flex>
              </ButtonGrey>
            </Box>
          </Flex>
          <DataRow loading={overallLoading} title="Liquidity:" value={`$${formatCurrencyAmount(liquidityUSD)}`} />
          <DataRow loading={overallLoading} title="Volume:" value={`$${formatCurrencyAmount(volume24hUSD)}`} />
          {!!account && (
            <Box mt="18px">
              <FullPositionCard pair={pair || undefined} />
            </Box>
          )}
          <RowBetween mt="18px">
            <ButtonGrey
              id="rewards-campaign-for-pair"
              onClick={() => {
                history.push(`/rewards/${pair?.token0.address}/${pair?.token1.address}`)
              }}
              disabled={!liquidityMiningEnabled || loading}
              padding="8px"
              marginRight="18px"
              width="50%"
            >
              <Text fontSize="12px" fontWeight="bold" lineHeight="15px">
                REWARD CAMPAIGNS
              </Text>
              {numberOfCampaigns > 0 && <RewardsCampaignsIndicator>{numberOfCampaigns}</RewardsCampaignsIndicator>}
            </ButtonGrey>
            <ButtonGrey
              padding="8px"
              disabled
              style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '15px' }}
              width="50%"
            >
              GOVERNANCE (COMING SOON)
            </ButtonGrey>
          </RowBetween>
        </Flex>
      </StyledDarkCard>
    </>
  )
}

export default PairView
