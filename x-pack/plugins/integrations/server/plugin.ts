/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { Observable } from 'rxjs';
import {
  CoreSetup,
  CoreStart,
  Logger,
  Plugin,
  PluginInitializerContext,
  SavedObjectsServiceStart,
  HttpServiceSetup,
  SavedObjectsClientContract,
  RequestHandlerContext,
  KibanaRequest,
} from 'kibana/server';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';
import { DEFAULT_APP_CATEGORIES } from '../../../../src/core/server';
import { PluginSetupContract as FeaturesPluginSetup } from '../../features/server';
import {
  PLUGIN_ID,
  PACKAGE_POLICY_SAVED_OBJECT_TYPE,
  PACKAGES_SAVED_OBJECT_TYPE,
} from './constants';
import { registerSavedObjects } from './saved_objects';
import { registerEPMRoutes, registerPackagePolicyRoutes, registerDataStreamRoutes } from './routes';
import {
  EsAssetReference,
  IntegrationsConfigType,
  NewPackagePolicy,
  UpdatePackagePolicy,
} from '../common';
import { appContextService, packagePolicyService, PackageService } from './services';
import { getInstallation } from './services/epm/packages';

export interface IntegrationsSetupDeps {
  features?: FeaturesPluginSetup;
  usageCollection?: UsageCollectionSetup;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IntegrationsStartDeps {}

export interface IntegrationsAppContext {
  config$?: Observable<IntegrationsConfigType>;
  savedObjects: SavedObjectsServiceStart;
  isProductionMode: PluginInitializerContext['env']['mode']['prod'];
  kibanaVersion: PluginInitializerContext['env']['packageInfo']['version'];
  kibanaBranch: PluginInitializerContext['env']['packageInfo']['branch'];
  logger?: Logger;
  httpSetup?: HttpServiceSetup;
}

export type IntegrationsSetupContract = void;

const allSavedObjectTypes = [PACKAGE_POLICY_SAVED_OBJECT_TYPE, PACKAGES_SAVED_OBJECT_TYPE];

/**
 * Callbacks supported by the Fleet plugin
 */
export type ExternalCallback =
  | [
      'packagePolicyCreate',
      (
        newPackagePolicy: NewPackagePolicy,
        context: RequestHandlerContext,
        request: KibanaRequest
      ) => Promise<NewPackagePolicy>
    ]
  | [
      'packagePolicyUpdate',
      (
        newPackagePolicy: UpdatePackagePolicy,
        context: RequestHandlerContext,
        request: KibanaRequest
      ) => Promise<UpdatePackagePolicy>
    ];

export type ExternalCallbacksStorage = Map<ExternalCallback[0], Set<ExternalCallback[1]>>;

/**
 * Describes public Fleet plugin contract returned at the `startup` stage.
 */
export interface IntegrationsStartContract {
  packageService: PackageService;
  /**
   * Services for Fleet's package policies
   */
  packagePolicyService: typeof packagePolicyService;
  /**
   * Register callbacks for inclusion in fleet API processing
   * @param args
   */
  registerExternalCallback: (...args: ExternalCallback) => void;
}

export class IntegrationsPlugin
  implements
    Plugin<
      IntegrationsSetupContract,
      IntegrationsStartContract,
      IntegrationsSetupDeps,
      IntegrationsStartDeps
    > {
  private config$: Observable<IntegrationsConfigType>;
  private logger: Logger | undefined;

  private isProductionMode: IntegrationsAppContext['isProductionMode'];
  private kibanaVersion: IntegrationsAppContext['kibanaVersion'];
  private kibanaBranch: IntegrationsAppContext['kibanaBranch'];
  private httpSetup: HttpServiceSetup | undefined;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.config$ = this.initializerContext.config.create<IntegrationsConfigType>();
    this.isProductionMode = this.initializerContext.env.mode.prod;
    this.kibanaVersion = this.initializerContext.env.packageInfo.version;
    this.kibanaBranch = this.initializerContext.env.packageInfo.branch;
    this.logger = this.initializerContext.logger.get();
  }

  public async setup(core: CoreSetup, deps: IntegrationsSetupDeps) {
    this.httpSetup = core.http;
    registerSavedObjects(core.savedObjects);

    // Register feature
    // TODO: Flesh out privileges
    if (deps.features) {
      deps.features.registerKibanaFeature({
        id: PLUGIN_ID,
        name: 'Integrations',
        category: DEFAULT_APP_CATEGORIES.management,
        app: [PLUGIN_ID, 'kibana'],
        catalogue: ['integrations'],
        privileges: {
          all: {
            api: [`${PLUGIN_ID}-read`, `${PLUGIN_ID}-all`],
            app: [PLUGIN_ID, 'kibana'],
            catalogue: ['integrations'],
            savedObject: {
              all: allSavedObjectTypes,
              read: [],
            },
            ui: ['show', 'read', 'write'],
          },
          read: {
            api: [`${PLUGIN_ID}-read`],
            app: [PLUGIN_ID, 'kibana'],
            catalogue: ['integrations'], // TODO: check if this is actually available to read user
            savedObject: {
              all: [],
              read: allSavedObjectTypes,
            },
            ui: ['show', 'read'],
          },
        },
      });
    }

    const router = core.http.createRouter();

    registerPackagePolicyRoutes(router);
    registerDataStreamRoutes(router);
    registerEPMRoutes(router);
  }

  public async start(
    core: CoreStart,
    plugins: IntegrationsStartDeps
  ): Promise<IntegrationsStartContract> {
    await appContextService.start({
      config$: this.config$,
      savedObjects: core.savedObjects,
      isProductionMode: this.isProductionMode,
      kibanaVersion: this.kibanaVersion,
      kibanaBranch: this.kibanaBranch,
      httpSetup: this.httpSetup,
      logger: this.logger,
    });

    return {
      packageService: {
        getInstalledEsAssetReferences: async (
          savedObjectsClient: SavedObjectsClientContract,
          pkgName: string
        ): Promise<EsAssetReference[]> => {
          const installation = await getInstallation({ savedObjectsClient, pkgName });
          return installation?.installed_es || [];
        },
      },
      packagePolicyService,
      registerExternalCallback: (type: ExternalCallback[0], callback: ExternalCallback[1]) => {
        return appContextService.addExternalCallback(type, callback);
      },
    };
  }

  public async stop() {
    appContextService.stop();
  }
}
