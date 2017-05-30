import yargs from 'yargs';
import fix from './fix';
import defaults from './defaults';

export default function getNycOptions(cwd) {
  return fix(yargs.options(defaults).pkgConf('nyc', cwd || process.env.NYC_CWD || process.cwd()).argv);
}
