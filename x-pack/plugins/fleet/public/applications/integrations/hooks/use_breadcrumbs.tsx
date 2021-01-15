/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { i18n } from '@kbn/i18n';
import { ChromeBreadcrumb } from 'src/core/public';
import { FLEET_BASE_PATH, Page, DynamicPagePathValues, pagePathGetters } from '../../../constants';
import { useStartServices } from '../../../hooks';

const BASE_BREADCRUMB: ChromeBreadcrumb = {
  href: pagePathGetters.integrations_base()[1],
  text: i18n.translate('xpack.fleet.breadcrumbs.integrationsAppTitle', {
    defaultMessage: 'Fleet',
  }),
};

const breadcrumbGetters: {
  [key in Page]?: (values: DynamicPagePathValues) => ChromeBreadcrumb[];
} = {
  integrations_base: () => [BASE_BREADCRUMB],
  integrations: () => [
    {
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationsPageTitle', {
        defaultMessage: 'Integrations',
      }),
    },
  ],
  integrations_all: () => [
    {
      href: pagePathGetters.integrations()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationsPageTitle', {
        defaultMessage: 'Integrations',
      }),
    },
    {
      text: i18n.translate('xpack.fleet.breadcrumbs.allIntegrationsPageTitle', {
        defaultMessage: 'All',
      }),
    },
  ],
  integrations_installed: () => [
    {
      href: pagePathGetters.integrations()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationsPageTitle', {
        defaultMessage: 'Integrations',
      }),
    },
    {
      text: i18n.translate('xpack.fleet.breadcrumbs.installedIntegrationsPageTitle', {
        defaultMessage: 'Installed',
      }),
    },
  ],
  integration_details: ({ pkgTitle }) => [
    {
      href: pagePathGetters.integrations()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationsPageTitle', {
        defaultMessage: 'Integrations',
      }),
    },
    { text: pkgTitle },
  ],
  integration_policy_edit: ({ pkgTitle, pkgkey, policyName }) => [
    {
      href: pagePathGetters.integrations()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationPageTitle', {
        defaultMessage: 'Integration',
      }),
    },
    {
      href: pagePathGetters.integration_details({ pkgkey, panel: 'policies' })[1],
      text: pkgTitle,
    },
    { text: policyName },
  ],
  add_integration_to_policy: ({ pkgTitle, pkgkey }) => [
    BASE_BREADCRUMB,
    {
      href: pagePathGetters.integrations()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.integrationsPageTitle', {
        defaultMessage: 'Integrations',
      }),
    },
    {
      href: pagePathGetters.integration_details({ pkgkey })[1],
      text: pkgTitle,
    },
    {
      text: i18n.translate('xpack.fleet.breadcrumbs.addPackagePolicyPageTitle', {
        defaultMessage: 'Add integration',
      }),
    },
  ],
  edit_integration: ({ policyName, policyId }) => [
    BASE_BREADCRUMB,
    {
      href: pagePathGetters.policies()[1],
      text: i18n.translate('xpack.fleet.breadcrumbs.policiesPageTitle', {
        defaultMessage: 'Policies',
      }),
    },
    {
      href: pagePathGetters.policy_details({ policyId })[1],
      text: policyName,
    },
    {
      text: i18n.translate('xpack.fleet.breadcrumbs.editPackagePolicyPageTitle', {
        defaultMessage: 'Edit integration',
      }),
    },
  ],
};

export function useBreadcrumbs(page: Page, values: DynamicPagePathValues = {}) {
  const { chrome, http } = useStartServices();
  const breadcrumbs: ChromeBreadcrumb[] =
    breadcrumbGetters[page]?.(values).map((breadcrumb) => ({
      ...breadcrumb,
      href: breadcrumb.href
        ? http.basePath.prepend(`${FLEET_BASE_PATH}#${breadcrumb.href}`)
        : undefined,
    })) || [];
  const docTitle: string[] = [...breadcrumbs]
    .reverse()
    .map((breadcrumb) => breadcrumb.text as string);
  chrome.docTitle.change(docTitle);
  chrome.setBreadcrumbs(breadcrumbs);
}
