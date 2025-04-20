// /utils/requestContext.js
import { AsyncLocalStorage } from 'async_hooks';

const asyncLocalStorage = new AsyncLocalStorage();

export const requestContext = {
  run: (data, callback) => asyncLocalStorage.run(data, callback),
  get: () => asyncLocalStorage.getStore(),
};
