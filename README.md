# Receipt Generator

Receipt Generator is a browser-based tool for creating thermal-style receipts, previewing the result in real time, and exporting or printing the receipt without requiring a server-side database.

Production: https://receipt.febro.id/

Built and maintained by Febro Herdyanto.

## Features

- Real-time receipt preview
- 15 React receipt templates
- 21 Classic receipt templates
- IDR, THB, PHP, MYR, SGD, VND, and USD currency support
- Store, customer, cashier, order, tax, discount, payment, and footer fields
- Business-specific fields for restaurant, fuel station, laundry, salon, and other receipt types
- JPG, PNG, and PDF export
- Browser print support
- Light and dark mode
- English and Indonesian interface
- Browser-based receipt history
- Search, preview, duplicate, print, and delete history records
- Responsive layout for desktop and mobile
- Realistic sample data generators for store names, customer names, cashier names, and order IDs
- Local natural-language receipt generator with no external AI API

## Templates

The application keeps React and Classic templates separate.

```text
Receipt Templates
├── React Templates
│   └── 15 templates
└── Classic Templates
    └── 21 templates
```

Classic templates are already ported to React and live in:

```text
apps/web/src/templates/ClassicReceiptTemplates.jsx
```

The old PHP implementation is no longer required.

## Tech Stack

- React 18
- Vite 7
- Tailwind CSS
- Radix UI
- React Router
- html2canvas
- jsPDF
- Sonner

## Requirements

- Node.js 22
- npm 10 or newer

The repository includes `.nvmrc` with Node.js 22.

## Local Development

Clone the repository:

```bash
git clone git@github.com:fbrhrdynt/LS_Receipt.git
cd LS_Receipt
```

Install dependencies:

```bash
npm ci --include=dev
```

Start the development server:

```bash
npm run dev
```

The Vite development server runs on port `3000`.

## Production Build

Build the application:

```bash
npm run build
```

Production files are generated in:

```text
dist/apps/web/
```

You can test the production build with:

```bash
npm run start --prefix apps/web
```

## VPS Deployment

This project can be served as static files or through a local static server behind Nginx.

Current VPS deployment uses PM2 to serve the built application.

Example:

```bash
pm2 serve /opt/receipt/dist/apps/web 3101 --name ls-receipt --spa
pm2 save
```

Nginx can proxy the public domain to the local application:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name receipt.febro.id;

    location / {
        proxy_pass http://127.0.0.1:3101;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Use Certbot or your existing SSL setup for HTTPS.

## Project Structure

```text
LS_Receipt/
├── apps/
│   └── web/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   ├── contexts/
│       │   ├── locales/
│       │   ├── pages/
│       │   ├── templates/
│       │   └── utils/
│       └── package.json
├── anti-slop/
├── DESIGN.md
├── package.json
└── package-lock.json
```

Important template files:

```text
apps/web/src/templates/ReceiptTemplateRegistry.jsx
apps/web/src/templates/ClassicReceiptTemplates.jsx
apps/web/src/utils/ReceiptTemplates.jsx
```

## Local Smart Generator

The Generator page includes a natural-language section above the normal form.

Example:

```text
Buatkan nota makan siang di Palembang tanggal 19 September 2026
dengan jumlah 130500 rupiah pembayaran cash.
```

Required information:

- city
- date
- total payment amount
- payment method

When all four values are present, generation happens immediately in the browser. There is no API request, no loading state, no external AI service, and no token cost.

The generated draft fills the existing Generator form so the user can review and edit every field before export or printing.

Generated fields include:

- store name
- city
- order ID
- date
- context-appropriate time
- cashier
- customer
- item names
- quantities and prices
- payment method
- footer note
- receipt template

Defaults:

```text
Currency       : IDR
Tax            : 0%
Discount       : 0
Service charge : 0%
Paid           : yes
```

The parser recognizes common contexts such as:

```text
meal / lunch / dinner
coffee
fuel / SPBU
laundry
barbershop / salon
electronics
bakery
juice
minimarket
```

It also recognizes common payment methods including cash, QRIS, debit card, credit card, transfer, GoPay, OVO, DANA, and ShopeePay.

The line item generator always adjusts the last item so the final receipt total exactly matches the amount requested by the user.

### Local Processing

The local generator lives in:

```text
apps/web/src/utils/LocalReceiptGenerator.js
apps/web/src/components/LocalReceiptGenerator.jsx
```

Architecture:

```text
User instruction
      |
      v
Local parser in browser
      |
      +-- city
      +-- date
      +-- total amount
      +-- payment method
      +-- category and time context
      |
      v
Generated formData
      |
      v
Existing Receipt Generator
      |
      v
Review / Edit / Export / Print
```

No API key or paid AI account is required.

Generated store and person names are synthetic sample data intended to look natural. They do not represent a verified real transaction, person, or business.

## Receipt History

Receipt history is stored in the browser using `localStorage`.

This means:

- history stays on the current browser and device
- the application does not require a database for receipt history
- clearing browser storage can remove local history
- history is not automatically synchronized between devices

Do not use browser history storage as a replacement for accounting or regulatory record keeping.

## Sample Data Generator

Auto-generation is available for:

- Store Name
- Order ID
- Cashier Name
- Customer Name
- Footer text

Generated people and business names are synthetic examples designed to look natural. They are not intended to identify or represent a specific real person or business.

## Support

Receipt Generator is provided as a free tool.

A small dismissible support notice is shown below the main navigation. Users who find the project useful can optionally support its development through Saweria:

```text
https://saweria.co/fbrhrdynt
```

The notice is intentionally non-blocking:

- no modal
- no countdown
- no forced donation
- no repeated popup during the same browser session
- dismissing the notice hides it for the current session

## Domain

Current domain:

```text
https://receipt.febro.id/
```

Legacy `febroherdyanto.web.id` URLs should not be used in the active application.

## Design

The UI direction is documented in:

```text
DESIGN.md
```

The application is designed as a practical utility. The shell uses solid surfaces, one primary accent color, restrained motion, and a working light and dark theme. Receipt paper remains white in both modes.

## Build Verification

Before deploying a new version:

```bash
npm ci --include=dev
npm run build
```

Then verify:

```bash
pm2 status
curl -I http://127.0.0.1:3101
curl -I https://receipt.febro.id/
```

Also check:

- Home page
- Generator
- History
- Light mode
- Dark mode
- Mobile navigation
- English and Indonesian
- React templates
- Classic templates
- JPG export
- PNG export
- PDF export
- Print
- History duplicate and delete

## Repository

GitHub:

```text
https://github.com/fbrhrdynt/LS_Receipt
```
