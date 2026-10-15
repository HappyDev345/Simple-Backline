# BACKLINE — Static Website

BACKLINE is a static community-platform website built with plain HTML, CSS, and vanilla JavaScript.

## Files

- `index.html` — The website's page structure and content.
- `style.css` — Visual styling, layout, colours, typography, and responsive behaviour.
- `script.js` — Client-side interactions such as navigation, dialogs, form validation, and feedback.
- `README.md` — This documentation file.

## Run the website

1. Download and extract the website files.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern web browser.

No installation, build step, package manager, or local server is required.

## Requirements

- A modern web browser.
- An internet connection for remote images and Google Fonts, where used.

The core website files run directly from the local filesystem. If an external image or font is unavailable, the page may use a browser fallback or show the image as unavailable.

## Functionality

The static frontend includes the page layout and client-side interactions implemented in the supplied files. Forms provide local validation and success feedback; they do not send information to a server or save submissions.

Any feature that requires user accounts, a database, persistent shared content, or server-side processing would need a backend service to work across sessions or devices.

## Customisation

- **Edit content:** Update the relevant markup in `index.html`.
- **Change appearance:** Edit rules in `style.css`.
- **Change interactions:** Update event handlers and behaviour in `script.js`.

Keep the three website files together and preserve their filenames so the stylesheet and script continue to load correctly.

## Troubleshooting

- **Styling is missing:** Check that `style.css` is beside `index.html` and that its filename matches exactly.
- **Interactions do not work:** Check that `script.js` is beside `index.html` and that its filename matches exactly. Open the browser developer console for JavaScript errors.
- **Images or fonts do not load:** Check your internet connection and whether the remote resource is still available.
- **Changes are not visible:** Save the files and refresh the browser. A hard refresh may clear cached styles or scripts.

## License and assets

No license or ownership terms are specified here. Check the original project and the terms for any third-party images, fonts, or other assets before redistributing the website.
