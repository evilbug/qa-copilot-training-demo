---
name: locator-drift
description: Triage and repair a failing UI test in this repo. Use when a Selenium or Cucumber
  test fails, when a run reports NoSuchElementError or "element not found", when tests that used
  to pass start failing after a UI or framework upgrade, or when someone asks whether a failure
  is a real bug or a broken locator.
---

# Triaging a failing UI test

A red test has exactly three explanations. Decide which one **before** changing any file,
because the answer determines which file you are allowed to touch.

## 1. Classify the failure

Read the failure output first (the Cucumber summary and the stack trace), then:

| Signal | Classification | File you may touch |
|---|---|---|
| The element is found, but the asserted value is wrong | **App defect** | None. Open a bug; the test did its job |
| `NoSuchElementError` / timeout locating an element that exists in the app under another id or selector | **Stale locator** | The page object only |
| The element is gone because the flow itself changed | **Outdated scenario** | None yet — the user story has to change first |

If you cannot tell case 1 from case 2, check the app source (`app/index.html`,
`app/app.js`) for the element the locator is looking for. If the element exists under a
different `id`, it is case 2. If it is genuinely absent and the app no longer does that,
it is case 3.

## 2. Repair, by case

**Stale locator.** Update the locator in
`automation/features/support/pageObjects/LoginPage.js` and nowhere else. There must be
exactly one definition of each locator; if you find the same element located in two
places, say so. Prefer `By.id` — the app provides ids on every interactive element.

**App defect.** Change nothing. Report the file, the expected value, the actual value,
and the acceptance criterion that is now violated.

**Outdated scenario.** Change nothing yet. Report that the acceptance criterion behind
this scenario no longer matches the app, and that a new or amended user story has to be
approved before the `.feature` is edited.

## 3. The rule that overrides everything

Never edit a `.feature` file to make a run go green. The `.feature` is the approved
promise to the user; a broken locator is an implementation detail of the test. Editing
the promise to accommodate the detail hides the regression instead of fixing it.

Never delete or weaken an assertion for the same reason.

## 4. Verify

After a locator repair, re-run the suite and report the before/after counts. Do not
claim the suite passes without having run it.

```
npm start      # in one terminal, serves the app on :4000
npm test       # in another
```
