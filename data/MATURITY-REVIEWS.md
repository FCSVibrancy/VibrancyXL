# Indicator maturity reviews

`maturity-rubrics.js` owns the five indicator-specific descriptions and the separate `reviews` registry. Keys are existing indicator IDs, followed by reporting period. The two retained feedback references resolve to `scales` and `scales-self-check`; reporting homes, commitments, result keys, history, and evidence URLs remain unchanged.

The production registry is empty because no completed Fleming County maturity reviews were supplied. Existing unsubstantiated maturity strings do not publish a stage. Do not copy test records into this registry. Reportable percentages continue to come from the existing term-results source; a missing percentage does not prevent a completed maturity review.

To publish a district review, add a record under `reviews[indicatorId][reportingPeriod]` and deploy it with the reviewed rubric. Required fields:

- `approved: true`, district `reviewer`, `period`, ISO `date` (YYYY-MM-DD), and `scope` identifying the settings and applicable opportunities actually reviewed.
- `finding`: a brief evidence finding stating what reviewers observed and where; `**selective phrases**` render as bold text. Cite available walkthroughs, student accounts, and work samples without claiming broader coverage.
- `evidence`: an array of `{label, reference}` citations to the actual reviewed records. Existing term evidence links remain separately available.
- `samplingApproved: true` and `sampling`: the district-approved sample selection, size, coverage, opportunities/cycle, exceptions, and decision thresholds. The public rubric flags these as requiring district review; the code does not invent numerical thresholds.
- `criteria`: stage-name keys with `true` only where reviewers attest that the complete indicator-specific description is supported. The highest fully supported stage is selected; this is a human evidence review, not a percentage conversion. For Not Started, a completed review must affirm that implementation has not begun.
- Sustaining and Advancing also requires `priorPeriods`, `improvement`, and `followUp`, with evidence citations documenting implementation across those periods, the specific change, and what the follow-up check found.

On a card with several term dials, the badge uses the latest dated review for that indicator, and the profile highlights that rating. The simplified public popup shows the five stage descriptions and advancement expectations; review findings and metadata remain in the separate review record. Reviews remain keyed by period; opening a specific reporting window uses that period's review. Never infer an overall stage by averaging term percentages.

A 0% for the reviewed period holds Implementing or Sustaining and Advancing for district discrepancy review. Reconcile student action, period, and scope before publishing. If the result demonstrably measures something different, record the district's explanation in `distinctProgressMeasures[period].reason`. Do not use this field to bypass a credible zero for the same action, period, and scope. The zero result is never changed or hidden by this check.

Writing Across the Content uses instructional weeks in every course. Presentations of Learning uses the district's scheduled cycles in grades 3–12; approve and document that schedule. Example analysis occurs before first demonstrations; unfinished-work checks occur during instruction; revision evidence must show the change and how it improved understanding or performance. Claims about Growth, Mastery, Readiness, Agency, and Student Well-being require direct outcome evidence, not participation alone.

Run `node --test tests/*.cjs`. Illustrative records in `tests/maturity.cjs` exercise Not Started, Not Yet Rated, a true zero with counts/scope, a reviewed Developing rating without a percentage, sustaining evidence, and discrepancy withholding. They never enter public data.
