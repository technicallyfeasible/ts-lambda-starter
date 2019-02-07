/**
 * Sample file for API gateway integration including authorizer
 */
import {
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  CustomAuthorizerHandler,
  CustomAuthorizerResult,
} from 'aws-lambda';
import { createServer, proxy } from 'aws-serverless-express';
// tslint:disable-next-line:no-submodule-imports
import { eventContext } from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';

import StatusCodeError from './errors/StatusCodeError';
import { buildAllowAllPolicy } from './policy';
import registerActionRoutes from './routes/actions';
import registerAuthRoutes from './routes/auth';
import registerAuthFormRoutes from './routes/authForm';
import registerMetricsRoutes from './routes/metrics';
import registerVehicleRoutes from './routes/vehicles';
import logger from './utils/logger';

const log = logger.getPrefixedLogger('[HANDLER]');

const app = express();
app.use(cors());
app.use(eventContext());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
registerMetricsRoutes(app);
registerVehicleRoutes(app);
registerAuthRoutes(app);
registerAuthFormRoutes(app);
registerActionRoutes(app);

// tslint:disable-next-line:max-func-args
app.use((error: StatusCodeError, req: Request, res: Response, next: NextFunction) => {
  const code: number = error.statusCode || 500;
  if (code === 500) log.error(error);
  res.status(code).json({
    error: error.message,
  });
});

const server = createServer(app);

export const handler: APIGatewayProxyHandler = (event, context): Promise<APIGatewayProxyResult> => {
  return proxy(server, event, context, 'PROMISE').promise;
};

export const authorizer: CustomAuthorizerHandler = (event, context): Promise<CustomAuthorizerResult> => {
  const authHeader = event.headers.authorization || event.headers.Authorization || '';
  const [authType, authKey] = authHeader.split(' ');

  if (authType.toLowerCase() !== 'basic' || !authKey) {
    return Promise.reject('Unauthorized');
  }

  const [username, password] = (new Buffer(authKey, 'base64')).toString('utf8').split(':');

  if (username !== 'synaptiv' || password !== 'demo') {
    return Promise.reject('Unauthorized');
  }

  return Promise.resolve(buildAllowAllPolicy(event, username));
};
