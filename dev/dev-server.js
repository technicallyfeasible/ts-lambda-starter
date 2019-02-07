import Module from 'module';
import webpack from 'webpack';
import exitHook from 'async-exit-hook';

import { OUTPUT_FILE } from '../webpack/constants';
import config from '../webpack.config';
import * as apiGateway from './events/apiGateway';

const eventSources = [
  apiGateway,
];

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
  const handler = serverModule && serverModule.exports && serverModule.exports.handler;
  if (!handler) {
    console.error('Module does not export handler');
  } else {
    eventSources.forEach(source => {
      try {
        source.start(handler);
      } catch(err) {
        console.error(err);
      }
    });
  }
}

function unloadModule(done) {
  if (!serverModule) {
    return done();
  }
  console.log('Unloading module...');

  eventSources.forEach(source => source.pause());

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

exitHook(() => {
  unloadModule(() => {
    eventSources.forEach(source => source.stop());
  });
});
