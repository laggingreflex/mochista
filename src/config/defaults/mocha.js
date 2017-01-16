const defaults = {};

defaults.compilers = {
  type: 'array',
  default: []
};
defaults.require = {
  type: 'array',
  default: []
};
defaults['async-only'] = {
  alias: ['A'],
  type: 'boolean',
  default: false
};
defaults.colors = {
  // alias: [ 'c' ],
  type: 'boolean',
  // default: true
};
defaults['no-colors'] = {
  // alias: [ 'C' ],
  type: 'boolean',
  // default: true
};
defaults.growl = {
  alias: ['G'],
  type: 'boolean',
  // default: true
};
defaults['test-reporter'] = {
  alias: ['reporter', 'R'],
  type: 'string',
  default: 'spec'
};
defaults.sort = {
  alias: ['S'],
  type: 'boolean',
  // default: false
};
defaults.bail = {
  alias: ['b'],
  type: 'boolean',
  // default: false
};
defaults.grep = {
  alias: ['g'],
  type: 'string'
};
defaults.fgrep = {
  alias: ['f'],
  type: 'string'
};
defaults.invert = {
  alias: ['i'],
  type: 'boolean'
};
defaults.slow = {
  alias: ['s'],
  type: 'number',
  default: 75
};
defaults.timeout = {
  alias: ['t'],
  type: 'number',
  default: 2000,
};
defaults.ui = {
  alias: ['u'],
  type: 'string',
  default: 'bdd'
};
defaults['check-leaks'] = {
  type: 'boolean',
  // default: false,
};
defaults['full-trace'] = {
  type: 'boolean',
  // default: false,
};
defaults.globals = {
  type: 'array',
  // default: false,
};
defaults['no-exit'] = {
  type: 'boolean',
  // default: false,
};
defaults['no-timeouts'] = {
  type: 'boolean',
  // default: false,
};

export default defaults;
