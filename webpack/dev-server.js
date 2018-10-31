import Module from 'module';
import express from 'express';
import cors from 'cors';
import webpack from 'webpack';
import exitHook from 'async-exit-hook';

import { OUTPUT_FILE } from './constants';
import config from '../webpack.config';

let serverModule;
let exitCallback;
function loadModule() {
  console.log('Loading module...');
  try {
    serverModule = new Module(OUTPUT_FILE);
    serverModule.load(OUTPUT_FILE);
    console.log('Module loaded.');
  } catch (err) {
    console.error('Error loading module:', err);
    serverModule = null;
  }
}

function unloadModule(done) {
  if (!serverModule) {
    return done();
  }
  console.log('Unloading module...');
  exitCallback = done;
  serverModule = null;
  delete Module._cache[OUTPUT_FILE];
  console.log('Module unloaded.');
  done();
}

const bundler = webpack(config);
bundler.watch(config.watchOptions, (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(stats.toString(config.stats));

  unloadModule(() => {
    loadModule();
  });
});

function lambdaMiddleware(request, response, next) {
  if (!serverModule) {
    throw new Error('Module not loaded');
  }
  const handler = serverModule.exports.handler;
  if (!handler) {
    throw new Error('Module does not export "handler" function');
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
    body: request.body,
    headers: request.headers,
    httpMethod: request.method,
    path: request.path,
    queryStringParameters: request.query,
    isBase64Encoded: false,
    requestContext: {
      httpMethod: request.method,
      identity: {},
      path: request.path,
    }
  };
  handler(event, context)
    .then(result => {
      response.status(result.statusCode);
      response.set(result.headers);
      response.send(result.body);
    })
    .catch(next);
}

const app = express();
app.use(cors());
app.use(lambdaMiddleware);
app.use((err, request, response, next) => {
  response.status(500).send(err.message);
  console.error(err);
});
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Dev server listening on port', server.address().port);
});

exitHook(() => {
  unloadModule(() => {
    server.close();
  });
});
