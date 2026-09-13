# zolt task runner. Run `just` (or `just --list`) to see available recipes.

# Cloudflare Turnstile always-pass test site key. `just dev` injects this into
# the local build so the widget works on localhost without the real site key.
turnstile_test_sitekey := "1x00000000000000000000AA"

# Show the list of recipes.
default:
    @just --list

# Run all checks.
check: zola-check fmt-check worker-check

# Validate the site without rendering.
zola-check:
    zola check

# Typecheck the Cloudflare Worker (no emit).
worker-check:
    npx --yes tsc --noEmit -p tsconfig.json

# Verify formatting without writing.
fmt-check:
    npx --yes prettier --check --print-width 100 'static/js/**/*.js' 'worker/**/*.ts'

# Format JS/TS in place via npx.
fmt:
    npx --yes prettier --write --print-width 100 'static/js/**/*.js' 'worker/**/*.ts'

# Serve the site locally with live reload and Sveltia CMS.
serve:
    zola serve

# Run the Worker + static assets locally. Builds with the localhost base URL so
# links/assets resolve under `wrangler dev`.
dev: (build "-u http://localhost:8787")
    sed 's/data-sitekey=[^ >]*/data-sitekey={{turnstile_test_sitekey}}/' public/contact/index.html > public/contact/index.html.tmp
    mv public/contact/index.html.tmp public/contact/index.html
    npx --yes wrangler dev

# Full production build: Zola build plus post-build steps. Pass extra `zola build`
# flags via `flags` (e.g. `-u <base_url>`); defaults to none.
build flags="": check clean (zola-build flags) strip-admin minify-js patch-badge

# Build the site into public/ using zola build. Optional `flags` are appended.
zola-build flags="":
    zola build {{flags}}

# Remove the Sveltia CMS admin panel from the build output.
strip-admin:
    rm -rf public/admin

# Minify the *.js copied from static/js/.
minify-js:
    find public/js -name '*.js' -type f -exec sh -c 'npx --yes esbuild "$1" --minify --outfile="$1.min" && mv "$1.min" "$1"' _ {} \;

# Inject the GitHub corner badge into the built HTML.
patch-badge:
    node scripts/patch-badge.mjs public

# Remove the build output.
clean:
    rm -rf public
