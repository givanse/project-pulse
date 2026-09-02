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

Production deploys of https://ccp.givan.se (`project-pulse`) cost Netlify credits shared across this account (~15 per production deploy, 300/month). **Do not ship on every PR or every `master` push.**

**How to ship on purpose**

- **Deploys → Trigger deploy** (top of the deploy list). Same-SHA retries fail open so path ignore does not skip this.
- **Build hook** (bypasses ignore entirely): **Project configuration → Build & deploy → Continuous deployment → Build hooks** → **Add build hook**. `POST` that URL when you mean to publish.

**What path ignore does (production / `master`)**

`[build] ignore` runs `scripts/netlify-ignore.sh` from the **base directory** (repo root unless a leftover UI Base directory is set). The script `git -C`s to the repo root (`$NETLIFY_REPO_PATH`, else `.` or `..`) and skips (exit 0) when **none** of `src/`, `public/`, `lib/`, `config/`, `descriptors/`, `server/`, `ember-cli-build.js`, `package.json`, `yarn.lock`, or `netlify.toml` changed between `$CACHED_COMMIT_REF` and `$COMMIT_REF`. README, Travis, and tests do **not** force a production build.

Missing or equal git refs fail **open to BUILD** (exit 1) so **Deploys → Trigger deploy** is never silently skipped. [Build hooks ignore the ignore command](https://docs.netlify.com/build/configure-builds/ignore-builds/).

Path ignore **still allows a production build** when those site paths change on `master`. That is not “only when we click.”

**Deploy Previews and branch deploys**

Toml always skips them (`[context.deploy-preview]` / `[context.branch-deploy]` `ignore = "exit 0"`). `skip_prs` is already true in the dashboard.

**Leftover Netlify UI clicks**

Toml already skips Deploy Previews and non-site production builds. Optional dashboard clicks:

1. Confirm **Deploy Previews** stay off (`skip_prs` is already true): **Project configuration → Build & deploy → Continuous Deployment → Branches and deploy contexts** → **Configure** → disable **Deploy Previews** → **Save**.
2. Path ignore **still auto-builds production** when site paths or `netlify.toml` change on `master`. Click-only even then is a UI lever, not toml:
   - **Deploys → Lock** to stop auto publishing — still **burns build credits**, only holds ccp.givan.se.
   - **Project configuration → Build & deploy → Continuous deployment → Build settings** → **Configure** → **Build status** → **Stopped builds** — stops git, hooks, and Trigger deploy. **Do not use this** (`stop_builds` also blocks intentional deploys).
3. Intentional UI ship (builds still Active): **Deploys → Trigger deploy**, or **Project configuration → Build & deploy → Continuous deployment → Build hooks** → **Add build hook**.

Do **not** fill **Base directory** / **Build command** / **Publish directory** in the UI to match this toml (this file does not set those; leftover UI values remain the live build path). Do not Trigger deploy just to land an ignore-toml change; the next intentional UI ship picks up the committed config.

## Further Reading / Useful Links

* [glimmerjs](http://github.com/tildeio/glimmer/)
* [ember-cli](https://ember-cli.com/)
