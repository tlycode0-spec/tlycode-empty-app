#!/usr/bin/env node

/**
 * Playwright browser CLI — general-purpose browsing, testing & screenshots.
 *
 * Usage:
 *   node browse.js <url> [options]
 *   node browse.js <url> --actions actions.json
 *   node browse.js <url> --script inline-js
 *
 * Options:
 *   --screenshot <path>   Save screenshot (default: screenshot.png)
 *   --full-page           Full-page screenshot
 *   --wait <ms>           Wait after load (default: 2000)
 *   --no-content          Skip content extraction
 *   --actions <file>      JSON file with actions to execute (see below)
 *   --script <code>       Inline JS to run with `page` variable available
 *   --viewport <WxH>      Viewport size (default: 1280x720)
 *
 * Actions JSON format (array of steps):
 *   [
 *     { "action": "goto", "url": "https://..." },
 *     { "action": "click", "selector": "button[type=submit]" },
 *     { "action": "fill", "selector": "input[name=email]", "value": "test@test.cz" },
 *     { "action": "wait", "ms": 1000 },
 *     { "action": "screenshot", "path": "step1.png" },
 *     { "action": "select", "selector": "select[name=country]", "value": "cz" },
 *     { "action": "content" },
 *     { "action": "evaluate", "script": "document.title" }
 *   ]
 *
 * Examples:
 *   node browse.js https://example.com
 *   node browse.js https://example.com --screenshot result.png --full-page
 *   node browse.js https://app.run.app/login --script "await page.fill('input[name=email]','test@test.cz'); await page.fill('input[name=password]','Heslo_123456'); await page.click('button[type=submit]'); await page.waitForTimeout(2000);"
 *   node browse.js https://app.run.app --actions test-flow.json
 */

const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const opts = {
    url: null,
    screenshot: 'screenshot.png',
    fullPage: false,
    wait: 2000,
    content: true,
    actions: null,
    script: null,
    viewport: { width: 1280, height: 720 },
  };

  const args = argv.slice(2);
  let i = 0;

  while (i < args.length) {
    const arg = args[i];
    if (arg === '--screenshot') { opts.screenshot = args[++i]; }
    else if (arg === '--full-page') { opts.fullPage = true; }
    else if (arg === '--wait') { opts.wait = parseInt(args[++i], 10); }
    else if (arg === '--no-content') { opts.content = false; }
    else if (arg === '--actions') { opts.actions = args[++i]; }
    else if (arg === '--script') { opts.script = args[++i]; }
    else if (arg === '--viewport') {
      const [w, h] = args[++i].split('x').map(Number);
      opts.viewport = { width: w, height: h };
    }
    else if (arg === '--help' || arg === '-h') { opts.help = true; }
    else if (!arg.startsWith('--') && !opts.url) { opts.url = arg; }
    i++;
  }

  return opts;
}

function printHelp() {
  console.log(`Playwright Browser CLI

Usage: node browse.js <url> [options]

Options:
  --screenshot <path>   Screenshot path (default: screenshot.png)
  --full-page           Capture full page screenshot
  --wait <ms>           Wait after page load (default: 2000)
  --no-content          Skip text content extraction
  --actions <file>      JSON file with action steps to execute
  --script <code>       Inline JS code (has access to 'page' and 'browser')
  --viewport <WxH>      Viewport size (default: 1280x720)

Actions JSON: array of { action, ...params }
  goto        url                    Navigate to URL
  click       selector               Click element
  fill        selector, value        Fill input field
  select      selector, value        Select dropdown option
  wait        ms                     Wait N milliseconds
  screenshot  path (opt)             Take screenshot
  content                            Extract & print page text content
  evaluate    script                 Run JS in browser context, print result`);
}

function extractContent() {
  const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, a, p, span, li, td, th, label, button');
  const texts = new Set();
  const result = [];

  for (const el of elements) {
    const text = el.textContent?.trim();
    if (text && text.length > 1 && text.length < 300 && !texts.has(text)) {
      texts.add(text);
      const tag = el.tagName.toLowerCase();
      const href = el.getAttribute('href') || '';
      if (tag === 'a' && href) {
        result.push(`[${tag}] ${text} -> ${href}`);
      } else {
        result.push(`[${tag}] ${text}`);
      }
    }
  }
  return result.slice(0, 150).join('\n');
}

async function executeActions(page, actions) {
  for (const step of actions) {
    switch (step.action) {
      case 'goto': {
        const gotoMaxRetries = 3;
        for (let gotoAttempt = 1; gotoAttempt <= gotoMaxRetries; gotoAttempt++) {
          console.log(`> goto ${step.url}${gotoAttempt > 1 ? ` (retry ${gotoAttempt}/${gotoMaxRetries})` : ''}`);
          await page.goto(step.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          const currentUrl = page.url();
          try {
            const expected = new URL(step.url).hostname;
            const actual = new URL(currentUrl).hostname;
            if (actual === expected || actual.endsWith('.' + expected)) break;
            console.warn(`> WARNING: proxy redirected to ${currentUrl}, retrying in ${gotoAttempt * 2}s...`);
            if (gotoAttempt < gotoMaxRetries) await page.waitForTimeout(gotoAttempt * 2000);
          } catch { break; }
        }
        break;
      }
      case 'click':
        console.log(`> click ${step.selector}`);
        await page.click(step.selector, { timeout: 10000 });
        break;
      case 'fill':
        console.log(`> fill ${step.selector} = "${step.value}"`);
        await page.fill(step.selector, step.value);
        break;
      case 'select':
        console.log(`> select ${step.selector} = "${step.value}"`);
        await page.selectOption(step.selector, step.value);
        break;
      case 'wait':
        console.log(`> wait ${step.ms}ms`);
        await page.waitForTimeout(step.ms || 1000);
        break;
      case 'screenshot': {
        const p = step.path || 'screenshot.png';
        console.log(`> screenshot ${p}`);
        await page.screenshot({ path: path.resolve(p), fullPage: !!step.fullPage });
        break;
      }
      case 'content': {
        const text = await page.evaluate(extractContent);
        console.log('\n=== CONTENT ===');
        console.log(text);
        break;
      }
      case 'evaluate': {
        const result = await page.evaluate(step.script);
        console.log(`> evaluate: ${JSON.stringify(result)}`);
        break;
      }
      default:
        console.log(`> unknown action: ${step.action}`);
    }
  }
}

(async () => {
  const opts = parseArgs(process.argv);

  if (opts.help) { printHelp(); process.exit(0); }
  if (!opts.url) { console.error('Error: URL is required. Use --help for usage.'); process.exit(1); }

  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  const launchOptions = {
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/root/.cache/ms-playwright/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox'],
  };

  if (proxyUrl) {
    const url = new URL(proxyUrl);
    launchOptions.proxy = {
      server: `${url.protocol}//${url.host}`,
      username: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
    };
  }

  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage({ viewport: opts.viewport, ignoreHTTPSErrors: true });

  // Check if page was redirected to an unexpected domain (proxy issue)
  function isProxyRedirect(requestedUrl, actualUrl) {
    try {
      const expected = new URL(requestedUrl).hostname;
      const actual = new URL(actualUrl).hostname;
      return actual !== expected && !actual.endsWith('.' + expected);
    } catch { return false; }
  }

  try {
    // Navigate with retry on proxy redirect
    const MAX_RETRIES = 3;
    let lastUrl = '';
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      console.log(`> goto ${opts.url}${attempt > 1 ? ` (retry ${attempt}/${MAX_RETRIES})` : ''}`);
      await page.goto(opts.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(opts.wait);
      lastUrl = page.url();
      if (!isProxyRedirect(opts.url, lastUrl)) break;
      console.warn(`> WARNING: proxy redirected to ${lastUrl}, retrying in ${attempt * 2}s...`);
      if (attempt < MAX_RETRIES) await page.waitForTimeout(attempt * 2000);
    }
    if (isProxyRedirect(opts.url, lastUrl)) {
      console.error(`> ERROR: proxy keeps redirecting to ${lastUrl} instead of ${opts.url}`);
    }

    // Execute actions file
    if (opts.actions) {
      const actionsData = JSON.parse(fs.readFileSync(path.resolve(opts.actions), 'utf-8'));
      await executeActions(page, actionsData);
    }

    // Execute inline script
    if (opts.script) {
      console.log('> running inline script...');
      const fn = new Function('page', 'browser', `return (async () => { ${opts.script} })();`);
      await fn(page, browser);
    }

    // Screenshot
    const screenshotPath = path.resolve(opts.screenshot);
    await page.screenshot({ path: screenshotPath, fullPage: opts.fullPage });
    console.log(`\n=== SCREENSHOT saved: ${screenshotPath} ===`);

    // Title
    const title = await page.title();
    console.log(`\n=== TITLE ===\n${title}`);

    // Content extraction
    if (opts.content) {
      const content = await page.evaluate(extractContent);
      console.log(`\n=== CONTENT ===\n${content}`);
    }
  } catch (err) {
    console.error('Error:', err.message);
    // Try to save screenshot even on error
    try {
      await page.screenshot({ path: path.resolve(opts.screenshot) });
      console.error(`Error screenshot saved: ${path.resolve(opts.screenshot)}`);
    } catch {}
    process.exit(1);
  }

  await browser.close();
})();
