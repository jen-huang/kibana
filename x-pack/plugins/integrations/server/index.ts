/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { schema, TypeOf } from '@kbn/config-schema';
import { PluginConfigDescriptor, PluginInitializerContext } from 'src/core/server';
import { IntegrationsPlugin } from './plugin';

export { default as apm } from 'elastic-apm-node';
export { getRegistryUrl, PackageService } from './services';
export {
  IntegrationsSetupContract,
  IntegrationsSetupDeps,
  IntegrationsStartContract,
  ExternalCallback,
} from './plugin';

export const config: PluginConfigDescriptor = {
  exposeToBrowser: {
    epm: true,
    agents: true,
  },
  deprecations: ({ renameFromRoot }) => [
    renameFromRoot('xpack.fleet.registryUrl', 'xpack.integrations.registryUrl'),
    renameFromRoot('xpack.fleet.registryProxyUrl', 'xpack.integrations.registryProxyUrl'),
  ],
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
    registryUrl: schema.maybe(schema.uri({ scheme: ['http', 'https'] })),
    registryProxyUrl: schema.maybe(schema.uri({ scheme: ['http', 'https'] })),
  }),
};

export type IntegrationsConfigType = TypeOf<typeof config.schema>;

export { PackagePolicySchema, NamespaceSchema } from './types/models';
export { PackagePolicyServiceInterface } from './services/package_policy';

export const plugin = (initializerContext: PluginInitializerContext) => {
  return new IntegrationsPlugin(initializerContext);
};
