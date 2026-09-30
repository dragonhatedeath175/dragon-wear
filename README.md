# DRAGON WEAR — Final Store Build

## Run locally
npm ci
npm start

Then open http://localhost:3000

## Render
Build: `npm ci`
Start: `npm start`
Health: `/health`

Add `PAYSTACK_SECRET_KEY` only in Render Environment Variables. Never place it in `public/index.html`.

The custom domain should be configured in Render; Render handles TLS for configured custom domains.
