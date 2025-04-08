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
