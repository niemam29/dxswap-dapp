import { Pair } from '@swapr/sdk'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Plus, X } from 'react-feather'
import { FixedSizeList } from 'react-window'
import { Box, Flex, Text } from 'rebass'
import React, { useCallback } from 'react'

import Badge from '../../Badge'
import { TokenPickerItem } from '../shared'
import DoubleCurrencyLogo from '../../DoubleLogo'

import { useAllPairs } from '../../../hooks/useAllPairs'
import { isPairOnList } from '../../../utils'
import { unwrappedToken } from '../../../utils/wrappedCurrency'
import { useActiveWeb3React } from '../../../hooks'
import { useIsUserAddedPair } from '../../../hooks/Tokens'
import { usePairAdder, usePairRemover } from '../../../state/user/hooks'

import { PairListProps, PairRowProps } from './PairList.types'

function pairKey(index: number, data: Pair[]) {
  return data[index].liquidityToken.address
}

const PairRow = ({ pair, onSelect, isSelected, style }: PairRowProps) => {
  const { chainId } = useActiveWeb3React()
  const { pairs: allPairs } = useAllPairs()
  const isOnSelectedList = isPairOnList(allPairs, pair)
  const customAdded = useIsUserAddedPair(pair)

  const removePair = usePairRemover()
  const addPair = usePairAdder()

  const pairText = `${unwrappedToken(pair.token0)?.symbol || ''}/${unwrappedToken(pair.token1)?.symbol || ''}`

  // only show add or remove buttons if not on selected list
  return (
    <TokenPickerItem
      style={style}
      onClick={() => (isSelected ? null : onSelect())}
      disabled={isSelected}
      alignItems="center"
      px="20px"
    >
      <Box mr="8px">
        <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={20} />
      </Box>
      <Box>
        <Text title={pairText} fontWeight={500}>
          {pairText}
        </Text>
      </Box>
      <Flex flex="1" px="20px">
        {!isOnSelectedList && (
          <Box>
            <Badge
              label={customAdded ? 'Added by user' : 'Found by address'}
              icon={customAdded ? X : Plus}
              onClick={event => {
                event.stopPropagation()
                if (!chainId) {
                  return
                }
                if (customAdded) {
                  removePair(pair)
                } else {
                  addPair(pair)
                }
              }}
            />
          </Box>
        )}
      </Flex>
    </TokenPickerItem>
  )
}

export const PairList = ({ pairs, selectedPair, onPairSelect }: PairListProps) => {
  const Row = useCallback(
    ({ data, index, style }) => {
      const pair = data[index]
      const isSelected = Boolean(selectedPair && selectedPair.equals(pair))
      const handleSelect = () => onPairSelect(pair)
      return <PairRow style={style} pair={pair} isSelected={isSelected} onSelect={handleSelect} />
    },
    [onPairSelect, selectedPair]
  )

  return (
    <Flex overflowY="auto" flex="1">
      <AutoSizer style={{ width: '100%', height: '100%' }}>
        {({ width, height }) => (
          <FixedSizeList
            width={width}
            height={height}
            itemData={pairs}
            itemCount={pairs.length}
            itemSize={56}
            itemKey={pairKey}
          >
            {Row}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Flex>
  )
}
