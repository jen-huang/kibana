/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type {
  NewPackagePolicyInput,
  RegistryStream,
  RegistryInput,
  RegistryInputKeys,
} from '../../../types';

export type CreatePackagePolicyFrom = 'package' | 'package-edit' | 'policy' | 'edit';
export type PackagePolicyFormState = 'VALID' | 'INVALID' | 'CONFIRM' | 'LOADING' | 'SUBMITTED';

export type GroupedPackageInfoInput = Pick<
  RegistryInput,
  RegistryInputKeys.vars | RegistryInputKeys.type | RegistryInputKeys.title
> & {
  streams: Array<RegistryStream & { policy_template: string; data_stream: { dataset: string } }>;
};

export type GroupedPackagePolicyInput = NewPackagePolicyInput;
