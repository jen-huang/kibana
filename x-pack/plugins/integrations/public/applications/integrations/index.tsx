/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { CoreStart, AppMountParameters } from 'src/core/public';
import { IntegrationsStartServices } from '../../plugin';
import { AppRoutes, IntegrationsAppContext } from './app';

export interface ProtectedRouteProps extends RouteProps {
  isAllowed?: boolean;
  restrictedPath?: string;
}

export const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = ({
  isAllowed = false,
  restrictedPath = '/',
  ...routeProps
}: ProtectedRouteProps) => {
  return isAllowed ? <Route {...routeProps} /> : <Redirect to={{ pathname: restrictedPath }} />;
};

interface IntegrationsAppProps {
  history: AppMountParameters['history'];
  startServices: IntegrationsStartServices;
}

const IntegrationsApp = ({ history, startServices }: IntegrationsAppProps) => {
  return (
    <IntegrationsAppContext history={history} startServices={startServices}>
      <AppRoutes />
    </IntegrationsAppContext>
  );
};

export function renderApp(
  startServices: IntegrationsStartServices,
  { element, history }: AppMountParameters
) {
  ReactDOM.render(<IntegrationsApp history={history} startServices={startServices} />, element);

  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
}

export const teardownIntegrations = (coreStart: CoreStart) => {
  coreStart.chrome.docTitle.reset();
  coreStart.chrome.setBreadcrumbs([]);
};
