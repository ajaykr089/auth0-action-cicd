# auth0-action-cicd

Simple CI/CD starter for Auth0 Actions.

This repo is designed for a developer-friendly workflow:

- keep Auth0 Actions in git
- edit them locally in VS Code
- deploy them from GitHub Actions or Bitbucket Pipelines

## How it works

1. Create or edit an action locally from VS Code.
2. Keep the Auth0 Actions configuration in this repo.
3. Commit and push.
4. Let GitHub Actions or Bitbucket Pipelines deploy to Auth0.

## Files added in this repo

- `config/auth0.json`: safe committed config for Deploy CLI. It only manages `actions` and `triggers`.
- `auth0/`: exported Auth0 YAML plus generated action code files will live here after your first export.
- `.github/workflows/auth0-deploy.yml`: GitHub Actions deployment pipeline.
- `bitbucket-pipelines.yml`: Bitbucket Pipelines deployment pipeline.
- `package.json`: local scripts for export and deploy.

## One-time Auth0 setup

Create a dedicated Machine to Machine application in Auth0 for CI/CD:

1. Auth0 Dashboard -> Applications -> Applications -> Create Application.
2. Name it something like `Deploy CLI`.
3. Choose `Machine to Machine Applications`.
4. Authorize it against `Auth0 Management API`.
5. Grant the scopes needed to manage actions and trigger bindings.

For this repository, keep `AUTH0_ALLOW_DELETE` set to `false` unless you explicitly want CI to delete removed actions.

## Local setup

Install Node.js 20.18.1 or later, then install dependencies:

```bash
npm install
```

Create a local env file instead of exporting secrets in your shell:

```bash
cp .env.example .env.local
```

Then put your real Auth0 values in `.env.local`:

```env
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-m2m-client-id
AUTH0_CLIENT_SECRET=your-m2m-client-secret
```

`.env.local` is ignored by git, so your credentials stay local.

## Recommended local workflow

You do not need the Auth0 CLI for normal development.

Use this flow:

1. Create your first action once in the Auth0 Dashboard.
2. Pull that action into this repo.
3. Edit the exported files in VS Code.
4. Deploy locally or through CI.

Pull the current Auth0 state into this repo with:

```bash
npm run auth0:export:local
```

That command generates `auth0/tenant.yaml` and any related action code files inside `auth0/`.

After that:

1. Edit the generated files directly in VS Code.
2. Test your logic.
3. Run `npm run auth0:deploy:local` when you want to push changes manually.
4. Commit and push when you want CI to deploy.

## Optional Auth0 CLI workflow

Use this only if you want Auth0's CLI to create or update actions interactively.

Set VS Code as the editor:

```bash
export EDITOR="code --wait"
```

What this does:

- `code` opens VS Code.
- `--wait` makes the Auth0 CLI wait until you finish editing before it continues.

Install and log in to the Auth0 CLI:

```bash
brew tap auth0/auth0-cli
brew install auth0
auth0 login
```

Then you can create or update actions interactively:

```bash
auth0 actions create
auth0 actions update
```

After using the Auth0 CLI, pull the latest Auth0 state back into this repo:

```bash
npm run auth0:export:local
```

If you do not want this interactive flow, skip this section completely.

## Deploy locally

To push the checked-in Auth0 configuration to your tenant:

```bash
npm run auth0:deploy:local
```

For verbose logs:

```bash
npm run auth0:deploy:debug:local
```

CI still uses GitHub or Bitbucket secrets and does not depend on `.env.local`.

## GitHub Actions setup

Add these repository secrets in GitHub:

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

Deployment behavior:

- Pushes to `main` deploy automatically.
- You can also run the workflow manually with `workflow_dispatch`.

## Bitbucket Pipelines setup

Add these repository variables in Bitbucket:

- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`

Deployment behavior:

- Pushes to `main` deploy automatically.
- You can also run the custom pipeline named `deploy-auth0`.

## First-time setup

Do this once:

1. Copy `.env.example` to `.env.local`.
2. Add your Auth0 domain, client ID, and client secret to `.env.local`.
3. Create your first action in the Auth0 Dashboard.
4. Run `npm run auth0:export:local`.
5. Commit the generated `auth0/tenant.yaml` and action code files.
6. Push to `main`.

After that, this repo becomes the source of truth for your Auth0 Actions.

## Multi-environment note

If you want separate `dev` and `prod` tenants, duplicate the workflow or pipeline and point each one at different secrets. A common pattern is:

- `develop` -> dev Auth0 tenant
- `main` -> production Auth0 tenant

## Notes

- This repo intentionally manages only `actions` and `triggers`, not your entire tenant.
- Trigger bindings matter. If an action is not bound to a flow, it will not run even if it is deployed.
- Keep secrets in Auth0 secrets, GitHub secrets, or Bitbucket repository variables, not in git.
- Keyword preservation is disabled by default for simplicity. If you later want environment placeholders like `@@API_URL@@`, add `AUTH0_KEYWORD_REPLACE_MAPPINGS` and then re-enable keyword preservation.
