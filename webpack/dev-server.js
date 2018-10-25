import child_process from 'child_process';
import webpack from 'webpack';
import exitHook from 'async-exit-hook';

import { OUTPUT_FILE } from './constants';
import config from '../webpack.config';

let serverProcess;
let exitCallback;
function startServer() {
  console.log('Starting server.');
  serverProcess = child_process.fork(OUTPUT_FILE);
  serverProcess.on('exit', () => {
    console.log('Server stopped.');
    serverProcess = null;
    const cb = exitCallback;
    exitCallback = null;
    if (cb) setImmediate(cb);
  });
}
function killServer(done) {
  if (!serverProcess) {
    return done();
  }
  console.log('Stopping server...');
  exitCallback = done;
  serverProcess.kill('SIGTERM');
}

const bundler = webpack(config);
bundler.watch(config.watchOptions, (err, stats) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(stats.toString(config.stats));

  killServer(() => {
    startServer();
  });
});

exitHook(killServer);
