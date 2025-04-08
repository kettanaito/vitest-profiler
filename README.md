# `vitest-profiler`

A Vite plugin to profile Vitest test runs.

## Getting started

### 1. Install

```sh
npm i vitest-profiler-plugin
```

### 2. Add plugin

```js
// vite.config.js
import { vitestProfiler } from 'vitest-profiler/plugin'

export default defineConfig({
  plugins: [vitestProfiler()],
})
```

### 3. Run tests

```sh
vitest-profiler npm test
```

```json
{
  "scripts": {
    "test": "vitest",
    "test:profile": "vitest-profiler npm test"
  }
}
```
