#!/usr/bin/env node
// Simple deployment verifier for Next.js + Vercel

const args = process.argv.slice(2)
const baseArgIndex = args.findIndex((a) => a === '--base')
const baseUrl = baseArgIndex >= 0 ? args[baseArgIndex + 1] : process.env.DEPLOYMENT_URL

if (!baseUrl) {
  console.error('Usage: npm run verify:deployment -- --base https://your-deployment-url')
  process.exit(1)
}

const endpoints = [
  '/',
  '/api/health/db',
  '/api/stats',
  '/api/users',
]

async function checkEndpoint(path) {
  const url = `${baseUrl}${path}`
  try {
    const res = await fetch(url)
    const ok = res.ok
    const status = res.status
    const text = await res.text()
    console.log(`[${ok ? 'OK' : 'FAIL'}] ${path} -> ${status}`)
    return ok
  } catch (err) {
    console.error(`[ERROR] ${path} ->`, err?.message || err)
    return false
  }
}

async function main() {
  console.log(`Verifying deployment at: ${baseUrl}`)
  const results = await Promise.all(endpoints.map(checkEndpoint))
  const passed = results.every(Boolean)
  if (!passed) {
    process.exitCode = 2
    console.error('One or more verification checks failed.')
  } else {
    console.log('All verification checks passed.')
  }
}

main()

