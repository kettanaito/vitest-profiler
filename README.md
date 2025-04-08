# `vitest-profiler`

A Vite plugin to profile Vitest test runs.

## Motivation

Vitest has fantastic documentation on [Profiling Test Performance](https://vitest.dev/guide/profiling-test-performance.html). When it comes to profiling said performance in practice, it involves a series of configuration and Node.js process modifications that felt too tedious for me to repeat every time. Besides, you likely want those profiling options to be conditional anyway, to apply only when you actually want to profile your test run.

I've created this plugin to implement the Vitest recommendations of test profiling while simultaneously giving you a nice experience while doing so. I also intend to keep this plugin in-sync with the Vitest team recommendations in the future so for you it's a single point of entry for accessible test profiling.

## Getting started

### 1. Install

First, add this package as a dependency to your project:

```sh
npm i vitest-profiler-plugin --save-dev
```

### 2. Add plugin

Next, add the `vitestProfiler` plugin from the `vitest-profiler/plugin` package to the `plugins` array of your Vite/Vitest configuration:

```js
// vite.config.js
import { vitestProfiler } from 'vitest-profiler/plugin'

export default defineConfig({
  plugins: [vitestProfiler()],
})
```

> The plugin automatically configures your threads/forks with the correct `execArgv` to privision Node.js process profiling. It does nothing unless you [run your tests](#3-run-tests) correctly.

### 3. Run tests

Finally, run your test command prepending `vitest-profiler` before it:

```sh
vitest-profiler npm test
```

Alternatively, you can create a custom NPM script to use as a shorthand:

```json
{
  "scripts": {
    "test": "vitest",
    "test:profile": "vitest-profiler npm test"
  }
}
```

### 4. Observe output

After running your tests with the profiler, you will see a message listing all the generated profiles:

```sh
Test profiling complete! Generated the following profiles:

  main-thread:
    - CPU:      test-profiles/2025-04-08-10-30-12-main-thread.cpuprofile

  tests:
    - CPU:      test-profiles/2025-04-08--10-30-12-tests.cpuprofile
    - Heap:     test-profiles/2025-04-08--10-30-12-tests.heapprofile
```

Navigate to the respective files to observe and debug your test performance. Here's a quick guide on each file:

- **CPU profiles** (`*.cpuprofile`) record your CPU usage during the test run. Look here to see what takes the most _time_ in your tests;
- **Heap profiles** (`*.heapprofile`) record memory usage during the test run. Look here for potential _memory leaks/heaps_ and other memory management issues.
