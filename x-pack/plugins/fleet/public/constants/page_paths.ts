/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

export type StaticPage =
  | 'fleet_base'
  | 'integrations_base'
  | 'integrations'
  | 'integrations_all'
  | 'integrations_installed'
  | 'policies'
  | 'policies_list'
  | 'fleet'
  | 'fleet_enrollment_tokens'
  | 'data_streams';

export type DynamicPage =
  | 'integration_details'
  | 'integration_details_overview'
  | 'integration_details_policies'
  | 'integration_details_settings'
  | 'integration_details_custom'
  | 'integration_policy_edit'
  | 'policy_details'
  | 'add_integration_from_policy'
  | 'add_integration_to_policy'
  | 'edit_integration'
  | 'fleet_agent_list'
  | 'fleet_agent_details';

export type Page = StaticPage | DynamicPage;

export interface DynamicPagePathValues {
  [key: string]: string;
}

export const FLEET_BASE_PATH = '/app/fleet';
export const INTEGRATIONS_BASE_PATH = '/app/integrations';

// If routing paths are changed here, please also check to see if
// `pagePathGetters()`, below, needs any modifications
export const FLEET_ROUTING_PATHS = {
  policies: '/policies',
  policies_list: '/policies',
  policy_details: '/policies/:policyId/:tabId?',
  policy_details_settings: '/policies/:policyId/settings',
  add_integration_from_policy: '/policies/:policyId/add-integration',
  edit_integration: '/policies/:policyId/edit-integration/:packagePolicyId',
  fleet: '/agents',
  fleet_agent_list: '/agents',
  fleet_agent_details: '/agents/:agentId/:tabId?',
  fleet_agent_details_logs: '/agents/:agentId/logs',
  fleet_enrollment_tokens: '/enrollment-tokens',
};

// If routing paths are changed here, please also check to see if
// `pagePathGetters()`, below, needs any modifications
export const INTEGRATION_ROUTING_PATHS = {
  integrations: '/:tabId',
  integrations_all: '/browse',
  integrations_installed: '/manage',
  integration_details: '/detail/:pkgkey/:panel?',
  integration_details_overview: '/detail/:pkgkey/overview',
  integration_details_policies: '/detail/:pkgkey/policies',
  integration_details_settings: '/detail/:pkgkey/settings',
  integration_details_custom: '/detail/:pkgkey/custom',
  integration_policy_edit: '/edit/:packagePolicyId',
  add_integration_to_policy: '/:pkgkey/add-integration',
  data_streams: '/data-streams',
};

export const pagePathGetters: {
  [key in StaticPage]: () => [string, string];
} &
  {
    [key in DynamicPage]: (values: DynamicPagePathValues) => [string, string];
  } = {
  fleet_base: () => [FLEET_BASE_PATH, '/'],
  integrations_base: () => [INTEGRATIONS_BASE_PATH, '/'],
  integrations: () => [INTEGRATIONS_BASE_PATH, '/'],
  integrations_all: () => [INTEGRATIONS_BASE_PATH, '/browse'],
  integrations_installed: () => [INTEGRATIONS_BASE_PATH, '/manage'],
  integration_details: ({ pkgkey }) => [INTEGRATIONS_BASE_PATH, `/detail/${pkgkey}`],
  integration_details_overview: ({ pkgkey }) => [
    INTEGRATIONS_BASE_PATH,
    `/detail/${pkgkey}/overview`,
  ],
  integration_details_policies: ({ pkgkey }) => [
    INTEGRATIONS_BASE_PATH,
    `/detail/${pkgkey}/policies`,
  ],
  integration_details_settings: ({ pkgkey }) => [
    INTEGRATIONS_BASE_PATH,
    `/detail/${pkgkey}/settings`,
  ],
  integration_details_custom: ({ pkgkey }) => [INTEGRATIONS_BASE_PATH, `/detail/${pkgkey}/custom`],
  integration_policy_edit: ({ packagePolicyId }) => [
    INTEGRATIONS_BASE_PATH,
    `/edit/${packagePolicyId}`,
  ],
  policies: () => [FLEET_BASE_PATH, '/policies'],
  policies_list: () => [FLEET_BASE_PATH, '/policies'],
  policy_details: ({ policyId, tabId }) => [
    FLEET_BASE_PATH,
    `/policies/${policyId}${tabId ? `/${tabId}` : ''}`,
  ],
  add_integration_from_policy: ({ policyId }) => [
    FLEET_BASE_PATH,
    `/policies/${policyId}/add-integration`,
  ],
  add_integration_to_policy: ({ pkgkey }) => [INTEGRATIONS_BASE_PATH, `/${pkgkey}/add-integration`],
  edit_integration: ({ policyId, packagePolicyId }) => [
    FLEET_BASE_PATH,
    `/policies/${policyId}/edit-integration/${packagePolicyId}`,
  ],
  fleet: () => [FLEET_BASE_PATH, '/agents'],
  fleet_agent_list: ({ kuery }) => [FLEET_BASE_PATH, `/agents${kuery ? `?kuery=${kuery}` : ''}`],
  fleet_agent_details: ({ agentId, tabId, logQuery }) => [
    FLEET_BASE_PATH,
    `/agents/${agentId}${tabId ? `/${tabId}` : ''}${logQuery ? `?_q=${logQuery}` : ''}`,
  ],
  fleet_enrollment_tokens: () => [FLEET_BASE_PATH, '/enrollment-tokens'],
  data_streams: () => [INTEGRATIONS_BASE_PATH, '/data-streams'],
};
