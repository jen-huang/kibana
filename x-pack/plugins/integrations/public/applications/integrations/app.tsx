/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React, { memo } from 'react';
import { EuiErrorBoundary } from '@elastic/eui';
import { AppMountParameters } from 'src/core/public';
import { Router, Redirect, Route, Switch } from 'react-router-dom';
import useObservable from 'react-use/lib/useObservable';
import { PackageInstallProvider } from './sections/epm/hooks';
import { PAGE_ROUTING_PATHS } from './constants';
import { DefaultLayout } from './layouts';
import { EPMApp } from './sections/epm';
import { DataStreamApp } from './sections/data_stream';
import { IntegrationsStartServices } from '../../plugin';
import { KibanaContextProvider } from '../../../../../../src/plugins/kibana_react/public';
import { EuiThemeProvider } from '../../../../xpack_legacy/common';

/**
 * Integrations Application context all the way down to the Router, but with no permissions or setup checks
 * and no routes defined
 */
export const IntegrationsAppContext: React.FC<{
  history: AppMountParameters['history'];
  startServices: IntegrationsStartServices;
}> = memo(({ children, history, startServices }) => {
  const isDarkMode = useObservable<boolean>(startServices.uiSettings.get$('theme:darkMode'));

  return (
    <startServices.i18n.Context>
      <KibanaContextProvider services={{ ...startServices }}>
        <EuiErrorBoundary>
          <EuiThemeProvider darkMode={isDarkMode}>
            <Router history={history}>
              <PackageInstallProvider notifications={startServices.notifications}>
                {children}
              </PackageInstallProvider>
            </Router>
          </EuiThemeProvider>
        </EuiErrorBoundary>
      </KibanaContextProvider>
    </startServices.i18n.Context>
  );
});

export const AppRoutes = memo(() => {
  return (
    <Switch>
      <Route path={PAGE_ROUTING_PATHS.integrations}>
        <DefaultLayout section="epm">
          hello
          {/* <EPMApp /> */}
        </DefaultLayout>
      </Route>
      <Route path={PAGE_ROUTING_PATHS.data_streams}>
        <DefaultLayout section="data_stream">
          hello
          {/* <DataStreamApp /> */}
        </DefaultLayout>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
});
