#!/usr/bin/env node
// api-agent.js — CLI wrapper for TypeForge CMS REST API
// Usage: node api-agent.js <command> [args...]
// Env: API_BASE_URL (required), API_KEY (required)

const API_BASE = process.env.API_BASE_URL || '';
const API_KEY = process.env.API_KEY || '';

if (!API_BASE) {
    console.error('Error: API_BASE_URL environment variable is required');
    process.exit(1);
}

async function apiRequest(method, path, body = null) {
    const url = `${API_BASE}${path}`;
    const headers = {
        'Content-Type': 'application/json',
    };
    if (API_KEY) {
        headers['Authorization'] = `Bearer ${API_KEY}`;
    }

    const options = { method, headers };
    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    try {
        const res = await fetch(url, options);
        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = { raw: text };
        }

        if (!res.ok) {
            console.error(`Error ${res.status}: ${JSON.stringify(data, null, 2)}`);
            process.exit(1);
        }
        return data;
    } catch (err) {
        console.error(`Request failed: ${err.message}`);
        process.exit(1);
    }
}

function parseArgs(args) {
    const result = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const val = args[i + 1];
            if (val !== undefined && !val.startsWith('--')) {
                result[key] = val;
                i++;
            } else {
                result[key] = 'true';
            }
        }
    }
    return result;
}

function out(data) {
    console.log(JSON.stringify(data, null, 2));
}

const commands = {
    // ---- Dashboard ----
    'dashboard': async (args) => {
        out(await apiRequest('GET', '/api/dashboard'));
    },

    // ---- Auth ----
    'login': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/auth/login', body));
    },

    // ---- Pages ----
    'list-pages': async () => {
        out(await apiRequest('GET', '/api/pages'));
    },
    'get-page': async (args) => {
        if (!args[0]) { console.error('Usage: get-page <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/pages/${args[0]}`));
    },
    'create-page': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/pages', body));
    },
    'update-page': async (args) => {
        if (!args[0]) { console.error('Usage: update-page <id> --field value'); process.exit(1); }
        const id = args.shift();
        const body = parseArgs(args);
        out(await apiRequest('PUT', `/api/pages/${id}`, body));
    },
    'delete-page': async (args) => {
        if (!args[0]) { console.error('Usage: delete-page <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/pages/${args[0]}`));
    },

    // ---- Articles ----
    'list-articles': async () => {
        out(await apiRequest('GET', '/api/articles'));
    },
    'get-article': async (args) => {
        if (!args[0]) { console.error('Usage: get-article <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/articles/${args[0]}`));
    },
    'create-article': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/articles', body));
    },
    'update-article': async (args) => {
        if (!args[0]) { console.error('Usage: update-article <id> --field value'); process.exit(1); }
        const id = args.shift();
        const body = parseArgs(args);
        out(await apiRequest('PUT', `/api/articles/${id}`, body));
    },
    'delete-article': async (args) => {
        if (!args[0]) { console.error('Usage: delete-article <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/articles/${args[0]}`));
    },

    // ---- Blog Categories ----
    'list-categories': async () => {
        out(await apiRequest('GET', '/api/blog-categories'));
    },
    'get-category': async (args) => {
        if (!args[0]) { console.error('Usage: get-category <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/blog-categories/${args[0]}`));
    },
    'create-category': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/blog-categories', body));
    },
    'update-category': async (args) => {
        if (!args[0]) { console.error('Usage: update-category <id> --field value'); process.exit(1); }
        const id = args.shift();
        const body = parseArgs(args);
        out(await apiRequest('PUT', `/api/blog-categories/${id}`, body));
    },
    'delete-category': async (args) => {
        if (!args[0]) { console.error('Usage: delete-category <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/blog-categories/${args[0]}`));
    },

    // ---- Users ----
    'list-users': async () => {
        out(await apiRequest('GET', '/api/users'));
    },
    'get-user': async (args) => {
        if (!args[0]) { console.error('Usage: get-user <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/users/${args[0]}`));
    },
    'create-user': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/users', body));
    },
    'update-user': async (args) => {
        if (!args[0]) { console.error('Usage: update-user <id> --field value'); process.exit(1); }
        const id = args.shift();
        const body = parseArgs(args);
        out(await apiRequest('PUT', `/api/users/${id}`, body));
    },
    'delete-user': async (args) => {
        if (!args[0]) { console.error('Usage: delete-user <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/users/${args[0]}`));
    },

    // ---- Media ----
    'list-media': async () => {
        out(await apiRequest('GET', '/api/media'));
    },
    'get-media': async (args) => {
        if (!args[0]) { console.error('Usage: get-media <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/media/${args[0]}`));
    },
    'delete-media': async (args) => {
        if (!args[0]) { console.error('Usage: delete-media <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/media/${args[0]}`));
    },

    // ---- Menu ----
    'get-menu': async () => {
        out(await apiRequest('GET', '/api/menu'));
    },
    'update-menu': async (args) => {
        // Accepts JSON string or file path
        let body;
        if (args[0] && !args[0].startsWith('--')) {
            const fs = require('fs');
            if (fs.existsSync(args[0])) {
                body = JSON.parse(fs.readFileSync(args[0], 'utf8'));
            } else {
                body = JSON.parse(args[0]);
            }
        } else {
            body = parseArgs(args);
        }
        out(await apiRequest('POST', '/api/menu', body));
    },

    // ---- Settings ----
    'get-settings': async () => {
        out(await apiRequest('GET', '/api/settings'));
    },
    'get-setting': async (args) => {
        if (!args[0]) { console.error('Usage: get-setting <key>'); process.exit(1); }
        out(await apiRequest('GET', `/api/settings/${args[0]}`));
    },
    'update-settings': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/settings', body));
    },

    // ---- Redirects ----
    'list-redirects': async () => {
        out(await apiRequest('GET', '/api/redirects'));
    },
    'get-redirect': async (args) => {
        if (!args[0]) { console.error('Usage: get-redirect <id>'); process.exit(1); }
        out(await apiRequest('GET', `/api/redirects/${args[0]}`));
    },
    'create-redirect': async (args) => {
        const body = parseArgs(args);
        out(await apiRequest('POST', '/api/redirects', body));
    },
    'update-redirect': async (args) => {
        if (!args[0]) { console.error('Usage: update-redirect <id> --field value'); process.exit(1); }
        const id = args.shift();
        const body = parseArgs(args);
        out(await apiRequest('PUT', `/api/redirects/${id}`, body));
    },
    'delete-redirect': async (args) => {
        if (!args[0]) { console.error('Usage: delete-redirect <id>'); process.exit(1); }
        out(await apiRequest('DELETE', `/api/redirects/${args[0]}`));
    },
    'toggle-redirect': async (args) => {
        if (!args[0]) { console.error('Usage: toggle-redirect <id>'); process.exit(1); }
        out(await apiRequest('POST', `/api/redirects/toggle/${args[0]}`));
    },

    // ---- Help ----
    'help': async () => {
        console.log(`
TypeForge CMS API Agent
=======================

Environment variables:
  API_BASE_URL  Base URL of the CMS (e.g. https://my-app.run.app)
  API_KEY       API key for authentication (Bearer token)

Commands:

  Dashboard:
    dashboard                              Get dashboard stats

  Auth:
    login --email <e> --password <p>       Login and get API key

  Pages:
    list-pages                             List all pages
    get-page <id>                          Get page by ID
    create-page --title <t> [--content <c>] [--status <s>] [--slug <s>]
    update-page <id> --title <t> [--content <c>] [--status <s>]
    delete-page <id>                       Delete page

  Articles:
    list-articles                          List all articles
    get-article <id>                       Get article by ID
    create-article --title <t> [--content <c>] [--status <s>] [--category_id <n>]
    update-article <id> --title <t> [--content <c>] [--status <s>]
    delete-article <id>                    Delete article

  Blog Categories:
    list-categories                        List all categories
    get-category <id>                      Get category by ID
    create-category --name <n> [--slug <s>] [--sort_order <n>]
    update-category <id> --name <n> [--slug <s>]
    delete-category <id>                   Delete category

  Users:
    list-users                             List all users
    get-user <id>                          Get user by ID
    create-user --name <n> --email <e> --password <p> [--role <r>] [--status <s>]
    update-user <id> --name <n> [--email <e>] [--role <r>] [--status <s>]
    delete-user <id>                       Delete user

  Media:
    list-media                             List all media files
    get-media <id>                         Get media by ID
    delete-media <id>                      Delete media file

  Menu:
    get-menu                               Get menu structure
    update-menu <json-file-or-string>      Replace entire menu

  Settings:
    get-settings                           Get all settings
    get-setting <key>                      Get single setting
    update-settings --key1 val1 --key2 val2  Update settings

  Redirects:
    list-redirects                         List all redirects
    get-redirect <id>                      Get redirect by ID
    create-redirect --source_path <p> --target_url <u> [--type <t>] [--status_code <n>]
    update-redirect <id> --source_path <p> [--target_url <u>]
    delete-redirect <id>                   Delete redirect
    toggle-redirect <id>                   Toggle redirect active state
`);
    },
};

// ---- Main ----
const [,, command, ...args] = process.argv;

if (!command || command === '--help' || command === '-h') {
    commands.help();
} else if (commands[command]) {
    commands[command](args);
} else {
    console.error(`Unknown command: ${command}`);
    console.error('Run "node api-agent.js help" for usage');
    process.exit(1);
}
