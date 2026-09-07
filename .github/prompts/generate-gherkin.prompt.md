---
description: Draft Gherkin scenarios for a user story, one per acceptance criterion.
mode: agent
---

Draft the Gherkin scenarios for the user story I attach.

Work in this order and show your working:

1. List the acceptance criteria you found in the user story, numbered. If the story has
   none, stop and say so — do not invent them.
2. Search the repository for step definitions that already cover part of this flow
   (`automation/features/step_definitions/`) and for existing page-object methods
   (`automation/features/support/pageObjects/`). List what you will reuse.
3. Propose one `Scenario` per acceptance criterion, naming the criterion each one
   covers. Reuse the existing step wording wherever it fits rather than inventing a
   new phrasing for the same action.
4. Finish with what you could **not** cover from the acceptance criteria alone, and
   what a tester would still need to decide.

Do not write step definitions or page-object code in this pass — scenarios only.
