---
applyTo: "automation/**"
---

# Automation-only conventions

These apply on top of `.github/copilot-instructions.md`, and only when working inside
`automation/`. They are the rules that would be wrong or meaningless in `app/`.

## Scenario naming and traceability

- Name every scenario after the acceptance criterion it covers, and state the criterion
  id in the response when proposing one — e.g. "covers US-102 / AC-2".
- One scenario per acceptance criterion. If a criterion needs two scenarios, say why.
- Never invent a scenario that no acceptance criterion asks for. If the behavior looks
  worth testing but is not in the user story, report it as a **missing acceptance
  criterion** instead of writing the test.

## Waiting

- Never use a fixed sleep to make a step pass. Wait for the condition
  (`driver.wait(until.…)`), the way `LoginPage.getErrorMessage()` already does.
- A test that only passes when re-run is a defect in the test, not a flake to retry.

## Steps and page objects

- Step definitions contain no locators. Locators live only in the page object.
- Keep steps reusable across scenarios: parameterise with `{string}` rather than
  writing a near-duplicate step.
- No conditional logic (`if`/`try` to swallow a failure) inside a step definition.

## Assertions

- Assert the observable behavior the criterion promises, not the implementation.
- Never relax or delete an assertion to turn a run green. Report the failure and
  classify it (see the `locator-drift` skill).
