<p align="center">
  <img src="static/img/zolt.png" alt="zolt" width="160">
</p>

# zolt

> zolt (Zola Template) is an opinionated skeleton for
> [Zola](https://www.getzola.org/) — not a ready-to-run site, but a starting
> point that makes building new sites less painful.

**[Live demo →](https://lab.frazier.software/zolt/)**

[![release](https://img.shields.io/github/v/release/chrisfrazier0/zolt.svg)](https://github.com/chrisfrazier0/zolt/releases)
[![license](https://img.shields.io/github/license/chrisfrazier0/zolt.svg)](LICENSE)

zolt stays out of your way. It's a skeleton, not a finished site — it wires up
the parts you'd otherwise rebuild every time — articles, galleries, taxonomies,
feeds, and search — so starting a new Zola site is less painful and repetitive.
The styles are intentionally minimal: a plain, readable baseline meant to be
replaced, not a theme to fight. Delete the sample content, edit `zola.toml`, and
build from there.

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

That's the starting point, not the finish line. zolt is a skeleton, so expect to
make it yours: adjust the templates in `templates/` to fit your structure, and
bring your own styles — the SASS in `sass/` is a bare baseline meant to be
extended or swapped out, not a finished design.

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
