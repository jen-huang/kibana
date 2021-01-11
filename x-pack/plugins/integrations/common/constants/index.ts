/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
export * from './epm';
export * from './package_policy';
export * from './plugin';
export * from './routes';

// TODO: This is the default `index.max_result_window` ES setting, which dictates
// the maximum amount of results allowed to be returned from a search. It's possible
// for the actual setting to differ from the default. Can we retrieve the real
// setting in the future?
export const SO_SEARCH_LIMIT = 10000;
