const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

const expressOboarding = async (user_id) => {

  const account = await stripe.accounts.create({
    country: 'CA',
    type: 'express',
    capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
    business_type: 'individual',
    business_profile: { url: 'https://wwww.navidexample.com' },
  });

  console.log(account)

//   const accountLink = await stripe.accountLinks.create({
//     account: 'account_id',
//     refresh_url: 'https://www.navidjalili.com/reauth',
//     return_url: 'https://www.navidjalili.com/return',
//     type: 'account_onboarding',
//   });

const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://navidjaliliexample.com/reauth',
    return_url: 'https://navidjaliliexample.com/return',
    type: 'account_onboarding',
    collect: 'eventually_due',
  });


  console.log(JSON.stringify(accountLink))

}


module.exports = expressOboarding;