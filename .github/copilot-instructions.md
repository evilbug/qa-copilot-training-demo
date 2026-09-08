# Copilot instructions for this repo

This file is read automatically by GitHub Copilot Chat and Agent Mode for every conversation scoped to this repository - it's context you don't have to paste by hand each time.

## What this project is

A tiny demo app (a login page) plus its Selenium + Cucumber test automation, written in Node.js. It exists to demonstrate spec-driven test automation, not to be a real product.

## Spec-first, always

- Never generate a Gherkin scenario, step definition, or page-object method without an approved user story (see `user-stories/`) to point at. If no acceptance criterion covers the behavior being asked for, say so instead of inventing one.
- Every generated Gherkin scenario must map to a specific acceptance criterion in its user story. State which criterion each scenario covers.

## Reuse before generating

- Before writing a new step definition or locator, check `automation/features/step_definitions/` and `automation/features/support/pageObjects/LoginPage.js` for an existing one that already does the job.
- Extend `LoginPage` rather than creating a second page object for the same page.

## Conventions

- Step definitions live in `automation/features/step_definitions/`, page objects in `automation/features/support/pageObjects/`.
- Locators are looked up by `id` where the app provides one - prefer that over XPath/CSS position-based selectors, which break more easily when markup changes.
- One Cucumber scenario per acceptance criterion, not one giant scenario covering all of them.

## When a test fails

Before proposing any fix for a red test, invoke the `locator-drift` skill and follow it.
Classifying the failure decides which file may be touched, so it comes first.

## What not to do

- Don't invent app behavior that isn't in `app/app.js` - read it before assuming what the app does.
- Don't mark a failing test as passing or delete an assertion to make a run go green; report the failure and whether it looks like an app defect or a broken locator/test.
