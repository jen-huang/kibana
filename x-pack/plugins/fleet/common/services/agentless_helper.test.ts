/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  isAgentlessApiEnabled,
  isAgentlessEnabled,
  isDefaultAgentlessPolicyEnabled,
  prependAgentlessApiBasePathToEndpoint,
} from './agentless_helper';

describe('isAgentlessApiEnabled', () => {
  it('should return false if cloud is not enabled', () => {
    expect(
      isAgentlessApiEnabled({
        cloudSetup: { isCloudEnabled: false } as any,
        fleetConfig: {
          agentless: {
            enabled: true,
          },
        } as any,
      })
    ).toBe(false);
  });

  it('should return false if cloud is enabled but agentless is not', () => {
    expect(
      isAgentlessApiEnabled({
        cloudSetup: { isCloudEnabled: true } as any,
        fleetConfig: {
          agentless: {
            enabled: false,
          },
        } as any,
      })
    ).toBe(false);
  });

  it('should return true if cloud is enabled and agentless is enabled', () => {
    expect(
      isAgentlessApiEnabled({
        cloudSetup: { isCloudEnabled: true } as any,
        fleetConfig: {
          agentless: {
            enabled: true,
          },
        } as any,
      })
    ).toBe(true);
  });
});

describe('isDefaultAgentlessPolicyEnabled', () => {
  it('should return false if serverless is not enabled', () => {
    expect(
      isDefaultAgentlessPolicyEnabled({
        cloudSetup: { isServerlessEnabled: false } as any,
        fleetExperimentalFeatures: { agentless: false } as any,
      })
    ).toBe(false);
  });

  it('should return false if serverless is enabled but agentless is not', () => {
    expect(
      isDefaultAgentlessPolicyEnabled({
        cloudSetup: { isServerlessEnabled: true } as any,
        fleetExperimentalFeatures: { agentless: false } as any,
      })
    ).toBe(false);
  });

  it('should return true if serverless is enabled and agentless is enabled', () => {
    expect(
      isDefaultAgentlessPolicyEnabled({
        cloudSetup: { isServerlessEnabled: true } as any,
        fleetExperimentalFeatures: { agentless: true } as any,
      })
    ).toBe(true);
  });
});

describe('isAgentlessEnabled', () => {
  it('should return false if cloud and serverless are not enabled', () => {
    expect(
      isAgentlessEnabled({
        cloudSetup: { isCloudEnabled: false, isServerlessEnabled: false } as any,
        fleetConfig: { agentless: { enabled: true } } as any,
        fleetExperimentalFeatures: { agentless: true } as any,
      })
    ).toBe(false);
  });

  it('should return false if cloud is enabled but agentless is not', () => {
    expect(
      isAgentlessEnabled({
        cloudSetup: { isCloudEnabled: true, isServerlessEnabled: false } as any,
        fleetConfig: { agentless: { enabled: false } } as any,
        fleetExperimentalFeatures: { agentless: false } as any,
      })
    ).toBe(false);
  });

  it('should return false if serverless is enabled but agentless is not', () => {
    expect(
      isAgentlessEnabled({
        cloudSetup: { isCloudEnabled: false, isServerlessEnabled: true } as any,
        fleetConfig: { agentless: { enabled: false } } as any,
        fleetExperimentalFeatures: { agentless: false } as any,
      })
    ).toBe(false);
  });

  it('should return true if cloud is enabled and agentless is enabled', () => {
    expect(
      isAgentlessEnabled({
        cloudSetup: { isCloudEnabled: true, isServerlessEnabled: false } as any,
        fleetConfig: { agentless: { enabled: true } } as any,
        fleetExperimentalFeatures: { agentless: true } as any,
      })
    ).toBe(true);
  });

  it('should return true if serverless is enabled and agentless is enabled', () => {
    expect(
      isAgentlessEnabled({
        cloudSetup: { isCloudEnabled: false, isServerlessEnabled: true } as any,
        fleetConfig: { agentless: { enabled: true } } as any,
        fleetExperimentalFeatures: { agentless: true } as any,
      })
    ).toBe(true);
  });
});
describe('prependAgentlessApiBasePathToEndpoint', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should prepend the agentless api base path to the endpoint with ess if in cloud', () => {
    const agentlessConfig = {
      api: {
        url: 'https://agentless-api.com',
      },
    } as any;
    const endpoint = '/deployments';

    expect(
      prependAgentlessApiBasePathToEndpoint(agentlessConfig, endpoint, {
        isCloudEnabled: true,
        isServerlessEnabled: false,
      } as any)
    ).toBe('https://agentless-api.com/api/v1/ess/deployments');
  });

  it('should prepend the agentless api base path to the endpoint with serverless if in serverless', () => {
    const agentlessConfig = {
      api: {
        url: 'https://agentless-api.com',
      },
    } as any;
    const endpoint = '/deployments';

    expect(
      prependAgentlessApiBasePathToEndpoint(agentlessConfig, endpoint, {
        isCloudEnabled: false,
        isServerlessEnabled: true,
      } as any)
    ).toBe('https://agentless-api.com/api/v1/serverless/deployments');
  });

  it('should prepend the agentless api base path to the endpoint with a dynamic path', () => {
    const agentlessConfig = {
      api: {
        url: 'https://agentless-api.com',
      },
    } as any;
    const endpoint = '/deployments/123';

    expect(
      prependAgentlessApiBasePathToEndpoint(agentlessConfig, endpoint, {
        isCloudEnabled: true,
        isServerlessEnabled: false,
      } as any)
    ).toBe('https://agentless-api.com/api/v1/ess/deployments/123');
  });
});
