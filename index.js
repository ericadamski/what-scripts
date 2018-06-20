const fs = require('fs');
const path = require('path');
const { green, cyan, magenta } = require('chalk');
const { bindNodeCallback } = require('rxjs');
const { concatMap, map } = require('rxjs/operators');

const access = bindNodeCallback(fs.access);
const read = bindNodeCallback(fs.readFile);

const p = path.join(process.cwd(), 'package.json');

access(p).pipe(concatMap(() => read(p, { encoding: 'utf8' })), map(data => JSON.parse(data))).subscribe({
  next({ scripts, name, author }) {
    console.log(`
    ${cyan.underline(name)} by ${magenta(author)} has the following scripts:

      ${Object.keys(scripts).map(key => `${green(key)} - ${scripts[key]}`)}
    `);
  },
  error(e) {
    console.log(`Could not find a package.json file in ${p}.`);
  }
});
