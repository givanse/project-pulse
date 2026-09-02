#!/usr/bin/env bash
# Netlify [build] ignore: skip when the Glimmer site did not change.
# Simulates Netlify running the script from base (repo root, or a leftover
# UI base subdirectory). No live Netlify. Exit 0 = skip, exit 1 = continue.
set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
script="$root/scripts/netlify-ignore.sh"
fail=0

section() {
  echo
  echo "[test:netlify-ignore] $*"
}

assert_eq() {
  local got="$1" want="$2" msg="$3"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL: $msg (got $got, want $want)" >&2
    fail=1
  fi
}

git_in() {
  local cwd="$1"
  shift
  git -C "$cwd" "$@"
}

sha() {
  git_in "$1" rev-parse HEAD
}

commit_file() {
  local cwd="$1" rel="$2" contents="$3" message="$4"
  mkdir -p "$cwd/$(dirname "$rel")"
  printf '%s' "$contents" >"$cwd/$rel"
  git_in "$cwd" add "$rel"
  git_in "$cwd" commit -m "$message" >/dev/null
  sha "$cwd"
}

# Run ignore with an explicit env. Empty cached/commit unsets those vars.
# repo_path __unset__ unsets NETLIFY_REPO_PATH. cwd is where Netlify would run.
run_ignore() {
  local cached="${1-}" commit="${2-}" repo_path="${3-}" cwd="${4-}"
  local status=0
  (
    cd "$cwd"
    if [[ -z "$cached" ]]; then unset CACHED_COMMIT_REF; else export CACHED_COMMIT_REF="$cached"; fi
    if [[ -z "$commit" ]]; then unset COMMIT_REF; else export COMMIT_REF="$commit"; fi
    if [[ "$repo_path" == "__unset__" ]]; then unset NETLIFY_REPO_PATH; else export NETLIFY_REPO_PATH="$repo_path"; fi
    bash "$script"
  ) || status=$?
  echo "$status"
}

fixture_repo() {
  local dir
  dir="$(mktemp -d "${TMPDIR:-/tmp}/pp-nignore-XXXXXX")"
  git_in "$dir" init -b master >/dev/null
  git_in "$dir" config user.email "test@example.com"
  git_in "$dir" config user.name "test"
  git_in "$dir" config commit.gpgsign false
  mkdir -p "$dir/src" "$dir/public" "$dir/lib" "$dir/config" "$dir/descriptors" "$dir/server" "$dir/tests"
  printf 'src\n' >"$dir/src/app.ts"
  printf 'ok\n' >"$dir/public/robots.txt"
  printf 'lib\n' >"$dir/lib/index.js"
  printf 'config\n' >"$dir/config/environment.js"
  printf '{}\n' >"$dir/descriptors/bitcoin.json"
  printf 'server\n' >"$dir/server/index.js"
  printf 'module.exports = {};\n' >"$dir/ember-cli-build.js"
  printf '{}\n' >"$dir/package.json"
  printf '# lock\n' >"$dir/yarn.lock"
  printf '[build]\n' >"$dir/netlify.toml"
  printf '# project-pulse\n' >"$dir/README.md"
  printf 'language: node_js\n' >"$dir/.travis.yml"
  printf 'test\n' >"$dir/tests/index.html"
  git_in "$dir" add .
  git_in "$dir" commit -m "seed" >/dev/null
  echo "$dir"
}

section "toml ignore path starts with ./ and DP always skips"
assert_eq "$(grep -c 'ignore = "bash ./scripts/netlify-ignore.sh"' "$root/netlify.toml")" 1 "production ignore uses ./scripts/…"
assert_eq "$(awk '/\[context.deploy-preview\]/{getline; print}' "$root/netlify.toml" | tr -d '[:space:]')" 'ignore="exit0"' "deploy-preview ignore exit 0"
assert_eq "$(awk '/\[context.branch-deploy\]/{getline; print}' "$root/netlify.toml" | tr -d '[:space:]')" 'ignore="exit0"' "branch-deploy ignore exit 0"
if grep -Eq '^\s*stop_builds\s*=' "$root/netlify.toml"; then
  echo "FAIL: netlify.toml must not set stop_builds" >&2
  fail=1
fi

fx="$(fixture_repo)"
cached="$(sha "$fx")"

section "missing refs fail open to BUILD"
assert_eq "$(run_ignore "" "" "$fx" "$fx")" 1 "both refs unset"
assert_eq "$(run_ignore "$cached" "" "$fx" "$fx")" 1 "COMMIT_REF unset"
assert_eq "$(run_ignore "" "$cached" "$fx" "$fx")" 1 "CACHED_COMMIT_REF unset"

section "equal refs fail open (Trigger deploy / empty cache)"
assert_eq "$(run_ignore "$cached" "$cached" "$fx" "$fx")" 1 "equal SHAs"

section "README / Travis / tests skip"
readme="$(commit_file "$fx" "README.md" "# update"$'\n' "docs")"
assert_eq "$(run_ignore "$cached" "$readme" "$fx" "$fx")" 0 "README-only"
travis="$(commit_file "$fx" ".travis.yml" "language: node_js"$'\n'"node_js:"$'\n'"  - 8"$'\n' "travis")"
assert_eq "$(run_ignore "$readme" "$travis" "$fx" "$fx")" 0 "travis-only"
tests="$(commit_file "$fx" "tests/index.html" "test2"$'\n' "tests")"
assert_eq "$(run_ignore "$travis" "$tests" "$fx" "$fx")" 0 "tests-only"

section "site paths continue BUILD"
src="$(commit_file "$fx" "src/app.ts" "src2"$'\n' "ui")"
assert_eq "$(run_ignore "$tests" "$src" "$fx" "$fx")" 1 "src/"
pub="$(commit_file "$fx" "public/robots.txt" "ok2"$'\n' "public")"
assert_eq "$(run_ignore "$src" "$pub" "$fx" "$fx")" 1 "public/"
toml="$(commit_file "$fx" "netlify.toml" "[build]"$'\n'"ignore = \"x\""$'\n' "toml")"
assert_eq "$(run_ignore "$pub" "$toml" "$fx" "$fx")" 1 "netlify.toml"

section "honor leftover base cwd + NETLIFY_REPO_PATH"
mkdir -p "$fx/leftover-base"
naive=0
git -C "$fx/leftover-base" diff --quiet "$pub" "$toml" -- . || naive=$?
assert_eq "$naive" 0 "sanity: git diff . from leftover base misses root netlify.toml"

assert_eq "$(run_ignore "$pub" "$toml" "__unset__" "$fx/leftover-base")" 1 \
  "NETLIFY_REPO_PATH unset, cwd leftover-base, root toml change must BUILD"
assert_eq "$(run_ignore "$pub" "$toml" "$fx" "$fx/leftover-base")" 1 \
  "NETLIFY_REPO_PATH set, cwd leftover-base, root toml change must BUILD"
assert_eq "$(run_ignore "$tests" "$src" "__unset__" "$fx")" 1 \
  "NETLIFY_REPO_PATH unset, cwd repo root, src change must BUILD"

section "unknown git refs fail open"
assert_eq "$(run_ignore "$cached" "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" "$fx" "$fx")" 1 "unknown COMMIT_REF"

rm -rf "$fx"

if [[ "$fail" -ne 0 ]]; then
  echo
  echo "[test:netlify-ignore] FAILED"
  exit 1
fi
echo
echo "[test:netlify-ignore] ok"
