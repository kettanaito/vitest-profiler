import fs from 'node:fs'
import path from 'node:path'

export const VITEST_PROFILER_DIRECTORY = path.join('test-profiles')

/**
 * @param {string} filename
 * @return {string}
 */
export function createProfileName(filename) {
  const timestamp = new Date()
    .toISOString()
    .replace(/:/g, '-')
    .replace(/\..+/, '')
    .replace('T', '--')

  return `${timestamp}--${filename}`
}

export const mainThreadCpuProfileName = createProfileName(
  'main-thread.cpuprofile',
)

/**
 * Vitest Profiler Plugin.
 * Add this to the `plugins` array of your Vite/Vitest configuration.
 *
 * @example
 * // vite.config.js
 * import { vitestProfiler } from 'vitest-profiler/plugin'
 *
 * export default defineConfig({
 *   plugins: [vitestProfiler()]
 * })
 *
 * @return {import('vite').Plugin}
 */
export function vitestProfiler() {
  const generatedProfiles = [
    {
      name: 'main-thread',
      cpuProfilePath: path.join(
        VITEST_PROFILER_DIRECTORY,
        mainThreadCpuProfileName,
      ),
    },
  ]

  return {
    name: 'vitest-profiler-plugin',
    async config(config) {
      // Skip this plugin entirely if not run from under `vitest-profiler` CLI.
      if (process.env.VITEST_PROFILER_ENABLED !== '1') {
        return config
      }

      if (fs.existsSync(VITEST_PROFILER_DIRECTORY)) {
        await fs.promises.rm(VITEST_PROFILER_DIRECTORY, {
          recursive: true,
          force: true,
        })
      }

      const cpuProfileName = createProfileName('tests.cpuprofile')
      const heapProfileName = createProfileName('tests.heapprofile')

      const execArgv = [
        '--cpu-prof',
        `--cpu-prof-dir=${VITEST_PROFILER_DIRECTORY}`,
        `--cpu-prof-name=${cpuProfileName}`,
        '--heap-prof',
        `--heap-prof-dir=${VITEST_PROFILER_DIRECTORY}`,
        `--heap-prof-name=${heapProfileName}`,
      ]

      generatedProfiles.push({
        name: 'tests',
        cpuProfilePath: path.join(VITEST_PROFILER_DIRECTORY, cpuProfileName),
        heapProfilePath: path.join(VITEST_PROFILER_DIRECTORY, heapProfileName),
      })

      const overrides =
        config.test?.pool === 'threads'
          ? {
              threads: {
                singleThread: true,
                execArgv,
              },
            }
          : {
              forks: {
                singleFork: true,
                execArgv,
              },
            }

      config.test = {
        ...(config.test || {}),
        watch: false,
        poolOptions: {
          ...(config.test?.poolOptions || {}),
          ...overrides,
        },
      }

      return config
    },
    buildEnd() {
      console.log(
        'Test profiling complete! Generated the following profiles:\n',
      )
      generatedProfiles.forEach((profile) => {
        console.log(`  ${profile.name}:
${[
  ['CPU', profile.cpuProfilePath],
  ['Heap', profile.heapProfilePath],
]
  .filter(([_, profilePath]) => !!profilePath)
  .map(([profileName, profilePath]) => `    - ${profileName}:\t${profilePath}`)
  .join('\n')}
`)
      })
    },
  }
}
