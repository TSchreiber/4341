export const test_data = {}

// Token validation is being handled primarly by the authenticator in 
// API Gateway, so the payload is assumed to be properly signed. The
// token is assumed to not be expired and all other basic validation is 
// assumed to have been done properly.
test_data.valid_id_tokens = [
    ".eyJzdWIiOiJlNTg2YzhiMS01OWFhLTRjMDUtYmZjYy01OGE0ZTE4ZTU5MDIiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0=.",
    ".eyJzdWIiOiJlNTg2YzhiMS01OWFhLTRjMDUtYmZjYy01OGE0ZTE4ZTAwMDAiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0=.",
];

// Although the payload is assumed to be legitimate, some payload data
// still needs to be checked.
test_data.invalid_id_tokens = {
    email_not_verified: ".eyJzdWIiOiJlNTg2YzhiMS01OWFhLTRjMDUtYmZjYy01OGE0ZTE4ZTU5MDIifQ==.",
    user_id_not_provided: ".eyJlbWFpbF92ZXJpZmllZCI6dHJ1ZX0=.",
};

test_data.valid_addresses = [
    {
        firstName: 'John',
        middleName: '',
        lastName: 'Doe',
        mailingAddress1: '800 W Campbell Rd',
        mailingAddress2: '',
        city: 'Richardson',
        state: 'TX',
        zip: '75080',
        urbanization: ''
    },
];

test_data.invalid_addresses = [
    {
        mailingAddress1: '800 W Campbell Rd',
        mailingAddress2: '',
        city: 'Richardson',
        state: 'TX',
        zip: '75080',
        urbanization: ''
    },
];

test_data.valid_item_PLUs = [
    '982038352481',
];

test_data.invalid_item_PLUs = [
    '982038352482',
];

test_data.valid_payment_methods = [
    {
        nameOnCard: 'John Doe',
        cardNumber: '4111111111111111',
        securityCode: '111',
        expiration: '01/2030'
    }
];

test_data.invalid_payment_methods = {
    missing_information: [
        {
            cardNumber: '4111111111111111',
            securityCode: '111',
            expiration: '01/2030'
        },
        {
            nameOnCard: 'John Doe',
            securityCode: '111',
            expiration: '01/2030'
        },
        {
            nameOnCard: 'John Doe',
            cardNumber: '4111111111111111',
            expiration: '01/2030'
        },
        {
            nameOnCard: 'John Doe',
            cardNumber: '4111111111111111',
            securityCode: '111',
        },
    ],
    // The numbers should pass the Luhn algorithm check
    incorrect_number_length: [
        {
            nameOnCard: 'John Doe',
            cardNumber: '1111111',
            securityCode: '111',
            expiration: '01/2030'
        },
        {
            nameOnCard: 'John Doe',
            cardNumber: '21111111111111111111',
            securityCode: '111',
            expiration: '01/2030'
        },

    ],
    invalid_number: [{
        nameOnCard: 'John Doe',
        cardNumber: '4111111111111112',
        securityCode: '111',
        expiration: '01/2030'
    }],
    expired_card: [{
        nameOnCard: 'John Doe',
        cardNumber: '4111111111111111',
        securityCode: '111',
        expiration: '01/2020'
    }],
    invalid_expiration_format: [{
        nameOnCard: 'John Doe',
        cardNumber: '4111111111111111',
        securityCode: '111',
        expiration: '01/020'
    }],
};

test_data.valid_orders = [
    {
        shippingAddress: test_data.valid_addresses[0],
        paymentInfo: test_data.valid_payment_methods[0],
        billingAddress: test_data.valid_addresses[0],
        items: test_data.valid_item_PLUs
    },
];

test_data.valid_order_ids = [
]
