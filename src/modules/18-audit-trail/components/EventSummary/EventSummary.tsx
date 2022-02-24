/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { ReactElement } from 'react'
import { Drawer, IDrawerProps } from '@blueprintjs/core'
import { Color, Container, FontVariation, Text } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import type { AuditEventDTO } from 'services/audit'
import { getReadableDateTime } from '@common/utils/dateUtils'
import AuditTrailFactory from '@audit-trail/factories/AuditTrailFactory'
import { getStringFromSubtitleMap } from '@audit-trail/utils/RequestUtil'
import YamlDiffButton from './YamlDiffButton'
import css from './EventSummary.module.scss'

const drawerStates: IDrawerProps = {
  autoFocus: true,
  canEscapeKeyClose: true,
  canOutsideClickClose: true,
  enforceFocus: true,
  hasBackdrop: true,
  usePortal: true,
  isOpen: true,
  size: 790
}

interface EventSummaryProps {
  onClose?: () => void
  auditEvent: AuditEventDTO
}

interface EventCard {
  key: string
  title: string | ReactElement
  subTitle?: string | ReactElement
  content: ReactElement
  condition?: boolean
}

const EventSummary: React.FC<EventSummaryProps> = ({ onClose, auditEvent }) => {
  const {
    auditId,
    resourceScope: { accountIdentifier, projectIdentifier, orgIdentifier },
    timestamp,
    httpRequestInfo: { requestMethod } = {},
    requestMetadata: { clientIP } = {}
  } = auditEvent

  const { getString } = useStrings()
  const { moduleLabel = 'na' } = AuditTrailFactory.getResourceHandler(auditEvent.resource.type) || {}

  const subTitle = {
    [getString('projectLabel')]: projectIdentifier,
    [getString('common.moduleLabel')]: getString(moduleLabel),
    [getString('orgLabel')]: orgIdentifier
  }

  const renderYamlDiffCard = (): ReactElement => {
    return (
      <>
        {/* TODO:  Handle null case for auditId and accountIdentifier */}
        {auditId && accountIdentifier && <YamlDiffButton auditId={auditId} accountIdentifier={accountIdentifier} />}
      </>
    )
  }

  const renderSupplementaryDetails = (): ReactElement => {
    return (
      <>
        <Text
          color={Color.GREY_350}
          font={{ variation: FontVariation.SMALL_SEMI }}
          margin={{ bottom: 'xsmall', top: 'xlarge' }}
        >
          {getString('auditTrail.eventSource')}
        </Text>
        <Text color={Color.GREY_800} font={{ variation: FontVariation.BODY }}>
          {getString('auditTrail.http', {
            method: requestMethod,
            clientIP
          })}
        </Text>
      </>
    )
  }

  const cards: EventCard[] = [
    {
      key: 'yamlDiff',
      title: getReadableDateTime(timestamp, 'MMM DD, YYYY, hh:mm a'),
      subTitle: getStringFromSubtitleMap(subTitle),
      content: renderYamlDiffCard()
    },
    {
      key: 'supplementaryDetails',
      title: getString('auditTrail.supplementaryDetails'),
      content: renderSupplementaryDetails(),
      condition: Boolean(requestMethod && clientIP)
    }
  ]

  return (
    <Drawer className={css.drawer} {...drawerStates} title={getString('auditTrail.eventSummary')} onClose={onClose}>
      <Container height="100%" background={Color.GREY_100} padding="xlarge">
        {cards.map(card => {
          if (typeof card.condition === 'undefined' || card.condition) {
            return (
              <Container
                key={card.key}
                className={css.card}
                background={Color.WHITE}
                padding="large"
                margin={{ bottom: 'xlarge' }}
              >
                <Text font={{ variation: FontVariation.H6 }} color={Color.GREY_800}>
                  {card.title}
                </Text>
                {card.subTitle && (
                  <Text
                    color={Color.GREY_350}
                    font={{ variation: FontVariation.SMALL_SEMI }}
                    margin={{ bottom: 'xlarge', top: 'xsmall' }}
                  >
                    {card.subTitle}
                  </Text>
                )}
                {card.content}
              </Container>
            )
          }
        })}
      </Container>
    </Drawer>
  )
}

export default EventSummary
