# VERO POS usage analytics

VERO POS measures traffic and anonymous product usage without sending products,
prices, order contents, customer details, QR codes, or backup files.

## Traffic

Set `NEXT_PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN` to the site token from
Cloudflare Web Analytics. Page views, visitors, referrers, and device traffic
will then appear in the Cloudflare dashboard.

## Anonymous usage events

Set `NEXT_PUBLIC_VERO_ANALYTICS_ENDPOINT` to an HTTPS collector that accepts a
JSON `POST`. Events are queued in IndexedDB while offline and retried when the
app is online. The local queue keeps at most 500 events and is intentionally
excluded from V1 backup and restore files.

Tracked events: `app_open`, `app_installed`, `welcome_started`,
`first_product_created`, `setup_completed`, and `order_completed`.

Each event contains only a random installation ID, timestamp, app version,
device class, and whether the event happened online or offline.
