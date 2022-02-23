/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { Drawer, IDrawerProps } from '@blueprintjs/core'
import { Color, Container, FontVariation, Text } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import type { AuditEventDTO } from 'services/audit'
import { getReadableDateTime } from '@common/utils/dateUtils'
import AuditTrailFactory from '@audit-trail/factories/AuditTrailFactory'
import { getStringFromLabelMap } from '@audit-trail/utils/RequestUtil'
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

const EventSummary: React.FC<EventSummaryProps> = ({ onClose, auditEvent }) => {
  const {
    auditId,
    resourceScope: { accountIdentifier, projectIdentifier, orgIdentifier },
    timestamp,
    authenticationInfo: { labels, principal },
    httpRequestInfo: { requestMethod } = {},
    requestMetadata: { clientIP } = {}
  } = auditEvent

  const { getString } = useStrings()
  const time = getReadableDateTime(timestamp, 'MMM DD, YYYY, hh:mm a')
  const { moduleLabel = 'na' } = AuditTrailFactory.getResourceHandler(auditEvent.resource.type) || {}

  const labelMap = {
    [getString('projectLabel')]: projectIdentifier,
    [getString('common.moduleLabel')]: getString(moduleLabel),
    [getString('orgLabel')]: orgIdentifier,
    [getString('common.userLabel')]: labels?.username || principal.identifier
  }

  return (
    <Drawer className={css.drawer} {...drawerStates} title={getString('auditTrail.eventSummary')} onClose={onClose}>
      <Container height="100%" background={Color.GREY_100} padding="xlarge">
        <Container className={css.card} background={Color.WHITE} padding="large" margin={{ bottom: 'large' }}>
          <Text font={{ variation: FontVariation.H6 }} color={Color.GREY_800}>
            {time}
          </Text>
          <Text
            color={Color.GREY_350}
            font={{ variation: FontVariation.SMALL_SEMI }}
            margin={{ bottom: 'xlarge', top: 'xsmall' }}
          >
            {getStringFromLabelMap(labelMap)}
          </Text>
          {/* TODO:  Handle null case for auditId and accountIdentifier */}
          {auditId && accountIdentifier && <YamlDiffButton auditId={auditId} accountIdentifier={accountIdentifier} />}
        </Container>
        {requestMethod && clientIP ? (
          <Container className={css.card} background={Color.WHITE} padding="large">
            <Text font={{ variation: FontVariation.H6 }} color={Color.GREY_800}>
              {getString('auditTrail.supplementaryDetails')}
            </Text>
            <Text
              color={Color.GREY_350}
              font={{ variation: FontVariation.SMALL_SEMI }}
              margin={{ bottom: 'xsmall', top: 'xlarge' }}
            >
              {getString('auditTrail.eventSource')}
            </Text>
            <Text
              color={Color.GREY_800}
              font={{ variation: FontVariation.BODY }}
            >{`HTTP ${requestMethod} (Client IP: ${clientIP})`}</Text>
          </Container>
        ) : undefined}
      </Container>
    </Drawer>
  )
}

export default EventSummary
