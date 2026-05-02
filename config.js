// Configuration file for the purchase form

const CONFIG = {
    // Stripe Configuration
    stripe: {
        publishableKey: 'pk_live_51TO3zUHZtxrliH3O6oow1zbq6TMTDz9yKkcH3HB9IMpy5nsuPKJ5ufGwwNMKGc6RdDgqwXGrUg5X4eJh1WCOSwT800NhFcFII0',
    },
    
    // Owner/Admin Configuration
    owner: {
        name: 'Dave Todd',
        email: 'dltodd68@gmail.com',
        company: 'VisionEdge AI Media'
    },
    
    // Products Configuration
    // Add or modify products here - Stripe products created automatically!
    products: [
        {
            id: 'go-mobile',
            name: 'Go Mobile AI',
            description: 'Complete mobile AI solution for local businesses',
            setupFee: 497,
            monthlyFee: 97
        },
        {
            id: 'local-agency',
            name: 'My Local Agency AI',
            description: 'AI-powered voice technology for agencies',
            setupFee: 997,
            monthlyFee: 197
        },
        {
            id: 'smart-agency',
            name: 'Smart Agency OS',
            description: 'Complete agency management system',
            setupFee: 1497,
            monthlyFee: 297
        },
        {
            id: 'custom-solution',
            name: 'Custom AI Solution',
            description: 'Tailored AI solution for your specific needs',
            setupFee: 2500,
            monthlyFee: 500
        }
        // Add as many products as you want! No Stripe pre-setup needed.
        // Just add them here with: id, name, description, setupFee, monthlyFee
    ],
    
    // Email notification endpoint
    // You'll need to set up a backend endpoint to send emails
    emailEndpoint: '/api/send-notification'
};
