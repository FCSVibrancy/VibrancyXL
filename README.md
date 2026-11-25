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


## Vibrancy homepage

The root homepage now introduces all five Vibrancy areas using the supplied `assets/vibrancy-header.png` banner in its original proportions. The existing dashboard is preserved at `learning.html`, with a return link to the main homepage. The other four areas have dedicated placeholder pages clearly marked as awaiting resources and dashboards. Homepage styles are isolated in `home.css`.

### Edit the homepage in Google Sheets

Use the **Homepage** tab in the existing control spreadsheet. The homepage reads `Homepage!A1:I200` on each visit and when **Refresh homepage** is clicked. Google may briefly cache edits. Keep row 1 headers and the page/label/image IDs intact.

- Row 2: main heading (`title`) and introductory sentence (`description`).
- Rows 3–6: eyebrow, district, closing sentence, and footer text (`title`).
- Row 7: header image URL (`url`) and accessible image description (`title`). Use a directly accessible HTTPS image URL, or an existing local asset path.
- Rows 8–13: six tiles. Edit `title`, `description`, destination `url`, button text `button`, and numeric `sort_order`. Set `visible` to FALSE to hide a tile. Available icons: network, grid, chart, people, book. Add more tile rows within row 200 if needed.
- Keep `learning.html` as the Learning destination to retain the existing seven-experience dashboard. `journey.html` is the new Journey destination, ready for content; its link can be changed in the sheet.

Local relative links and HTTPS links are supported. Homepage text is rendered as plain text. A visible source notice identifies live loading or the saved November 25, 2026 fallback (`data/homepage.json`). The fallback does not automatically update when the sheet changes. The Learning dashboard's existing Sheet1 and Alignment controls are unchanged.

## Private web control board (Vercel)

The new `/admin` screen edits existing records in **Homepage**, **Sheet1**, **Alignment**, and **SiteContent** in the existing spreadsheet. It provides search, labeled fields, draft content previews, and explicit Publish. Navigating away with drafts prompts before discarding them. Identity fields and formulas are protected. Percentages are validated; saves use RAW values so entered text is never executed as a formula. Every data read and publish validates Google's signed ID token, client audience and expiration, verified email, and Brian's exact Google account ID. The sign-in shell is publicly reachable; content and writes require Brian's identity. No other district account can edit through this API.

The new SiteContent tab controls current section-page headings and body copy plus learning overview titles and questions. Homepage images and links remain in Homepage; indicator descriptions, reporting windows, status, maturity, notes, examples, and evidence links remain in Sheet1. Alignment supplies the definitions that override five dashboards, so edit those definitions in Alignment. The control board supports adding tiles to the homepage and every section page, including the learning overview, and uploading images or medallions. New indicator definitions and page layouts still require development.

### Activate on your Vercel project

1. Create a Google Cloud **Web application** OAuth client. Add your exact Vercel production origin to **Authorized JavaScript origins** (and any stable preview origin you intend to use). Configure the consent screen for your district account. Google Identity Services handles sign-in; no OAuth client secret is needed for this ID-token flow.
2. Enable **Google Sheets API** in that Cloud project. Create a service account and share this control spreadsheet with its email as **Editor**. Create its private key.
3. Set Vercel server environment variables `GOOGLE_CLIENT_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` using `.env.example` as the field guide. Keep the key out of Git and browser code. The server fixes the spreadsheet ID and owner account in `lib/control.cjs`.
4. Import/link `FCSVibrancy/VibrancyXL` in Vercel, select **Other**, leave the build command empty, and serve the repository root. Vercel installs package dependencies and deploys `api/control.js` as a Node function. Redeploy after adding the environment variables.
5. Visit `/admin`, sign in as `brian.creasman@fleming.kyschools.us`, and test one edit. Refresh its public page to verify. Google may briefly cache the public CSV/JSON reads.

Public pages retain the current public-read Google Sheets integration and saved fallbacks, so the sheet must remain readable by public visitors. Only publishable content should go in it. Server credentials are never sent to the browser. The revision check detects a change between loading and publishing; Google Sheets does not offer an atomic compare-and-swap, so simultaneous direct spreadsheet edits can still race with a publish. Reload before editing after making direct sheet changes.

Run `node --test tests/admin.cjs` plus the three existing content tests. Live sign-in and publishing require the Vercel/Google configuration above and have not been verified by local tests.


## Visual editing workspace

The private `/admin` control board now shows an interactive draft of the homepage tiles, section pages, learning overview cards, and all seven indicator dashboards. Select a tile or outlined text in the preview to edit it in the adjacent panel. Changes update the private preview as you type. Choose the dashboard and reporting window above the preview; numeric indicators, maturity ratings, descriptions, examples, and evidence buttons use the public dashboard renderer and styles. Hidden homepage tiles remain dimmed in the editor so they can be selected again.

**Publish changes** explicitly writes drafts from the current content area to Google Sheets. The public site does not receive typing or preview changes. Switching content areas with unpublished changes asks before discarding them; changing the dashboard or reporting window within one area retains its drafts. Conflicting direct sheet changes still require reloading before publishing.

For the five Alignment-based dashboards, indicator titles and descriptions are read-only in the ratings panel. **Edit this indicator’s wording** opens the matching Alignment record, whose draft is shown in the actual indicator card. The public layout adapts to the preview width. Editing is available only after the existing owner-only Google sign-in; the preview receives content, never the sign-in token.

Validation includes model tests for stable Alignment matching and duplicate indicator IDs across reporting windows, plus browser checks of tile selection, unpublished text and meters, explicit publishing against a local fixture, overview cards, section-page copy, and indicator-definition previews.


### Image uploads and new tiles

In `/admin`, select an image, homepage tile, or learning overview card and choose **Upload replacement image**. Existing pictures stay in place until replaced; learning pictures keep their shaped frames. JPEG, PNG, and WebP files up to 20 MB are optimized in the browser into JPEG images that fit Google Sheets cells (45,000 characters). The optimized image is saved with the content, so no separate storage setup is needed.

Use **Add to this page** and **Add tile** in Homepage or Pages & learning tiles. Select the destination page first. Choose Image tile or Icon / medallion; edit its title, description, destination, and image. Click a medallion in the preview to edit its symbol or upload its picture. Homepage tiles accept existing icon names, plain symbols, or uploaded images. New section-page tiles appear after existing content in insertion order. All additions and uploads remain private drafts until **Publish changes**. Each content area supports up to 200 rows.

### Delete and rearrange tiles

Select a tile in the preview to show **Move up**, **Move down**, and **Delete tile**. These actions update the private draft; publish to apply them to the public page. A deleted tile stays dimmed and selectable in the editor, where **Restore tile** brings it back. Homepage tiles, original learning overview cards, and custom tiles all support these controls. Positions are saved per page. Icon tiles and medallion tiles are separate choices in the add menu.

### Welcome entrance

The root `index.html` is a black welcome screen with the supplied Fleming County Schools seal, Vibrancy wordmark, and welcome quote. Logos, text, and the Enter Vibrancy button fade in in sequence. After 14 seconds (starting once the logos load), the screen fades out over 900 ms and opens `home.html`, the original Google Sheets-driven tile homepage. The Enter Vibrancy link can continue sooner. Returning to the root during the same tab session goes straight to the homepage; a new session shows the entrance again. Reduced-motion preferences skip the animation. The plain link still works without JavaScript.

### Area indicators and automatic homepage activation
Open **Area indicators** in the private control board, choose any of the six areas, and click **Add indicator**. Enter an actual indicator title and description, optionally enter a percentage, status, and HTTPS evidence link, and leave visibility set to Visible. The private preview shows whether the area will activate. Publish changes to save. An empty or incomplete indicator never activates an area. Hide all complete indicators to return that area's tile to gray; Learning remains active through its existing seven dashboards.

AreaIndicators!A1:I200 stores these records separately from Learning's existing Sheet1 and Alignment data. Its headers are id, area_id, title, description, percent, status, evidence_url, visible, sort_order. IDs and area assignments are protected after creation. Existing owner-only authorization and revision checks protect publishing. The public GET /api/indicators endpoint exposes only complete, visible indicator fields, reads Google Sheets without caching, and supplies both the area pages and homepage availability. General SiteContent tiles, headings, images, and ordinary links never activate an area. Pending homepage tiles have no navigable link. Open or refresh the public homepage after publishing; returning via browser Back also refreshes availability. No deployment is needed to publish subsequent indicators.
