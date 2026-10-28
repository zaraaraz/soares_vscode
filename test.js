const assert = require('node:assert');
const { JOKES, isJoke, comment, trigger } = require('./lib');

assert.equal(comment('python', 'x'), '# x');
assert.equal(comment('html', 'x'), '<!-- x -->');
assert.equal(comment('css', 'x'), '/* x */');
assert.equal(comment('typescript', 'x'), '// x');

assert(isJoke('//joke') && isJoke('  /joke ') && isJoke('// joke') && isJoke('#JOKE'));
assert(!isJoke('// joke de mau gosto') && !isJoke('const joke = 1'));

assert.ok(trigger('  // TODO'));
assert.ok(trigger('console.log'));
assert.equal(trigger('// TODO: arranjar'), undefined);

// as piadas não podem partir comentários (-- e */) nem disparar os próprios gatilhos
for (const j of JOKES) assert(!/--|\*\/|\n|TODO|console\.log/.test(j), j);

console.log('ok');
