const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

const adminAccountId = `acct_1Mf2aRIEms0pPyUD`
const receipiantId = 'acct_1MfXM7Iccdu7Vb1T'

const transferPayout = async (user_id) => {
    // Collect payment information
    const token = await stripe.tokens.create({
        card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2024,
            cvc: '123',
        },
    });


    // Create a charge
    // const charge = await stripe.charges.create({
    //     amount: 1000, // amount in cents
    //     currency: 'cad',
    //     source: token.id,
    // });

    // Calculate platform fee
    let intent = await stripe.paymentIntents.create({
        amount: 2500000,
        currency: 'cad',
        payment_method_data: {
            type: 'card',
            card: {
                token: token.id
            }
        },
        // automatic_payment_methods: {enabled: true},
        transfer_data: {
            destination: user_id,
        },
        application_fee_amount: 1123,
        // automatic_payment_methods: {
        //     enabled: true,
        // },
        // automatic_payment_methods: {
        //     enabled: true,
        // },
        capture_method: 'manual',
        confirmation_method: 'manual',
        confirm: true
    });
    // print the intent information
    console.log("❗ PaymentIntent ID: " + intent.id);    


    if (intent.status === "requires_capture") {
        console.log("❗ Charging the card for: " + intent.amount_capturable);
        // Because capture_method was set to manual we need to manually capture in order to move the funds
        // You have 7 days to capture a confirmed PaymentIntent
        // To cancel a payment before capturing use .cancel() (https://stripe.com/docs/api/payment_intents/cancel)
        // intent = await stripe.paymentIntents.capture(intent.id);
        // confirm the payment intent
        intent = await stripe.paymentIntents.capture(intent.id);
    
        console.log("❗ capture the card for: " + intent.status);
        console.log("❗ capture the card for: " + JSON.stringify(intent));
    }

    

    // const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
    //     intent.id,
    //     { payment_method: paymentIntent.payment_method }
    //   );
      

    // check the status of the payment
    // const paymentIntent = await stripe.paymentIntents.retrieve(intent.id);
    // console.log("❗ capture the card intent for: " + JSON.stringify(paymentIntent.status));


    // if (paymentIntent.id) {
    //     account = await stripe.accounts.retrieve('acct_1MfXM7Iccdu7Vb1T');
    //     console.log("❗ check to confirm ID capabilities: " +  JSON.stringify(account));
    //   //  intent = await stripe.paymentIntents.confirm(paymentIntent.id);
    // }
    const balance = await stripe.balance.retrieve({
        stripeAccount:'acct_1MgYfAIDX8o7b74P'})
    // const payout = await stripe.payouts.create(
    //     {amount: 1000, currency: 'cad', source_type: 'card'},
    //     {stripeAccount: user_id}
    //   );
    return balance;
}


const payout = async () => {
    const payout = await stripe.payouts.create({
        amount: 100,
        currency: 'cad',
    }, {
        stripeAccount: 'acct_1MfXM7Iccdu7Vb1T',
    });
}

module.exports = transferPayout;
