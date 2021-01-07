/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export type StaticPage =
  | 'base'
  | 'integrations'
  | 'integrations_all'
  | 'integrations_installed'
  | 'data_streams';

export type DynamicPage =
  | 'integration_details'
  | 'integration_policy_edit'
  | 'add_integration_to_policy';

export type Page = StaticPage | DynamicPage;

export interface DynamicPagePathValues {
  [key: string]: string;
}

export const BASE_PATH = '/app/integrations';

// If routing paths are changed here, please also check to see if
// `pagePathGetters()`, below, needs any modifications
export const PAGE_ROUTING_PATHS = {
  integrations: '/:tabId?',
  integrations_all: '/',
  integrations_installed: '/installed',
  integration_details: '/detail/:pkgkey/:panel?',
  integration_policy_edit: '/edit-integration/:packagePolicyId',
  add_integration_to_policy: '/:pkgkey/add-integration',
  data_streams: '/data-streams',
};

export const pagePathGetters: {
  [key in StaticPage]: () => string;
} &
  {
    [key in DynamicPage]: (values: DynamicPagePathValues) => string;
  } = {
  base: () => '/',
  integrations: () => '/',
  integrations_all: () => '/',
  integrations_installed: () => '/installed',
  integration_details: ({ pkgkey, panel }) => `/detail/${pkgkey}${panel ? `/${panel}` : ''}`,
  integration_policy_edit: ({ packagePolicyId }) => `/edit-integration/${packagePolicyId}`,
  add_integration_to_policy: ({ pkgkey }) => `/${pkgkey}/add-integration`,
  data_streams: () => '/data-streams',
};
