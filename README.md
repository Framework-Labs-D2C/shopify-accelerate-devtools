TODO:
Write udpated Readme.

## `build`

Builds a theme once and exits. Meant for CI (e.g. a GitHub Action that builds on every push to `staging`).

```bash
shopify-accelerate build -e production
```

- Reads the environment from `shopify.theme.toml` (`path`, `mode`, `ignore_*`) like `dev`, and writes to the same output folder (e.g. `./themes/production`).
- Runs everything `dev` does to produce theme output, once: types and presets, naming fixes, the Liquid/JSON build, every section/block/asset JS entry (as `dev --rebuild-js`), `bundle-scripts.js`, and Tailwind (no `--watch`).
- Runs at most one ESLint/Prettier worker per CPU core, minus one (`dev` starts them all at once), so it fits on a standard CI runner.
- Never starts watchers, prompts, calls the Shopify CLI, writes template backups or sends telemetry. `store` and `theme` are not required.
- Exits `0` on success. Exits `1` if a step throws, a JS or Tailwind compile fails, `bundle-scripts.js` reports an error, or template validation fails.
- Prints the output folder, file counts per folder and the time taken.
