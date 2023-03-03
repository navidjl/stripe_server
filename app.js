const stripe = require('stripe')('sk_test_51MeTWSIIwNl3ABwKHx7K9nojHAEM0kjdbiDlIefn8JpGGx3LBd4AXQ15ceH4TbvsL6cZ7wCDlJ7KFSWXlgrksaRS00ucphHr2j');

const http = require('http');

const hostname = 'localhost';
var ip = require('ip');
const update = require('./stripe/customers/update.js');

const transfer = require('./transfer.js');
const customer = require('./transactions.js');
const payoutFound = require('./payout.js');
const onboarding = require('./onboarding.js');
const checkoutsession = require('./checkout.js');
const createCustomerWithCardToken = require('./transactions.js');

const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, world!');
});

const userId = 'acct_1MfSevINoBN1o4cW';
const accountNumber = '000123456789';
const routingNumber = '11000-000';

server.listen(port, hostname, async () => {
    console.log(`Server running at http://${hostname}:${port}/`);
    // const response = await createAccountIndividual("band1@gmail.com","band1", "band2",accountNumber,routingNumber)
    //  const response = await updateUserInfoTOS('acct_1MfXM7Iccdu7Vb1T', 'test2@gmail.com', '5149654455', 'navid1', 'jalili1');
    //  console.log("payoutMethodId ------> \n")
    //  const getPayoutMethodStatusResponse = await getPayoutMethodStatus('acct_1Mf2aRIEms0pPyUD')
     const response = await checkoutsession()
    // const response = await retrieveBankAccount('acct_1MfXM7Iccdu7Vb1T')
    //  const response = await createAccountIndividual("asgharjavid@javidshah.com","mamad", "hosseini",accountNumber,routingNumber)
    
});

const retrieveBankAccount = async (user_id) => {
   
    const bankAccounts = await stripe.accounts.retrieve(
        'acct_1MfXM7Iccdu7Vb1T',
      );
      console.log(bankAccounts.external_accounts.data[0].id)  

      const bankAccount = await stripe.accounts.updateExternalAccount(
        'acct_1MeTWSIIwNl3ABwK',
        'ba_1MgGuzIIwNl3ABwKRzNSqZyC',
        {metadata: {order_id: '6735'}}
      );
      
      return bankAccounts
}

const updateUserInfoTOS = async (user_id, email, phone, name) => {
   
    existing = await stripe.accounts.retrieve(user_id);
    if (existing) {
        let account = await stripe.accounts.update(user_id, {
            tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: ip.address(), // Assumes you're not using a proxy
            }
        });
        if (account) {
            return account;
        }
    }

    return existing;
}

const updateCapabilities = async (user_id, email, phone, name) => {
   
    response = await stripe.accounts.retrieveCapability(user_id,'card_payments',);
    
    if (response.status == 'inactive') {
        let account = await stripe.accounts.updateCapability(user_id,'card_payments',
        {
            requested: true
        });
       
        if (account) {
        
            /* update capabilities if response is inactive and current_due is required
            with the list of required fields like below 
            currently_due: [
      'individual.dob.day',
      'individual.dob.month',
      'individual.dob.year',
      'individual.first_name',
      'individual.last_name',
      'tos_acceptance.date',
      'tos_acceptance.ip'
    ]   */      
        if( response.requirements.currently_due.length > 0){
                individual = {individual : { 
                    dob: { day: 1, month : 1, year : 1990 }, 
                    first_name: 'navid', last_name : 'jalili' } }
                
                    
                let account = await stripe.accounts.updateCapability(
                    user_id,{individual : { 
                        dob: { day: 1, month : 1, year : 1990 }, 
                        first_name: 'navid', last_name : 'jalili' } } );
            return account;
        }

    }
    }
}


const createAccountIndividual = async (email, fname, lname, accountNumber, routingNumber) => {

    const account = await stripe.accounts.create({
        type: "custom",
        email: email,
        business_type: "individual",
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        settings: { payouts: { schedule: { interval: "daily" } } },
        individual: {
            address: {
                city: "North York",
                country: "CA",
                line1: "5180 yonge street",
                line2: "2301",
                postal_code: "m2n 0k5",
                state: "ON"
            },
            dob: { day: 1, month: 1, year: 1990 },
            first_name: fname, last_name: lname
        },
        tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: ip.address(), // Assumes you're not using a proxy
        }
    })

    const externalAccount = await stripe.accounts.createExternalAccount(
        account.id,
        { external_account: { object: 'bank_account', account_number: accountNumber, routing_number: routingNumber, country: 'CA', currency: 'cad' } }
    );

    return account;
}

const createPaymentIntent = async (email, first_name, last_name, accountNumber, routingNumber) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000,
        currency: 'cad',
        automatic_payment_methods: {enabled: true},
        transfer_data: {
          destination: '{{CONNECTED_STRIPE_ACCOUNT_ID}}',
        },
      });
    return paymentIntent;
}



// Get the status of a payout method verification
const getPayoutMethodStatus = async (payoutMethodId) => {
    const externalAccount = await stripe.accounts.listExternalAccounts(payoutMethodId);

    return externalAccount;
};

// Retrieve a list of transactions for a payout method
const getPayoutMethodTransactions = async (payoutMethodId) => {
    const transactions = await stripe.balanceTransactions.list({
        payout: payoutMethodId,
    });

    return transactions.data;
};

// Send a payment to a payout method
const sendPaymentToPayoutMethod = async (payoutMethodId, amount) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        transfer_data: {
            destination: payoutMethodId,
        },
    });

    return paymentIntent;
};

// Create a new payment intent with tax included
const createPaymentIntentWithTax = async (amount, taxRateId) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
        application_fee_amount: 100, // Example fee amount
        transfer_data: {
            destination: 'PAYOUT_METHOD_ID',
        },
        tax_rates: [taxRateId],
    });

    return paymentIntent;
};

// Get the tax rate for a specific location
const getTaxRate = async (country, state) => {
    const taxRate = await stripe.taxRates.list({
        country: country,
        state: state,
    });

    return taxRate.data[0].id;
};

// Get a list of charges for a customer
const getCustomerCharges = async (customerId) => {
    const charges = await stripe.charges.list({
        customer: customerId,
    });

    return charges.data;
};

