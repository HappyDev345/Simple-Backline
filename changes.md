# BACKLINE — Bug Fixes

A summary of the bugs found and fixed in the BACKLINE static site. The layout and page count are unchanged. Every fix was checked in a headless browser at desktop (1280px), tablet (768px) and phone (390px) widths, with no JavaScript errors.

**Files changed:** `index.html`, `style.css`, `script.js`

---

## Summary

| # | Bug | Area | File(s) |
|---|-----|------|---------|
| 1 | White box around Sign In | Visual | `style.css` |
| 2 | Hidden buttons still visible in dialogs | Dialogs | `style.css` |
| 3 | Search matched button labels | Search | `script.js` |
| 4 | Call cards broken on phones | Responsive | `style.css` |
| 5 | Hero too tall, image offset on small screens | Responsive | `style.css` |
| 6 | Nav labels wrapped and squashed on tablets | Navigation | `style.css` |
| 7 | No way to sign in or join on mobile | Navigation | `index.html`, `style.css` |
| 8 | Empty Backstage Discussions column | Content | `index.html` |
| 9 | Messy listing-detail popups | Dialogs | `script.js` |
| 10 | Wrong image alt text and unescaped `&` | Accessibility / HTML | `index.html` |
| 11 | Mobile menu didn't close on outside click | Navigation | `script.js` |
| 12 | Missing favicon (404 request) | Polish | `index.html` |

---

## Details

### 1. White box around Sign In
- **Cause:** the `.sign-in` button had no background set, so the browser's default grey/white button style showed through.
- **Fix:** `background: transparent` on `.sign-in`, plus `white-space: nowrap`.

### 2. Hidden buttons still visible in dialogs
- **Cause:** `.button { display: inline-flex }` overrode the browser's `[hidden]` rule. The About and Privacy dialogs showed a "Continue" button that was meant to be hidden, and clicking it showed a misleading "This is a preview" message.
- **Fix:** added a global `[hidden] { display: none !important; }` rule.

### 3. Search matched button labels
- **Cause:** the search used each card's full `textContent`, which includes the "Save", "View show" and "View profile" button text. Searching for "view" or "sav" matched every listing.
- **Fix:** searchable text is now built once per card with the buttons removed and whitespace normalised.
- **Verified:** "sav" and "view" return no results, and "grandma3" correctly returns 2 of 12.

### 4. Call cards broken on phones
- **Cause:** a later `grid-template-columns` rule overrode the responsive ones. On a 390px screen the middle column collapsed to 0px.
- **Fix:** restored the responsive columns after the late rule: two columns up to 980px, one column up to 720px.

### 5. Hero too tall and image offset on small screens
- **Cause:** later desktop rules overrode the responsive ones. The hero kept an 820px minimum height, the image kept a 28px left offset, and the padding and font-size overrides were lost.
- **Fix:** re-applied the intended responsive values in later media queries.

### 6. Nav labels wrapped and squashed on tablets
- **Cause:** between 721px and 900px, four nav links plus two buttons didn't fit. "Explore Shows" and "Sign In" wrapped onto two lines.
- **Fix:** the hamburger menu now starts at 900px, and nav labels use `white-space: nowrap`.

### 7. No way to sign in or join on mobile
- **Cause:** Sign In and Join the Crew were hidden at small sizes with no alternative.
- **Fix:** added "Sign In" and "Join the Crew" to the mobile menu. They are hidden on desktop through the `.nav-mobile-only` class.

### 8. Empty Backstage Discussions column
- **Cause:** `.discussion-list` was empty even though the card styles existed, leaving a blank column and a dead nav link.
- **Fix:** added four sample discussion cards. They are labelled "Sample thread", open the join dialog, and use no invented authors, reply counts or timestamps. Replace them with your own topics if you prefer.

### 9. Messy listing-detail popups
- **Cause:** the popup text came straight from `textContent`. It ran skills together ("DiGiCoRFSystem tech") and leaked button text ("View profile Save").
- **Fix:** whitespace is normalised, skills are comma-separated, call details are separated by ` · `, and button text is excluded.

### 10. Wrong image alt text and unescaped `&`
- **Cause:** two production images had alt text naming shows that don't exist on the page. "Sydney Coffee & Connect" used a bare `&`.
- **Fix:** corrected the alt text and used `&amp;`.

### 11. Mobile menu didn't close on outside click
- **Fix:** clicking anywhere outside the menu and its toggle now closes it. Escape and link clicks already worked.

### 12. Missing favicon
- **Fix:** added an inline SVG favicon, which stops the browser requesting a file that doesn't exist.

---

## Noticed but not changed

These are content choices rather than bugs, so I left them alone:

- **Dates have passed.** The sample production dates (Sep–Oct 2026) and labels like "Available Sep" are now in the past.
- **Section links go nowhere new.** "Explore all shows", "Discover crew" and "View all crew calls" link to the section you're already viewing. They would need extra pages or filters to do more.
- **Sample content.** All listings, profiles and discussions are placeholders, and the forms don't send or store anything, as the README states.