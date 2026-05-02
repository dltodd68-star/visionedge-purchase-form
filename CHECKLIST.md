# 📋 Setup Checklist

Use this checklist to get your purchase form up and running.

## Pre-Setup

- [ ] Node.js installed on your machine
- [ ] Git installed (optional, for deployment)
- [ ] Text editor ready (VS Code, Sublime, etc.)

---

## Stripe Setup

- [ ] Create Stripe account at https://stripe.com
- [ ] Navigate to https://dashboard.stripe.com/apikeys
- [ ] Copy **Publishable key** (starts with `pk_test_`)
- [ ] Copy **Secret key** (starts with `sk_test_`)
- [ ] Go to https://dashboard.stripe.com/products
- [ ] Create product #1: Go Mobile AI
  - [ ] Set monthly price: $97
  - [ ] Copy Product ID (`prod_`)
  - [ ] Copy Price ID (`price_`)
- [ ] Create product #2: My Local Agency AI
  - [ ] Set monthly price: $197
  - [ ] Copy Product ID
  - [ ] Copy Price ID
- [ ] Create product #3: Smart Agency OS
  - [ ] Set monthly price: $297
  - [ ] Copy Product ID
  - [ ] Copy Price ID
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Add webhook endpoint
- [ ] Select event: `checkout.session.completed`
- [ ] Copy **Webhook secret** (`whsec_`)

---

## Email Setup (Gmail)

- [ ] Go to https://myaccount.google.com/security
- [ ] Enable 2-Step Verification (if not already)
- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Select "Mail" and generate password
- [ ] Copy the 16-character App Password
- [ ] Save it securely (you'll need it for `.env`)

---

## Project Setup

- [ ] Open terminal
- [ ] Navigate to project: `cd ~/purchase-form`
- [ ] Install dependencies: `npm install`
- [ ] Copy environment file: `cp .env.example .env`
- [ ] Edit `.env` file:
  - [ ] Add `STRIPE_SECRET_KEY`
  - [ ] Add `STRIPE_WEBHOOK_SECRET`
  - [ ] Add `SMTP_USER` (dltodd68@gmail.com)
  - [ ] Add `SMTP_PASS` (Gmail App Password)
  - [ ] Add `SMTP_FROM` (dltodd68@gmail.com)
- [ ] Edit `config.js`:
  - [ ] Add `publishableKey` (Stripe)
  - [ ] Update product #1 IDs
  - [ ] Update product #2 IDs
  - [ ] Update product #3 IDs
  - [ ] Verify owner email is correct

---

## Testing

- [ ] Start server: `npm start`
- [ ] Open browser: http://localhost:3000
- [ ] Verify form loads correctly
- [ ] Test product selection
- [ ] Fill out form with test data
- [ ] Click "Complete Purchase"
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete test payment
- [ ] Check success page loads
- [ ] Check customer email received
- [ ] Check salesperson email received
- [ ] Check owner email received (dltodd68@gmail.com)
- [ ] Verify payment in Stripe dashboard

---

## Customization (Optional)

- [ ] Update product names/descriptions in `config.js`
- [ ] Adjust pricing (setup fees, monthly fees)
- [ ] Customize email templates in `server.js`
- [ ] Modify colors/branding in `index.html` styles
- [ ] Add company logo
- [ ] Update success page message

---

## Production Deployment

- [ ] Choose hosting platform
- [ ] Set up production server/account
- [ ] Switch to Stripe **Live** keys
  - [ ] Live publishable key in `config.js`
  - [ ] Live secret key in `.env`
- [ ] Update `BASE_URL` in `.env` to real domain
- [ ] Set up SSL certificate (HTTPS)
- [ ] Update webhook URL in Stripe to production URL
- [ ] Deploy code to production
- [ ] Test with real payment (small amount)
- [ ] Verify all emails work in production

---

## Going Live

- [ ] Share form URL with sales team
- [ ] Create documentation for salespeople
- [ ] Set up monitoring for errors
- [ ] Monitor Stripe dashboard for payments
- [ ] Check email inbox for notifications
- [ ] Test from different devices (phone, tablet)

---

## Maintenance

- [ ] Weekly: Check for failed payments in Stripe
- [ ] Monthly: Update dependencies (`npm update`)
- [ ] As needed: Add new products
- [ ] As needed: Add new salespeople (they enter their info)

---

## 🎉 Launch Ready!

Once all boxes are checked, you're ready to start taking payments!

**Need help?** Email: dltodd68@gmail.com
