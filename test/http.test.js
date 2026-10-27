const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { getJson } = require('../src/handlers/http');

const targetCommands = [
  'src/commands/fun/birdfact.js',
  'src/commands/fun/catfact.js',
  'src/commands/fun/dogfact.js',
  'src/commands/fun/hack.js',
  'src/commands/fun/koalafact.js',
  'src/commands/fun/pandafact.js',
  'src/commands/fun/token.js',
  'src/commands/images/bird.js',
  'src/commands/images/cat.js',
  'src/commands/images/dog.js',
  'src/commands/images/fox.js',
  'src/commands/images/koala.js',
  'src/commands/images/meme.js',
  'src/commands/images/panda.js',
  'src/commands/images/redpanda.js',
  'src/commands/images/trumptweet.js',
  'src/commands/images/tweet.js',
  'src/commands/tools/anagram.js',
  'src/commands/tools/mcstatus.js',
];

test('getJson retourne le JSON lorsque la réponse HTTP est OK', async () => {
  const result = await getJson('https://example.test/data', {
    fetchImpl: async (url, options) => {
      assert.equal(url, 'https://example.test/data');
      assert.equal(options.method, 'GET');
      return {
        ok: true,
        status: 200,
        json: async () => ({ answer: 42 }),
      };
    },
  });

  assert.deepEqual(result, { answer: 42 });
});

test('getJson rejette une réponse HTTP non OK avec le statut', async () => {
  await assert.rejects(
    getJson('https://example.test/missing', {
      fetchImpl: async () => ({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable',
      }),
    }),
    /HTTP 503.*Service Unavailable/
  );
});

test('getJson interrompt une requête qui dépasse le timeout', async () => {
  await assert.rejects(
    getJson('https://example.test/slow', {
      timeoutMs: 5,
      fetchImpl: (_url, options) => new Promise((resolve, reject) => {
        options.signal.addEventListener('abort', () => reject(Object.assign(new Error('aborted'), { name: 'AbortError' })));
      }),
    }),
    /timed out after 5ms/
  );
});

test('les commandes HTTP ciblées utilisent le helper commun', () => {
  for (const command of targetCommands) {
    const source = fs.readFileSync(path.join(__dirname, '..', command), 'utf8');
    assert.match(source, /getJson\(/, command);
    assert.doesNotMatch(source, /require\(['"]node-fetch['"]\)|\bfetch\s*\(/, command);
  }
});

