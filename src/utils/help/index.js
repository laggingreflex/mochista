import pkg from '.../package.json';
import getDefs from './get-defaults';

export function printUsage( exit ) {
  console.log( `
    ${pkg.description}

    Usage: mochista [OPTIONS] [test-files]

         --root                   Base directory from which watch paths are to be derived.
                                    Default: result of process.cwd(): "${getDefs('root')}"

         --test-files,            Files/globs that should be tested by mocha.
                                    Default: ${getDefs('testFiles')}
         --test-files-exclude,    Files/globs ignored from test-files.
           --ignore                 Default: ${getDefs('testFilesExclude')}

         --source-files,          Files/globs that should be covered by istanbul.
           --include                Default: ${getDefs('sourceFiles')}
         --source-files-exclude,  Files/globs ignored from source-files. (test-files auto excluded)
           --exclude                Default: ${getDefs('sourceFilesExclude')}

         --file-count-limit       Throws error if source/test files exceed this value.
                                    Default: ${getDefs('fileCountLimit')}

         --watch,                 Watch files for changes.
           -w                       Default: false

         --help,                  Print this and exit.
           -h, /?

      Options from Mocha:

         --compilers              Use the given module(s) to compile files.
                                    Eg.: --compilers js:babel-register
         --require                Require the given module(s).
                                    Eg.: --require source-map-support/register tests/_/first.js

         --test-reporter,         Reporter to use for Mocha
           --reporter,              Default: ${getDefs('testReporter')}
           -R                       Eg.: --require spec

       ...and most other mocha options

      Options from Istanbul/nyc:

         --coverage-reporter,     Reporter(s) to use for Istanbul coverage.
           --report                 Default: ${getDefs('coverageReporter')}
                                    Eg.: --report lcov text

         --report-dir,            Directory to output coverage reports in.
           --report                 Default: ${getDefs('reportDir')}

       ...and most other istanbul/nyc options

    Examples:
      mochista test/**
  ` );
  if ( exit ) {
    process.exit( 0 );
  }
}
