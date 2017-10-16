const { createContext, summarizers } = require('istanbul-lib-report');
const reports = require('istanbul-reports');
const arrify = require('arrify');
const log = require('.../utils/logger');

export default async function report(coverageMap, {
  reportDir: dir = 'coverage',
  reporters = ['lcov', 'text'],
} = {}) {
  const context = createContext({ dir });
  const tree = summarizers.pkg(coverageMap);
  arrify(reporters).forEach(reporter =>
    tree.visit(
      reports.create(reporter),
      context
    )
  );
}
