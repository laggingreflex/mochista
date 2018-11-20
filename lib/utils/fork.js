const { fork } = require('child_process');
const { inspect } = require('util');
const fack = require('fork-acknowledge');
const utils = require('.');

exports.parent = async (filename, commands, ...forkArgs) => {
  const child = fork(filename, ...forkArgs);
  const { send } = fack(child);
  for (const command in commands) {
    const defaultArgs = commands[command]
    commands[command] = (...args) => send({
      command: {
        [command]: args.length ? args : defaultArgs
      }
    });
  }
  commands.end = async () => {
    const exited = new Promise(resolve => child.on('exit', resolve));
    await send({ command: { end: [] } });
    return exited;
  };
  return commands;
};

exports.child = commands => {
  const { on } = fack(process);
  const off = on((message) => {
    if (message.command) {
      for (const command in message.command) {
        if (!(command in commands)) {
          throw new Error(`Invalid command received from parent: '${command}'`);
        } else {
          const args = utils.arrify(message.command[command]);
          return commands[command](...args);
        }
      }
    } else {
      throw new Error(`Invalid message received from parent: ${inspect(message)}`)
    }
  });
  commands.end = () => { off(); };
};
