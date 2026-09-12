<p align="center">
  <img src="static/img/zolt.png" alt="zolt" width="160">
</p>

# zolt

> zolt (Zola Template) is an opinionated starting point for
> [Zola](https://www.getzola.org/) — a foundation to fork and make your own,
> not a drop-in theme.

**[Live demo →](https://lab.frazier.software/zolt/)**

[![release](https://img.shields.io/github/v/release/chrisfrazier0/zolt.svg)](https://github.com/chrisfrazier0/zolt/releases)
[![license](https://img.shields.io/github/license/chrisfrazier0/zolt.svg)](LICENSE)

zolt stays out of your way. It wires up the parts you'd otherwise rebuild every
time — articles, galleries, taxonomies, feeds, search, light/dark mode, etc. —
so starting a new Zola site is less painful and repetitive. The styles are
intentionally restrained: a clean, readable baseline you can run as-is or use as
the groundwork for your own design. Delete the sample content, edit `zola.toml`,
and build from there.

## Requirements

zolt targets Zola **0.23+**. Install it from the
[Zola releases](https://www.getzola.org/documentation/getting-started/installation/),
then:

```sh
git clone https://github.com/chrisfrazier0/zolt.git my-site
cd my-site
zola serve
```

Open <http://127.0.0.1:1111> and edit away.

Production builds are driven by [just](https://github.com/casey/just), which also runs
the JavaScript through [esbuild](https://esbuild.dev/) (fetched on demand via
[npx](https://docs.npmjs.com/cli/commands/npx), so [Node.js](https://nodejs.org/)
is required for this step):

```sh
just build   # zola build + minify the *.js from static/js/
```

Run `just` to list the available recipes.

## Making it yours

Edit `zola.toml` — set `base_url`, `title`, `description`, and `author`. The
`base_url` drives feed URLs, the sitemap, and absolute links, so set it before
deploying. Then replace the sample content under `content/`.

zolt is built to be forked and modified. Adjust the templates in `templates/`
to fit your structure, and shape the look from `sass/` — the colour palette
lives in one place (`sass/_theme.sass`), so light and dark are easy to retune,
and the rest is a baseline to extend or replace. Run it close to the default
or take it somewhere else entirely.

### Analytics

zolt ships with **no tracking**. Add your provider's snippet in
`templates/partials/analytics.html` (it's included on every page). If the
provider talks to another origin, widen the Content-Security-Policy to match
(see below).

### Content Security Policy

A CSP `<meta>` in `templates/base.html` restricts scripts, styles, fonts, and
connections to `self` plus the jsDelivr CDN (used by KaTeX). Extend its
directives when you add third-party origins — e.g. an analytics or fonts host.
For stronger protection (and `frame-ancestors`), serve the same policy as an
HTTP header from your host, which overrides the meta tag.

## License

Licensed under the [MIT License](LICENSE).

## Links

- Demo: <https://lab.frazier.software/zolt/>
- Source: <https://github.com/chrisfrazier0/zolt>
- Zola: <https://www.getzola.org/>
