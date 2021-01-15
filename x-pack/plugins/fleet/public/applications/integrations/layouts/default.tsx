/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import styled from 'styled-components';
import { EuiTabs, EuiTab, EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';
import { useLink } from '../../../hooks';
import { Section } from '../sections';

interface Props {
  showSettings?: boolean;
  section?: Section;
  children?: React.ReactNode;
}

const Container = styled.div`
  min-height: calc(
    100vh - ${(props) => parseFloat(props.theme.eui.euiHeaderHeightCompensation) * 2}px
  );
  background: ${(props) => props.theme.eui.euiColorEmptyShade};
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Nav = styled.nav`
  background: ${(props) => props.theme.eui.euiColorEmptyShade};
  border-bottom: ${(props) => props.theme.eui.euiBorderThin};
  padding: ${(props) =>
    `${props.theme.eui.euiSize} ${props.theme.eui.euiSizeL} ${props.theme.eui.euiSize} ${props.theme.eui.euiSizeL}`};
  .euiTabs {
    padding-left: 3px;
    margin-left: -3px;
  }
`;

export const DefaultLayout: React.FunctionComponent<Props> = ({
  showSettings = true,
  section,
  children,
}) => {
  const { getHref } = useLink();

  return (
    <>
      <Container>
        <Wrapper>
          <Nav>
            <EuiFlexGroup gutterSize="l" alignItems="center">
              <EuiFlexItem>
                <EuiTabs display="condensed">
                  <EuiTab isSelected={section === 'epm'} href={getHref('integrations_all')}>
                    <FormattedMessage
                      id="xpack.fleet.appNavigation.epmLinkText"
                      defaultMessage="Integrations"
                    />
                  </EuiTab>
                  <EuiTab isSelected={section === 'data_stream'} href={getHref('data_streams')}>
                    <FormattedMessage
                      id="xpack.fleet.appNavigation.dataStreamsLinkText"
                      defaultMessage="Data streams"
                    />
                  </EuiTab>
                </EuiTabs>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Nav>
          {children}
        </Wrapper>
      </Container>
    </>
  );
};
