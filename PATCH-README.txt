LS Receipt Local Smart Generator Patch 004

This ZIP includes all changes from AntiSlop Fix 002.

The API-based AI patch 003 is NOT required and should not be uploaded.

New behavior:
- Natural-language generator is on the same /generator page.
- The section appears above the normal form.
- Generation is instant and synchronous.
- No loading state.
- No OpenAI API.
- No API key.
- No extra backend process.
- No extra PM2 process.
- No extra Nginx API route.
- No token or AI usage cost.

Required input:
- city
- date
- total payment amount
- payment method

Generated draft:
- realistic synthetic store name
- order ID
- date and context-based time
- cashier and customer
- receipt items and prices
- payment method
- footer
- suitable template

Defaults:
- IDR
- tax 0
- discount 0
- service charge 0
- paid true

After Generate Draft, every generated value appears in the existing form and can be edited before export or printing.

Classic templates remain in React. The legacy old/ PHP folder can be removed.
