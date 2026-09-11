# zolt task runner. Run `just` (or `just --list`) to see available recipes.

# Show the list of recipes.
default:
    @just --list

# Run all checks.
check: zola-check fmt-check

# Validate the site without rendering.
zola-check:
    zola check

# Verify formatting without writing.
fmt-check:
    npx --yes prettier --check --print-width 100 'static/js/**/*.js'

# Format JS in place via npx.
fmt:
    npx --yes prettier --write --print-width 100 'static/js/**/*.js'

# Serve the site locally with live reload.
serve:
    zola serve

# Full production build: Zola build plus post-build steps.
build: check clean zola-build minify-js

# Build the GitHub Pages demo.
build-pages: build patch-badge
    rm -rf docs
    mv public docs

# Build the site into using zola build.
zola-build:
    zola build

# Minify the *.js copied from static/js/.
minify-js:
    find public/js -name '*.js' -type f -exec sh -c 'npx --yes esbuild "$1" --minify --outfile="$1.min" && mv "$1.min" "$1"' _ {} \;

# Inject the GitHub corner badge into the built HTML.
patch-badge:
    node scripts/patch-badge.mjs public

# Remove the build output.
clean:
    rm -rf public
