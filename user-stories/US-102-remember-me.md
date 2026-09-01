# US-102 — Remember me

**As a** returning user
**I want to** have my username remembered after a successful login
**So that** I don't have to retype it every time I come back

## Acceptance criteria

1. Given the login form, when the user checks "Remember me" and logs in successfully, then the username is pre-filled the next time the login page loads.
2. Given "Remember me" was not checked, when the user logs in successfully, then the username field is empty the next time the login page loads.
3. Given the user previously had their username remembered, when they log in again with "Remember me" unchecked, then the stored username is cleared and no longer pre-filled afterwards.

## Test flow (already defined, not yet automated)

1. Open the login page.
2. Enter valid credentials, check "Remember me", submit.
3. Reload the login page and confirm the username field is pre-filled.
4. Log in again with "Remember me" unchecked.
5. Reload the login page and confirm the username field is now empty.

## Status

**Feature is implemented in the app** (see `app/app.js`), but **not automated yet** — no Gherkin scenario, no step definitions, no page-object changes exist for it. This is the live demo target: given this US and test flow, have the assistant inspect the running app, propose the Gherkin scenario, identify the needed locators, and draft the step definitions / page-object additions — reusing `LoginPage` and the existing step patterns from US-101 before writing anything new.
