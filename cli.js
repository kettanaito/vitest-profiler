#!/usr/bin/env node
import { execSync } from 'node:child_process'
import {
  VITEST_PROFILER_DIRECTORY,
  mainThreadCpuProfileName,
} from './plugin.js'

const argv = process.argv.slice(2)

execSync(`${argv.join(' ')}`, {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: [
      ...(process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS.split(' ') : []),
      '--cpu-prof',
      `--cpu-prof-dir=${VITEST_PROFILER_DIRECTORY}`,
      `--cpu-prof-name=${mainThreadCpuProfileName}`,
    ].join(' '),
  },
})
