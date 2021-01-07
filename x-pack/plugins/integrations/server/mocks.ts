/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { loggingSystemMock, savedObjectsServiceMock } from 'src/core/server/mocks';
import { IntegrationsAppContext } from './plugin';
import { PackagePolicyServiceInterface } from './services/package_policy';

export const createAppContextStartContractMock = (): IntegrationsAppContext => {
  return {
    savedObjects: savedObjectsServiceMock.createStartContract(),
    logger: loggingSystemMock.create().get(),
    isProductionMode: true,
    kibanaVersion: '8.0.0',
    kibanaBranch: 'master',
  };
};

export const createPackagePolicyServiceMock = () => {
  return {
    compilePackagePolicyInputs: jest.fn(),
    buildPackagePolicyFromPackage: jest.fn(),
    bulkCreate: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getByIDs: jest.fn(),
    list: jest.fn(),
    update: jest.fn(),
    runExternalCallbacks: jest.fn(),
  } as jest.Mocked<PackagePolicyServiceInterface>;
};
