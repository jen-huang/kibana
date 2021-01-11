/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
export * from './routes';
export * as AgentStatusKueryHelper from './agent_status';
export { storedPackagePoliciesToAgentInputs } from './package_policies_to_agent_inputs';
export { fullAgentPolicyToYaml } from './full_agent_policy_to_yaml';
export { decodeCloudId } from './decode_cloud_id';
export { isDiffPathProtocol } from './is_diff_path_protocol';
export { LicenseService } from './license';
export { isAgentUpgradeable } from './is_agent_upgradeable';

export { isValidNamespace } from '../../../integrations/common';
