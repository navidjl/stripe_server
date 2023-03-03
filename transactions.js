const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

async function createCustomerWithCardToken(email) {
    // const token = await stripe.tokens.create({
    //     card: {
    //         number: '4242424242424242',
    //         exp_month: 12,
    //         exp_year: 2024,
    //         cvc: '123',
    //     },
    // });

    creteInvoice()

    // const customer = await stripe.customers.create({
    //     email: 'customer@example.com',
    //     source: token.id
    // });

    // return customer;
}

async function creteInvoice() {
   
    const paymentIntents = await stripe.paymentIntents.search(
        {query: '-customer:\'cus_NRBALU4AJ61vSX\''}
        );
        

    const balance = await stripe.balance.retrieve({
            stripeAccount: 'acct_1MfXM7Iccdu7Vb1T',
    });

          console.log(balance)
        
}


module.exports = createCustomerWithCardToken;
