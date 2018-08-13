module.exports = {
  cwd: {
    type: 'string',
    default: process.cwd()
  },
  testFiles: {
    type: 'array',
    default: ['test']
  },
  sourceFiles: {
    type: 'array',
    default: ['.']
  },
  exclude: {
    type: 'array',
    default: ['.*', 'node_modules', 'coverage']
  },
  extensions: {
    type: 'array',
    default: ['.js']
  },
  watch: {
    alias: ['w']
    // type: 'boolean'
  },
  coverage: {
    type: 'boolean',
    default: true
  },
  coverageReporter: {
    alias: ['report'],
    type: 'array',
    default: ['text', 'lcov', 'html']
  }
};
