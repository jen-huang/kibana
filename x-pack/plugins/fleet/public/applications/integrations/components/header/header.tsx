/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback } from 'react';
import {
  EuiHeaderSectionItem,
  EuiHeaderSection,
  EuiHeaderLinks,
  EuiHeaderLink,
} from '@elastic/eui';

import type { AppMountParameters } from '@kbn/core/public';

import { useAssistantContext } from '@kbn/elastic-assistant';

import type { FleetStartServices } from '../../../../plugin';

import { HeaderPortal } from './header_portal';
import { DeploymentDetails } from './deployment_details';

export const IntegrationsHeader = ({
  setHeaderActionMenu,
  startServices,
}: {
  setHeaderActionMenu: AppMountParameters['setHeaderActionMenu'];
  startServices: Pick<FleetStartServices, 'analytics' | 'i18n' | 'theme'>;
}) => {
  const { showAssistantOverlay, assistantAvailability } = useAssistantContext();
  const showAssistant =
    assistantAvailability.hasAssistantPrivilege && assistantAvailability.isAssistantEnabled;

  const showOverlay = useCallback(
    () => showAssistantOverlay({ showOverlay: true }),
    [showAssistantOverlay]
  );

  // TODO: i18n
  return (
    <HeaderPortal {...{ setHeaderActionMenu, startServices }}>
      <EuiHeaderSection grow={false}>
        <EuiHeaderSectionItem>
          <EuiHeaderLinks>
            <DeploymentDetails />
            {showAssistant && (
              <EuiHeaderLink onClick={showOverlay} isActive={true}>
                AI Assistant
              </EuiHeaderLink>
            )}
          </EuiHeaderLinks>
        </EuiHeaderSectionItem>
      </EuiHeaderSection>
    </HeaderPortal>
  );
};
