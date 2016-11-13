import defaults from './defaults';

export default function fixDuplicates(config) {
  for (const key in config)
    if (config[key] instanceof Array && defaults[key] && defaults[key].type !== 'array')
      config[key] = config[key].pop();
}
