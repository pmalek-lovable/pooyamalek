# Working on this site

Pooya's personal site: plain HTML, CSS and JavaScript with no build step. Netlify publishes whatever is on `main`.

## How changes happen

- Never commit directly to `main`. `main` is what's live.
- One branch per change, named by type: `update/...`, `fix/...`, `content/...`, `experiment/...`.
- Keep commits small. Messages describe what changed, in plain words.
- Every change reaches `main` through a pull request. Pooya reviews the Netlify deploy preview, then merges.
- Pooya pushes and opens pull requests in GitHub Desktop. Prepare the branch and the changes, then tell him what to review.

## Undoing a mistake

- Not committed yet: discard the changes to that file.
- Committed on a branch: fix it with a new commit, or drop the branch.
- Already merged: use GitHub's Revert button on the pull request. Never rewrite `main`'s history or force-push.

## Explaining

Pooya is a product designer, not an engineer. Explain Git and code concepts briefly, in design language.

## Site notes

- Hash-routed single-page app: routes and views live in `app.js` and `views.js`.
- Service worker (`sw.js`): bump `CACHE_NAME` whenever shipped files change, so returning visitors get the new version.
- `.claude/` and `skills/` stay on this Mac only (see `.gitignore`).
