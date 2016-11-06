
# Mochista
[![npm](https://img.shields.io/npm/v/mochista.svg)](https://www.npmjs.com/package/mochista)

[Mocha] + [Istanbul] in a single process.

[![][scr]][scr]

## Features

* Like `mocha --watch` but with Istanbul coverage reports.

* Runs only the tests that were modified.

* Fully compatible with `mocha.opts`; use it as a drop-in replacement.

* Option to exclude files (missing feature in mocha)

* Built in support for ES6/ES2015+ using [babel-istanbul].


## Usage
```sh
npm i -g mochista
```
```sh
mochista
```

Replace all your istanbul and mocha statements
```json
"test": "istanbul cover -x test/**/*.mspec.js _mocha -- test/**/*.mspec.js --compilers js:babel-register",
"tdd": "mocha test/**/*.mspec.js --compilers js:babel-register --check-leaks --reporter min -w",
```
with mochista:
```json
"test": "mochista test/**/*.mspec.js --compilers js:babel-register --one-run",
"tdd" : "mochista test/**/*.mspec.js --compilers js:babel-register --reporter min --check-leaks",
```
No need to specify `-x 'test/**/*.mspec.js'` for istanbul, mochista automatically excludes test files from source files for coverage.

Mochista starts in `--watch` mode by default; for single run use `--one-run`.


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
