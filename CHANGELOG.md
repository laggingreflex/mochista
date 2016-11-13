# 0.3.0

## New

* multilevel -vv verbose logging
[`601c097e`]

## Fixes

* transformer verbosity
[`47efa958`]

* test watcher handle newly added files
[`1b8701c6`]

* add/remove files handled properly
[`bbf3d24b`]

# 0.2.0

## New

* Better coverage, source-map support
[`8ea24aa0`]
[`f190884e`]
[`66be884e`]

  Uses Istanbul's [newer separate libs](https://github.com/istanbuljs) (the same that [nyc](https://github.com/istanbuljs/nyc) uses). Was using simply [babel-istanbul](https://github.com/jmcriffey/babel-istanbul) before.

* config --all (run all tests on mod)
[`43fc6042`]

* added CHANGELOG.md

## Fixes

* duplicate config options, keep last one
[`bf4d8f95`]

* mocha opts; command line options weren't being processed
[`d9c02667`]

* better better mocha-optins parsing
[`f2cb74f4`]

* better logger.err (full error only on debug)
[`16763491`]

* debounce=1000
[`e739ac5b`]

# 0.1.2

## Fixes

* wait debounce before next cycle, message
[`6232fc4e`]

# 0.1.1

## Fixes

* minor fixex, readme extras
[`e17db85f`]

* better mocha-options parser
[`be542225`]


# 0.1.0

## New features

* new logger, require-up, clean-up
[`db4dedec`]


## Fixes

* help, readme, fix watch, update deps
[`bfc710d0`]



# 0.0.1

* initial commit
[`3e62561c`]



