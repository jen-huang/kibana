/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SavedObjectMigrationFn } from 'kibana/server';
import { PackagePolicy, Installation } from '../../types';

export const migratePackagePolicyToV7100: SavedObjectMigrationFn<
  Exclude<PackagePolicy, 'policy_id'> & {
    config_id: string;
  },
  PackagePolicy
> = (packagePolicyDoc) => {
  packagePolicyDoc.attributes.policy_id = packagePolicyDoc.attributes.config_id;
  // @ts-expect-error
  delete packagePolicyDoc.attributes.config_id;

  return packagePolicyDoc;
};

export const migrateInstallationToV7100: SavedObjectMigrationFn<
  Exclude<Installation, 'install_source'>,
  Installation
> = (installationDoc) => {
  installationDoc.attributes.install_source = 'registry';

  return installationDoc;
};
