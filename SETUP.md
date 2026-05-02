# AI Business Purchase Form - Setup Guide

## Overview
This is a complete purchase form system that handles:
- Product selection with setup fees and monthly subscriptions
- Stripe payment integration
- Email notifications to customer, salesperson, and owner
- Professional, mobile-responsive design

---

## Quick Start (5 Steps)

### 1. Install Dependencies
```bash
cd ~/purchase-form
npm install
```

### 2. Set Up Stripe Account

#### Create Stripe Account
1. Go to https://stripe.com and sign up (or log in)
2. Get your API keys from https://dashboard.stripe.com/apikeys
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)

#### Create Products in Stripe
For each product (Go Mobile AI, My Local Agency AI, etc.):

1. Go to https://dashboard.stripe.com/products
2. Click "Add product"
3. Enter product name and monthly price
4. Click "Add recurring price"
5. Set price and billing interval (monthly)
6. Save the **Product ID** (starts with `prod_`)
7. Save the **Price ID** (starts with `price_`)

#### Set Up Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter: `https://yourdomain.com/api/webhook` (or `http://localhost:3000/api/webhook` for testing)
4. Select event: `checkout.session.completed`
5. Copy the **Signing secret** (starts with `whsec_`)

### 3. Configure Environment Variables

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
nano .env
```

Fill in your values:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=dltodd68@gmail.com
SMTP_PASS=your_gmail_app_password
SMTP_FROM=dltodd68@gmail.com

# Server Configuration
PORT=3000
BASE_URL=http://localhost:3000
```

**For Gmail:**
- Go to https://myaccount.google.com/apppasswords
- Create an "App Password" for "Mail"
- Use that password (not your regular Gmail password)

### 4. Update Configuration Files

#### Edit `config.js`:
```javascript
stripe: {
    publishableKey: 'pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY', // From Stripe dashboard
},

products: [
    {
        id: 'go-mobile',
        name: 'Go Mobile AI',
        description: 'Complete mobile AI solution',
        setupFee: 497,
        monthlyFee: 97,
        stripeProductId: 'prod_ACTUAL_ID',     // From Stripe
        stripePriceId: 'price_ACTUAL_ID'       // From Stripe
    },
    // Add your other products...
]
```

### 5. Start the Server
```bash
npm start
```

Visit: http://localhost:3000

---

## File Structure

```
~/purchase-form/
├── index.html          # Main purchase form
├── success.html        # Success page after payment
├── app.js             # Frontend JavaScript logic
├── config.js          # Configuration (products, Stripe keys)
├── server.js          # Backend API server
├── package.json       # Node.js dependencies
├── .env              # Environment variables (create this)
├── .env.example      # Example env file
└── SETUP.md          # This file
```

---

## Customization

### Adding New Products

Edit `config.js` and add to the `products` array:

```javascript
{
    id: 'new-product',
    name: 'New Product Name',
    description: 'Product description',
    setupFee: 999,
    monthlyFee: 199,
    stripeProductId: 'prod_XXX',
    stripePriceId: 'price_XXX'
}
```

### Adding New Salespeople

When a salesperson makes a sale, they just enter their name and email in the form. No pre-configuration needed!

### Customizing Emails

Edit the `sendEmailNotifications` function in `server.js` to customize email content.

---

## Deployment Options

### Option 1: Simple VPS (Recommended)
- DigitalOcean, Linode, Vultr ($5-10/month)
- Install Node.js
- Clone files
- Run with PM2 for auto-restart

```bash
npm install -g pm2
pm2 start server.js --name purchase-form
pm2 startup
pm2 save
```

### Option 2: Vercel (Free Tier)
- Push to GitHub
- Connect to Vercel
- Add environment variables
- Deploy

### Option 3: Heroku
- Create Heroku app
- Add environment variables
- Deploy via Git

### Option 4: Netlify Functions
- Use serverless functions
- Requires slight code modifications

---

## Testing

### Test Mode
- Use Stripe test keys (start with `sk_test_` and `pk_test_`)
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

### Test the Flow
1. Fill out the form
2. Select a product
3. Click "Complete Purchase"
4. Use test card on Stripe Checkout
5. Check emails (customer, salesperson, owner)

---

## Production Checklist

Before going live:

- [ ] Switch from test to live Stripe keys
- [ ] Update `BASE_URL` in `.env` to your domain
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Test email delivery from production server
- [ ] Update webhook URL in Stripe dashboard
- [ ] Add your domain to Stripe allowed domains
- [ ] Test with real payment (small amount)
- [ ] Set up monitoring/error alerts

---

## Troubleshooting

### Stripe Errors
- Check API keys are correct (live vs test)
- Verify webhook secret matches
- Ensure products exist in Stripe dashboard

### Email Not Sending
- Gmail: Use App Password, not regular password
- Check SMTP settings
- Verify "Less secure app access" is enabled (if needed)
- Try different SMTP provider (SendGrid, Mailgun)

### Server Won't Start
- Check if port 3000 is in use: `lsof -i :3000`
- Verify all dependencies installed: `npm install`
- Check for syntax errors: `node -c server.js`

---

## Security Notes

- Never commit `.env` file to Git
- Use environment variables for all secrets
- Keep Stripe keys secure
- Validate webhook signatures
- Use HTTPS in production
- Regularly update dependencies

---

## Support

Questions or issues? Contact Dave Todd:
- Email: dltodd68@gmail.com

---

## Next Steps

1. Complete Stripe setup
2. Test in development mode
3. Customize products and pricing
4. Deploy to production
5. Share form URL with salespeople
6. Monitor sales in Stripe dashboard

Good luck! 🚀
