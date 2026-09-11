const test = require('node:test');
const assert = require('node:assert/strict');

// Assumes no local .env file overrides PORT/NODE_ENV (true on a clean checkout / CI).
function loadConfig() {
  delete require.cache[require.resolve('../src/config')];
  return require('../src/config');
}

test('config falls back to sensible defaults when no env vars are set', () => {
  const originalPort = process.env.PORT;
  const originalNodeEnv = process.env.NODE_ENV;
  delete process.env.PORT;
  delete process.env.NODE_ENV;

  try {
    const config = loadConfig();

    assert.equal(config.port, 3000);
    assert.equal(config.nodeEnv, 'development');
  } finally {
    if (originalPort !== undefined) process.env.PORT = originalPort;
    if (originalNodeEnv !== undefined) process.env.NODE_ENV = originalNodeEnv;
  }
});

test('config reads PORT and NODE_ENV from the environment when set', () => {
  const originalPort = process.env.PORT;
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.PORT = '5000';
  process.env.NODE_ENV = 'production';

  try {
    const config = loadConfig();

    assert.equal(config.port, '5000');
    assert.equal(config.nodeEnv, 'production');
  } finally {
    if (originalPort === undefined) delete process.env.PORT;
    else process.env.PORT = originalPort;

    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
  }
});
