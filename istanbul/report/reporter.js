import { createContext, summarizers } from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import arrify from 'arrify';
import log from '.../utils/logger';

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
