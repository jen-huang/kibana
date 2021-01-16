/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { FLEET_ROUTING_PATHS } from '../../../../constants';
import { Loading, Error } from '../../components';
import { useConfig, useFleetStatus, useCapabilities } from '../../../../hooks';
import { useBreadcrumbs } from '../../hooks';
import { AgentListPage } from './agent_list_page';
import { SetupPage } from './setup_page';
import { AgentDetailsPage } from './agent_details_page';
import { NoAccessPage } from './error_pages/no_access';
import { WithoutHeaderLayout } from '../../layouts';

export const FleetApp: React.FunctionComponent = () => {
  useBreadcrumbs('fleet');
  const { agents } = useConfig();
  const capabilities = useCapabilities();

  const fleetStatus = useFleetStatus();

  if (!agents.enabled) return null;
  if (fleetStatus.isLoading) {
    return <Loading />;
  }

  if (fleetStatus.error) {
    return (
      <WithoutHeaderLayout>
        <Error
          title={
            <FormattedMessage
              id="xpack.fleet.agentsInitializationErrorMessageTitle"
              defaultMessage="Unable to initialize central management for Elastic Agents"
            />
          }
          error={fleetStatus.error}
        />
      </WithoutHeaderLayout>
    );
  }

  if (fleetStatus.isReady === false) {
    return (
      <SetupPage
        missingRequirements={fleetStatus.missingRequirements || []}
        refresh={fleetStatus.refresh}
      />
    );
  }
  if (!capabilities.read) {
    return <NoAccessPage />;
  }

  return (
    <Router>
      <Switch>
        <Route path={FLEET_ROUTING_PATHS.fleet_agent_details}>
          <AgentDetailsPage />
        </Route>
        <Route path={FLEET_ROUTING_PATHS.fleet_agent_list}>
          <AgentListPage />
        </Route>
        <Redirect to={FLEET_ROUTING_PATHS.fleet_agent_list} />
      </Switch>
    </Router>
  );
};
