# Vibrant Learning

A responsive, buildless dashboard for Vibrancy 5.0 / Fleming County Schools, based on the supplied dashboard concept.

## Run locally

From this directory, run `python3 -m http.server 8000`, then open http://localhost:8000. No install or build is required.

## Features

- Seven learning experience cards with reference imagery and black-and-gold branding.
- Seven learning experiences displayed together on the landing page, with direct Explore Learning buttons.
- Evidence dialogs and a proposed evidence-review process, with native keyboard focus handling and Escape dismissal.
- Responsive layouts and reduced-motion support.

## Content and imagery

This is a prototype. School groups and evidence descriptions are illustrative, not live school data. The supplied concept image is used as a temporary image atlas; inline SVG viewports display its photo and logo regions without reproducing its embedded text in the page UI. Replace it with original approved photo files and a standalone district logo for production.

Edit `experiences` in `app.js` to replace sample evidence. Update the school selector in `index.html` and each record's `groups` together when real schools and evidence are available. Review publishing permissions for student imagery and work before deployment.

## Hosting

Serve the repository root as a static site. It is compatible with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) or any static hosting service. No hosting has been enabled by this source change.

The “Show What You Can Do” tile uses an AI-generated illustrative image of a fictional male student presenting his BPI artifact portfolio (`assets/student-bpi-portfolio.png`). Built-in image generation prompt: “Keep the student and classroom unchanged; replace only the monitor website with My BPI Portfolio, showcasing writing, science, and digital design artifacts alongside reflections and growth.”

## Learning with Purpose: Google Sheet controls

Click **Explore Learning** under Learning with Purpose to open the status dashboard. It reads `Sheet1!A1:Z250` from [the control sheet](https://docs.google.com/spreadsheets/d/1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU/edit) each time the window opens or **Refresh data** is clicked. Google may briefly cache changes. No API keys or visitor sign-in are required while the sheet remains viewable to anyone with its link.

Keep the first-row headers and `type` / `id` values intact. Edit these fields:

| Rows / type | Controls |
| --- | --- |
| 2 / `page` | Window heading (`title`) and introductory explanation (`description`) |
| 3–12 / `label` | Commitment, status headings, section labels, pending labels, brand text |
| 13 / `window` | Reporting-window option (`id` and `title`) |
| 14–19 / `nav` | Experience navigation labels |
| 20–23 / `kpi` | KPI names, descriptions, why it matters, status, percentage, maturity, and note |
| 24–26 / `example` | Grade-band labels and examples |
| 27–31 / `maturity` | Legend labels |

For KPI rows, enter `percent` as a number from **0 to 100**, such as `50`, or as `50%`. Leave it blank for unknown data; blank is never treated as zero. The `status` text overrides the displayed number when supplied: clear it to display a numeric percentage. The `maturity` column controls the rating pill; `note` can retain “Illustrative data” until actual evidence is available. Ratings are editorial values from the sheet, not computed from evidence.

To add a reporting window, add a `window` row with a unique `id`, then copy the four `kpi` rows and set their `reporting_window` to that ID. Give each copied KPI its own ratings and text. `example` rows with an empty `reporting_window` apply to all windows; set that field to scope an example to a window. `sort_order` controls order within a type. Supported icon keys: `book`, `target`, `checklist`, `steps`. Do not rename Sheet1 or headers without updating the source. The bounded read includes at most 249 content rows.

If the sheet cannot be loaded or its required structure is missing, the window clearly identifies the bundled November 25, 2026 sheet snapshot as potentially out of date. The snapshot is not automatically updated; updating it requires a repository change. All seven experiences now use the status dashboard and evidence viewer.

Validation: `node tests/purpose-data.cjs` and `node --check purpose-dashboard.js`.

## Entrance animations

The overview tiles and Learning with Purpose KPI tiles fade in once as they enter their scrolling viewport. Each KPI's meter then fades in and fills from the left to its sheet-controlled value. Unknown ratings retain an empty bar. Opening, refreshing, or selecting a reporting window starts a fresh entrance sequence. Reduced-motion users see the completed state immediately; browsers without IntersectionObserver retain visible content.


## Evidence of Practice

Each KPI tile grows to fit its title, description, Why It Matters text, and evidence section. Add up to six evidence items in the existing KPI rows (20–23 in the initial sheet). Columns **M:X** alternate button label and Google Drive sharing URL:

| Slot | Label | URL |
| --- | --- | --- |
| 1 | M | N |
| 2 | O | P |
| 3 | Q | R |
| 4 | S | T |
| 5 | U | V |
| 6 | W | X |

Paste URLs as plain cell values. Rename the prefilled “Evidence 1” through “Evidence 6” labels as desired. Empty URLs are hidden. All evidence buttons use the same rounded gold style and form a two-row, three-column grid when all six links are present. Rows 32–33 control the evidence section heading and empty-state text. Keep the header names intact. For a new reporting window, copy these columns with the KPI rows, then replace the evidence URLs for that period.

Supported URLs include Drive file links, Google Docs, Sheets, Slides, and published Docs/Sheets/Slides links. Drive folder links offer an “Open in Google Drive” link because folders do not provide a document preview. Only HTTPS URLs on drive.google.com or docs.google.com are accepted. The popup uses Google’s own viewer, retains resource keys and sheet tab IDs, and scrolls within its viewport. It does not bypass file access restrictions. Files must be accessible to the intended viewers; see [Google’s sharing guidance](https://support.google.com/drive/answer/7166529). The popup also provides an original-file link if preview access is unavailable.

Clicking the popup backdrop, its close button, or Escape closes only the evidence viewer. The Learning with Purpose dashboard remains open with its current reporting window and scroll position. Keyboard focus returns to the evidence button.

Validation: `node tests/evidence.cjs` checks URL handling, retained resource keys, invalid URLs, six-link limits, empty slots, and escaped labels. Browser QA covered long tile content, six buttons in a 3×2 grid, an actual Google Sheets preview, backdrop dismissal, Escape dismissal, and mobile overflow. No test evidence URLs were added to the live control sheet.


## Seven learning experiences and Alignment

All seven overview cards open the same compact, animated status-dashboard layout. Learning with Purpose keeps its existing four KPIs. The five other original experiences use the 13 leading KPIs in `Alignment!A4:D100`; Thriving Learner contains Growth, Mastery, Readiness, and Student Well-being, as requested. New ratings and evidence URLs start empty and show Awaiting data / Awaiting evidence. New page introductions, Why It Matters copy, grade-band examples, and Thriving Learner definitions are editable starter copy; they are not verified school results.

At every open or refresh, Sheet1 supplies labels, page introductions, ratings, Why It Matters, examples, and evidence links. For the five Alignment-based experiences, a second live read overlays the KPI titles, student-experience descriptions, and walkthrough references from Alignment. Matching uses the experience and first walkthrough ID, keeping ratings/evidence attached to the same indicator when Alignment rows are reordered. Keep those IDs stable. Adding an entirely new Alignment KPI also requires a matching KPI control row in Sheet1; this version initializes the 13 provided KPIs.

Column **Y (`experience_id`)** scopes KPI and example rows to a dashboard. Column **Z (`walkthrough_alignment`)** contains the walkthrough reference and stable primary ID. Valid experience IDs: `purpose`, `thinking`, `voice`, `work`, `feedback`, `support`, `thriving`. Do not change row `id` values. Shared labels, navigation and reporting windows apply across dashboards. Each KPI retains its own six label/URL pairs in M:X. Current KPI control rows:

| Experience | Sheet1 rows | KPI count |
| --- | --- | --- |
| Learning with Purpose | 20–23 | 4 |
| Big Thinking, Real Problems | 41–42 | 2 |
| My Voice, My Choices | 43–45 | 3 |
| Show What You Can Do | 46–48 | 3 |
| Feedback That Moves Me Forward | 49–50 | 2 |
| Support to Take the Next Step | 51–53 | 3 |
| Thriving Learner | 54–57 | 4 |

New page introductions are in rows 35–40; new illustrative examples are in 58–75. These row numbers describe the initial setup; filter by type and experience_id if rows are moved. A reporting-window change filters KPI and example records within the selected experience. Existing fallback snapshot behavior is retained; when Alignment alone cannot load, a notice explains that saved definitions from Sheet1 are shown.

The new fictional Thriving Learner photo is `assets/thriving-learner.png`, generated with the built-in image tool. Prompt: “A candid school-library photograph of a teenage female student in a muted blue cardigan sharing a learning portfolio with a classmate; natural light, engaged expressions, belonging and confidence, portrait framing, no overlay text or logos.”

Additional validation: `node tests/alignment.cjs` verifies all seven KPI groups, current navigation, rating isolation, live Alignment edits, and reporting-window scoping. Browser QA checked each experience’s live sheet content and cross-dashboard navigation.

### Updated Thriving Learner imagery

The Thriving Learner overview tile now uses `assets/student-reading-growth.png`: the requested AI-generated elementary student holding a Reading Growth Award certificate. The earlier library portrait and four-photo activity collage are retained as unused assets. Credits for the earlier stock photos are in `assets/PHOTO-CREDITS.md`. The dashboard’s illustrative-imagery label still applies.

The landing-page School Group and Learning Experience dropdowns have been removed. All seven overview tiles remain visible, including when an older URL contains school or experience filter parameters. Reporting-window selectors inside each learning dashboard are retained.
