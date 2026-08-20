# zdrofit-cli

## Requirements

- Bun
- Node.js available as `node` in `PATH` (Playwright is run in a Node worker for Windows compatibility)

To install dependencies:

```bash
bun install
bunx playwright install chromium
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
