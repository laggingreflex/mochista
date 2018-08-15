
# Mochista
[![npm](https://img.shields.io/npm/v/mochista.svg)](https://www.npmjs.com/package/mochista)

***Like***[\*](#not-all) [Mocha] + ~~[Istanbul]~~ [c8*](#uses-c8) in a single process.

Mochista uses [Mocha] and ~~[Istanbul]~~ [c8]'s[*][c8-fork] programmatic API to run both in a single process yielding fastest test results and coverage reports.

[c8-fork]: #c8-fork

Its `--watch` feature runs modified tests and generates coverage using cache for unmodified files instantly:

<a href="https://gfycat.com/IdleSoreHammerheadshark">
<video muted autoplay loop>
<source src="https://giant.gfycat.com/IdleSoreHammerheadshark.mp4"/>
<img src="https://thumbs.gfycat.com/IdleSoreHammerheadshark-size_restricted.gif">
</video>
</a>

<!-- [![][scr_gif]][scr_ext] -->

[scr_mp4]: https://giant.gfycat.com/IdleSoreHammerheadshark.mp4
[scr_gif]: https://thumbs.gfycat.com/IdleSoreHammerheadshark-size_restricted.gif
[scr_ext]: https://gfycat.com/IdleSoreHammerheadshark

Protip: Use [live-server] on the `coverage` dir

[live-server]: https://github.com/tapio/live-server

## Update: Major Rewrite

### Uses [c8]

After recently discovering **[c8]** I decided to rewrite this to use that  instead of [Istanbul]. But [c8] still uses [Istanbul] under the hood to generate reports and such, so the overall outcome of this change should be more or less the same as before.

[c8]: https://github.com/bcoe/c8

<a id="c8-fork"></a> Actually it uses a [fork][laggingreflex/c8] that offers a feature ([Node API][c8/pull/19]) not yet integrated into [c8].

[laggingreflex/c8]: https://github.com/laggingreflex/c8
[c8/pull/19]: https://github.com/bcoe/c8/pull/19

### <a id="not-all"></a> Not all features of [Mocha] and [Istanbul] supported

Incorporating ***all*** functionalities of both [Mocha] and [Istanbul] is no longer the intent of this project. Earlier this project may have claimed to be a drop-in replacement for both, but that is no longer the case (in hindsight it wasn't a wise decision to begin with, since there were/would've been a lot of flag/features collisions). It'll however still try to support some of the most common features (bail, fgrep) with direct flags or --mocha-xxx prefix.

### Node v10

Another thing this rewrite did was to massively simplify the code (1.3k->300 LOC), and some of the features ([Async Iteration]) are heavily reliant on latest NodeJS (v10).

I don't currently plan to use babel to transpile-down.

[Async Iteration]: https://github.com/tc39/proposal-async-iteration


## Features

* Run tests and generate coverage reports

* Like `mocha --watch` but with [Istanbul] coverage reports.

* [Exclude](#excludes) files from tests in mocha; test files auto-excluded from source for coverage.

Note: Following features have been removed since the [update](#update-major-rewrite).

* ~~Run only modified tests.~~
It's easier (and not that slow) to just re-run everything.

* ~~Instrumentation caching on disk and memory for fastest coverage report generation and re-generation.~~
Not needed anymore.

* ~~Supports `mocha.opts` with [extra features](#multiline-mochaopts).~~
See [above](#not-all). It does support `.env` file (via [dotenv]) and all can take all command-line flags from it (via [yargs]' [.env][yargs-env] feature)

[yargs-env]: https://github.com/yargs/yargs/blob/master/docs/api.md#envprefix

* ~~Built in support for ES6/ES2015+ by using [coverage source-maps][istanbul-lib-source-maps].~~
See [below](#transpilers)

## Install
```sh
npm i -g mochista
```
## Usage
```sh
mochista [options]
```
```
Options:
  --help             Show help  [boolean]
  --version          Show version number  [boolean]
  --cwd              Current dir  [string]
  --testFiles, -t    Files to test (anymatch)  [array] [default: ["*test*/**","**/*.test.*"]]
  --sourceFiles, -s  Source files (for coverage) (anymatch)  [array] [default: ["."]]
  --exclude          Files to exclude (anymatch)  [array] [default: [".*","node_modules","coverage"]]
  --gitignore        Files to exclude based on .gitignore  [string] [default: [".gitignore","~/.gitignore"]]
  --extensions       Extensions to monitor (all other files ignored)  [array] [default: [".js"]]
  --watch, -w        Watch for file changes and re-run. `--watch=i` to only re-run on pressing Enter
  --coverage         Collect coverage (use --no-coverage to disable)  [boolean] [default: true]
  --reporter         Mocha reporter  [string] [default: "spec"]
  --report           Istanbul reporters  [array] [default: ["text","lcov","html"]]
  --mocha-xxx        All mocha-related options, like --mocha-fgrep etc
```

## Issues

### Transpilers

Personally not a huge fan of transpilers (babel, typescript) so they've neither been tested nor support for them is provided currently.

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


## Libraries used

* **[mocha]**
* **[c8]**
* [yargs]
* [dotenv]
* [anymatch]
* [parse-gitignore]
* [untildify]
* *[file-watch-iterator]*
* *[merge-async-iterators]*
* *[streams-to-async-iterator]*

[file-watch-iterator]: https://github.com/laggingreflex/file-watch-iterator
[map-better]: https://github.com/laggingreflex/map-better
[merge-async-iterators]: https://github.com/laggingreflex/merge-async-iterators
[streams-to-async-iterator]: https://github.com/laggingreflex/streams-to-async-iterator
[yargs]: https://github.com/yargs/yargs
[anymatch]: https://github.com/micromatch/anymatch
[parse-gitignore]: https://github.com/jonschlinkert/parse-gitignore
[untildify]: https://github.com/sindresorhus/untildify
[dotenv]: https://github.com/motdotla/dotenv
