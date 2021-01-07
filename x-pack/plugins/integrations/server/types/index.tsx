/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { LegacyScopedClusterClient } from 'src/core/server';

export * from '../../common/types';
export * from './models';
export * from './rest_spec';

export type CallESAsCurrentUser = LegacyScopedClusterClient['callAsCurrentUser'];
