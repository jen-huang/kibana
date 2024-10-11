/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Redirect } from 'react-router-dom';
import { Router, Routes, Route } from '@kbn/shared-ux-router';

import { i18n } from '@kbn/i18n';
import { StartServicesAccessor } from '@kbn/core/public';
import { KibanaRenderContextProvider } from '@kbn/react-kibana-context-render';
import { KibanaContextProvider } from '@kbn/kibana-react-plugin/public';
import { ManagementAppMountParams } from '@kbn/management-plugin/public';
import { NoDataViewsPromptKibanaProvider } from '@kbn/shared-ux-prompt-no-data-views';
import {
  IndexPatternTableWithRouter,
  EditIndexPatternContainer,
  CreateEditFieldContainer,
} from '../components';
import {
  IndexPatternManagementStartDependencies,
  IndexPatternManagementStart,
  IndexPatternManagementSetupDependencies,
} from '../plugin';
import { IndexPatternManagmentContext } from '../types';
import { DataViewMgmtService } from './data_view_management_service';

const readOnlyBadge = {
  text: i18n.translate('indexPatternManagement.indexPatterns.badge.readOnly.text', {
    defaultMessage: 'Read only',
  }),
  tooltip: i18n.translate('indexPatternManagement.dataViews.badge.readOnly.tooltip', {
    defaultMessage: 'Unable to save data views',
  }),
  iconType: 'glasses',
};

export async function mountManagementSection(
  getStartServices: StartServicesAccessor<IndexPatternManagementStartDependencies>,
  { noDataPage }: Pick<IndexPatternManagementSetupDependencies, 'noDataPage'>,
  params: ManagementAppMountParams
) {
  const [
    {
      application,
      chrome,
      uiSettings,
      settings,
      notifications,
      overlays,
      http,
      docLinks,
      ...startServices
    },
    {
      data,
      dataViewFieldEditor,
      dataViewEditor,
      dataViews,
      fieldFormats,
      unifiedSearch,
      share,
      spaces,
      savedObjectsManagement,
    },
    indexPatternManagementStart,
  ] = await getStartServices();

  const canSave = dataViews.getCanSaveSync();

  if (!canSave) {
    chrome.setBadge(readOnlyBadge);
  }

  const deps: IndexPatternManagmentContext = {
    dataViewMgmtService: new DataViewMgmtService({
      services: {
        dataViews,
        application,
        savedObjectsManagement,
        uiSettings,
      },
      initialValues: {},
    }),
    application,
    chrome,
    uiSettings,
    settings,
    share,
    notifications,
    overlays,
    unifiedSearch,
    http,
    docLinks,
    data,
    dataViewFieldEditor,
    dataViews,
    indexPatternManagementStart: indexPatternManagementStart as IndexPatternManagementStart,
    setBreadcrumbs: params.setBreadcrumbs,
    fieldFormatEditors: dataViewFieldEditor.fieldFormatEditors,
    IndexPatternEditor: dataViewEditor.IndexPatternEditorComponent,
    fieldFormats,
    spaces: spaces?.hasOnlyDefaultSpace ? undefined : spaces,
    savedObjectsManagement,
    noDataPage,
    ...startServices,
  };

  const editPath = '/dataView/:id/field/:fieldName';
  const createPath = '/dataView/:id/create-field/';
  const createEditPath = dataViews.scriptedFieldsEnabled ? [editPath, createPath] : [editPath];

  ReactDOM.render(
    <KibanaRenderContextProvider {...startServices}>
      <KibanaContextProvider services={deps}>
        <NoDataViewsPromptKibanaProvider
          coreStart={{ ...startServices, docLinks, application }}
          dataViewEditor={dataViewEditor}
          share={share}
        >
          <Router history={params.history}>
            <Routes>
              <Route path={['/create']}>
                <IndexPatternTableWithRouter canSave={canSave} showCreateDialog={true} />
              </Route>
              <Route path={createEditPath}>
                <CreateEditFieldContainer />
              </Route>
              <Route path={['/dataView/:id']}>
                <EditIndexPatternContainer />
              </Route>
              <Redirect path={'/patterns*'} to={'dataView*'} />
              <Route path={['/']}>
                <IndexPatternTableWithRouter canSave={canSave} />
              </Route>
            </Routes>
          </Router>
        </NoDataViewsPromptKibanaProvider>
      </KibanaContextProvider>
    </KibanaRenderContextProvider>,
    params.element
  );

  return () => {
    chrome.docTitle.reset();
    ReactDOM.unmountComponentAtNode(params.element);
  };
}
