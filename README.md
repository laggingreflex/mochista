
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


## Install
```sh
npm i -g mochista
```
## Usage
```sh
mochista
```

Replace your mocha/istanbul/nyc statements
```json
"test": "mocha test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
"cover": "istanbul cover -x \"test/**/*.js src/**/*.{test,spec}.js\" _mocha -- test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register",
```
with mochista:
```json
"test": "mochista test/**/*.js src/**/*.{test,spec}.js --compilers js:babel-register"
```
It automatically excludes test files from source files for coverage, so no need to specify `-x …`


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
