# project-pulse

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Yarn](https://yarnpkg.com/en/)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone <repository-url>` this repository
* `cd project-pulse`
* `yarn`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Testing

 * `ember test --server`
 * Run the tests at [http://localhost:7357](http://localhost:7357).

## Explicit Netlify deploys (credits)

Production deploys of https://ccp.givan.se (`project-pulse`) cost Netlify credits shared across this account (~15 per production deploy, 300/month). **Do not ship on every PR or every `master` push.** Use the Netlify CLI (linked site), not the dashboard.

**How to ship on purpose**

From the **repo root**, on the linked `project-pulse` site (`netlify status`).

```bash
netlify status                 # confirm the linked project
netlify deploy --prod          # local/CLI build + publish (ignore command does not apply)
```

If the site is not linked: `netlify link --name project-pulse`.

**Or** POST a **build hook** (remote git build; [hooks bypass ignore](https://docs.netlify.com/build/configure-builds/ignore-builds/)):

```bash
netlify status                 # copy site id
netlify api listSiteBuildHooks --data '{"site_id":"SITE_ID"}'
curl -X POST -d {} "$HOOK_URL"
```

Do **not** `netlify deploy --prod` just to land an ignore-toml change. Path ignore is read from the commit used on the next intentional ship.

**Merge / git CD:** squash-merge with `[skip netlify]` in the commit message **unless that merge is the intentional ship**. Landing ignore/docs on `master` should skip; shipping the Glimmer site should not.

**What path ignore does (production / `master` git builds)**

`[build] ignore` runs `scripts/netlify-ignore.sh` from the **base directory** (repo root). The script `git -C`s to the repo root (`$NETLIFY_REPO_PATH`, else `.` or `..`) and skips (exit 0) when **none** of `src/`, `public/`, `lib/`, `config/`, `descriptors/`, `server/`, `ember-cli-build.js`, `package.json`, or `yarn.lock` changed between `$CACHED_COMMIT_REF` and `$COMMIT_REF`. README, Travis, tests, and toml-only ignore edits do **not** force a production git build.

Missing or equal git refs fail **open to BUILD** (exit 1) so a same-SHA retry or empty cache is not silently skipped. CLI `netlify deploy --prod` uploads a local build and does not use this ignore.

Path ignore **still allows a git production build** when those site paths change on `master` without `[skip netlify]`. That is why squash-merge of this kind of change uses `[skip netlify]` unless it is the ship.

**Deploy Previews and branch deploys**

Toml always skips them (`[context.deploy-preview]` / `[context.branch-deploy]` `ignore = "exit 0"`). `skip_prs` is already true (CLI). Keep `stop_builds` false. This repo has no branch-deploy workflow.

## Further Reading / Useful Links

* [glimmerjs](http://github.com/tildeio/glimmer/)
* [ember-cli](https://ember-cli.com/)
