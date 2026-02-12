Prepare and publish npm packages.

## Pre-publish Checklist
1. Verify `package.json` has correct `name`, `version`, `main`, `types`, `bin`
2. Ensure `files` field or `.npmignore` is configured
3. Run `npm run build` if applicable
4. Run `npm test` if tests exist
5. Run `npm pack --dry-run` to preview package contents

## Version Bumping
- **Patch** (bug fixes): `npm version patch`
- **Minor** (new features): `npm version minor`
- **Major** (breaking changes): `npm version major`

## Publishing
```bash
npm publish --access public    # For scoped packages
npm publish                    # For unscoped packages
```

## Post-publish
- Verify on npmjs.com: `npm view <package-name>`
- Tag the release in git: `git tag v<version> && git push --tags`
- Update CHANGELOG.md if it exists
