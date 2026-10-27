const assert = require('node:assert/strict');
const test = require('node:test');

const { renderStatusActivity } = require('../src/handlers/functions/botStatus');

test('renders dynamic bot status values', () => {
    assert.equal(
        renderStatusActivity('sur {guilds} serveurs avec {membersInVoice} membres en vocal depuis {uptime}', {
            guilds: 2,
            membersInVoice: 4,
            uptime: '15 min',
        }),
        'sur 2 serveurs avec 4 membres en vocal depuis 15 min',
    );
});
