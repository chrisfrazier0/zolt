# zolt task runner. Run `just` (or `just --list`) to see available recipes.

# Show the list of recipes.
default:
    @just --list

# Validate the site without rendering.
check:
    zola check

# Format JS and the README in place via npx.
fmt:
    npx --yes prettier --write --print-width 100 'static/js/**/*.js' README.md

# Verify formatting without writing.
fmt-check:
    npx --yes prettier --check --print-width 100 'static/js/**/*.js' README.md

# Serve the site locally with live reload.
serve:
    zola serve

# Build the site into public/.
zola-build:
    zola build

# Minify the *.js copied from static/js/.
minify-js:
    find public/js -name '*.js' -type f -exec sh -c 'npx --yes esbuild "$1" --minify --outfile="$1.min" && mv "$1.min" "$1"' _ {} \;

# Full production build: Zola build plus post-build minification.
build: check fmt-check clean zola-build minify-js

# Remove the build output.
clean:
    rm -rf public
