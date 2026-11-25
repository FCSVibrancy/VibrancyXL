# Vibrant Learning

A responsive, buildless dashboard for Vibrancy 5.0 / Fleming County Schools, based on the supplied dashboard concept.

## Run locally

From this directory, run `python3 -m http.server 8000`, then open http://localhost:8000. No install or build is required.

## Features

- Six learning experience cards with reference imagery and black-and-gold branding.
- Combined school-group and experience filters, clear filters, empty state, and shareable URL parameters.
- Evidence dialogs and a proposed evidence-review process, with native keyboard focus handling and Escape dismissal.
- Responsive layouts and reduced-motion support.

## Content and imagery

This is a prototype. School groups and evidence descriptions are illustrative, not live school data. The supplied concept image is used as a temporary image atlas; inline SVG viewports display its photo and logo regions without reproducing its embedded text in the page UI. Replace it with original approved photo files and a standalone district logo for production.

Edit `experiences` in `app.js` to replace sample evidence. Update the school selector in `index.html` and each record's `groups` together when real schools and evidence are available. Review publishing permissions for student imagery and work before deployment.

## Hosting

Serve the repository root as a static site. It is compatible with GitHub Pages (Settings → Pages → Deploy from a branch → `main` / root) or any static hosting service. No hosting has been enabled by this source change.

The “Show What You Can Do” tile uses an AI-generated illustrative image of a fictional male student presenting his BPI artifact portfolio (`assets/student-bpi-portfolio.png`). Built-in image generation prompt: “Keep the student and classroom unchanged; replace only the monitor website with My BPI Portfolio, showcasing writing, science, and digital design artifacts alongside reflections and growth.”

## Learning with Purpose: Google Sheet controls

Click **Explore Learning** under Learning with Purpose to open the status dashboard. It reads `Sheet1!A1:L250` from [the control sheet](https://docs.google.com/spreadsheets/d/1NJTD9kym-A6BeEFsEXm8bsCVG5jSE0EAjYuR5lAXpAU/edit) each time the window opens or **Refresh data** is clicked. Google may briefly cache changes. No API keys or visitor sign-in are required while the sheet remains viewable to anyone with its link.

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

If the sheet cannot be loaded or its required structure is missing, the window clearly identifies the bundled November 25, 2026 sheet snapshot as potentially out of date. The snapshot is not automatically updated; updating it requires a repository change. The other five experiences retain their existing evidence panels.

Validation: `node tests/purpose-data.cjs` and `node --check purpose-dashboard.js`.

## Entrance animations

The overview tiles and Learning with Purpose KPI tiles fade in once as they enter their scrolling viewport. Each KPI's meter then fades in and fills from the left to its sheet-controlled value. Unknown ratings retain an empty bar. Opening, refreshing, or selecting a reporting window starts a fresh entrance sequence. Reduced-motion users see the completed state immediately; browsers without IntersectionObserver retain visible content.
