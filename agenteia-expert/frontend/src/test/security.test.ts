// @vitest-environment node
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

function collectSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)
    if (stat.isDirectory()) {
      if (entry === 'test') {
        continue
      }
      files.push(...collectSourceFiles(fullPath))
    } else if (/\.(tsx|ts)$/.test(entry)) {
      files.push(fullPath)
    }
  }
  return files
}

describe('xss safety', () => {
  it('does not use innerHTML or dangerouslySetInnerHTML in src', () => {
    const srcDir = join(import.meta.dirname, '..')
    const sources = collectSourceFiles(srcDir).map((file) => readFileSync(file, 'utf8'))
    const combined = sources.join('\n')
    expect(combined).not.toContain('dangerouslySetInnerHTML')
    expect(combined).not.toContain('.innerHTML')
  })
})
