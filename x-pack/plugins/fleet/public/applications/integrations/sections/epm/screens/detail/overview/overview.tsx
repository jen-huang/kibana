/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { memo } from 'react';
import styled from 'styled-components';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import { PackageInfo } from '../../../../../../../types';
import { AssetsFacetGroup } from './assets_facet_group';
import { Screenshots } from './screenshots';
import { Readme } from './readme';

interface Props {
  packageInfo: PackageInfo;
}

const LeftColumn = styled(EuiFlexItem)`
  /* 🤢🤷 https://www.styled-components.com/docs/faqs#how-can-i-override-styles-with-higher-specificity */
  &&& {
    margin-top: 77px;
  }
`;

export const OverviewPage: React.FC<Props> = memo(({ packageInfo }: Props) => {
  return (
    <EuiFlexGroup alignItems="flexStart">
      <LeftColumn grow={2} />
      <EuiFlexItem grow={9}>
        {packageInfo.readme ? (
          <Readme
            readmePath={packageInfo.readme}
            packageName={packageInfo.name}
            version={packageInfo.version}
          />
        ) : null}
      </EuiFlexItem>
      <EuiFlexItem grow={3}>
        <EuiFlexGroup direction="column" gutterSize="l">
          {packageInfo.screenshots && packageInfo.screenshots.length ? (
            <EuiFlexItem>
              <Screenshots
                images={packageInfo.screenshots}
                packageName={packageInfo.name}
                version={packageInfo.version}
              />
            </EuiFlexItem>
          ) : null}
          <EuiFlexItem>
            <AssetsFacetGroup assets={packageInfo.assets} />
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
});
