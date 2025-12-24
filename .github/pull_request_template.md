# Pull Request

## Description
<!-- Briefly describe what this PR does -->

## Related Issue
<!-- Link to the issue this PR addresses -->
Fixes #

## Changes Made
<!-- List the main changes -->
- Added `isXXX()` function in `index.js`
- Added tests in `test/index.spec.js`
- Updated `index.d.ts` with TypeScript definitions
- Updated `README.md` with examples and counts

## Checklist

### Required (PR will not be merged without these):
- [ ] ✅ **Synced with latest main branch** (`git rebase main`)
- [ ] ✅ **All tests pass** (`npm test`)
- [ ] ✅ **Linting passes** (`npm run lint`)
- [ ] ✅ **README.md updated** with:
  - [ ] Data type added to supported types list
  - [ ] Test count updated
  - [ ] Usage example added
- [ ] ✅ **TypeScript definitions added** in `index.d.ts`
- [ ] ✅ **JSDoc documentation** added for new functions

### Code Quality:
- [ ] Followed conventional commit format (`feat:`, `fix:`, `style:`, etc.)
- [ ] Used **single quotes** (`'`) not double quotes (`"`) 
- [ ] No `console.log` statements in code
- [ ] Functions added at the end of file (minimizes conflicts)
- [ ] Test cases added at the end of test file
- [ ] Pre-commit hook ran automatically (auto-fixed linting)

## Test Results
<!-- Paste the output of `npm test` showing all tests pass -->
```
Paste test output here
```

## Avoiding Conflicts
- [ ] I have rebased on the latest main branch before creating this PR
- [ ] I understand that if conflicts occur, I need to resolve them by rebasing again

---

**Thank you for contributing!** 🎉

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.
