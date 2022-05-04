/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { ElasticsearchClient, SavedObjectsClientContract, Logger } from '@kbn/core/server';

import { APP_API_ROUTES } from '../../constants';
import type { FleetRequestHandler } from '../../types';
import type { FleetAuthzRouter } from '../security';
import { appContextService } from '../../services';

import { checkConfiguration } from './configuration';
import { checkPackages } from './packages';
import { checkAgents } from './agents';

/**
 * Dev notes:
 *
 *  This could potentially be a long running operation. Should we advise users
 *  to increase timeout (Kibana and ES) settings before running?
 *
 *  How can we verify the usefulness of this health check? Can we get a snapshot of
 *  a "broken" cluster to check report?
 *
 *  This report does not pertain to standalone usage.
 *
 *  Is this useful for Cloud deployments? What other conditions/checks would be
 *  relevant for Cloud?
 */

type CHECK = 'configuration' | 'packages' | 'agents' | 'policies';
type STATUS = 'not_started' | 'running' | 'healthy' | 'problem';

export type IHealthCheck = (options: HealthCheckOptions) => Promise<void>;
export interface HealthCheckOptions {
  soClient: SavedObjectsClientContract;
  esClient: ElasticsearchClient;
  logger: Logger;
  updateReport: (content: string | string[] | Record<string, string>, level?: number) => void;
  updateStatus: (status: STATUS) => void;
}

export const getHealthCheckHandler: FleetRequestHandler<undefined, undefined, undefined> = async (
  context,
  request,
  response
) => {
  // Dependencies
  const logger = appContextService.getLogger();
  const soClient = (await context.fleet).epm.internalSoClient;
  const esClient = (await context.core).elasticsearch.client.asInternalUser;

  // Report content
  const report: string[] = [];

  // Running checks and statuses
  let currentCheck: CHECK = 'configuration';
  const checkStatus: Record<CHECK, STATUS> = {
    configuration: 'not_started',
    packages: 'not_started',
    agents: 'not_started',
    policies: 'not_started',
  };

  // Helper methods
  const updateReport = (content: string | string[] | Record<string, string>, level: number = 1) => {
    const messages: string[] = [];
    if (Array.isArray(content)) {
      messages.push(...content);
    } else if (typeof content === 'object') {
      messages.push(...Object.entries(content).map(([key, value]) => `${key}: ${value}`));
    } else {
      messages.push(content);
    }
    let prefix = '';
    let suffix = '';
    switch (level) {
      case 0:
        prefix = '--- ';
        suffix = ' ---';
        break;
      case 1:
        break;
      default:
        prefix = ' '.repeat((level - 1) * 2);
    }
    messages.forEach((message) => report.push(prefix + message + suffix));
  };

  const updateStatus = (check: CHECK) => {
    return (status: STATUS) => {
      checkStatus[check] = status;
      if (status === 'running') {
        currentCheck = check;
      }
    };
  };

  try {
    // Start
    updateReport(`Starting Fleet health check report`, 0);

    // Check configuration
    updateReport(``);
    await checkConfiguration({
      soClient,
      esClient,
      logger,
      updateReport,
      updateStatus: updateStatus('configuration'),
    });

    updateReport(``);
    updateReport(`---`);

    // Check agents
    updateReport(``);
    await checkAgents({
      soClient,
      esClient,
      logger,
      updateReport,
      updateStatus: updateStatus('agents'),
    });

    updateReport(``);
    updateReport(`---`);

    // Check packages
    updateReport(``);
    await checkPackages({
      soClient,
      esClient,
      logger,
      updateReport,
      updateStatus: updateStatus('packages'),
    });

    updateReport(``);
    updateReport(`---`);

    // Check policies -- not sure if still needed

    // Finish
    updateReport(``);
    updateReport(`Finished Fleet health check report.`, 0);
  } catch (error) {
    // On error, display and log, but still return 200 reponse with report so far
    updateReport(``);
    updateReport(
      `Error finishing health check report while checking ${currentCheck}. 
      Check Kibana logs for more details:`
    );
    updateReport(error.message);
    logger.error(error);
  }

  return response.ok({
    body: report.join('\n'),
    headers: { 'content-type': 'text/plain' },
  });
};

export const registerRoutes = (router: FleetAuthzRouter) => {
  router.get(
    {
      path: APP_API_ROUTES.HEALTH_CHECK_PATTERN,
      validate: {},
      fleetAuthz: {
        fleet: { all: true },
      },
    },
    getHealthCheckHandler
  );
};
