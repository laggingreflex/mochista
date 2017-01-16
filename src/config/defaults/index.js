import _ from 'lodash';
import mocha from './mocha';
import istanbul from './istanbul';

const defaultConfig = {
  ...mocha,
  ...istanbul,
};

defaultConfig.root = {
  type: 'string',
  default: process.cwd()
};
defaultConfig['source-files'] = {
  alias: ['include'],
  type: 'array',
  default: [
    // '**/*.{js,coffee}',
    // './**/*.{js,coffee}',
    '{src,lib}/**/*.{js,coffee}',
    '*.{js,coffee}',
  ]
};
defaultConfig['source-files-exclude'] = {
  alias: ['exclude'],
  type: 'array',
  default: [
    // 'node_modules',
    // '*node_modules*',
    'node_modules/**',
    // './node_modules/**',
    // './**node_modules**/**',
    // '**/node_modules/**',
    // '**node_modules**/**',
    // '**/**node_modules**/**',
    'coverage/**',
  ]
};
defaultConfig['test-files'] = {
  type: 'array',
  default: [
    '*{test,tests}*.{js,coffee}',
    '{test,tests,__test__,__tests__}/**/*.{js,coffee}',
    '{src,lib}/**/*.{test,spec}.{js,coffee}'
  ]
};
defaultConfig['test-files-exclude'] = {
  alias: ['ignore'],
  type: 'array',
  default: ['**/node_modules/**'],
  // default: defaults.sourceFilesExclude.default,
};

defaultConfig.watch = {
  alias: ['w'],
  type: 'boolean',
  default: false
};
defaultConfig.all = {
  // alias: [ 'A' ],
  type: 'boolean',
  default: false
};
defaultConfig['file-count-limit'] = {
  type: 'number',
  default: 1000
};

defaultConfig['browser-sync'] = {
  alias: ['bs'],
  type: 'boolean',
  default: false
};

defaultConfig.verbose = {
  alias: ['v'],
  type: 'count',
  default: 0
};
defaultConfig.debug = {
  alias: ['d'],
  type: 'boolean',
  default: false
};

defaultConfig.help = {
  alias: ['h', '?'],
  type: 'boolean'
};

export default defaultConfig;

export const defaults = _.mapValues(_.pickBy(defaultConfig, d => !_.isUndefined(d.default)), d => d.default);
