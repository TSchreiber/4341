create table Orders (
    orderId int primary key
);

create table Products (
    PLU int primary key,
    name varchar(100) not null,
    description clob,
    image_url varchar(256),
    price int not null
);

insert into Products values 
(910956136334, "EcoSmart Thermostat", "A smart home thermostat that helps you save energy and customize your home's temperature from your phone.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/EcoSmart_Thermostat.png", 19999),
(961947050502, "TechPro UltraBook X1", "A sleek and powerful laptop with a high-resolution display, fast processor, and all-day battery life.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/EcoSmart_Thermostat.png", 119999),
(982038352481, "Premium Organic Coffee Beans", "A sleek and powerful laptop with a high-resolution display, fast processor, and all-day battery life.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/Premium_Organic_Coffee_Beans.png", 1499),
(921363448554, "CapturePro DSLR Camera", "A professional-grade DSLR camera with a high-resolution sensor, 4K video recording, and advanced shooting modes.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/CapturePro_DSLR_Camera.png", 149999),
(931061209310, "SpeedMax Running Shoes", "Lightweight and breathable running shoes designed for maximum speed and comfort during your workouts.", "https://utd-cs4389-f2023-team1.s3.us-east-2.amazonaws.com/product-images/SpeedMax_Running_Shoes.png", 8999);
