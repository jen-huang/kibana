/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { memo, useMemo } from 'react';
import { keyBy } from 'lodash';
import {
  EuiHorizontalRule,
  EuiFlexGroup,
  EuiFlexItem,
  EuiEmptyPrompt,
  EuiText,
} from '@elastic/eui';
import { FormattedMessage } from '@kbn/i18n/react';

import type { NewPackagePolicy } from '../../../types';
import { Loading } from '../../../components';

import type { PackagePolicyValidationResults } from './services';
import type { GroupedPackageInfoInput, GroupedPackagePolicyInput } from './types';
import { PackagePolicyInputPanel } from './components';

export const StepConfigurePackagePolicy: React.FunctionComponent<{
  groupedPackageInfoInputs: GroupedPackageInfoInput[];
  groupedPackagePolicy: NewPackagePolicy;
  updateGroupedPackagePolicy: (fields: Partial<NewPackagePolicy>) => void;
  validationResults: PackagePolicyValidationResults;
  submitAttempted: boolean;
}> = memo(
  ({
    groupedPackageInfoInputs,
    groupedPackagePolicy,
    updateGroupedPackagePolicy,
    validationResults,
    submitAttempted,
  }) => {
    const groupedPackagePolicyInputsByType = useMemo(
      () => keyBy(groupedPackagePolicy.inputs, 'type'),
      [groupedPackagePolicy.inputs]
    );
    console.log('groupedPackageInfoInputs', groupedPackageInfoInputs);
    console.log('groupedPackagePolicyInputsByType', groupedPackagePolicyInputsByType);
    const renderConfigureInputs = () =>
      groupedPackageInfoInputs.length ? (
        <>
          <EuiHorizontalRule margin="m" />
          <EuiFlexGroup direction="column" gutterSize="none">
            {groupedPackageInfoInputs.map((inputGroup) => {
              const packagePolicyInput = groupedPackagePolicyInputsByType[inputGroup.type];
              return packagePolicyInput ? (
                <EuiFlexItem key={inputGroup.type}>
                  <PackagePolicyInputPanel
                    packageInput={inputGroup}
                    packageInputStreams={inputGroup.streams}
                    packagePolicyInput={packagePolicyInput}
                    updatePackagePolicyInput={(
                      updatedInput: Partial<GroupedPackagePolicyInput>
                    ) => {
                      const indexOfUpdatedInput = groupedPackagePolicy.inputs.findIndex(
                        (input) => input.type === inputGroup.type
                      );
                      const newInputs = [...groupedPackagePolicy.inputs];
                      newInputs[indexOfUpdatedInput] = {
                        ...newInputs[indexOfUpdatedInput],
                        ...updatedInput,
                      };
                      updateGroupedPackagePolicy({
                        inputs: newInputs,
                      });
                    }}
                    inputValidationResults={validationResults!.inputs![packagePolicyInput.type]}
                    forceShowErrors={submitAttempted}
                  />
                  <EuiHorizontalRule margin="m" />
                </EuiFlexItem>
              ) : null;
            })}
          </EuiFlexGroup>
        </>
      ) : (
        <EuiEmptyPrompt
          iconType="checkInCircleFilled"
          iconColor="secondary"
          body={
            <EuiText>
              <p>
                <FormattedMessage
                  id="xpack.fleet.createPackagePolicy.stepConfigure.noPolicyOptionsMessage"
                  defaultMessage="Nothing to configure"
                />
              </p>
            </EuiText>
          }
        />
      );

    return validationResults ? renderConfigureInputs() : <Loading />;
  }
);
