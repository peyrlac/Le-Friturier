const fetch = require('node-fetch');

const DEFAULT_TIMEOUT_MS = 10_000;

async function request(url, options = {}) {
  const {
    fetchImpl = fetch,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    ...requestOptions
  } = options;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      ...requestOptions,
      signal: controller.signal,
    });

    if (!response.ok) {
      const status = response.status ?? 'unknown';
      const statusText = response.statusText ? ` ${response.statusText}` : '';
      throw new Error(`HTTP ${status}${statusText}`);
    }

    return response;
  } catch (error) {
    if (error.name === 'AbortError' && timeoutMs !== Infinity) {
      throw new Error(`HTTP request timed out after ${timeoutMs}ms: ${url}`, { cause: error });
    }
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith('HTTP ') || message.startsWith('Invalid JSON')) {
      throw error;
    }
    throw new Error(`HTTP request failed for ${url}: ${message}`, { cause: error });
  } finally {
    clearTimeout(timeout);
  }
}

async function getJson(url, options = {}) {
  const response = await request(url, options);
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Invalid JSON response from ${url}`, { cause: error });
  }
}

async function getText(url, options = {}) {
  const response = await request(url, options);
  try {
    return await response.text();
  } catch (error) {
    throw new Error(`Invalid text response from ${url}`, { cause: error });
  }
}

getJson.DEFAULT_TIMEOUT_MS = DEFAULT_TIMEOUT_MS;

module.exports = { request, getJson, getText };
