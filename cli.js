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
    // Set this flag so the plugin knows if it has to run or not.
    VITEST_PROFILER_ENABLED: '1',
    NODE_OPTIONS: [
      ...(process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS.split(' ') : []),
      '--cpu-prof',
      `--cpu-prof-dir=${VITEST_PROFILER_DIRECTORY}`,
      `--cpu-prof-name=${mainThreadCpuProfileName}`,
    ].join(' '),
  },
})
