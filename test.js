const assert = require('node:assert');
const { COMMANDS, JOKES, HEART, command, comment } = require('./lib');

assert.equal(comment('python', 'x'), '# x');
assert.equal(comment('html', 'x'), '<!-- x -->');
assert.equal(comment('css', 'x'), '/* x */');
assert.equal(comment('typescript', 'x'), '// x');

assert(JOKES.includes(command('//joke')[0]));
for (const c of ['//love', '//LOVE', '  //Love ']) assert.equal(command(c), HEART, c);
for (const c of ['// love', '/love', '#love', '//i love it', '//nada', '//constructor', 'const love = 1']) assert.equal(command(c), undefined, c);
assert.match(command('//rip').join('\n'), /\d\d\/\d\d\/\d{4}/);
for (const name in COMMANDS) assert(command('//help').some(l => l.startsWith(`//${name} `)), `//help sem ${name}`);
assert(command('//help').every(l => command(l) === undefined)); // Enter numa linha da ajuda não dispara nada

// nenhum desenho pode partir comentários (-- e */) nem ter quebras de linha lá dentro;
// a última linha não pode acabar em \, que em C/C++ comentava a linha de código seguinte
for (const name in COMMANDS)
  for (let i = 0; i < 20; i++) {
    const lines = command('//' + name);
    for (const l of lines) assert(typeof l === 'string' && !/--|\*\/|\n/.test(l), `${name}: ${l}`);
    assert(!lines.at(-1).endsWith('\\'), name);
  }

console.log('ok');
