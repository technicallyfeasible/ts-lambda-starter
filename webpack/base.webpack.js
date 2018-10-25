import { OUTPUT_PATH } from './constants';
import * as loaders from './loaders.webpack';
import { getNodeModules } from './webpack.utils';

export default {
  mode: 'production',
  target: 'node',
  entry: {
    server: './src/index.ts',
  },
  watchOptions: {
    ignored: /node_modules/
  },
  externals: {
    ...getNodeModules()
  },
  cache: true,
  devtool: 'source-map',
  stats: {
    colors: true,
    reasons: false,
    modules: false,
    chunks: false,
  },
  /**
   * File types to resolve by .suffix
   */
  resolve: {
    extensions: [
      '.json',
      '.ts',
    ],
  },
  /**
   * Output settings for the webpack build process
   */
  output: {
    path: OUTPUT_PATH,
    publicPath: '',
    filename: '[name].js',
    libraryTarget: 'commonjs',
    pathinfo: true,
  },
  /**
   * Rules applied to a specific file type, regex matched
   */
  module: {
    rules: [
      loaders.ts(),
    ],
  },
};
