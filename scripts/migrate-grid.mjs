#!/usr/bin/env node

/* eslint-disable no-console */

import fs from 'fs'
import chalk from 'chalk'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const files = args.filter((arg) => !arg.startsWith('--'))

if (files.length === 0) {
  console.error('❌ No input files provided.')
  process.exit(1)
}

// --- Mapping Rules ---

const exactReplacements = {
  'vads-l-grid-container': 'vads-grid-container',
  'vads-l-row': 'vads-grid-row',
  'usa-grid-full': 'vads-grid-container', // Needs to come before usa-grid because replacing usa-grid first will mess this one up
  'usa-grid': 'vads-grid-container',
  'usa-width-one-half': 'vads-grid-col-6',
  'usa-width-one-third': 'vads-grid-col-4',
  'usa-width-two-thirds': 'vads-grid-col-8',
  // Add more as needed
}

const prefixReplacements = {
  'vads-l-col--': 'vads-grid-col-',
}

const breakpointReplacements = {
  'xsmall-screen:vads-l-': 'mobile:vads-grid-',
  'small-screen:vads-l-': 'mobile-lg:vads-grid-',
  'medium-screen:vads-l-': 'tablet:vads-grid-',
  'small-desktop-screen:vads-l-': 'desktop:vads-grid-',
  'large-screen:vads-l-': 'desktop-lg:vads-grid-',
}

const foundationRegexes = [
  /[" :](row|column|columns)\b/g,
  /[" :]small-[\w-]+\b/g,
  /[" :]medium-[\w-]+\b/g,
  /[" :]large-[\w-]+\b/g,
]

// --- Migration Function ---

function migrateContent(content, filePath) {
  let updated = content
  let hasChanges = false

  // Exact replacements
  for (const [from, to] of Object.entries(exactReplacements)) {
    const regex = new RegExp(`\\b${from}\\b`, 'g')
    if (regex.test(updated)) {
      updated = updated.replace(regex, to)
      hasChanges = true
    }
  }

  // Prefix replacements
  for (const [fromPrefix, toPrefix] of Object.entries(prefixReplacements)) {
    const regex = new RegExp(`\\b${fromPrefix}([\\w-]+)\\b`, 'g')
    updated = updated.replace(regex, (_, suffix) => {
      hasChanges = true
      return `${toPrefix}${suffix}`
    })
  }

  // Breakpoint replacements
  for (const [fromPrefix, toPrefix] of Object.entries(breakpointReplacements)) {
    const regex = new RegExp(`\\b${fromPrefix}`, 'g')
    if (regex.test(updated)) {
      updated = updated.replace(regex, toPrefix)
      hasChanges = true
    }
  }

  // Foundation class cleanup (warn instead of replace)
  const lines = updated.split('\n')
  const allFoundationMatches = []

  for (const regex of foundationRegexes) {
    lines.forEach((line, lineNumber) => {
      const lineMatches = line.match(regex)
      if (lineMatches) {
        allFoundationMatches.push({
          lineNumber: lineNumber + 1,
          line: line.trim(),
          matches: lineMatches,
        })
      }
    })
  }

  if (allFoundationMatches.length > 0) {
    console.warn(`⚠️  [${filePath}] contains deprecated Foundation class(es):`)
    allFoundationMatches.forEach(({ lineNumber, line, matches }) => {
      let highlightedLine = line
      // Sort matches by position in reverse order to avoid index shifting
      const matchPositions = []
      matches.forEach((match) => {
        const regex = new RegExp(`\\b${match}\\b`, 'g')
        let matchResult
        while ((matchResult = regex.exec(line)) !== null) {
          matchPositions.push({
            start: matchResult.index,
            end: matchResult.index + match.length,
            match: match,
          })
        }
      })

      // Sort by start position in reverse order
      matchPositions.sort((a, b) => b.start - a.start)

      // Replace matches from end to start to maintain positions
      matchPositions.forEach(({ start, end, match }) => {
        const before = highlightedLine.substring(0, start)
        const after = highlightedLine.substring(end)
        highlightedLine = before + chalk.yellow(match) + after
      })

      console.warn(`   Line ${lineNumber}: ${chalk.cyan(highlightedLine)}`)
    })
    hasChanges = true
  }

  // Remove duplicate class names
  for (const newClassName of Object.values(exactReplacements)
    .concat(Object.values(prefixReplacements))
    .concat(Object.values(breakpointReplacements))) {
    updated = updated.replace(
      new RegExp(`\\b(${newClassName}).+\\1\\b`, 'g'),
      '$1'
    )
  }

  return { updated, hasChanges }
}

// --- File Processor ---

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.error(`❌ File not found: ${file}`)
    continue
  }

  const original = fs.readFileSync(file, 'utf8')
  const { updated, hasChanges } = migrateContent(original, file)

  if (!hasChanges) {
    console.log(`✅ No changes needed: ${file}`)
    continue
  }

  if (dryRun) {
    console.log(`📝 Dry run - proposed changes for: ${file}`)
    const originalLines = original.split('\n')
    const updatedLines = updated.split('\n')
    originalLines.forEach((line, i) => {
      if (line !== updatedLines[i]) {
        console.log(chalk.grey(`${i}:`), chalk.red(`- ${line}`))
        console.log(chalk.grey(`${i}:`), chalk.green(`+ ${updatedLines[i]}`))
        console.log()
      }
    })
  } else {
    fs.writeFileSync(file, updated, 'utf8')
    console.log(`✅ Updated: ${file}`)
  }
}
