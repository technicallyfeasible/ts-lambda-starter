import express from 'express';
import cors from 'cors';
import { isFunction } from 'lodash';

let lambdaHandler;

function lambdaMiddleware(request, response, next) {
  if (!lambdaHandler) {
    throw new Error('Module not loaded');
  }

  const context = {
    getRemainingTimeInMillis: () => 1000,
  };
  /*
    body: string | null;
    headers: { [name: string]: string };
    httpMethod: string;
    isBase64Encoded: boolean;
    path: string;
    pathParameters: { [name: string]: string } | null;
    queryStringParameters: { [name: string]: string } | null;
    stageVariables: { [name: string]: string } | null;
    requestContext: APIGatewayEventRequestContext;
    resource: string;
  */
  const event = {
    body: request.rawBody,
    headers: request.headers,
    httpMethod: request.method,
    path: request.path,
    pathParameters: request.params,
    queryStringParameters: Object.keys(request.query).length > 0 ? request.query : null,
    resource: '/{proxy+}',
    isBase64Encoded: false,
    requestContext: {
      httpMethod: request.method,
      identity: {},
      path: `/dev${request.path}`,
      resourcePath: '/{proxy+}',
    }
  };

  const processResult = result => {
    response.status(result.statusCode);
    response.set(result.headers);
    response.send(result.body);
  };

  let lambdaResult = lambdaHandler(event, context, (err, result) => {
    if (err) next(err);
    else processResult(result);
  });

  if (lambdaResult && isFunction(lambdaResult.then)) {
    lambdaResult
      .then(processResult)
      .catch(next);
  }
}

const app = express();
app.use(cors());
app.use(function(req, res, next) {
  req.rawBody = null;
  req.setEncoding('utf8');

  req.on('data', chunk => {
    if (!req.rawBody) req.rawBody = '';
    req.rawBody += chunk;
  });

  req.on('end', () => {
    next();
  });
});
app.use(lambdaMiddleware);
app.use((err, request, response, next) => {
  console.error(err);
  response.status(500).send(err.message);
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Dev server listening on port', server.address().port);
});

export function start(handler) {
  lambdaHandler = handler;
}

export function pause() {
  lambdaHandler = null;
}

export function stop() {
  lambdaHandler = null;
  server.close();
}
