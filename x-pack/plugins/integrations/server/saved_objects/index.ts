/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SavedObjectsServiceSetup, SavedObjectsType } from 'kibana/server';
import { migratePackagePolicyToV7110 } from '../../../security_solution/common';
import {
  PACKAGE_POLICY_SAVED_OBJECT_TYPE,
  PACKAGES_SAVED_OBJECT_TYPE,
  ASSETS_SAVED_OBJECT_TYPE,
} from '../constants';
import { migratePackagePolicyToV7100 } from './migrations/to_v7_10_0';

/*
 * Saved object types and mappings
 *
 * Please update typings in `/common/types` as well as
 * schemas in `/server/types` if mappings are updated.
 */
const getSavedObjectTypes = (): { [key: string]: SavedObjectsType } => ({
  [PACKAGE_POLICY_SAVED_OBJECT_TYPE]: {
    name: PACKAGE_POLICY_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false,
    },
    mappings: {
      properties: {
        name: { type: 'keyword' },
        description: { type: 'text' },
        namespace: { type: 'keyword' },
        enabled: { type: 'boolean' },
        policy_id: { type: 'keyword' },
        output_id: { type: 'keyword' },
        package: {
          properties: {
            name: { type: 'keyword' },
            title: { type: 'keyword' },
            version: { type: 'keyword' },
          },
        },
        inputs: {
          type: 'nested',
          enabled: false,
          properties: {
            type: { type: 'keyword' },
            enabled: { type: 'boolean' },
            vars: { type: 'flattened' },
            config: { type: 'flattened' },
            compiled_input: { type: 'flattened' },
            streams: {
              type: 'nested',
              properties: {
                id: { type: 'keyword' },
                enabled: { type: 'boolean' },
                data_stream: {
                  properties: {
                    dataset: { type: 'keyword' },
                    type: { type: 'keyword' },
                  },
                },
                vars: { type: 'flattened' },
                config: { type: 'flattened' },
                compiled_stream: { type: 'flattened' },
              },
            },
          },
        },
        revision: { type: 'integer' },
        updated_at: { type: 'date' },
        updated_by: { type: 'keyword' },
        created_at: { type: 'date' },
        created_by: { type: 'keyword' },
      },
    },
    migrations: {
      '7.10.0': migratePackagePolicyToV7100,
      '7.11.0': migratePackagePolicyToV7110,
    },
  },
  [PACKAGES_SAVED_OBJECT_TYPE]: {
    name: PACKAGES_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false,
    },
    mappings: {
      properties: {
        name: { type: 'keyword' },
        version: { type: 'keyword' },
        internal: { type: 'boolean' },
        removable: { type: 'boolean' },
        es_index_patterns: {
          enabled: false,
          type: 'object',
        },
        installed_es: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
          },
        },
        installed_kibana: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
          },
        },
        package_assets: {
          type: 'nested',
          properties: {
            id: { type: 'keyword' },
            type: { type: 'keyword' },
          },
        },
        install_started_at: { type: 'date' },
        install_version: { type: 'keyword' },
        install_status: { type: 'keyword' },
        install_source: { type: 'keyword' },
      },
    },
  },
  [ASSETS_SAVED_OBJECT_TYPE]: {
    name: ASSETS_SAVED_OBJECT_TYPE,
    hidden: false,
    namespaceType: 'agnostic',
    management: {
      importableAndExportable: false,
    },
    mappings: {
      properties: {
        package_name: { type: 'keyword' },
        package_version: { type: 'keyword' },
        install_source: { type: 'keyword' },
        asset_path: { type: 'keyword' },
        media_type: { type: 'keyword' },
        data_utf8: { type: 'text', index: false },
        data_base64: { type: 'binary' },
      },
    },
  },
});

export function registerSavedObjects(savedObjects: SavedObjectsServiceSetup) {
  const savedObjectTypes = getSavedObjectTypes();
  Object.values(savedObjectTypes).forEach((type) => {
    savedObjects.registerType(type);
  });
}
