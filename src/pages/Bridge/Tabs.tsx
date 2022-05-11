import React from 'react'
import styled from 'styled-components'
import { NumberBadge } from '../../components/NumberBadge'
import Row from '../../components/Row'
import { BridgeTxsFilter } from '../../state/bridge/reducer'

interface TabsProps {
  collectableTxAmount: number
  isCollecting: boolean
  isCollectableFilter: boolean
  handleResetBridge: () => void
  setTxsFilter: (filter: BridgeTxsFilter) => void
}

export const Tabs = ({
  collectableTxAmount,
  isCollecting,
  isCollectableFilter,
  handleResetBridge,
  setTxsFilter,
}: TabsProps) => {
  return (
    <TabsRow>
      <Button
        onClick={() => {
          if (isCollecting) {
            handleResetBridge()
            return
          }
          setTxsFilter(BridgeTxsFilter.RECENT)
        }}
        className={!(isCollecting || isCollectableFilter) ? 'active' : ''}
      >
        Bridge
      </Button>
      <Button
        onClick={() => {
          setTxsFilter(BridgeTxsFilter.COLLECTABLE)
        }}
        className={isCollecting || isCollectableFilter ? 'active' : ''}
        disabled={isCollecting}
      >
        Collect
        {<Badge badgeTheme="green">{collectableTxAmount}</Badge>}
      </Button>
    </TabsRow>
  )
}

const TabsRow = styled(Row)`
  display: inline-flex;
  width: auto;
  margin: 0 0 10px;
  padding: 2px;
  background: ${({ theme }) => theme.bg8};
  border-radius: 12px;
`

const Button = styled.button`
  display: flex;
  align-items: center;
  padding: 8.5px 10px;
  font-weight: 600;
  font-size: 11px;
  line-height: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.text5};
  border-radius: 10px;
  border: none;
  background: none;
  cursor: pointer;

  &.active {
    color: #ffffff;
    background: ${({ theme }) => theme.bg2};
  }

  &:disabled {
    color: ${({ theme }) => theme.text6};
    cursor: not-allowed;
  }
`
const Badge = styled(NumberBadge)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
  font-size: 9px;
  letter-spacing: 0;
`
