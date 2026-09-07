# QA Copilot Training Demo

A small, self-contained sandbox used to demo AI-assisted, spec-driven test automation in a QA training session: a login page with a companion Selenium + Cucumber automation suite (Node.js / JavaScript).

The point of the demo isn't the app (a deliberately trivial login form) — it's showing the flow: **approved spec → generated test → generated automation → triaged failure**, always starting from a written spec instead of free-form prompting.

## Layout

```
app/                  Static demo app (a login page + dashboard)
automation/features/  Cucumber feature files, step definitions, page objects
user-stories/         Sample user stories used as the spec input for the demo
server.js             Tiny static file server for app/
```

## Copilot customization shipped with this repo

The point of the training demo is that none of this is typed into a chat box — it lives
in the repository, is reviewed like any other file, and applies to whoever opens it.

| Path | What it demonstrates |
|---|---|
| `.github/copilot-instructions.md` | Repo-wide instructions, loaded automatically in every conversation |
| `.github/instructions/automation.instructions.md` | Path-scoped instructions (`applyTo: "automation/**"`) — automation conventions that must not leak into `app/` |
| `.github/prompts/generate-gherkin.prompt.md` | A reusable prompt file, invoked as `/generate-gherkin` |
| `.github/agents/test-reviewer.agent.md` | A custom agent with **read-only tools**: it reviews a test against its acceptance criterion and cannot edit anything, so it cannot "make it green" |
| `.github/skills/locator-drift/SKILL.md` | An agent skill the model loads on its own, from its description, when a UI test fails — the triage procedure and which file may be touched in each case |
| `mcp/xray-server.js` + `.vscode/mcp.json` | A zero-dependency MCP server standing in for Xray/Jira: read a test set and its last execution instead of pasting them in |

Check the MCP server responds without leaving the terminal:

```
printf '%s\n' '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node mcp/xray-server.js
```

## Setup

```
npm install
```

Requires Chrome installed locally. `selenium-webdriver` (v4.6+) manages the matching driver automatically via Selenium Manager — no separate chromedriver install needed in most cases.

## Running

Start the demo app:

```
npm start
```

Serves it at `http://localhost:4000`.

In another terminal, run the automation suite:

```
npm test
```

## User stories

- **[US-101 — Login](user-stories/US-101-login.md)**: already automated (`automation/features/login.feature`). Use it as the "existing conventions" reference — the page object and step patterns an assistant should reuse.
- **[US-102 — Remember me](user-stories/US-102-remember-me.md)**: implemented in the app, but **not automated yet**. This is the live demo target — hand the assistant this US and its test flow, and have it draft the Gherkin scenario, locators, and step definitions, reusing `LoginPage` first.

## Simulating a broken locator (failure-triage demo)

To demo diagnosing a real regression failure (as opposed to a bug in the app itself), rename the login button's id in `app/index.html`:

```html
<!-- before -->
<button type="submit" id="login-submit">Log in</button>

<!-- after -->
<button type="submit" id="submit-login">Log in</button>
```

Re-run `npm test` — the existing US-101 scenarios now fail with an element-not-found error, standing in for a real-world locator drift after a UI change. Ask the assistant to diagnose the failure and propose a fix; revert the id afterward to restore the passing suite.

## Login credentials used by the demo

- Valid: `demo_user` / `demo_pass123`
- Locked account: username `locked_user` (any password)
- Any other combination: invalid credentials
