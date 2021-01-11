/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { SavedObjectsClientContract } from 'kibana/server';
import { EsAssetReference } from '../types';

export * from './app_context';
export { ESIndexPatternSavedObjectService } from './es_index_pattern';
export { packagePolicyService } from './package_policy';
export { getRegistryUrl } from './epm/registry/registry_url';
export { agentPolicyService, outputService } from '../../../fleet/server';

/**
 * Service that provides exported function that return information about EPM packages
 */

export interface PackageService {
  getInstalledEsAssetReferences(
    savedObjectsClient: SavedObjectsClientContract,
    pkgName: string
  ): Promise<EsAssetReference[]>;
}
