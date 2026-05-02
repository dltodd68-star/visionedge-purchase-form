# 🚀 Deploy to Vercel - Step by Step

## What You'll Get
A live URL like: **https://visionedge-purchase.vercel.app**

Your salespeople can send this URL to customers!

---

## Option A: Deploy via Web (Easiest - 5 Minutes)

### Step 1: Sign Up for Vercel
1. Go to: https://vercel.com
2. Click **"Sign Up"**
3. Sign up with **GitHub** (easiest) or email
4. It's **FREE** for this use case

### Step 2: Download Your Files
You need to get these files from the server to your computer:

**Option 1: Use SCP (if you have SSH access)**
```bash
scp -r root@209.182.213.100:~/purchase-form /path/on/your/computer/
```

**Option 2: Create a ZIP file**
I can create a downloadable ZIP for you (ask me to do this)

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click **"Deploy"** (or "Add New Project")
3. Choose **"Upload"** or **"Import Git Repository"**
4. Upload your purchase-form folder
5. Vercel will detect it's a Node.js project
6. Click **"Deploy"**

### Step 4: Add Environment Variables
After deployment:
1. Go to your project settings
2. Click **"Environment Variables"**
3. Add these:

```
STRIPE_SECRET_KEY = your_stripe_secret_key_here

SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your_email@gmail.com
SMTP_PASS = your_gmail_app_password_here
SMTP_FROM = your_email@gmail.com

BASE_URL = (Vercel will provide this - like https://your-site.vercel.app)
```

4. Click **"Save"**
5. Click **"Redeploy"** to apply the environment variables

### Step 5: Update Stripe Webhook (After Deployment)
1. Note your Vercel URL (like `https://your-site.vercel.app`)
2. Go to: https://dashboard.stripe.com/webhooks
3. Click **"Add endpoint"**
4. Enter: `https://your-site.vercel.app/api/webhook`
5. Select event: **checkout.session.completed**
6. Copy the **Webhook Secret** (starts with `whsec_`)
7. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`
8. Redeploy

### Step 6: Done! 🎉
Your URL is live! Share it with salespeople:
**https://your-site.vercel.app**

---

## Option B: Deploy via CLI (Advanced)

### Prerequisites
- Node.js installed on your computer
- Terminal/Command Prompt

### Steps
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to the purchase-form folder
cd ~/purchase-form

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. Follow the prompts
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? visionedge-purchase (or whatever you want)
# - Directory? ./
# - Override settings? No

# 6. Add environment variables
vercel env add STRIPE_SECRET_KEY
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_USER
vercel env add SMTP_PASS
vercel env add SMTP_FROM

# 7. Deploy to production
vercel --prod
```

---

## What Files to Upload

Make sure these files are in your folder:
- ✅ index.html
- ✅ success.html
- ✅ app.js
- ✅ config.js
- ✅ server.js
- ✅ package.json
- ✅ vercel.json
- ❌ .env (DO NOT upload - use Vercel environment variables instead)

---

## Troubleshooting

### "Can't reach the site"
- Check Vercel deployment status
- Make sure environment variables are set
- Check Vercel logs for errors

### "Stripe error"
- Verify Stripe keys in environment variables
- Check that BASE_URL matches your Vercel URL
- Make sure webhook is configured

### "Email not sending"
- Verify Gmail app password is correct
- Check SMTP settings
- Look at Vercel function logs

---

## After Deployment

### Update config.js with Your Vercel URL
In the deployed version, update BASE_URL in environment variables to match your actual Vercel URL.

### Custom Domain (Optional)
1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain (like purchase.visionedge.com)
4. Follow DNS instructions

---

## Share With Salespeople

Once deployed, give your sales team:

**URL:** https://your-site.vercel.app

**Instructions:**
1. Send this link to customers
2. Customer fills out form
3. Customer enters their card on Stripe (secure)
4. Everyone gets email notifications automatically

---

## Cost

**Vercel:** FREE for this use case
**Stripe:** 2.9% + $0.30 per transaction

---

## Need Help?

If you get stuck:
1. Check Vercel logs
2. Check this guide
3. Ask me for help!

Your purchase form is ready to deploy! 🚀
