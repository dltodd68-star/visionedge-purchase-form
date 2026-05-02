const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { customer, salesperson, product } = JSON.parse(event.body);
    
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
    
    // Build line items
    const lineItems = [];
    
    // Setup fee
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
    
    // Monthly subscription
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
      success_url: `${process.env.URL || 'https://dltodd68-star.github.io/visionedge-purchase-form'}/success.html`,
      cancel_url: `${process.env.URL || 'https://dltodd68-star.github.io/visionedge-purchase-form'}/index.html`,
      metadata: {
        customer_name: customer.name,
        customer_email: customer.email,
        salesperson_name: salesperson.name,
        salesperson_email: salesperson.email,
        product_name: product.name,
        product_id: product.id
      }
    });
    
    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
