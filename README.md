# A Little Date Invitation ❤️

A responsive, static HTML/CSS/JavaScript date invitation website. It can be hosted for free with GitHub Pages.

## Run locally
Open `index.html` in a browser, or use the VS Code Live Server extension.

## Publish with GitHub Pages
1. Create a GitHub repository (for example `date-invitation`).
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. The URL will look like `https://YOUR-USERNAME.github.io/date-invitation/`.

## Email receipt setup (optional)
The site works without email configuration; the receipt is displayed on the final page. To send it to your inbox:
1. Create an account at [EmailJS](https://www.emailjs.com/).
2. Add an email service and create a template.
3. Add template variables such as `{{to_email}}`, `{{date}}`, `{{time}}`, `{{venue}}`, `{{food_and_drinks}}`, `{{nearby_places}}`, `{{total_cost}}`, and `{{message}}`.
4. In `app.js`, replace `YOUR_EMAILJS_PUBLIC_KEY`, `YOUR_EMAILJS_SERVICE_ID`, `YOUR_EMAILJS_TEMPLATE_ID`, and `your-email@example.com`.
5. Commit and push the changes.

Use only an EmailJS public key in browser code. Never put a Gmail password, private API key, or other secret in this repository. Check EmailJS sending limits and configure its allowed domains.

## Price and location notes
- The menu prices in `app.js` are editable rough estimates in LKR, not live restaurant quotes.
- Custom suggestions currently use a clearly labelled placeholder estimate of LKR 700 each. Update `CUSTOM_SUGGESTION_ESTIMATE` or implement a verified pricing source if you need better estimates.
- Nearby places open a Google Maps search around the entered venue. This does not automatically verify availability, prices, or opening hours.

## Customization
- Change colours and layout in `style.css`.
- Change menu items and rough prices in the `MENU` array in `app.js`.
- The site stores the current plan in memory while the page is open; it does not save personal selections to a database.
