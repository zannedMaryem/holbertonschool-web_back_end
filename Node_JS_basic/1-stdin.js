process.stdout.write('Welcome to Holberton School, what is your name?\n');

const readline = require('readline');

const input = readline.createInterface({
  input: process.stdin,
});

input.on('line', (name) => {
  process.stdout.write(`Your name is: ${name}\n`);
});

input.on('close', () => {
  process.stdout.write('This important software is now closing\n');
});
