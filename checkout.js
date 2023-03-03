// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

line_item =
{
  price_data: {
    unit_amount: 1000,
    currency: 'cad',
    product_data: {
      name: 'Foobar'
    },
    tax_behavior: 'exclusive',
  },
  quantity: 1,
}

const checkoutsession = async () => {

  // 1) create a customer
  // const customer = createCustomer('abbas12@gmial.com')

  // 2) create a checkout session
  // const session = await createSession(customer)

  // 3) capture the payment
  // capturePayment(session.id);
}

// capture session
const capturePayment = async (session_id) => {
  // create a checkout session
  paymentIntent = await stripe.checkout.sessions.retrieve('cs_test_a1VpLD2qqqKt3C8v5Z6rBihIcInJrXv2DtFKw8fOX3jw9ertKdmY6V4uae')
  console.log("intent data=-------> \n");
  console.log(paymentIntent);

  // retreive the customer 
  const customerSession = await stripe.checkout.sessions.retrieve(
    session_id
  )

  console.log("session data=-------> \n");
  console.log(customerSession);


  // capture the payment intent
  intent = await stripe.paymentIntents.capture(customerSession.payment_intent);
  console.log("intent data=-------> \n");
  console.log(intent);

}

const createSession = async (_customer) => {
  // create a checkout session
  return await stripe.checkout.sessions.create({
    customer: _customer.id,
    line_items: [
      line_item
    ],
    mode: 'payment',
    automatic_tax: {
      enabled: true,
    },
    payment_method_types: ['card'],
    success_url: 'https://example.com/success',  // redirect to our app
    cancel_url: 'https://example.com/cancel',    // redirect to our app
    payment_intent_data: {
      capture_method: 'manual',
      application_fee_amount: 3000,
      transfer_data: {
        destination: 'acct_1MfXM7Iccdu7Vb1T',  // a desired receipiant / account id
      }
    }
  });
}

const createCustomer = async (_email) => {
  customer = await stripe.customers.create({
    description: 'a new user 2',
    email: _email,
    address: {
      line1: '5180 yonge street',
      line2: '2301',
      city: 'Toronto',
      state: 'ON',
      postal_code: ' M2N 0K5',
      country: 'CA',
    },
    name: "something something",
    tax: {
      ip_address: '99.240.161.50'
    },
    expand: ['tax'],
  });

  return customer;
}
module.exports = checkoutsession;