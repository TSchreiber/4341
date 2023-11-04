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

