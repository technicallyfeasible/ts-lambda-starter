import fs from 'fs';

export function getNodeModules() {
  const nodeModules = {};
  fs.readdirSync('node_modules')
    .filter(x => ['.bin'].indexOf(x) === -1)
    .forEach(mod => {
      nodeModules[mod] = `commonjs ${mod}`;
    });
  return nodeModules;
}
