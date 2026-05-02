// Main application logic
let selectedProduct = null;
let stripe = null;

// Initialize Stripe
document.addEventListener('DOMContentLoaded', function() {
    try {
        stripe = Stripe(CONFIG.stripe.publishableKey);
        renderProducts();
    } catch (error) {
        showError('Failed to initialize payment system. Please check Stripe configuration.');
        console.error('Stripe initialization error:', error);
    }
});

// Render product cards
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    CONFIG.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-name">${product.name}</div>
            <div class="product-pricing">
                <span class="price-highlight">$${product.setupFee}</span> setup + 
                <span class="price-highlight">$${product.monthlyFee}/month</span>
            </div>
            ${product.description ? `<div style="font-size: 12px; color: #888; margin-top: 5px;">${product.description}</div>` : ''}
        `;
        
        productCard.addEventListener('click', () => selectProduct(product, productCard));
        productList.appendChild(productCard);
    });
}

// Handle product selection
function selectProduct(product, cardElement) {
    // Remove previous selection
    document.querySelectorAll('.product-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Mark new selection
    cardElement.classList.add('selected');
    selectedProduct = product;
    
    // Update pricing display
    updatePricingDisplay();
}

// Update pricing display
function updatePricingDisplay() {
    const totalSection = document.getElementById('total-section');
    
    if (selectedProduct) {
        document.getElementById('setup-fee-display').textContent = `$${selectedProduct.setupFee}`;
        document.getElementById('monthly-fee-display').textContent = `$${selectedProduct.monthlyFee}/month`;
        document.getElementById('total-display').textContent = `$${selectedProduct.setupFee}`;
        totalSection.classList.remove('hidden');
    } else {
        totalSection.classList.add('hidden');
    }
}

// Handle form submission
document.getElementById('purchase-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!selectedProduct) {
        showError('Please select a product');
        return;
    }
    
    // Get form data
    const formData = {
        customer: {
            name: document.getElementById('customer-name').value.trim(),
            email: document.getElementById('customer-email').value.trim(),
            phone: document.getElementById('customer-phone').value.trim()
        },
        salesperson: {
            name: document.getElementById('salesperson-name').value.trim(),
            email: document.getElementById('salesperson-email').value.trim()
        },
        product: selectedProduct,
        owner: CONFIG.owner
    };
    
    // Validate
    if (!formData.customer.name || !formData.customer.email || !formData.salesperson.name || !formData.salesperson.email) {
        showError('Please fill in all required fields');
        return;
    }
    
    // Show loading
    showLoading(true);
    hideError();
    hideSuccess();
    
    try {
        // Create Stripe checkout session
        await createCheckoutSession(formData);
    } catch (error) {
        showError('Payment processing failed: ' + error.message);
        showLoading(false);
        console.error('Checkout error:', error);
    }
});

// Create Stripe Checkout Session
async function createCheckoutSession(formData) {
    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create checkout session');
        }
        
        const { url } = await response.json();
        
        // Redirect to Stripe Checkout
        window.location.href = url;
        
    } catch (error) {
        console.error('Checkout error:', error);
        throw error;
    }
}

// Send email notifications (requires backend)
async function sendNotifications(formData, paymentDetails) {
    try {
        const response = await fetch(CONFIG.emailEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...formData,
                paymentDetails
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to send notifications');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Notification error:', error);
        throw error;
    }
}

// UI Helper Functions
function showLoading(show) {
    const form = document.getElementById('purchase-form');
    const loading = document.getElementById('loading');
    
    if (show) {
        form.classList.add('hidden');
        loading.classList.remove('hidden');
    } else {
        form.classList.remove('hidden');
        loading.classList.add('hidden');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideError() {
    document.getElementById('error-message').classList.add('hidden');
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideSuccess() {
    document.getElementById('success-message').classList.add('hidden');
}
