import { createCoverageMap } from 'istanbul-lib-coverage';

export default function collect( coverage ) {
  return createCoverageMap( coverage );
}
