const defaults = {};

defaults.coverageReporter = {
  alias: ['report' ],
  type: 'array',
  default: ['lcov', 'text']
};

defaults.reportDir = {
  // alias: [],
  type: 'string',
  default: 'coverage'
};

defaults.cacheDir = {
  // alias: [],
  type: 'string',
  default: '.coverage-cache'
};

defaults.cache = {
  // alias: [],
  type: 'boolean',
  default: true
};

defaults.all = {
  // alias: [],
  type: 'boolean',
  // default: false
};

defaults.checkCoverage = {
  // alias: [],
  // type: 'boolean',
  // default: false
};

defaults.coverageVariable = {
  type: 'string',
  default: '__coverage__'
};
defaults.transformerCacheVariable = {
  type: 'string',
  default: '__transformer_cache__'
};
defaults.sourceMapCacheVariable = {
  type: 'string',
  default: '__source_map_cache__'
};


export default defaults;
