const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

const payOutUser = async (user_id) => {
    const payout = await stripe.payouts.create(
        {amount: 24784, currency: 'cad', source_type: 'bank_account'},
        { stripeAccount: user_id }
    );
    console.log("payout----->\n")
    console.log(payout)

    return payout;
}

module.exports = payOutUser;
