/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';

import {
  type UiOptionsKey,
  type UI_OPTIONS_VALUE,
  UI_OPTIONS_KEYS,
  UI_OPTIONS_DEFAULTS,
} from '../constants';

import { useStartServices } from './use_core';

export function useUiOptions(uiOptionsKey: UiOptionsKey) {
  const { storage } = useStartServices();

  const storedValue = storage.get(UI_OPTIONS_KEYS[uiOptionsKey]);
  const [value, setValue] = React.useState(
    storedValue === undefined ? UI_OPTIONS_DEFAULTS[uiOptionsKey] : storedValue
  );

  const set = React.useCallback(
    (val: UI_OPTIONS_VALUE<typeof uiOptionsKey>) => {
      setValue(val);
      storage.set(UI_OPTIONS_KEYS[uiOptionsKey], val);
    },
    [storage, uiOptionsKey]
  );

  return {
    value,
    set,
  };
}
