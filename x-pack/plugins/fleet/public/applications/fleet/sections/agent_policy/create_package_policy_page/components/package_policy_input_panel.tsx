/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState, Fragment, memo, useMemo } from 'react';
import styled from 'styled-components';
import { i18n } from '@kbn/i18n';
import { FormattedMessage } from '@kbn/i18n/react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiSwitch,
  EuiText,
  EuiButtonIcon,
  EuiHorizontalRule,
  EuiSpacer,
} from '@elastic/eui';

import type {
  PackagePolicyInputStream,
  RegistryInput,
  RegistryInputKeys,
  RegistryStream,
} from '../../../../types';
import type { PackagePolicyInputValidationResults } from '../services';
import { hasInvalidButRequiredVar, countValidationErrors } from '../services';
import type { GroupedPackagePolicyInput, GroupedPackageInfoInput } from '../types';

import { PackagePolicyInputConfig } from './package_policy_input_config';
import { PackagePolicyInputStreamConfig } from './package_policy_input_stream';

const ShortenedHorizontalRule = styled(EuiHorizontalRule)`
  &&& {
    width: ${(11 / 12) * 100}%;
    margin-left: auto;
  }
`;

const shouldShowStreamsByDefault = (
  packageInput: Pick<RegistryInput, RegistryInputKeys.vars>,
  packageInputStreams: GroupedPackageInfoInput['streams'],
  packagePolicyInput: GroupedPackagePolicyInput
): boolean => {
  return (
    packagePolicyInput.enabled &&
    (hasInvalidButRequiredVar(packageInput.vars, packagePolicyInput.vars) ||
      Boolean(
        packageInputStreams.find(
          (stream) =>
            stream.enabled &&
            hasInvalidButRequiredVar(
              stream.vars,
              packagePolicyInput.streams.find(
                (pkgStream) =>
                  stream.data_stream.dataset === pkgStream.data_stream.dataset &&
                  (!packagePolicyInput.policy_template ||
                    stream.policy_template === packagePolicyInput.policy_template)
              )?.vars
            )
        )
      ))
  );
};

export const PackagePolicyInputPanel: React.FunctionComponent<{
  packageInput: Pick<
    RegistryInput,
    RegistryInputKeys.vars | RegistryInputKeys.title | RegistryInputKeys.type
  >;
  packageInputStreams: GroupedPackageInfoInput['streams'];
  packagePolicyInput: GroupedPackagePolicyInput;
  updatePackagePolicyInput: (updatedInput: Partial<GroupedPackagePolicyInput>) => void;
  inputValidationResults: PackagePolicyInputValidationResults;
  forceShowErrors?: boolean;
}> = memo(
  ({
    packageInput,
    packageInputStreams,
    packagePolicyInput,
    updatePackagePolicyInput,
    inputValidationResults,
    forceShowErrors,
  }) => {
    // Showing streams toggle state
    const [isShowingStreams, setIsShowingStreams] = useState<boolean>(
      shouldShowStreamsByDefault(packageInput, packageInputStreams, packagePolicyInput)
    );

    // Errors state
    const errorCount = countValidationErrors(inputValidationResults);
    const hasErrors = forceShowErrors && errorCount;

    const hasInputStreams = useMemo(() => packageInputStreams.length > 0, [
      packageInputStreams.length,
    ]);
    const inputStreams = useMemo(
      () =>
        packageInputStreams
          .map((packageInputStream) => {
            return {
              packageInputStream,
              packagePolicyInputStream: packagePolicyInput.streams.find((stream) => {
                return (
                  stream.data_stream.dataset === packageInputStream.data_stream.dataset &&
                  (!packagePolicyInput.policy_template ||
                    packageInputStream.policy_template === packagePolicyInput.policy_template)
                );
              }),
            };
          })
          .filter((stream) => Boolean(stream.packagePolicyInputStream)),
      [packageInputStreams, packagePolicyInput.policy_template, packagePolicyInput.streams]
    );

    return (
      <>
        {/* Header / input-level toggle */}
        <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiSwitch
              label={
                <EuiFlexGroup alignItems="center" gutterSize="s">
                  <EuiFlexItem grow={false}>
                    <EuiText>
                      <h4>{packageInput.title || packageInput.type}</h4>
                    </EuiText>
                  </EuiFlexItem>
                </EuiFlexGroup>
              }
              checked={packagePolicyInput.enabled}
              disabled={packagePolicyInput.keep_enabled}
              onChange={(e) => {
                const enabled = e.target.checked;
                updatePackagePolicyInput({
                  enabled,
                  streams: packagePolicyInput.streams.map((stream) => ({
                    ...stream,
                    enabled,
                  })),
                });
                if (!enabled && isShowingStreams) {
                  setIsShowingStreams(false);
                }
              }}
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s" alignItems="center">
              {hasErrors ? (
                <EuiFlexItem grow={false}>
                  <EuiText color="danger" size="s">
                    <FormattedMessage
                      id="xpack.fleet.createPackagePolicy.stepConfigure.errorCountText"
                      defaultMessage="{count, plural, one {# error} other {# errors}}"
                      values={{ count: errorCount }}
                    />
                  </EuiText>
                </EuiFlexItem>
              ) : null}
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType={isShowingStreams ? 'arrowUp' : 'arrowDown'}
                  onClick={() => setIsShowingStreams(!isShowingStreams)}
                  color={hasErrors ? 'danger' : 'text'}
                  aria-label={
                    isShowingStreams
                      ? i18n.translate(
                          'xpack.fleet.createPackagePolicy.stepConfigure.hideStreamsAriaLabel',
                          {
                            defaultMessage: 'Hide {type} inputs',
                            values: {
                              type: packageInput.type,
                            },
                          }
                        )
                      : i18n.translate(
                          'xpack.fleet.createPackagePolicy.stepConfigure.showStreamsAriaLabel',
                          {
                            defaultMessage: 'Show {type} inputs',
                            values: {
                              type: packageInput.type,
                            },
                          }
                        )
                  }
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
        </EuiFlexGroup>

        {/* Header rule break */}
        {isShowingStreams ? <EuiSpacer size="l" /> : null}

        {/* Input level policy */}
        {isShowingStreams && packageInput.vars && packageInput.vars.length ? (
          <Fragment>
            <PackagePolicyInputConfig
              hasInputStreams={hasInputStreams}
              packageInputVars={packageInput.vars}
              packagePolicyInput={packagePolicyInput}
              updatePackagePolicyInput={updatePackagePolicyInput}
              inputVarsValidationResults={{ vars: inputValidationResults.vars }}
              forceShowErrors={forceShowErrors}
            />
            {hasInputStreams ? <ShortenedHorizontalRule margin="m" /> : <EuiSpacer size="l" />}
          </Fragment>
        ) : null}

        {/* Per-stream policy */}
        {isShowingStreams ? (
          <EuiFlexGroup direction="column">
            {inputStreams.map(({ packageInputStream, packagePolicyInputStream }, index) => (
              <EuiFlexItem key={index}>
                <PackagePolicyInputStreamConfig
                  packageInputStream={packageInputStream}
                  packagePolicyInputStream={packagePolicyInputStream!}
                  updatePackagePolicyInputStream={(
                    updatedStream: Partial<PackagePolicyInputStream>
                  ) => {
                    const indexOfUpdatedStream = packagePolicyInput.streams.findIndex(
                      (stream) =>
                        stream.data_stream.dataset === packageInputStream.data_stream.dataset &&
                        (!packagePolicyInput.policy_template ||
                          packageInputStream.policy_template === packagePolicyInput.policy_template)
                    );
                    const newStreams = [...packagePolicyInput.streams];
                    newStreams[indexOfUpdatedStream] = {
                      ...newStreams[indexOfUpdatedStream],
                      ...updatedStream,
                    };

                    const updatedInput: Partial<GroupedPackagePolicyInput> = {
                      streams: newStreams,
                    };

                    // Update input enabled state if needed
                    if (!packagePolicyInput.enabled && updatedStream.enabled) {
                      updatedInput.enabled = true;
                    } else if (
                      packagePolicyInput.enabled &&
                      !newStreams.find((stream) => stream.enabled)
                    ) {
                      updatedInput.enabled = false;
                    }

                    updatePackagePolicyInput(updatedInput);
                  }}
                  inputStreamValidationResults={
                    inputValidationResults.streams![packagePolicyInputStream!.data_stream!.dataset]
                  }
                  forceShowErrors={forceShowErrors}
                />
                {index !== inputStreams.length - 1 ? (
                  <>
                    <EuiSpacer size="m" />
                    <ShortenedHorizontalRule margin="none" />
                  </>
                ) : null}
              </EuiFlexItem>
            ))}
          </EuiFlexGroup>
        ) : null}
      </>
    );
  }
);
