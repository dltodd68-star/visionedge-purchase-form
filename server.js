// Backend server for handling Stripe payments and email notifications
// Run with: node server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Webhook endpoint needs raw body
app.post('/api/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Other routes use JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve the HTML/CSS/JS files

// Email transporter configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Create Stripe Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    try {
        const { customer, salesperson, product, owner } = req.body;
        
        // Create Stripe customer
        const stripeCustomer = await stripe.customers.create({
            email: customer.email,
            name: customer.name,
            phone: customer.phone,
            metadata: {
                salesperson_name: salesperson.name,
                salesperson_email: salesperson.email
            }
        });
        
        // Build line items array
        const lineItems = [];
        
        // Add setup fee if present
        if (product.setupFee && product.setupFee > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${product.name} - Setup Fee`,
                        description: 'One-time setup fee'
                    },
                    unit_amount: Math.round(product.setupFee * 100)
                },
                quantity: 1
            });
        }
        
        // Add monthly subscription
        lineItems.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    description: product.description || 'Monthly subscription'
                },
                unit_amount: Math.round(product.monthlyFee * 100),
                recurring: {
                    interval: 'month'
                }
            },
            quantity: 1
        });
        
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.id,
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: lineItems,
            success_url: `${process.env.BASE_URL || 'http://localhost:3000'}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL || 'http://localhost:3000'}/index.html`,
            metadata: {
                customer_name: customer.name,
                customer_email: customer.email,
                salesperson_name: salesperson.name,
                salesperson_email: salesperson.email,
                product_name: product.name,
                product_id: product.id
            }
        });
        
        res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook to handle successful payments
async function handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        // Send email notifications
        await sendEmailNotifications(session);
    }
    
    res.json({ received: true });
}

// Send email notifications to all parties
async function sendEmailNotifications(session) {
    const { metadata } = session;
    
    // Email to customer
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: metadata.customer_email,
        subject: `Welcome to ${metadata.product_name}!`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">VisionEdge AI Media</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>Thank you for your purchase!</h2>
                    <p>Dear ${metadata.customer_name},</p>
                    <p>Your purchase of <strong>${metadata.product_name}</strong> has been confirmed.</p>
                    <p>Your subscription will begin shortly, and you'll receive further instructions via email.</p>
                    <p>If you have any questions, please don't hesitate to reach out.</p>
                    <br>
                    <p>Best regards,<br><strong>Dave Todd</strong><br>VisionEdge AI Media</p>
                </div>
                <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} VisionEdge AI Media. All rights reserved.</p>
                </div>
            </div>
        `
    });
    
    // Email to salesperson
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: metadata.salesperson_email,
        subject: `🎉 New Sale: ${metadata.product_name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">🎉 New Sale!</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>Congratulations!</h2>
                    <p>You've made a sale with VisionEdge AI Media.</p>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Product:</strong> ${metadata.product_name}</p>
                        <p style="margin: 10px 0;"><strong>Customer:</strong> ${metadata.customer_name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${metadata.customer_email}</p>
                        <p style="margin: 10px 0;"><strong>Session ID:</strong> ${session.id}</p>
                    </div>
                    <p><strong>Great work! Keep it up! 🚀</strong></p>
                </div>
                <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} VisionEdge AI Media. All rights reserved.</p>
                </div>
            </div>
        `
    });
    
    // Email to owner (Dave)
    await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: 'dltodd68@gmail.com',
        subject: `💰 New Purchase: ${metadata.product_name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
                    <h1 style="color: white; margin: 0;">💰 New Purchase!</h1>
                </div>
                <div style="padding: 30px; background: #f9f9f9;">
                    <h2>Purchase Details</h2>
                    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 10px 0;"><strong>Product:</strong> ${metadata.product_name}</p>
                        <p style="margin: 10px 0;"><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                        <p style="margin: 10px 0;"><strong>Customer:</strong> ${metadata.customer_name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${metadata.customer_email}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                        <p style="margin: 10px 0;"><strong>Salesperson:</strong> ${metadata.salesperson_name}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${metadata.salesperson_email}</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 15px 0;">
                        <p style="margin: 10px 0; font-size: 12px; color: #666;"><strong>Session ID:</strong> ${session.id}</p>
                        <p style="margin: 10px 0; font-size: 12px; color: #666;"><strong>Customer ID:</strong> ${session.customer}</p>
                    </div>
                    <p><a href="https://dashboard.stripe.com/customers/${session.customer}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">View in Stripe Dashboard →</a></p>
                </div>
                <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
                    <p>© ${new Date().getFullYear()} VisionEdge AI Media. All rights reserved.</p>
                </div>
            </div>
        `
    });
    
    console.log('Email notifications sent successfully');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view the purchase form`);
    console.log(`Or access from: http://209.182.213.100:${PORT}`);
});
