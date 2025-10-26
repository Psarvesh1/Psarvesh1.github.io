#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const P = path.resolve(__dirname, '..', 'index.html')
if (!fs.existsSync(P)) {
  console.error('index.html not found at', P)
  process.exit(1)
}
const s = fs.readFileSync(P, 'utf8')
let issues = 0

function report(msg){ console.log(msg); issues++ }

if (!/meta\s+name=["']viewport["']/i.test(s)) report('MISSING: <meta name="viewport">')
if (!/rel=["']preconnect["']\s+href=["']https:\/\/fonts.googleapis.com["']/.test(s)) report('MISSING: preconnect to fonts.googleapis.com')
if (!/rel=["']preconnect["']\s+href=["']https:\/\/fonts.gstatic.com["']/.test(s)) report('MISSING: preconnect to fonts.gstatic.com')
if (!/rel=["']preload["']\s+href=["']css\/default.css["']/.test(s)) console.log('NOTE: css/default.css not explicitly preloaded')
if (!/script[^>]*src=["']js\/script.js["'][^>]*defer/.test(s)) console.log('NOTE: js/script.js is not deferred')

const imgRegex = /<img\b[^>]*src=["']([^"']+)["'][^>]*>/g
let m
while (m = imgRegex.exec(s)){
  const tag = m[0]
  const src = m[1]
  if (!/\balt=/.test(tag)) console.log('IMG MISSING ALT ->', src), issues++
  const disk = src.replace(/^\//, '')
  if (!fs.existsSync(path.resolve(__dirname, '..', disk))) console.log('MISSING FILE ->', src)
}

console.log('Check complete. Total issues flagged:', issues)
