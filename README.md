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
