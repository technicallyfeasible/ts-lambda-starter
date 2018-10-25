import os from 'os';

/**
 * Load typescript files and allow typescript with jsx
 * @returns {Object}
 */
export function ts() {
  return {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'thread-loader',
        options: {
          // there should be 1 cpu for the fork-ts-checker-webpack-plugin
          workers: os.cpus().length - 1,
        },
      },
      { loader: 'babel-loader' },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          happyPackMode: true,
        },
      },
    ],
    exclude: /node_modules/,
  };
}
