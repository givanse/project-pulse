#!/usr/bin/env bash
# Skip production Netlify builds when the Glimmer site did not change.
#
# Netlify [build] ignore (exit 0 = skip, exit 1 = continue build).
# This command runs FROM THE BASE DIRECTORY. There is no toml `base` (site is
# the repo root), but a leftover UI Base directory would shift cwd. Diff
# pathspecs are resolved with git -C against the repo root ($NETLIFY_REPO_PATH,
# else . if we already look like the repo, else ..). A naive `git diff … .`
# from a leftover base would miss root package.json / ember-cli-build.js.
#
# Fail open to BUILD (exit 1) when refs are missing, equal (Trigger deploy /
# empty cache), or git cannot resolve them. Do not always-skip the UI.
set -u

cached="${CACHED_COMMIT_REF:-}"
commit="${COMMIT_REF:-}"

if [[ -z "$cached" || -z "$commit" ]]; then
  exit 1
fi

# Same SHA: first build, cleared cache, or Deploys → Trigger deploy.
# git diff --quiet would be empty and skip; we must not skip those.
if [[ "$cached" == "$commit" ]]; then
  exit 1
fi

repo="${NETLIFY_REPO_PATH:-}"
if [[ -z "$repo" ]]; then
  if [[ -d ./src && -f ./ember-cli-build.js ]]; then
    repo="."
  elif [[ -d ../src && -f ../ember-cli-build.js ]]; then
    repo=".."
  else
    exit 1
  fi
fi

if [[ ! -d "$repo/src" || ! -f "$repo/ember-cli-build.js" ]]; then
  exit 1
fi

if ! git -C "$repo" cat-file -e "${cached}^{commit}" 2>/dev/null; then
  exit 1
fi
if ! git -C "$repo" cat-file -e "${commit}^{commit}" 2>/dev/null; then
  exit 1
fi

# Paths that ship https://ccp.givan.se. README, Travis, tests, ignore
# helpers, and toml-only ignore/config edits do not force a production
# build (no prod deploy just to land toml).
git -C "$repo" diff --quiet "$cached" "$commit" -- \
  src/ \
  public/ \
  lib/ \
  config/ \
  descriptors/ \
  server/ \
  ember-cli-build.js \
  package.json \
  yarn.lock
status=$?

if [[ "$status" -eq 0 ]]; then
  exit 0
fi
exit 1
