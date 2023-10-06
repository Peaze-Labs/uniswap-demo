import { t } from '@lingui/macro'
import { ChainId } from '@uniswap/sdk-core'
import { MouseoverTooltip } from 'components/Tooltip'
import { getChainInfo } from 'constants/chainInfo'
import { L1_CHAIN_IDS, L2_CHAIN_IDS } from 'constants/chains'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { Box } from 'nft/components/Box'
import { Portal } from 'nft/components/common/Portal'
import { Column, Row } from 'nft/components/Flex'
import { useIsMobile } from 'nft/hooks'
import { useCallback, useRef, useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'react-feather'
import { peazeStore } from 'state/peaze/store'
import { useTheme } from 'styled-components'

import * as styles from './ChainSelector.css'
import { NavDropdown } from './NavDropdown'
import PeazeChainSelectorRow from './PeazeChainSelectorRow'

const NETWORK_SELECTOR_CHAINS = [...L1_CHAIN_IDS, ...L2_CHAIN_IDS]

interface ChainSelectorProps {
  leftAlign?: boolean
}

export const PeazeChainSelector = ({ leftAlign }: ChainSelectorProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const isMobile = useIsMobile()

  const theme = useTheme()

  const supportedChains = NETWORK_SELECTOR_CHAINS

  const ref = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(ref, () => setIsOpen(false), [modalRef])

  const { sourceChainId: chainId, setSourceChainId } = peazeStore()
  const info = getChainInfo(chainId)

  const onSelectChain = useCallback(
    async (targetChainId: ChainId) => {
      console.log('onSelectChain', targetChainId)

      setSourceChainId(targetChainId)

      setIsOpen(false)
    },
    [setIsOpen, setSourceChainId]
  )

  if (!chainId) {
    return null
  }

  const isSupported = !!info

  const dropdown = (
    <NavDropdown top="56" left={leftAlign ? '0' : 'auto'} right={leftAlign ? 'auto' : '0'} ref={modalRef}>
      <Column paddingX="8" data-testid="chain-selector-options">
        {supportedChains.map((selectorChain) => (
          <PeazeChainSelectorRow
            disabled={false}
            onSelectChain={onSelectChain}
            targetChain={selectorChain}
            key={selectorChain}
            isPending={false}
          />
        ))}
      </Column>
    </NavDropdown>
  )

  const chevronProps = {
    height: 20,
    width: 20,
    color: theme.neutral2,
  }

  return (
    <Box position="relative" ref={ref}>
      <MouseoverTooltip text={t`Your wallet's current network is unsupported.`} disabled={isSupported}>
        <Row
          data-testid="chain-selector"
          as="button"
          gap="8"
          className={styles.ChainSelector}
          background={isOpen ? 'accent2' : 'none'}
          onClick={() => setIsOpen(!isOpen)}
        >
          {!isSupported ? (
            <AlertTriangle size={20} color={theme.neutral2} />
          ) : (
            <img src={info.logoUrl} alt={info.label} className={styles.Image} data-testid="chain-selector-logo" />
          )}
          {isOpen ? <ChevronUp {...chevronProps} /> : <ChevronDown {...chevronProps} />}
        </Row>
      </MouseoverTooltip>
      {isOpen && (isMobile ? <Portal>{dropdown}</Portal> : <>{dropdown}</>)}
    </Box>
  )
}
