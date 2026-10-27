const fs = require('node:fs');
const test = require('node:test');
const assert = require('node:assert/strict');

const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
const dockerignore = fs.readFileSync('.dockerignore', 'utf8');

test('Dockerfile uses the locked production dependency install', () => {
    assert.match(dockerfile, /ENV NODE_ENV=production/);
    assert.match(dockerfile, /RUN npm ci --omit=dev/);
    assert.doesNotMatch(dockerfile, /RUN npm install --omit=dev/);
});

test('Docker build does not copy local secrets or generated dependencies', () => {
    assert.match(dockerignore, /^\.env$/m);
    assert.match(dockerignore, /^node_modules$/m);
    assert.match(dockerignore, /^\.git$/m);
});

test('Dockerfile keeps the portable bot healthcheck and Alpine Chromium path', () => {
    assert.match(dockerfile, /PUPPETEER_EXECUTABLE_PATH=\/usr\/bin\/chromium-browser/);
    assert.match(dockerfile, /existsSync\('\/tmp\/bot-alive'\)/);
    assert.match(dockerfile, /dumb-init/);
    assert.match(dockerfile, /STOPSIGNAL SIGTERM/);
});
