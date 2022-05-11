import { Currency, CurrencyAmount, Pair, Percent } from '@swapr/sdk'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { TYPE } from '../../theme'
import NumericalInput from '../Input/NumericalInput'
import { ReactComponent as DropDown } from '../../assets/images/dropdown.svg'
import { breakpoints } from '../../utils/theme'

import { useActiveWeb3React } from '../../hooks'
import { useTranslation } from 'react-i18next'
import { FiatValueDetails } from '../FiatValueDetails'
import { limitNumberOfDecimalPlaces } from '../../utils/prices'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  margin-bottom: 8px;
  align-items: center;
`

const CurrencySelect = styled.button<{ selected: boolean; disableCurrencySelect?: boolean }>`
  align-items: center;
  font-size: ${({ selected }) => (selected ? '26px' : '12px')};
  font-weight: ${({ selected }) => (selected ? 600 : 700)};
  background-color: ${({ selected, theme }) => (selected ? 'transparent' : theme.primary1)};
  border-radius: 8px;
  height: 28px;
  padding: ${({ selected }) => (selected ? '0' : '0 12px')};
  color: ${({ theme }) => theme.white};
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: ${({ disableCurrencySelect }) => (disableCurrencySelect ? 'auto' : 'pointer')};
  user-select: none;
  border: none;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  margin-bottom: 8px;
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledDropDown = styled(DropDown)<{ selected: boolean }>`
  margin: 0 0 0 5px;
  height: 11px;
  width: 11px;

  path {
    stroke: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
    stroke-width: 1.5px;
  }
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  z-index: 1;
`

const Container = styled.div<{ focused: boolean }>`
  background-color: ${({ theme }) => theme.bg1And2};
  border: solid 1px ${({ focused, theme }) => (focused ? theme.bg3 : theme.bg1And2)};
  border-radius: 12px;
  transition: border 0.3s ease;
  padding: 18px 22px;
  @media screen and (max-width: ${breakpoints.md}) {
    padding: 18px 16px;
  }
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  margin: ${({ active }) => (active ? '0 0 0 6px' : '0')};
  font-size: ${({ active }) => (active ? '16px' : '11px')};
  line-height: ${({ active }) => (active ? '20px' : '13px')};
  letter-spacing: 0.08em;
`

const UppercaseHelper = styled.span`
  text-transform: uppercase;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  disabled?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  customBalanceText?: string
  balance?: CurrencyAmount
  fiatValue?: CurrencyAmount | null
  priceImpact?: Percent
  isFallbackFiatValue?: boolean
}

export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  disabled,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  customBalanceText,
  balance,
  fiatValue,
  priceImpact,
  isFallbackFiatValue,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const { account } = useActiveWeb3React()

  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)

  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])

  const handleFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const handleBlur = useCallback(() => {
    setFocused(false)
  }, [])

  return (
    <InputPanel id={id}>
      <Container focused={focused}>
        <div>
          {!hideInput && label && (
            <LabelRow>
              <RowBetween>
                <TYPE.body fontWeight="600" fontSize="11px" lineHeight="13px" letterSpacing="0.08em">
                  <UppercaseHelper>{label}</UppercaseHelper>
                </TYPE.body>
              </RowBetween>
            </LabelRow>
          )}
          <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
            {!hideInput && (
              <NumericalInput
                className="token-amount-input"
                value={value}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onUserInput={val => {
                  onUserInput(val)
                }}
                disabled={disabled}
                data-testid="transaction-value-input"
              />
            )}
            <CurrencySelect
              selected={!!(currency || pair)}
              className="open-currency-select-button"
              disableCurrencySelect={disableCurrencySelect}
              onClick={() => {
                if (!disableCurrencySelect) {
                  setModalOpen(true)
                }
              }}
            >
              <Aligner>
                {pair ? (
                  <DoubleCurrencyLogo marginRight={4} currency0={pair.token0} currency1={pair.token1} size={20} />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="20px" />
                ) : null}
                {pair ? (
                  <StyledTokenName className="pair-name-container">
                    {pair?.token0.symbol}/{pair?.token1.symbol}
                  </StyledTokenName>
                ) : (
                  <StyledTokenName className="token-symbol-container" active={Boolean(currency && currency.symbol)}>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? currency.symbol.slice(0, 4) +
                        '...' +
                        currency.symbol.slice(currency.symbol.length - 5, currency.symbol.length)
                      : currency?.symbol) || <div data-testid="select-token-button"> {t('select Token')}</div>}
                  </StyledTokenName>
                )}
                {!disableCurrencySelect && (pair || currency) && <StyledDropDown selected={!!currency} />}
              </Aligner>
            </CurrencySelect>
          </InputRow>
          <div>
            <RowBetween>
              {fiatValue && (
                <FiatValueDetails
                  fiatValue={fiatValue?.toFixed(2, { groupSeparator: ',' })}
                  priceImpact={priceImpact}
                  isFallback={isFallbackFiatValue}
                />
              )}
              {account && (
                <TYPE.body
                  onClick={onMax}
                  fontWeight="600"
                  fontSize="10px"
                  lineHeight="13px"
                  letterSpacing="0.08em"
                  style={{
                    display: 'inline',
                    marginLeft: 'auto',
                    cursor:
                      !hideBalance && !!(currency || pair) && (balance || selectedCurrencyBalance) ? 'pointer' : 'auto',
                  }}
                >
                  <UppercaseHelper>
                    {!hideBalance && !!(currency || pair) && (balance || selectedCurrencyBalance) && (
                      <>
                        {customBalanceText ?? t('balance')}
                        <TYPE.small as="span" fontWeight="600" color="text3" style={{ textDecoration: 'underline' }}>
                          {limitNumberOfDecimalPlaces(balance || selectedCurrencyBalance) || '0'}
                        </TYPE.small>
                      </>
                    )}
                  </UppercaseHelper>
                </TYPE.body>
              )}
            </RowBetween>
          </div>
        </div>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
