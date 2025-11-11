# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.6.4-alpha] - 2025-11-11

### Added
- Dual build (CJS + ESM) under `dist/` with shared type declarations.
- Package `exports` map to expose `require`/`import` entry points.
- Smoke command `npm run test-module-import` using sandboxes in
  `sandbox/module-import`.

### Changed
- Jest resolver to translate local `.js` imports during TypeScript testing.
- Update dependencies.

