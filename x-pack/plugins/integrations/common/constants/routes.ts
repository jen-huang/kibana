/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

// Base API paths
export const API_ROOT = `/api/integrations`;
export const EPM_API_ROOT = `${API_ROOT}/packages`;
export const DATA_STREAM_API_ROOT = `${API_ROOT}/data_streams`;
export const PACKAGE_POLICY_API_ROOT = `${API_ROOT}/package_policies`;

// EPM API routes
const EPM_PACKAGES_MANY = `${EPM_API_ROOT}`;
const EPM_PACKAGES_BULK = `${EPM_PACKAGES_MANY}/_bulk`;
const EPM_PACKAGES_ONE = `${EPM_PACKAGES_MANY}/{pkgkey}`;
const EPM_PACKAGES_FILE = `${EPM_PACKAGES_MANY}/{pkgName}/{pkgVersion}`;
export const EPM_API_ROUTES = {
  BULK_INSTALL_PATTERN: EPM_PACKAGES_BULK,
  LIST_PATTERN: EPM_PACKAGES_MANY,
  LIMITED_LIST_PATTERN: `${EPM_PACKAGES_MANY}/limited`,
  INFO_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_FROM_REGISTRY_PATTERN: EPM_PACKAGES_ONE,
  INSTALL_BY_UPLOAD_PATTERN: EPM_PACKAGES_MANY,
  DELETE_PATTERN: EPM_PACKAGES_ONE,
  FILEPATH_PATTERN: `${EPM_PACKAGES_FILE}/{filePath*}`,
  CATEGORIES_PATTERN: `${EPM_API_ROOT}/categories`,
};

// Data stream API routes
export const DATA_STREAM_API_ROUTES = {
  LIST_PATTERN: `${DATA_STREAM_API_ROOT}`,
};

// Package policy API routes
export const PACKAGE_POLICY_API_ROUTES = {
  LIST_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  INFO_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  CREATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}`,
  UPDATE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/{packagePolicyId}`,
  DELETE_PATTERN: `${PACKAGE_POLICY_API_ROOT}/delete`,
};
