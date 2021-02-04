/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { useState, memo } from 'react';
import ReactDOM from 'react-dom';
import { EuiFlexGroup, EuiFlexItem, EuiButtonEmpty, EuiPortal } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { FleetStartServices } from '../../plugin';
import { SettingFlyout } from './components';

const ActionMenu: React.FC = memo(() => {
  const [isSettingsFlyoutOpen, setIsSettingsFlyoutOpen] = useState(false);

  return (
    <>
      {isSettingsFlyoutOpen && (
        <EuiPortal>
          <SettingFlyout
            onClose={() => {
              setIsSettingsFlyoutOpen(false);
            }}
          />
        </EuiPortal>
      )}
      <EuiFlexGroup gutterSize="s" direction="row">
        <EuiFlexItem>
          <EuiButtonEmpty
            iconType="popout"
            href="https://ela.st/ingest-manager-feedback"
            target="_blank"
          >
            <FormattedMessage
              id="xpack.fleet.appNavigation.sendFeedbackButton"
              defaultMessage="Send feedback"
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButtonEmpty iconType="gear" onClick={() => setIsSettingsFlyoutOpen(true)}>
            <FormattedMessage
              id="xpack.fleet.appNavigation.settingsButton"
              defaultMessage="Settings"
            />
          </EuiButtonEmpty>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
});

export const renderActionMenu = (startServices: FleetStartServices, element: HTMLElement) => {
  ReactDOM.render(
    <startServices.i18n.Context>
      <ActionMenu />
    </startServices.i18n.Context>,
    element
  );
  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
};
