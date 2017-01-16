const defaults = {};

defaults['coverage-reporter'] = {
  alias: ['report'],
  type: 'array',
  default: ['lcov', 'text']
};

defaults['report-dir'] = {
  // alias: [],
  type: 'string',
  default: 'coverage'
};

defaults['cache-dir'] = {
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

defaults['check-coverage'] = {
  // alias: [],
  // type: 'boolean',
  // default: false
};

defaults['coverage-variable'] = {
  type: 'string',
  default: '__coverage__'
};
defaults['transformer-cache-variable'] = {
  type: 'string',
  default: '__transformer_cache__'
};
defaults['source-map-cache-variable'] = {
  type: 'string',
  default: '__source_map_cache__'
};


export default defaults;
