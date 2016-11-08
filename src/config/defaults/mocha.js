const defaults = {};

defaults.compilers = {
  type: 'array',
  default: []
};
defaults.require = {
  type: 'array',
  default: []
};
defaults.asyncOnly = {
  alias: [ 'A', ],
  type: 'boolean',
  default: false
};
defaults.colors = {
  // alias: [ 'c', ],
  type: 'boolean',
  // default: true
};
defaults.noColors = {
  // alias: [ 'C', ],
  type: 'boolean',
  // default: true
};
defaults.growl = {
  alias: [ 'G', ],
  type: 'boolean',
  // default: true
};
defaults.testReporter = {
  alias: [ 'reporter', 'R', ],
  type: 'string',
  default: 'spec'
};
defaults.sort = {
  alias: [ 'S', ],
  type: 'boolean',
  // default: false
};
defaults.bail = {
  alias: [ 'b', ],
  type: 'boolean',
  // default: false
};
defaults.grep = {
  alias: [ 'g', ],
  type: 'string'
};
defaults.fgrep = {
  alias: [ 'f', ],
  type: 'string'
};
defaults.invert = {
  alias: [ 'i', ],
  type: 'boolean'
};
defaults.slow = {
  alias: [ 's', ],
  type: 'number',
  default: 75
};
defaults.timeout = {
  alias: [ 't', ],
  type: 'number',
  default: 2000,
};
defaults.ui = {
  alias: [ 'u', ],
  type: 'string',
  default: 'bdd'
};
defaults.checkLeaks = {
  type: 'boolean',
  // default: false,
};
defaults.fullTrace = {
  type: 'boolean',
  // default: false,
};
defaults.globals = {
  type: 'array',
  // default: false,
};
defaults.globals = {
  type: 'array',
  // default: false,
};
defaults.noExit = {
  type: 'boolean',
  // default: false,
};
defaults.noTimeouts = {
  type: 'boolean',
  // default: false,
};

export default defaults;
