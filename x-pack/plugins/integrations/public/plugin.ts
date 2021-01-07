/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { AppMountParameters, CoreSetup, Plugin, CoreStart } from 'src/core/public';
import { i18n } from '@kbn/i18n';
import { LicensingPluginSetup } from '../../licensing/public';
import { PLUGIN_ID } from '../common';

export { IntegrationsConfigType } from '../common/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IntegrationsSetup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IntegrationsStart {}

export interface IntegrationsSetupDeps {
  licensing: LicensingPluginSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IntegrationsStartDeps {}

export interface IntegrationsStartServices extends CoreStart, IntegrationsStartDeps {}

export class IntegrationsPlugin
  implements
    Plugin<IntegrationsSetup, IntegrationsStart, IntegrationsSetupDeps, IntegrationsStartDeps> {
  constructor() {}

  public setup(core: CoreSetup, deps: IntegrationsSetupDeps) {
    // // Set up http client
    // setHttpClient(core.http);

    // // Set up license service
    // licenseService.start(deps.licensing.license$);

    // Register main Integrations app
    core.application.register({
      id: PLUGIN_ID,
      title: i18n.translate('xpack.integrations.appTitle', { defaultMessage: 'Integrations' }),
      order: 300,
      euiIconType: 'logoElastic',
      mount: async (params: AppMountParameters) => {
        const [coreStartServices, startDepsServices] = (await core.getStartServices()) as [
          CoreStart,
          IntegrationsStartDeps,
          IntegrationsStart
        ];
        const startServices: IntegrationsStartServices = {
          ...coreStartServices,
          ...startDepsServices,
        };
        const { renderApp, teardownIntegrations } = await import('./applications/integrations');
        const unmount = renderApp(startServices, params);

        return () => {
          unmount();
          teardownIntegrations(startServices);
        };
      },
    });

    return {};
  }

  public async start(core: CoreStart): Promise<IntegrationsStart> {
    return {};
  }

  public stop() {}
}
