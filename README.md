
# Mochista
[![npm](https://img.shields.io/npm/v/mochista.svg)](https://www.npmjs.com/package/mochista)

[Mocha] + [Istanbul] in a single process.

Mochista uses Mocha and Istanbul's programatic API to run both in a single process yeilding fastest test results and coverage reports.

Its `--watch` option (like mocha) re-runs modified tests and re-generates coverage (using cache for unmodofied files) instantaneously.

[![][scr]][scr]

## Features

* Like `mocha --watch` but with Istanbul coverage reports.

* Runs only the tests that were modified.

* Fully compatible with `mocha.opts`

* Option to exclude files (missing feature in mocha)

* Built in support for ES6/ES2015+ using [babel-istanbul].


## Install
```sh
npm i -g mochista
```
## Usage
```sh
mochista test/**
```

### Options
```
--root                   Base directory from which watch paths are to be derived.
                           Default: result of process.cwd()

--test-files             Files/globs that should be tested by mocha.
                           Default: test*/**/*.js **/*.{test,spec}.js
--test-files-exclude,    Files/globs ignored from test-files.
  --ignore                 Default: **/node_modules/**

--source-files,          Files/globs that should be covered by istanbul.
  --include                Default: src/**/*.js
--source-files-exclude,  Files/globs ignored from source-files. (test-files auto excluded)
  --exclude                Default: node_modules/**

--file-count-limit       Throws error if source/test files exceed this value.
                           Default: 1000

--watch,                 Watch for file modification.
  -w                       Default: false
--all                    Run all tests on any test file modifications.
                           Default: false (runs only modified tests; still runs all tests on source modification)

--help,                  Print this and exit.
  -h, /?

Options from Mocha:

--compilers              Use the given module(s) to compile files.
                           Eg.: --compilers js:babel-register
--require                Require the given module(s).
                           Eg.: --require source-map-support/register tests/_/first.js

--test-reporter,         Reporter to use for Mocha
  --reporter,              Default: spec
  -R                       Eg.: --require spec

...and most other mocha options

Options from Istanbul/nyc:

--coverage-reporter,     Reporter(s) to use for Istanbul coverage.
  --report                 Default: lcov text
                           Eg.: --report lcov text

--report-dir,            Directory to output coverage reports in.
  --report                 Default: coverage

...and most other istanbul/nyc options
```

Replace both your mocha and istanbul/nyc statements
```json
"test": "mocha test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
"cover": "istanbul cover -x \"test/**/*.js src/**/*.{test,spec}.js\" _mocha -- test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
```
with mochista:
```json
"test": "mochista test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register"
```
It automatically excludes test files from source files for coverage, so no need to specify `-x …`

## Extras

* You can specify excludes for test-files. Eg.:
  ```
  mochista --testFiles test/** --testFilesExclude test/fixtures
  ```

* Files/globs beginning with `!` are added to their respective excludes. Eg.:
  ```
  mochista test/** !test/fixtures --sourceFiles src/** !src/vendor
  ```
  is equivalent to
  ```
  mochista --testFiles test/** --testFilesExclude test/fixtures --sourceFiles src/** --sourceFilesExclude src/vendor
  ```


* Line beginning with `#` in `mocha.opts` are ignored. Eg.:
  ```sh
  --compilers js:babel-register
  --require source-map-support/register
  --reporter spec
  # --debug
  ```

[scr]: misc/scr.gif

[mocha]: http://mochajs.org
[istanbul]: https://istanbul.js.org
[babel-istanbul]: https://github.com/jmcriffey/babel-istanbul
[chokidar]: https://github.com/paulmillr/chokidar
[watch]: https://github.com/mochajs/mocha/search?q=watch&type=issues
[exclude files]: https://github.com/mochajs/mocha/search?q=exclude+files&type=issues

[mocha-istanbul]: https://github.com/arikon/mocha-istanbul
[mocha-lcov-reporter]: https://github.com/StevenLooman/mocha-lcov-reporter

[pita]: http://www.urbandictionary.com/define.php?term=pita
