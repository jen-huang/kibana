/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { PackageInfo } from '../../../../../../types';
import { Readme } from './readme';

export function OverviewPanel(props: PackageInfo) {
  const { readme, name, version } = props;
  return readme ? <Readme readmePath={readme} packageName={name} version={version} /> : null;
}
