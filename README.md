
# Mochista
[![npm](https://img.shields.io/npm/v/mochista.svg)](https://www.npmjs.com/package/mochista)

[Mocha] + [Istanbul] in a single process.

Mochista uses Mocha and Istanbul's programatic API to run both in a single process yeilding fastest test results and coverage reports.

Its `--watch` feature runs modified tests and generates coverage using cache for unmodified files instantly:

[![][scr]][scr]

## Features

* Run tests and generate coverage reports

* Like `mocha --watch` but with Istanbul coverage reports.

* Run only modified tests.

* Instrumentation caching on disk and memory for fastest coverage report generation and re-generation.

* Supports `mocha.opts` with [extra features](#multiline-mochaopts).

* [Exclude](#excludes) files from tests in mocha; test files auto-excluded from source for coverage.

* Built in support for ES6/ES2015+ by using [coverage source-maps][istanbul-lib-source-maps].

## Why?

Why not just use [nyc]? It already supports mocha: `nyc --reporter=lcov mocha`

* Agreed. But I wrote mochista more for its `--watch` feature.

Why not just use nodemon or something?

* Multiprocess overhead. `mocha --watch` is so fast on subsequent runs because it does it all in the same process. Mochista builds on this and uses both Mocha and Istanbul's programatic API to do both for all subsequent runs in the same process. And with smart instrumentation caching, Mochista's `--watch` feature aims to be the fastest tool to run tests and generate coverage reports on file modifictaions.


## Install
```sh
npm i -g mochista
```
## Usage
```sh
mochista [OPTIONS] [test-files]
```
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

--file-count-limit       Throws error if source/test files exceed this value. (handy to detect unnecessary inclusions leak in file-watchers)
                           Default: 1000

--watch,                 Watch for file modification.
  -w                       Default: false
--run-all                Run all tests on any test file modifications.
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

Replace your mocha and istanbul/nyc statements
```json
"test": "mocha test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
"cover": "istanbul cover -x \"test/**/*.js src/**/*.{test,spec}.js\" _mocha -- test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
"nyc": "nyc --reporter=lcov --reporter=text npm test",
```
with mochista:
```json
"test": "mochista test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
"tdd": "npm run test -- --watch",
```

## Extras

#### Excludes
You can specify excludes for test-files. Eg.:
```
mochista --testFiles test/** --testFilesExclude test/fixtures
```
Files/globs beginning with `!` are added to their respective excludes. Eg.:
```
mochista test/** !test/fixtures --sourceFiles src/** !src/vendor
```
is equivalent to
```
mochista --testFiles test/** --testFilesExclude test/fixtures --sourceFiles src/** --sourceFilesExclude src/vendor
```
Note: It automatically excludes test files from source files for coverage reports, so no need to do this:
<strike>
```
--test-files test/** --source-files-exclude test/**
```
</strike>

#### Multiline `mocha.opts`
Line beginning with `#` in `mocha.opts` are ignored. Eg.:
```sh
--compilers js:babel-register
--require source-map-support/register
--reporter spec
# --debug
```

## Issues

If you're facing issues, use maximum verbosity level to get more info for reporting

```
-vvv
```

### Known issues

#### Running only tests that were affected by the changed files

This is something that isn't trivial. [Jest] does a marvelous job at actually detecting which test files need to be run based on analyzing import/requires of each file. Mochista in this regard has a much simpler logic:

* If a test file was changed, it just runs that test file again. Any imports and requires in that test files are loaded from cache by NodeJS default require caching mechanism, other that the test file itself whose cache is reset.

* If a source file was changed, NodeJS require caches for that source file, and all test files are reset, and all tests are run again. Mochista doesn't try to analyze which tests were affected by that source file, it just runs them all.

But resetting the cache for only the changed files may cause undesired behavior in some cases. For example:
```
// foo.js
export default 'This is foo'
```
```
// bar.js
const foo = require('./foo')
export default foo.replace('foo', 'bar')
```
```
// bar.test.js
const bar = require('./bar')
assert(bar === 'This is bar')
```
Now suppose you changed `foo.js`:
```
// foo.js modified
export default 'This is fuu' // this should make the above test fail
```
assuming `foo.js` is considered a source file which will trigger all tests to be run, the `bar.test.js` test will still (incorrectly) pass! This is because `bar.test.js` and `bar.js` weren't modified, they're still cached by NodeJS which use the previously cached version of `foo.js`.

This is especially troublesome when using babel-rewire. It might fail to re-wire your dependencies.

For this reason there's a third option, enabled by pressing "r" or using the switch `--run-all`, which resets all require cache for all test and all source files. This is probably the most fool proof way to re-run all tests. It's still a lot faster that running the process again.

#### Chokidar

Mochista uses [chokidar] for watching file changes.

If you see a warning like
```
Timed out (3s) waiting for watcher "ready" event.
```
It might mean you have specified a glob/dir that doesn't actually contain any files.
Checkout [chokidar#449]. It will try to continue on after that warning given that other globs were still able to find some files (use `-vvv` for more info). If no files were found it will definitely have thrown an unrecoverable error.

If Mochista fails to monitor the files you specified, try to simplify or reduce the glob patterns specified. See chokidar#561.

####  Invalid coverage with babel

In some cases you might see inaccurate coverage reports when using babel: [nyc#501](https://github.com/istanbuljs/nyc/issues/501)

Use [babel-plugin-istanbul] with `--instrument=false` to solve this issue.

This will however take a hit on speed because it won't be able to cache the instrumentation.

[scr]: misc/scr.gif

[mocha]: http://mochajs.org
[istanbul]: https://istanbul.js.org
[nyc]: https://github.com/istanbuljs/nyc
[babel-istanbul]: https://github.com/jmcriffey/babel-istanbul
[istanbul-lib-source-maps]: https://github.com/istanbuljs/istanbul-lib-source-maps
[chokidar]: https://github.com/paulmillr/chokidar
[chokidar#561]: https://github.com/paulmillr/chokidar/issues/561
[chokidar#449]: https://github.com/paulmillr/chokidar/issues/449
[watch]: https://github.com/mochajs/mocha/search?q=watch&type=issues
[exclude files]: https://github.com/mochajs/mocha/search?q=exclude+files&type=issues

[mocha-istanbul]: https://github.com/arikon/mocha-istanbul
[mocha-lcov-reporter]: https://github.com/StevenLooman/mocha-lcov-reporter

[babel-plugin-istanbul]: https://github.com/istanbuljs/babel-plugin-istanbul

[pita]: http://www.urbandictionary.com/define.php?term=pita

