/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { Fragment } from 'react';
import styled from 'styled-components';
import { EuiPage, EuiPageBody, EuiSpacer } from '@elastic/eui';
import { Header, HeaderProps } from './header';

export const Page = styled(EuiPage)`
  background: ${(props) => props.theme.eui.euiColorEmptyShade};
  width: 100%;
  align-self: center;
  margin-left: 0;
  margin-right: 0;
  flex: 1;
`;

export const ContentWrapper = styled.div`
  height: 100%;
`;

export interface WithHeaderLayoutProps extends HeaderProps {
  restrictWidth?: number;
  restrictHeaderWidth?: number;
  'data-test-subj'?: string;
  children?: React.ReactNode;
}

export const WithHeaderLayout: React.FC<WithHeaderLayoutProps> = ({
  restrictWidth,
  restrictHeaderWidth,
  children,
  'data-test-subj': dataTestSubj,
  ...rest
}) => (
  <Fragment>
    <Header
      maxWidth={restrictHeaderWidth}
      data-test-subj={dataTestSubj ? `${dataTestSubj}_header` : undefined}
      {...rest}
    />
    <Page
      restrictWidth={restrictWidth || 1200}
      data-test-subj={dataTestSubj ? `${dataTestSubj}_page` : undefined}
    >
      <EuiPageBody>
        <ContentWrapper>
          <EuiSpacer size="m" />
          {children}
        </ContentWrapper>
      </EuiPageBody>
    </Page>
  </Fragment>
);
