/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { SavedObjectsServiceStart, HttpServiceSetup, Logger, KibanaRequest } from 'src/core/server';
import packageJSON from '../../../../../package.json';
import { IntegrationsConfigType } from '../../common';
import { ExternalCallback, ExternalCallbacksStorage, IntegrationsAppContext } from '../plugin';

class AppContextService {
  private config$?: Observable<IntegrationsConfigType>;
  private configSubject$?: BehaviorSubject<IntegrationsConfigType>;
  private savedObjects: SavedObjectsServiceStart | undefined;
  private isProductionMode: IntegrationsAppContext['isProductionMode'] = false;
  private kibanaVersion: IntegrationsAppContext['kibanaVersion'] = packageJSON.version;
  private kibanaBranch: IntegrationsAppContext['kibanaBranch'] = packageJSON.branch;
  private logger: Logger | undefined;
  private httpSetup?: HttpServiceSetup;
  private externalCallbacks: ExternalCallbacksStorage = new Map();

  public async start(appContext: IntegrationsAppContext) {
    this.savedObjects = appContext.savedObjects;
    this.isProductionMode = appContext.isProductionMode;
    this.logger = appContext.logger;
    this.kibanaVersion = appContext.kibanaVersion;
    this.kibanaBranch = appContext.kibanaBranch;
    this.httpSetup = appContext.httpSetup;

    if (appContext.config$) {
      this.config$ = appContext.config$;
      const initialValue = await this.config$.pipe(first()).toPromise();
      this.configSubject$ = new BehaviorSubject(initialValue);
      this.config$.subscribe(this.configSubject$);
    }
  }

  public stop() {
    this.externalCallbacks.clear();
  }

  public getLogger() {
    if (!this.logger) {
      throw new Error('Logger not set.');
    }
    return this.logger;
  }

  public getConfig() {
    return this.configSubject$?.value;
  }

  public getConfig$() {
    return this.config$;
  }

  public getSavedObjects() {
    if (!this.savedObjects) {
      throw new Error('Saved objects start service not set.');
    }
    return this.savedObjects;
  }

  public getInternalUserSOClient(request: KibanaRequest) {
    // soClient as kibana internal users, be carefull on how you use it, security is not enabled
    return appContextService.getSavedObjects().getScopedClient(request, {
      excludedWrappers: ['security'],
    });
  }

  public getIsProductionMode() {
    return this.isProductionMode;
  }

  public getHttpSetup() {
    if (!this.httpSetup) {
      throw new Error('HttpServiceSetup not set.');
    }
    return this.httpSetup;
  }

  public getKibanaVersion() {
    return this.kibanaVersion;
  }

  public getKibanaBranch() {
    return this.kibanaBranch;
  }

  public addExternalCallback(type: ExternalCallback[0], callback: ExternalCallback[1]) {
    if (!this.externalCallbacks.has(type)) {
      this.externalCallbacks.set(type, new Set());
    }
    this.externalCallbacks.get(type)!.add(callback);
  }

  public getExternalCallbacks(type: ExternalCallback[0]) {
    if (this.externalCallbacks) {
      return this.externalCallbacks.get(type);
    }
  }
}

export const appContextService = new AppContextService();
