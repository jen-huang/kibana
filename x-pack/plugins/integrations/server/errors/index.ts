/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/* eslint-disable max-classes-per-file */
export {
  defaultIntegrationsErrorHandler,
  ingestErrorToResponseOptions,
  isLegacyESClientError,
  isESClientError,
} from './handlers';

export class IntegrationsError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = this.constructor.name; // for stack traces
  }
}
export class RegistryError extends IntegrationsError {}
export class RegistryConnectionError extends RegistryError {}
export class RegistryResponseError extends RegistryError {}
export class PackageNotFoundError extends IntegrationsError {}
export class PackageOutdatedError extends IntegrationsError {}
export class PackageUnsupportedMediaTypeError extends IntegrationsError {}
export class PackageInvalidArchiveError extends IntegrationsError {}
export class PackageCacheError extends IntegrationsError {}
export class PackageOperationNotSupportedError extends IntegrationsError {}
export class ConcurrentInstallOperationError extends IntegrationsError {}
