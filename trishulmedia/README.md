# vinext app

This project was created with create-vinext-app.

## Contact form email

The contact form sends enquiries directly to `Trishulmediafilms@gmail.com` through the Resend API. Verify a sender domain in Resend and use an address on that domain for `RESEND_FROM_EMAIL`. The sender address must be authorized by Resend; it is not necessarily the recipient inbox.

For local development, add these entries to `trishulmedia/.dev.vars`:

```dotenv
RESEND_API_KEY="re_your_api_key"
RESEND_FROM_EMAIL="bookings@your-verified-domain.com"
```

For the deployed Worker, set both values as Wrangler secrets from the `trishulmedia` directory:

```sh
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM_EMAIL
```

Enter the values when prompted, then deploy the Worker. Enquiries are delivered to `Trishulmediafilms@gmail.com`; replies go to the email address entered on the form.

## Scripts

- `pnpm run dev` starts the vinext dev server.
- `pnpm run build` builds the Cloudflare Worker output.
- `pnpm run start` starts the built Worker locally with Wrangler.
- `pnpm run deploy` deploys the Cloudflare Worker.
