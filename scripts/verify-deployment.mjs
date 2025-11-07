#!/usr/bin/env node
// Simple deployment verifier for Next.js + Vercel

const args = process.argv.slice(2)

function getArgValue(flag, fallback) {
  const idx = args.findIndex((a) => a === flag)
  if (idx >= 0 && args[idx + 1]) return args[idx + 1]
  return fallback
}

const baseUrl = getArgValue('--base', process.env.DEPLOYMENT_URL)
if (!baseUrl) {
  console.error('Usage: npm run verify:deployment -- --base https://your-deployment-url [--check /,/api/health/supabase] [--timeout 30000]')
  process.exit(1)
}

const checksArg = getArgValue('--check', '')
let endpoints = checksArg
  ? checksArg.split(',').map((s) => s.trim()).filter(Boolean)
  : [
      '/',
      '/api/health/supabase',
      '/api/users',
    ]

const timeoutMs = parseInt(getArgValue('--timeout', '15000'), 10)

async function checkEndpoint(path) {
  const url = `${baseUrl}${path}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, { signal: controller.signal })
    const ok = res.ok
    const status = res.status
    console.log(`[${ok ? 'OK' : 'FAIL'}] ${path} -> ${status}`)
    return ok
  } catch (err) {
    const msg = err?.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : (err?.message || err)
    console.error(`[ERROR] ${path} ->`, msg)
    return false
  } finally {
    clearTimeout(timeout)
  }
}

async function main() {
  console.log(`Verifying deployment at: ${baseUrl}`)
  const results = []
  for (const path of endpoints) {
    // Run sequentially to make logs readable
    // and avoid rate-limiting on free tiers
    /* eslint-disable no-await-in-loop */
    const ok = await checkEndpoint(path)
    results.push(ok)
  }
  const passed = results.every(Boolean)
  if (!passed) {
    process.exitCode = 2
    console.error('One or more verification checks failed.')
  } else {
    console.log('All verification checks passed.')
  }
}

main()
