/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { keyBy } from 'lodash';
import { i18n } from '@kbn/i18n';

import type { PackageInfo, NewPackagePolicy } from '../../../../types';
import { getStreamsForInputType } from '../../../../services';
import type { GroupedPackageInfoInput, GroupedPackagePolicyInput } from '../types';

const getInputGroupTitle = (inputGroup: string, packageName: string): string => {
  switch (inputGroup) {
    case 'logs':
      return i18n.translate('.createPackagePolicy.stepConfigure.collectLogsTitle', {
        defaultMessage: 'Collect {packageName} logs',
        values: {
          packageName,
        },
      });
    case 'metrics':
      return i18n.translate('.createPackagePolicy.stepConfigure.collectMetricsTitle', {
        defaultMessage: 'Collect {packageName} metrics',
        values: {
          packageName,
        },
      });
    default:
      return i18n.translate('.createPackagePolicy.stepConfigure.collectGenericTitle', {
        defaultMessage: 'Collect {packageName} {dataType}',
        values: {
          packageName,
          dataType: inputGroup,
        },
      });
  }
};

export const groupPackageInfoInputs = (packageInfo: PackageInfo): GroupedPackageInfoInput[] => {
  const inputGroupsByType: Record<string, GroupedPackageInfoInput> = {};

  (packageInfo.policy_templates || []).forEach((policyTemplate) => {
    (policyTemplate.inputs || []).forEach((input) => {
      const isUsingInputGroup = !!input.input_group;
      const groupType = isUsingInputGroup ? input.input_group! : input.type;
      const streams = getStreamsForInputType(
        input.type,
        packageInfo,
        policyTemplate.data_streams
      ).map((stream) => ({ ...stream, policy_template: policyTemplate.name }));
      if (inputGroupsByType[groupType]) {
        inputGroupsByType[groupType].streams.push(...streams);
      } else {
        inputGroupsByType[groupType] = isUsingInputGroup
          ? {
              type: groupType,
              title: getInputGroupTitle(groupType, packageInfo.title),
              streams,
            }
          : {
              type: input.type,
              title: input.title,
              streams,
            };
      }
    });
  });

  return Object.values(inputGroupsByType);
};

export const groupPackagePolicyInputs = (
  groupedInputs: ReturnType<typeof groupPackageInfoInputs>,
  packagePolicy: NewPackagePolicy
): GroupedPackagePolicyInput[] => {
  const groupedInputsByType = keyBy(groupedInputs, 'type');
  const groupedInputTypes = Object.keys(groupedInputsByType);
  const policyInputsByPolicyTemplateAndType = keyBy(
    packagePolicy.inputs,
    (input) => `${input.policy_template}-${input.type}`
  );
  const policyInputGroups: GroupedPackagePolicyInput[] = [];

  if (packagePolicy.inputs.every((input) => groupedInputTypes.includes(input.type))) {
    return packagePolicy.inputs;
  }

  groupedInputTypes.forEach((inputType) => {
    const groupedInput = groupedInputsByType[inputType];
    const streams: GroupedPackagePolicyInput['streams'] = [];
    groupedInput.streams.forEach((stream) => {
      const policyInput =
        policyInputsByPolicyTemplateAndType[`${stream.policy_template}-${stream.input}`];
      const policyStreams = policyInput?.streams || [];
      const policyStreamForDataset = policyStreams.find(
        (policyStream) => stream.data_stream.dataset === policyStream.data_stream.dataset
      );
      if (policyStreamForDataset) {
        streams.push(policyStreamForDataset);
      }
    });
    policyInputGroups.push({
      type: inputType,
      enabled: streams.some((stream) => stream.enabled),
      streams,
    });
  });

  return policyInputGroups;
};
