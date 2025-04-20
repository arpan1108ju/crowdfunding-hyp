// /middlewares/requestContext.js
import { requestContext } from '../utils/requestContext.js';

export const contextMiddleware = (req, res, next) => {
  requestContext.run({ req }, () => {
    next();
  });
};
