import { Collector } from 'babel-istanbul';

export default function collect( coverage ) {
  const collector = new Collector();
  collector.add( coverage );
  return collector;
}
