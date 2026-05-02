# 📊 Purchase Form Flow

This document explains how the purchase form system works from start to finish.

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    1. CUSTOMER VISITS FORM                   │
│                   http://yourdomain.com                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 2. CUSTOMER FILLS OUT FORM                   │
│   • Customer Name & Email                                    │
│   • Salesperson Name & Email                                 │
│   • Selects Product (Go Mobile AI, etc.)                    │
│   • Sees Total: Setup Fee + Monthly                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              3. CLICKS "COMPLETE PURCHASE"                   │
│   Form data sent to your server (server.js)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│           4. SERVER CREATES STRIPE SESSION                   │
│   • Creates customer in Stripe                               │
│   • Creates checkout session with:                           │
│     - Setup fee (one-time)                                   │
│     - Monthly subscription                                   │
│   • Stores metadata (customer, salesperson, product)        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│          5. REDIRECT TO STRIPE CHECKOUT PAGE                 │
│   Customer enters card details on Stripe                     │
│   (Your server never sees card numbers)                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                6. STRIPE PROCESSES PAYMENT                   │
│   • Charges setup fee today                                  │
│   • Sets up monthly subscription                             │
│   • Sends webhook to your server                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            7. YOUR SERVER RECEIVES WEBHOOK                   │
│   Event: "checkout.session.completed"                        │
│   Contains: All customer and payment info                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              8. SERVER SENDS 3 EMAILS                        │
│                                                              │
│   ┌──────────────────────────────────────┐                  │
│   │ 📧 Email to CUSTOMER                 │                  │
│   │ "Welcome! Purchase confirmed"        │                  │
│   └──────────────────────────────────────┘                  │
│                                                              │
│   ┌──────────────────────────────────────┐                  │
│   │ 📧 Email to SALESPERSON              │                  │
│   │ "Congrats! You made a sale"          │                  │
│   └──────────────────────────────────────┘                  │
│                                                              │
│   ┌──────────────────────────────────────┐                  │
│   │ 📧 Email to YOU (Dave)               │                  │
│   │ "New purchase + Stripe link"         │                  │
│   └──────────────────────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│             9. CUSTOMER SEES SUCCESS PAGE                    │
│   "Purchase Successful! Check your email"                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│            10. MONTHLY BILLING STARTS                        │
│   Stripe automatically charges customer every month          │
│   Customer can manage subscription in Stripe portal          │
└─────────────────────────────────────────────────────────────┘
```

---

## 💳 Payment Processing Details

### What Happens Today:
1. **Setup fee charged** (e.g., $497)
2. **Subscription created** but first charge is 30 days from now
3. **Customer gets confirmation**

### What Happens Next Month:
1. **Stripe auto-charges** monthly fee (e.g., $97)
2. **Every month after** → Same thing
3. **Customer can cancel** anytime in Stripe

---

## 📧 Email Content

### Email #1: To Customer
```
Subject: Welcome to [Product Name]!

Dear [Customer Name],

Thank you for your purchase!

Your purchase of [Product Name] has been confirmed.

Your subscription will begin shortly, and you'll receive 
further instructions via email.

If you have any questions, please don't hesitate to reach out.

Best regards,
Dave Todd
```

### Email #2: To Salesperson
```
Subject: New Sale: [Product Name]

Congratulations! You've made a sale.

Product: [Product Name]
Customer: [Customer Name]
Email: [Customer Email]
Session ID: [Stripe Session ID]

Great work!
```

### Email #3: To You (Dave)
```
Subject: New Purchase: [Product Name]

Product: [Product Name]
Customer: [Customer Name] ([Email])
Salesperson: [Salesperson Name] ([Email])
Amount: $XXX.XX
Session ID: [ID]
Stripe Customer ID: [ID]

View in Stripe Dashboard: [Direct Link]
```

---

## 🔒 Security Flow

```
Customer Card → Stripe Only (PCI Compliant)
     ↓
   Payment
     ↓
Webhook (Verified) → Your Server
     ↓
Send Emails
```

**Your server NEVER sees:**
- Card numbers
- CVV codes
- Expiry dates

**Your server DOES see:**
- Customer email
- Payment successful/failed
- Subscription ID

---

## 🛠️ Technical Stack

```
Frontend:
├── HTML (index.html, success.html)
├── JavaScript (app.js)
├── CSS (embedded in HTML)
└── Stripe.js (payment library)

Backend:
├── Node.js
├── Express (web server)
├── Stripe SDK (payment processing)
└── Nodemailer (email sending)

External Services:
├── Stripe (payment processing)
└── Gmail/SMTP (email delivery)
```

---

## 📊 Data Flow

```
Form Input → JavaScript → Server → Stripe
                           ↓
                    Create Session
                           ↓
                    Return URL
                           ↓
            Redirect to Stripe Checkout
                           ↓
                    Payment Success
                           ↓
              Webhook to Your Server
                           ↓
                   Send 3 Emails
                           ↓
                  Show Success Page
```

---

## 🎯 Key Points

1. **Customer data** goes to your server first
2. **Payment processing** happens on Stripe (secure)
3. **Webhooks** notify your server when payment succeeds
4. **Emails** sent automatically after successful payment
5. **Monthly billing** handled automatically by Stripe

---

## 🔍 Where Things Are Stored

| Data | Location |
|------|----------|
| Products | `config.js` (your server) |
| Stripe Keys | `.env` (your server, secret) |
| Email Settings | `.env` (your server, secret) |
| Customer Cards | Stripe only (never your server) |
| Payment History | Stripe Dashboard |
| Subscription Status | Stripe Dashboard |
| Transaction Logs | Stripe Dashboard |

---

## ⚡ What Can Go Wrong (and how to fix it)

| Problem | Cause | Fix |
|---------|-------|-----|
| Payment fails | Wrong Stripe keys | Check `.env` |
| Emails not sent | Wrong SMTP settings | Check `.env` |
| Webhook not firing | Wrong URL in Stripe | Update webhook URL |
| Form not loading | Server not running | Run `npm start` |
| Wrong price shown | Wrong config | Check `config.js` |

---

## 🎓 Understanding the Code

### Frontend (`app.js`):
- Renders products
- Handles form submission
- Calls backend API
- Manages UI state

### Backend (`server.js`):
- Creates Stripe sessions
- Handles webhooks
- Sends emails
- Serves static files

### Config (`config.js`):
- Product definitions
- Stripe public key
- Owner email

### Secrets (`.env`):
- Stripe secret key
- Webhook secret
- Email credentials

---

This flow ensures secure, reliable payment processing with automatic notifications to all parties!
