import React, { useCallback } from 'react'
import { SWPR_CONVERTER_ADDRESS, TokenAmount } from '@swapr/sdk'
import { useActiveWeb3React } from '../../../hooks'
import { AutoColumn } from '../../Column'
import { RowBetween } from '../../Row'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { ButtonPrimary } from '../../Button'
import ProgressCircles from '../../ProgressSteps'
import { useConvertSwprCallback } from '../../../hooks/swpr/useConvertSwprCallback'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import styled from 'styled-components'

const StyledAutoColumn = styled(AutoColumn)<{ disabled: boolean }>`
  opacity: ${props => (props.disabled ? 0.5 : 1)};
`

interface ConvertFlowProps {
  oldSwprBalance: TokenAmount | undefined
  disabled: boolean
  onError: () => void
}

export function ConvertFlow({ oldSwprBalance, disabled, onError }: ConvertFlowProps) {
  const { chainId, account } = useActiveWeb3React()
  const addTransaction = useTransactionAdder()
  //chainId will be one of  1,4,100,137,42161,421611 or undefined
  const spender = SWPR_CONVERTER_ADDRESS[chainId!]
  const [approvalState, approveCallback] = useApproveCallback(oldSwprBalance, spender)
  const convertSwprCallback = useConvertSwprCallback(account ?? undefined)

  const handleConvert = useCallback(() => {
    if (!convertSwprCallback) return
    convertSwprCallback()
      .then(transaction => {
        addTransaction(transaction, {
          summary: `Convert ${oldSwprBalance?.toFixed(3)} old SWPR to new SWPR`,
        })
      })
      .catch(error => {
        console.log(error)
        onError()
      })
  }, [addTransaction, convertSwprCallback, oldSwprBalance, onError])

  return (
    <StyledAutoColumn disabled={disabled}>
      <RowBetween mt="1rem" mb="1rem">
        <ButtonPrimary
          width="48%"
          onClick={approveCallback}
          disabled={disabled || approvalState !== ApprovalState.NOT_APPROVED}
        >
          Approve
        </ButtonPrimary>
        <ButtonPrimary
          width="48%"
          onClick={handleConvert}
          disabled={disabled || approvalState !== ApprovalState.APPROVED}
        >
          Convert
        </ButtonPrimary>
      </RowBetween>
      <ProgressCircles disabled={disabled} steps={[approvalState === ApprovalState.APPROVED]} />
    </StyledAutoColumn>
  )
}
