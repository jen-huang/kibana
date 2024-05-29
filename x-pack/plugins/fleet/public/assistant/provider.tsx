/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import type { FC, PropsWithChildren, ComponentProps } from 'react';
import React from 'react';
import {
  AssistantProvider as ElasticAssistantProvider,
  AssistantOverlay,
} from '@kbn/elastic-assistant';

import { useStartServices, useLicense } from '../hooks';

/**
 * This component configures the Elastic AI Assistant context provider for the Fleet/Integrations apps.
 */
export const AssistantProvider: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const {
    http,
    triggersActionsUi: { actionTypeRegistry },
    docLinks: { ELASTIC_WEBSITE_URL, DOC_LINK_VERSION },
  } = useStartServices();

  const assistantAvailability = useAssistantAvailability();
  const showAssistant =
    assistantAvailability.hasAssistantPrivilege && assistantAvailability.isAssistantEnabled;

  return (
    <ElasticAssistantProvider
      actionTypeRegistry={actionTypeRegistry}
      augmentMessageCodeBlocks={() => []}
      assistantAvailability={assistantAvailability}
      docLinks={{ ELASTIC_WEBSITE_URL, DOC_LINK_VERSION }}
      basePath={http.basePath.get()}
      baseConversations={{
        // TODO: i18n
        IntegrationsWelcome: {
          id: 'integrations-welcome',
          title: 'Integrations Welcome',
          category: 'assistant',
          isDefault: true,
          messages: [],
          replacements: {},
        },
      }}
      getComments={getComments}
      http={http}
    >
      {showAssistant && <AssistantOverlay isFlyoutMode={false} />}
      {children}
    </ElasticAssistantProvider>
  );
};

// TODO: Extract to separate hook. Are these the right `capabilities` from Management to use?
export const useAssistantAvailability = () => {
  const isEnterprise = useLicense().isEnterprise() || false;
  const {
    application: { capabilities },
  } = useStartServices();
  const hasAssistantPrivilege =
    capabilities.management.kibana.aiAssistantManagementSelection === true;
  const hasUpdateAIAssistantAnonymization = false;

  // Connectors & Actions capabilities as defined in x-pack/plugins/actions/server/feature.ts
  // `READ` ui capabilities defined as: { ui: ['show', 'execute'] }
  const hasConnectorsReadPrivilege =
    capabilities.actions?.show === true && capabilities.actions?.execute === true;
  // `ALL` ui capabilities defined as: { ui: ['show', 'execute', 'save', 'delete'] }
  const hasConnectorsAllPrivilege =
    hasConnectorsReadPrivilege &&
    capabilities.actions?.delete === true &&
    capabilities.actions?.save === true;

  return {
    hasAssistantPrivilege,
    hasConnectorsAllPrivilege,
    hasConnectorsReadPrivilege,
    isAssistantEnabled: isEnterprise,
    hasUpdateAIAssistantAnonymization,
  };
};

// TODO: Extract to separate file
const getComments: ComponentProps<typeof ElasticAssistantProvider>['getComments'] = ({
  currentConversation,
}) => {
  return (currentConversation?.messages || []).map((message) => {
    return {
      // TODO: i18n
      username: message.role === 'user' ? 'You' : 'Assistant',
      children: <>{message.content}</>,
    };
  });
};
