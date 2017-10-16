const _ = require('lodash');
const arrify = require('arrify');
const defaults = require('./defaults');

export default function fix(config) {
  config = fixArrays(config);
  config = fixDuplicates(config);
  config = fixSourceAndTestFiles(config);
  config = separateBangExcludes(config);
  config = checkTestExcludes(config);
  config = removeDuplicates(config);
  config = fixDefaults(config);
  return config;
}

function fixArrays(config) {
  for (const key in config) {
    if (defaults[key] && defaults[key].type === 'array') {
      config[key] = arrify(config[key]);
    }
  }
  return config;
}

function fixDuplicates(config) {
  for (const key in config)
    if (config[key] instanceof Array && defaults[key] && defaults[key].type !== 'array')
      config[key] = config[key].pop();
  return config;
}

function removeDuplicates(config) {
  for (const key in config) {
    if (_.isArray(config[key])) {
      config[key] = _.uniq(config[key]);
    }
  }
  return config;
}

function fixDefaults(config) {
  for (const key in config) {
    if (_.isArray(config[key]) && !config[key].length && defaults[key] && defaults[key].default) {
      config[key] = defaults[key].default
    }
  }
  return config;
}

function fixSourceAndTestFiles(config) {
  config.testFiles = arrify(config.testFiles);
  config.testFilesExclude = arrify(config.testFilesExclude);
  config.sourceFiles = arrify(config.sourceFiles);
  config.sourceFilesExclude = arrify(config.sourceFilesExclude);
  config.testFiles = config.testFiles.concat(config._);
  config._ = [];
  return config;
}

function separateBangExcludes(config) {
  const { includes: testFiles, excludes: testFilesExclude } = separateBangExcludes(config.testFiles);
  config.testFiles = testFiles;
  config.testFilesExclude.push(...testFilesExclude);

  const { includes: sourceFiles, excludes: sourceFilesExclude } = separateBangExcludes(config.sourceFiles);
  config.sourceFiles = sourceFiles;
  config.sourceFilesExclude.push(...sourceFilesExclude);

  return config;

  function separateBangExcludes(arr) {
    if (!arr || !arr.forEach) {
      throw new Error('Expected it to be an array: ' + arr);
    }

    const
      includes = [],
      excludes = [];

    arr.forEach(f => {
      if (!f || !f.charAt) {
        throw new Error('Expected it to be a string: ' + f);
      }
      if (f.charAt(0) == '!') {
        excludes.push(f.substr(1));
      } else {
        includes.push(f);
      }
    });

    return { includes, excludes };
  }
}

function checkTestExcludes(config) {
  const offendingPatterns = []
  config.sourceFilesExclude.forEach(sfx => {
    if (config.testFiles.includes(sfx)) {
      offendingPatterns.push(sfx);
    }
  });
  if (offendingPatterns.length) {
    console.error(`ERROR: You've specified {sourceFilesExclude} patterns that match {testFiles} patterns indicating that you're trying to exclude test-files from source-files. You don't have to do that. Please remove the following patterns from {sourceFilesExclude}:`, offendingPatterns);
    throw new Error('{sourceFilesExclude} patterns contain {testFiles} patterns');
  }
  return config;
}
