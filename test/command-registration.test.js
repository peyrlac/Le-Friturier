const assert = require('node:assert/strict');
const test = require('node:test');

const loadCommands = require('../src/handlers/loaders/commands');

test('clears stale guild commands after global registration', async () => {
  const calls = [];
  const rest = {
    async get(route) {
      calls.push(['get', route]);
      return [{ id: 'guild-one' }, { id: 'guild-two' }];
    },
    async put(route, body) {
      calls.push(['put', route, body]);
    }
  };

  await loadCommands.clearGuildCommands(rest, 'application-id');

  assert.equal(calls.filter(([method]) => method === 'get').length, 1);
  assert.equal(calls.filter(([method]) => method === 'put').length, 2);
  for (const [method, route, body] of calls.filter(([method]) => method === 'put')) {
    assert.equal(method, 'put');
    assert.match(route, /guilds\/guild-(one|two)\/commands$/);
    assert.deepEqual(body, { body: [] });
  }
});
