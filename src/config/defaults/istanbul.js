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

export default defaults;
