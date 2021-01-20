/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React, { memo } from 'react';
import styled from 'styled-components';

interface Props {
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

export const DefaultLayout: React.FunctionComponent<Props> = memo(({ children }) => {
  return (
    <Container>
      <Wrapper>{children}</Wrapper>
    </Container>
  );
});
