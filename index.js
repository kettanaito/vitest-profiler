throw new Error(
  `The "vitest-profile" module is not meant to be imported directly. You likely meant to import the plugin instead:
	
import { vitestProfiler } from 'vitest-profiler/plugin'
`,
)
