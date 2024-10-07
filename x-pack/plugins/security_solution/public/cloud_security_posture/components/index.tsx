/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { EuiAccordion, EuiHorizontalRule, EuiSpacer, EuiTitle, useEuiTheme } from '@elastic/eui';

import React from 'react';
import { css } from '@emotion/react';
import { FormattedMessage } from '@kbn/i18n-react';
import { useCspSetupStatusApi } from '@kbn/cloud-security-posture/src/hooks/use_csp_setup_status_api';
import { MisconfigurationsPreview } from './misconfiguration/misconfiguration_preview';
import { VulnerabilitiesPreview } from './vulnerabilities/vulnerabilities_preview';

export const EntityInsight = <T,>({
  name,
  fieldName,
  isPreviewMode,
}: {
  name: string;
  fieldName: 'host.name' | 'user.name';
  isPreviewMode?: boolean;
}) => {
  const { euiTheme } = useEuiTheme();
  const getSetupStatus = useCspSetupStatusApi();
  const hasMisconfigurationFindings = getSetupStatus.data?.hasMisconfigurationsFindings;
  const hasVulnerabilitiesFindings = getSetupStatus.data?.hasVulnerabilitiesFindings;
  const insightContent: React.ReactElement[] = [];
  const isVulnerabilitiesFindingForHost = hasVulnerabilitiesFindings && fieldName === 'host.name';

  if (hasMisconfigurationFindings)
    insightContent.push(
      <>
        <MisconfigurationsPreview name={name} fieldName={fieldName} isPreviewMode={isPreviewMode} />
        <EuiSpacer size="m" />
      </>
    );
  if (isVulnerabilitiesFindingForHost)
    insightContent.push(
      <>
        <VulnerabilitiesPreview hostName={name} />
        <EuiSpacer size="m" />
      </>
    );
  return (
    <>
      {(hasMisconfigurationFindings || isVulnerabilitiesFindingForHost) && (
        <>
          <EuiAccordion
            initialIsOpen={true}
            id="entityInsight-accordion"
            data-test-subj="entityInsightTestSubj"
            buttonProps={{
              'data-test-subj': 'entityInsight-accordion-button',
              css: css`
                color: ${euiTheme.colors.primary};
              `,
            }}
            buttonContent={
              <EuiTitle size="xs">
                <h3>
                  <FormattedMessage
                    id="xpack.securitySolution.flyout.entityDetails.insightsTitle"
                    defaultMessage="Insights"
                  />
                </h3>
              </EuiTitle>
            }
          >
            <EuiSpacer size="m" />
            {insightContent}
          </EuiAccordion>
          <EuiHorizontalRule />
        </>
      )}
    </>
  );
};
