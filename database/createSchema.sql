create table Orders (
    OrderId varchar(64) primary key,
    user_id varchar(50),
    shippingAddressId int, 
    billingAddressId int, 
    cardNumber varchar(4),
    timestamp datetime,
    foreign key (shippingAddressId) references Address(addressId),
    foreign key (billingAddressId) references Address(addressId)
);

create table Products (
    PLU int primary key,
    name varchar(100) not null,
    description clob,
    image_url varchar(256),
    price int not null
);

create table OrderItem (
    OrderId varchar(64),
    PLU int,
    quantity int,
    unitPrice int,
    primary key (orderId,PLU),
    foreign key (OrderId) references Orders(OrderId),
    foreign key (PLU) references Products(PLU)
);

create table Address (
    addressId integer primary key,
    firstName varchar(50) not null,
    middleName varchar(50),
    lastName varchar(50) not null,
    addressLine1 varchar(100) not null,
    addressLine2 varchar(100),
    city varchar(50) not null,
    state char(2),
    zip char(5) not null,
    urbanization varchar(50)
);

insert into Products values 
(910956136334, "EcoSmart Thermostat", "A smart home thermostat that helps you save energy and customize your home's temperature from your phone.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/EcoSmart_Thermostat.png", 19999),
(961947050502, "TechPro UltraBook X1", "A sleek and powerful laptop with a high-resolution display, fast processor, and all-day battery life.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/EcoSmart_Thermostat.png", 119999),
(982038352481, "Premium Organic Coffee Beans", "Enjoy the rich and aromatic flavors of our ethically sourced, 100% organic coffee beans.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/Premium_Organic_Coffee_Beans.png", 1499),
(921363448554, "CapturePro DSLR Camera", "A professional-grade DSLR camera with a high-resolution sensor, 4K video recording, and advanced shooting modes.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/CapturePro_DSLR_Camera.png", 149999),
(931061209310, "SpeedMax Running Shoes", "Lightweight and breathable running shoes designed for maximum speed and comfort during your workouts.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/SpeedMax_Running_Shoes.png", 8999);

insert into Address (firstName, lastName, addressLine1, city, state, zip) values 
("John","Doe","800 W Campbell Rd","Richardson","TX","75080"),
("John","Doe","800 W Campbell Rd","Richardson","TX","75080");

insert into Orders (OrderId,user_id,shippingAddressId,billingAddressId,timestamp,cardNumber) values 
("21636e24-d65c-4eb8-9477-50c2c4f5d735", "e586c8b1-59aa-4c05-bfcc-58a4e18e5902", 2, 1, 1698861040084, "1111");

insert into OrderItem (OrderId,PLU,unitPrice) values
("21636e24-d65c-4eb8-9477-50c2c4f5d735", 982038352481, 1499);
