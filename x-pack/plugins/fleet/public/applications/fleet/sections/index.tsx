/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
export { IngestManagerOverview } from './overview';
export { AgentPolicyApp } from './agent_policy';
export { FleetApp } from './agents';

export type Section = 'overview' | 'agent_policy' | 'fleet';
