# Gorgias Customer Notes Modal Editor

A lightweight Tampermonkey userscript that makes the built-in Gorgias customer notes field easier to read and edit.

By default, the customer notes field in Gorgias can be difficult to use for longer notes. This script turns the small sidebar note field into a clickable preview. When clicked, it opens a large centered modal editor with a clear **Save** button.

> [!IMPORTANT]  
> This is an unofficial browser-side enhancement. It is not created, maintained, endorsed, or supported by Gorgias.

## Features

- Opens the Gorgias customer notes field in a larger modal editor
- Uses the original customer notes field as the trigger
- Saves edited notes back into the original Gorgias field
- Keeps the original sidebar notes field compact
- Adds a blurred and tinted backdrop while editing
- Supports closing and saving via:
  - **Save** button
  - clicking outside the modal
  - pressing `Esc`
- Runs locally in the browser
- No external dependencies
- No external network requests
- No data storage outside the Gorgias page

## Why this exists

This script is intended for teams that use Gorgias customer notes to track longer customer context, such as:

- current customer situation
- order or support status
- previous actions taken
- next steps
- internal handover notes

The default sidebar note field can be too small for this type of workflow. This userscript improves the editing experience without requiring a separate app or browser extension.

## Installation

### 1. Install Tampermonkey

Install the Tampermonkey browser extension:

- [Tampermonkey for Chrome](https://www.tampermonkey.net/?browser=chrome)
- [Tampermonkey for Microsoft Edge](https://www.tampermonkey.net/?browser=edge)
- [Tampermonkey for Firefox](https://www.tampermonkey.net/?browser=firefox)
- [Tampermonkey for Safari](https://www.tampermonkey.net/?browser=safari)

### 2. Install the userscript

Open the raw userscript URL in your browser:

    https://raw.githubusercontent.com/KalinAngelo/gorgias-customer-notes-modal/main/gorgias-customer-notes-modal.user.js

Tampermonkey should detect the `.user.js` file and show an installation screen.

Click **Install**.

### 3. Open Gorgias

Go to Gorgias and open a customer or ticket page.

Click the customer notes field in the sidebar. A larger editor should open.

## Usage

1. Open a Gorgias customer or ticket page.
2. Click the customer notes field in the sidebar.
3. Edit the notes in the modal editor.
4. Click **Save**, press `Esc`, or click outside the modal to save and close.

The script writes the updated note back into the original Gorgias customer notes field.

## Suggested note format

The script saves normal plain text into Gorgias. You can use any structure you like.

A simple format that works well for customer support handovers:

    Situation:
    Current status:
    What has been done:
    Next action:
    Owner:
    Last updated:

Example:

    Situation:
    Customer reported that the replacement item has not arrived.

    Current status:
    Waiting for warehouse confirmation.

    What has been done:
    Checked previous tickets.
    Confirmed shipping address.
    Escalated to warehouse.

    Next action:
    Follow up with warehouse and update the customer.

    Owner:
    Support Team

    Last updated:
    2026-05-22

## Updating

If the script includes `@updateURL` and `@downloadURL` metadata, Tampermonkey can check for updates automatically.

To manually check for updates:

1. Open the Tampermonkey dashboard.
2. Find **Gorgias - Customer Notes Modal Editor**.
3. Use Tampermonkey’s update/check option.

If you maintain your own fork, remember to increase the userscript version number when publishing updates:

    // @version      2.2

## Recommended userscript metadata

If you fork or maintain your own version, the userscript header should look similar to this:

    // ==UserScript==
    // @name         Gorgias - Customer Notes Modal Editor
    // @namespace    https://github.com/YOUR_ORG/gorgias-customer-notes-modal
    // @version      2.1
    // @description  Opens Gorgias customer notes in a large centered modal editor.
    // @author       Your Name
    // @license      MIT
    // @match        https://*.gorgias.com/*
    // @match        https://app.gorgias.com/*
    // @run-at       document-idle
    // @grant        none
    // @updateURL    https://raw.githubusercontent.com/YOUR_ORG/gorgias-customer-notes-modal/main/gorgias-customer-notes-modal.user.js
    // @downloadURL  https://raw.githubusercontent.com/YOUR_ORG/gorgias-customer-notes-modal/main/gorgias-customer-notes-modal.user.js
    // ==/UserScript==

Replace `YOUR_ORG` with your GitHub username or organization name.

## Browser support

This script is intended for browsers supported by Tampermonkey, especially:

- Google Chrome
- Microsoft Edge
- Firefox

Other browsers may work but are not actively tested.

## Privacy and security

This userscript runs locally in your browser.

It does not intentionally:

- send customer note content to third-party services
- make external network requests
- store customer data outside Gorgias
- use analytics
- load external libraries

The script only modifies the browser UI around the existing Gorgias customer notes field.

As with any userscript, review the code before installing it, especially if you are using it in a production support environment.

## Limitations

This is a browser-side UI enhancement. It does not modify Gorgias itself.

The script depends on the current Gorgias customer notes field selector:

    textarea#note-field[aria-label="Note"]

If Gorgias changes its internal HTML structure, the script may stop working and need to be updated.

This project does not provide any guarantee that notes will save correctly in every Gorgias UI version. Test it carefully before rolling it out to a support team.

## Troubleshooting

### The modal does not open

Check that:

- Tampermonkey is installed
- the userscript is enabled
- the current page URL matches one of the configured `@match` patterns
- you are viewing a Gorgias page that contains the customer notes field
- Gorgias still uses the expected customer notes selector

Expected selector:

    textarea#note-field[aria-label="Note"]

### The note does not save

Try clicking **Save** and then clicking away from the customer or ticket page.

If saving still does not work, Gorgias may have changed how the customer notes field is handled internally. The save logic may need to be updated.

### The page feels slow

Disable the userscript and reload Gorgias to confirm whether the script is responsible.

The script uses a lightweight DOM observer to detect when Gorgias loads the customer notes field. If Gorgias changes how its interface updates, this logic may need adjustment.

## Development

Clone the repository:

    git clone https://github.com/YOUR_ORG/gorgias-customer-notes-modal.git
    cd gorgias-customer-notes-modal

Main file:

    gorgias-customer-notes-modal.user.js

After editing the script, increment the version number in the userscript metadata.

## Contributing

Issues and pull requests are welcome.

Useful contributions include:

- compatibility fixes for Gorgias UI changes
- improved save handling
- browser compatibility improvements
- accessibility improvements
- documentation updates

## License

MIT License.

See [`LICENSE`](LICENSE) for details.
