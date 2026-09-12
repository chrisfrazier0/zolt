# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Light and dark mode support that defaults to the system preference, with a
  half-filled circle toggle in the site navigation (`theme-toggle.js`) and a
  zero-flash inline `<head>` script that applies the saved choice before paint.
- Copy-to-clipboard buttons on code blocks via `code-copy.js`, hidden until the
  block is hovered (and always shown on touch devices), with a keyboard-focus
  fallback and a reduced-motion opt-out.

### Changed

- Centralized all theme colours as CSS custom properties in `sass/_theme.sass`,
  so both the light and dark palettes are adjusted in one place.

- Converted the `pagination.html` and `feed_links.html` partials into Tera 2
  components with explicit parameters, replacing the previous
  `{% set %}`-before-`{% include %}` call pattern.
- Added a `feed_alternate` component for the `<head>` feed autodiscovery
  `<link>` tags, removing the duplicated loop shared by the home and series
  templates.
- Moved each component into its own file under `templates/components/` (the
  `katex` component included), one component per file.

### Fixed

- Gallery lightbox on small screens: the prev/next chevrons no longer overlap
  the image (the figure reserves a horizontal gutter on each side) and the
  prev/next/close controls have larger tap targets.

## [1.0.0]

Initial release.

### Added

- Sibling content sections for `article/` and `gallery/`, woven into a single
  chronological home feed (newest first) with dates inferred from the
  `YYYY-MM-DD` filename prefix rather than frontmatter.
- Dynamic feed cards via a shared `post_card.html` partial that renders an
  article or gallery layout based on the page's component kind.
- Taxonomies for `tags`, `series`, and `location`, each with its own listing.
  Tag and location term pages are paginated; series pages stay unpaginated and
  ordered oldest-first, with prev/next navigation on article singles.
- Pagination across the home feed, tag, and location pages through a reusable
  `pagination.html` partial with accessible prev/next controls.
- KaTeX math rendering (inline and block) via a `katex` component, loaded from
  jsDelivr with Subresource Integrity hashes and `crossorigin` on every asset.
- Client-side search built on Zola's elasticlunr index: a full-width input with
  a magnifier icon, debounced queries, staggered result fade-in, an animated
  collapsible results panel, published dates on results, and a `<noscript>`
  fallback for no-JS visitors.
- Atom and RSS feeds with autodiscovery `<link>` tags site-wide and per-series,
  plus reusable feed icon links via a `feed_links.html` partial.
- A complete favicon set and `site.webmanifest` generated from the logo, wired
  into `base.html` with base-url-aware `get_url` prefixing, and a circular
  header logo.
- Open Graph and Twitter Card social sharing meta tags via a shared
  `social_meta.html` partial, with sensible fallbacks, raster share images, and
  per-page frontmatter overrides.
- Revision dates: an optional `updated` field surfaced visibly next to the
  published date and socially as `article:modified_time`, without affecting
  chronological sorting.
- Accessibility: a skip-to-content link, `aria-current` on the active nav item,
  labelled navigation landmarks, an `aria-live` search status, and a
  reduced-motion override.
- Security: a Content-Security-Policy `<meta>` tag scoped to `self` plus
  jsDelivr, and a blank `analytics.html` partial for opt-in tracking.
- SEO: `rel="canonical"` on content pages and a `theme-color` meta tag.
- Smooth in-page anchor scrolling with a reduced-motion fallback.
- A version marker (`[extra].zolt_version`) surfaced as a `<meta name="generator">` tag.
- A `justfile` task runner: `serve`, `build` (Zola build plus JS minification via
  esbuild), `check` (Zola link validation), and `fmt` / `fmt-check` (Prettier via
  `npx`, no committed `package.json`).

[Unreleased]: https://github.com/chrisfrazier0/zolt/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/chrisfrazier0/zolt/releases/tag/v1.0.0
