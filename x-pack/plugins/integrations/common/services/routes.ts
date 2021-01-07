/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import {
  EPM_API_ROOT,
  EPM_API_ROUTES,
  PACKAGE_POLICY_API_ROUTES,
  DATA_STREAM_API_ROUTES,
} from '../constants';

export const epmRouteService = {
  getCategoriesPath: () => {
    return EPM_API_ROUTES.CATEGORIES_PATTERN;
  },

  getListPath: () => {
    return EPM_API_ROUTES.LIST_PATTERN;
  },

  getListLimitedPath: () => {
    return EPM_API_ROUTES.LIMITED_LIST_PATTERN;
  },

  getInfoPath: (pkgkey: string) => {
    return EPM_API_ROUTES.INFO_PATTERN.replace('{pkgkey}', pkgkey);
  },

  getFilePath: (filePath: string) => {
    return `${EPM_API_ROOT}${filePath.replace('/package', '/packages')}`;
  },

  getInstallPath: (pkgkey: string) => {
    return EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN.replace('{pkgkey}', pkgkey).replace(
      /\/$/,
      ''
    ); // trim trailing slash
  },

  getBulkInstallPath: () => {
    return EPM_API_ROUTES.BULK_INSTALL_PATTERN;
  },

  getRemovePath: (pkgkey: string) => {
    return EPM_API_ROUTES.DELETE_PATTERN.replace('{pkgkey}', pkgkey).replace(/\/$/, ''); // trim trailing slash
  },
};

export const packagePolicyRouteService = {
  getListPath: () => {
    return PACKAGE_POLICY_API_ROUTES.LIST_PATTERN;
  },

  getInfoPath: (packagePolicyId: string) => {
    return PACKAGE_POLICY_API_ROUTES.INFO_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },

  getCreatePath: () => {
    return PACKAGE_POLICY_API_ROUTES.CREATE_PATTERN;
  },

  getUpdatePath: (packagePolicyId: string) => {
    return PACKAGE_POLICY_API_ROUTES.UPDATE_PATTERN.replace('{packagePolicyId}', packagePolicyId);
  },

  getDeletePath: () => {
    return PACKAGE_POLICY_API_ROUTES.DELETE_PATTERN;
  },
};

export const dataStreamRouteService = {
  getListPath: () => {
    return DATA_STREAM_API_ROUTES.LIST_PATTERN;
  },
};
