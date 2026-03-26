#!/usr/bin/env node

/**
 * TypeForge MCP CLI wrapper
 *
 * Usage:
 *   node typeforge-mcp.js <command> [options as JSON or key=value pairs]
 *
 * Examples:
 *   node typeforge-mcp.js list_projects
 *   node typeforge-mcp.js list_environments project_id=1
 *   node typeforge-mcp.js get_environment project_id=1 environment_id=2
 *   node typeforge-mcp.js get_cloudrun_logs project_id=1 environment_id=2 severity=ERROR limit=20
 *   node typeforge-mcp.js run_sql_query project_id=1 environment_id=2 query="SELECT * FROM users LIMIT 5"
 *   node typeforge-mcp.js get_project project_id=1
 *   node typeforge-mcp.js list_deployments project_id=1 environment_id=2
 *
 * Environment:
 *   TYPEFORGE_MCP_API_TOKEN - API token (required)
 *   TYPEFORGE_API_URL       - MCP endpoint (default: https://typeforge.filipeus.cz/api/mcp)
 */

const https = require('https');
const http = require('http');

const API_URL = process.env.TYPEFORGE_API_URL || 'https://typeforge.filipeus.cz/api/mcp';

function getToken() {
  if (process.env.TYPEFORGE_MCP_API_TOKEN) return process.env.TYPEFORGE_MCP_API_TOKEN;

  console.error('Error: TYPEFORGE_MCP_API_TOKEN environment variable is not set.');
  process.exit(1);
}

function parseArgs(args) {
  const params = {};
  for (const arg of args) {
    const eqIdx = arg.indexOf('=');
    if (eqIdx === -1) continue;
    const key = arg.substring(0, eqIdx);
    let value = arg.substring(eqIdx + 1);

    // Auto-convert numeric values
    if (/^\d+$/.test(value)) {
      value = parseInt(value, 10);
    } else if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    params[key] = value;
  }
  return params;
}

function mcpRequest(method, params, id) {
  return { jsonrpc: '2.0', id, method, params };
}

function httpPost(url, body, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const transport = parsed.protocol === 'https:' ? https : http;

    const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;

    if (proxyUrl) {
      // Use proxy via CONNECT
      const proxy = new URL(proxyUrl);
      const proxyTransport = proxy.protocol === 'https:' ? https : http;

      const connectReq = proxyTransport.request({
        host: proxy.hostname,
        port: proxy.port,
        method: 'CONNECT',
        path: `${parsed.hostname}:${parsed.port || 443}`,
        headers: {
          'Host': `${parsed.hostname}:${parsed.port || 443}`,
          'Proxy-Authorization': 'Basic ' + Buffer.from(`${decodeURIComponent(proxy.username)}:${decodeURIComponent(proxy.password)}`).toString('base64'),
        },
      });

      connectReq.on('connect', (res, socket) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Proxy CONNECT failed: ${res.statusCode}`));
          return;
        }

        const req = https.request({
          socket,
          hostname: parsed.hostname,
          path: parsed.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          rejectUnauthorized: false,
        }, handleResponse(resolve, reject));

        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
      });

      connectReq.on('error', reject);
      connectReq.end();
    } else {
      // Direct connection
      const req = transport.request({
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path: parsed.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }, handleResponse(resolve, reject));

      req.on('error', reject);
      req.write(JSON.stringify(body));
      req.end();
    }
  });
}

function handleResponse(resolve, reject) {
  return (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error(`Invalid JSON response: ${data.substring(0, 200)}`));
      }
    });
    res.on('error', reject);
  };
}

async function callTool(toolName, params) {
  const token = getToken();

  // Initialize session
  const initResp = await httpPost(API_URL, mcpRequest('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'typeforge-cli', version: '1.0.0' },
  }, 1), token);

  if (initResp.error) {
    console.error('MCP init error:', initResp.error.message);
    process.exit(1);
  }

  // Call tool
  const resp = await httpPost(API_URL, mcpRequest('tools/call', {
    name: toolName,
    arguments: params,
  }, 2), token);

  return resp;
}

function printHelp() {
  console.log(`TypeForge MCP CLI

Usage: node typeforge-mcp.js <command> [key=value ...]

Commands (most used):
  list_projects                          List all projects
  get_project project_id=N               Get project details
  list_environments project_id=N         List environments for a project
  get_environment project_id=N environment_id=N   Get environment details (incl. service_url)
  get_cloudrun_logs project_id=N environment_id=N [severity=ERROR] [limit=50] [hours_ago=1]
  run_sql_query project_id=N environment_id=N query="SELECT ..."
  list_deployments project_id=N environment_id=N

Other commands:
  create_project, update_project, delete_project
  create_environment, update_environment, delete_environment
  list_configs, create_config, update_config, delete_config
  get_database, get_cloudrun, get_storage
  list_all_cloudrun, list_all_storage, list_all_databases
  get_github_workflow_runs, get_github_workflow_run_logs
  github_get_file, github_list_directory, github_get_tree
  github_create_or_update_file, github_delete_file
  github_list_branches, github_create_branch
  github_list_pull_requests, github_create_pull_request, github_get_pull_request
  github_search_code, github_move_or_rename_file, github_copy_file

Token: Set TYPEFORGE_MCP_API_TOKEN environment variable`);
}

(async () => {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    process.exit(0);
  }

  const command = args[0];
  const params = parseArgs(args.slice(1));

  try {
    const resp = await callTool(command, params);

    if (resp.error) {
      console.error('Error:', resp.error.message || JSON.stringify(resp.error));
      process.exit(1);
    }

    const result = resp.result;

    // MCP tools/call returns { content: [{ type, text }] }
    if (result && result.content) {
      for (const item of result.content) {
        if (item.type === 'text') {
          // Try to pretty-print JSON
          try {
            const parsed = JSON.parse(item.text);
            console.log(JSON.stringify(parsed, null, 2));
          } catch {
            console.log(item.text);
          }
        } else {
          console.log(JSON.stringify(item, null, 2));
        }
      }
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
