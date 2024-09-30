/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { CloudSetup } from '@kbn/cloud-plugin/server';

import type { FleetConfigType } from '../types';
import type { ExperimentalFeatures } from '../experimental_features';

export const isAgentlessApiEnabled = ({
  cloudSetup,
  fleetConfig,
}: {
  cloudSetup?: Pick<CloudSetup, 'isCloudEnabled' | 'isServerlessEnabled'>;
  fleetConfig?: FleetConfigType;
}) => {
  const isHosted = cloudSetup?.isCloudEnabled || cloudSetup?.isServerlessEnabled;
  return Boolean(isHosted && fleetConfig?.agentless?.enabled);
};

export const isDefaultAgentlessPolicyEnabled = ({
  cloudSetup,
  fleetExperimentalFeatures,
}: {
  cloudSetup?: Pick<CloudSetup, 'isCloudEnabled' | 'isServerlessEnabled'>;
  fleetExperimentalFeatures: ExperimentalFeatures;
}) => {
  return Boolean(cloudSetup?.isServerlessEnabled && fleetExperimentalFeatures.agentless);
};

export const isAgentlessEnabled = ({
  cloudSetup,
  fleetConfig,
  fleetExperimentalFeatures,
}: {
  cloudSetup?: Pick<CloudSetup, 'isCloudEnabled' | 'isServerlessEnabled'>;
  fleetConfig?: FleetConfigType;
  fleetExperimentalFeatures: ExperimentalFeatures;
}) => {
  return (
    isAgentlessApiEnabled({
      cloudSetup,
      fleetConfig,
    }) ||
    isDefaultAgentlessPolicyEnabled({
      cloudSetup,
      fleetExperimentalFeatures,
    })
  );
};

const AGENTLESS_ESS_API_BASE_PATH = '/api/v1/ess';
const AGENTLESS_SERVERLESS_API_BASE_PATH = '/api/v1/serverless';

type AgentlessApiEndpoints = '/deployments' | `/deployments/${string}`;

export const prependAgentlessApiBasePathToEndpoint = (
  agentlessConfig: FleetConfigType['agentless'],
  endpoint: AgentlessApiEndpoints,
  cloudSetup?: Pick<CloudSetup, 'isCloudEnabled' | 'isServerlessEnabled'>
) => {
  const endpointPrefix = cloudSetup?.isServerlessEnabled
    ? AGENTLESS_SERVERLESS_API_BASE_PATH
    : AGENTLESS_ESS_API_BASE_PATH;
  return `${agentlessConfig?.api?.url}${endpointPrefix}${endpoint}`;
};
