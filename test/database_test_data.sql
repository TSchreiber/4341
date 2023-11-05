insert into Address (firstName, lastName, addressLine1, city, state, zip) values 
("John","Doe","800 W Campbell Rd","Richardson","TX","75080"),
("John","Doe","800 W Campbell Rd","Richardson","TX","75080");

insert into Orders (OrderId,user_id,shippingAddressId,billingAddressId,timestamp,cardNumber) values 
("21636e24-d65c-4eb8-9477-50c2c4f5d735", "e586c8b1-59aa-4c05-bfcc-58a4e18e5902", 2, 1, 1698861040084, "1111");

insert into OrderItem (OrderId,PLU,unitPrice) values
("21636e24-d65c-4eb8-9477-50c2c4f5d735", 982038352481, 1499);
