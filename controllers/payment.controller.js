import { createMollieClient } from "@mollie/api-client";

const mollieClient = createMollieClient({ 
  apiKey: process.env.MOLLIE_API_KEY || 'test_2x9bGEJ3CjafNtK7xfcxsQjW54Hxhh',
  environment: 'sandbox' // Use 'production' for live payments
});

export const createPayment = async (req, res) => {
    try {
        const payment = await mollieClient.payments.create({
            amount: { 
                currency: 'EUR', 
                value: '10.00' 
            },
            description: 'My first API payment',
            redirectUrl: 'http://localhost:3000/payment/success',
            method: ['ideal', 'paypal', 'creditcard'],
            locale: 'nl_NL',
            metadata: {
                order_id: '123456',
            }
        });
        
        return res.status(200).json({
            message: "Payment created",
            paymentId: payment.id,
            checkoutUrl: payment._links.checkout.href
        });
    } catch (error) {
        console.error('Payment creation failed:', error);
        
        if (error.name === 'ApiError') {
            return res.status(error.status || 400).json({
                message: "Payment creation failed",
                error: error.message
            });
        }

        return res.status(500).json({
            message: "Internal server error while creating payment",
            error: error.toString()
        });
    }
}

export const paymentSuccess = async (req, res) => {
    const { paymentId } = req.query;
    try {
        const payment = await mollieClient.payments.get(paymentId);
        
        return res.status(200).json({
            message: "Payment successful",
            status: payment.status,
            amount: payment.amount
        });
    } catch (error) {
        console.error('Error checking payment:', error);
        return res.status(500).json({
            message: "Error verifying payment",
            error: error.toString()
        });
    }
}