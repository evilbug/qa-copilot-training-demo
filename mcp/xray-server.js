#!/usr/bin/env node
/**
 * Demo MCP server for the QA training session. Zero dependencies.
 *
 * Speaks the Model Context Protocol over stdio (JSON-RPC 2.0) and exposes a
 * stand-in for a test-management tool (Xray/Jira), so the assistant can read a
 * test set and its last execution instead of having it pasted in by hand:
 *
 *   - list_test_sets      -> test sets defined in the demo project
 *   - get_test_set        -> the test cases in a set, with the criterion each covers
 *   - get_last_execution  -> results of the most recent run of a test set
 *
 * The data is fake and lives in this file. The point is the wiring, not the data.
 *
 * Run manually:  node mcp/xray-server.js
 * In VS Code it is configured from .vscode/mcp.json (included in this repo).
 */

const { createInterface } = require('node:readline');

// --- Demo data -------------------------------------------------------------

const TEST_SETS = {
  'TS-LOGIN': {
    id: 'TS-LOGIN',
    name: 'Login module regression',
    story: 'US-101',
    testCases: [
      { id: 'TC-101-1', covers: 'US-101 / AC-1', title: 'Valid credentials reach the dashboard', automated: true },
      { id: 'TC-101-2', covers: 'US-101 / AC-2', title: 'Wrong password shows "Invalid credentials"', automated: true },
      { id: 'TC-101-3', covers: 'US-101 / AC-3', title: 'Locked account shows "Account locked"', automated: true },
    ],
  },
  'TS-REMEMBER': {
    id: 'TS-REMEMBER',
    name: 'Remember me',
    story: 'US-102',
    testCases: [
      { id: 'TC-102-1', covers: 'US-102 / AC-1', title: 'Username is pre-filled when Remember me was checked', automated: false },
      { id: 'TC-102-2', covers: 'US-102 / AC-2', title: 'Username is empty when Remember me was not checked', automated: false },
      { id: 'TC-102-3', covers: 'US-102 / AC-3', title: 'Stored username is cleared when logging in unchecked', automated: false },
    ],
  },
};

const EXECUTIONS = {
  'TS-LOGIN': {
    executionId: 'EXEC-2041',
    ranAt: '2026-09-02T09:14:00Z',
    build: 'release/3.7.0',
    results: [
      { testCase: 'TC-101-1', status: 'FAIL', message: 'NoSuchElementError: Unable to locate element: [id="login-submit"]' },
      { testCase: 'TC-101-2', status: 'FAIL', message: 'NoSuchElementError: Unable to locate element: [id="login-submit"]' },
      { testCase: 'TC-101-3', status: 'FAIL', message: 'NoSuchElementError: Unable to locate element: [id="login-submit"]' },
    ],
  },
  'TS-REMEMBER': {
    executionId: null,
    ranAt: null,
    build: null,
    results: [],
  },
};

// --- Tool definitions ------------------------------------------------------

const TOOLS = [
  {
    name: 'list_test_sets',
    description: 'Lists the test sets defined in the demo test-management project, with the user story each one covers.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'get_test_set',
    description: 'Returns the test cases in a test set, including which acceptance criterion each one covers and whether it is automated.',
    inputSchema: {
      type: 'object',
      properties: {
        testSetId: { type: 'string', description: 'Test set identifier, for example TS-LOGIN.' },
      },
      required: ['testSetId'],
    },
  },
  {
    name: 'get_last_execution',
    description: 'Returns the results of the most recent execution of a test set, with the failure message of each failed test case.',
    inputSchema: {
      type: 'object',
      properties: {
        testSetId: { type: 'string', description: 'Test set identifier, for example TS-LOGIN.' },
      },
      required: ['testSetId'],
    },
  },
];

function runTool(name, args = {}) {
  if (name === 'list_test_sets') {
    return JSON.stringify(
      Object.values(TEST_SETS).map(({ id, name: n, story, testCases }) => ({
        id, name: n, story, testCases: testCases.length,
      })),
      null, 2
    );
  }

  if (name === 'get_test_set') {
    const id = String(args.testSetId ?? '').toUpperCase();
    const set = TEST_SETS[id];
    if (!set) {
      return `Unknown test set: "${args.testSetId}". Use list_test_sets to see the available ones.`;
    }
    return JSON.stringify(set, null, 2);
  }

  if (name === 'get_last_execution') {
    const id = String(args.testSetId ?? '').toUpperCase();
    const exec = EXECUTIONS[id];
    if (!exec) {
      return `Unknown test set: "${args.testSetId}". Use list_test_sets to see the available ones.`;
    }
    if (!exec.executionId) {
      return JSON.stringify({ testSetId: id, executed: false, note: 'This test set has never been executed.' }, null, 2);
    }
    const failed = exec.results.filter((r) => r.status === 'FAIL').length;
    return JSON.stringify({ testSetId: id, ...exec, passed: exec.results.length - failed, failed }, null, 2);
  }

  throw new Error(`Unknown tool: ${name}`);
}

// --- JSON-RPC loop over stdio ---------------------------------------------

function reply(id, result) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, result }) + '\n');
}

function replyError(id, code, message) {
  process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }) + '\n');
}

const rl = createInterface({ input: process.stdin });

rl.on('line', (line) => {
  const raw = line.trim();
  if (!raw) return;

  let message;
  try {
    message = JSON.parse(raw);
  } catch {
    return; // ignore anything that is not valid JSON
  }

  const { id, method, params } = message;

  // Notifications carry no id and get no reply.
  if (id === undefined || id === null) return;

  try {
    if (method === 'initialize') {
      reply(id, {
        protocolVersion: params?.protocolVersion ?? '2025-06-18',
        capabilities: { tools: {} },
        serverInfo: { name: 'qa-xray-demo', version: '1.0.0' },
      });
      return;
    }
    if (method === 'tools/list') { reply(id, { tools: TOOLS }); return; }
    if (method === 'tools/call') {
      reply(id, { content: [{ type: 'text', text: runTool(params?.name, params?.arguments) }] });
      return;
    }
    if (method === 'ping') { reply(id, {}); return; }
    replyError(id, -32601, `Unsupported method: ${method}`);
  } catch (error) {
    replyError(id, -32603, error.message);
  }
});

process.stderr.write('[qa-xray-demo] MCP server listening on stdio\n');
