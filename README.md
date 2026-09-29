# DRAGON WEAR — HTTPS-ready storefront

This package serves the DRAGON WEAR storefront through an Express web service and is prepared for Render deployment.

## Local test
1. Install Node.js 20+.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Render deployment
1. Put this folder in a GitHub repository.
2. In Render, create a Web Service from the repository, or use the included `render.yaml` Blueprint.
3. Render runs `npm ci` then `npm start`.
4. Render provides a public `*.onrender.com` address.
5. Add `dragonwear.com` under the service's Custom Domains.
6. At your domain registrar, add the DNS records Render gives you.
7. Verify the domain in Render.

Render automatically provisions and renews TLS certificates and redirects HTTP to HTTPS.

## Important
- Do not put Paystack secret keys in frontend HTML or GitHub.
- Add production secrets through Render environment variables.
- The current storefront is a frontend/demo checkout unless a payment backend is connected and configured.
