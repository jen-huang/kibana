/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { memo } from 'react';
import { EuiText, EuiFlexGroup, EuiFlexItem, EuiBetaBadge } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { useLink } from '../../../hooks';
import { Section } from '../sections';
import { WithHeaderLayout } from './';

interface Props {
  section?: Section;
  children?: React.ReactNode;
}

export const MainLayout: React.FunctionComponent<Props> = memo(({ section, children }) => {
  const { getHref } = useLink();

  return (
    <WithHeaderLayout
      leftColumn={
        <EuiFlexGroup direction="column" gutterSize="m">
          <EuiFlexItem>
            <EuiText>
              <h1>
                <FormattedMessage id="xpack.fleet.appTitle" defaultMessage="Fleet" />{' '}
                <EuiBetaBadge
                  label={<FormattedMessage id="xpack.fleet.betaLabel" defaultMessage="Beta" />}
                  tooltipContent={
                    <FormattedMessage
                      id="xpack.fleet.alphaMessageDescription"
                      defaultMessage="Fleet is not recommended for production environments."
                    />
                  }
                />
              </h1>
            </EuiText>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText color="subdued">
              <p>
                <FormattedMessage
                  id="xpack.fleet.appDescription"
                  defaultMessage="Centralized management for Elastic Agents."
                />
              </p>
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      }
      tabs={[
        {
          name: (
            <FormattedMessage
              id="xpack.fleet.appNavigation.agentsLinkText"
              defaultMessage="Agents"
            />
          ),
          isSelected: section === 'fleet',
          href: getHref('fleet_agent_list'),
        },
        {
          name: (
            <FormattedMessage
              id="xpack.fleet.appNavigation.policiesLinkText"
              defaultMessage="Agent policies"
            />
          ),
          isSelected: section === 'agent_policy',
          href: getHref('policies_list'),
        },
        {
          name: (
            <FormattedMessage
              id="xpack.fleet.appNavigation.enrollmentTokensLinkText"
              defaultMessage="Enrollment tokens"
            />
          ),
          isSelected: section === 'enrollment_token',
          href: getHref('fleet_enrollment_tokens'),
        },
      ]}
    >
      {children}
    </WithHeaderLayout>
  );
});
