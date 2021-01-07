/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
export * from './models';
export * from './rest_spec';

/**
 * Creates a Union Type for all the values of an object
 */
export type ValueOf<T> = T[keyof T];
