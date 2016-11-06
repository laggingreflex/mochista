import { prompt } from 'inquirer';

export async function confirm( message, def ) {
  return ( await prompt( [ {
    type: 'confirm',
    name: 'confirm',
    message,
    default: def || false
  } ] ) ).confirm;
}
