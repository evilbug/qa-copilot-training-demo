# US-101 — Login

**As a** registered user
**I want to** log in with my username and password
**So that** I can access my dashboard

## Acceptance criteria

1. Given a registered user with valid credentials, when they submit the login form, then they are redirected to the dashboard.
2. Given a registered user, when they submit the login form with an incorrect password, then an "Invalid credentials" error message is shown.
3. Given a user whose account is locked, when they submit the login form, then an "Account locked" error message is shown.

## Status

Already automated — see `automation/features/login.feature`, `automation/features/step_definitions/login.steps.js` and the `LoginPage` page object. Use this as the "existing conventions" example: when demoing US-102 below, show the assistant reading these files first and reusing the page object / step patterns instead of duplicating them.
