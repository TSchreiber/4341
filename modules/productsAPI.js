export const Products = {
    getByPLU: async PLU => {
        // api_url = "https://pwt6n24ft2.execute-api.us-east-2.amazonaws.com";
        // fetch(api_url+"/products/"+PLU)
        // .then(res_raw => res_raw.json())
        // .then(res => populateProducts(res));
        return new Promise(res => {
            let products = JSON.parse(`[{"PLU":"910956136334","description":"A smart home thermostat that helps you save energy and customize your home's temperature from your phone.","price":19999,"name":"EcoSmart Thermostat"},{"PLU":"961947050502","description":"A sleek and powerful laptop with a high-resolution display, fast processor, and all-day battery life.","price":119999,"name":"TechPro UltraBook X1"},{"PLU":"982038352481","description":"Enjoy the rich and aromatic flavors of our ethically sourced, 100% organic coffee beans.","price":1499,"name":"Premium Organic Coffee Beans"},{"PLU":"921363448554","description":"A professional-grade DSLR camera with a high-resolution sensor, 4K video recording, and advanced shooting modes.","price":149999,"name":"CapturePro DSLR Camera"},{"PLU":"931061209310","description":"Lightweight and breathable running shoes designed for maximum speed and comfort during your workouts.","price":8999,"name":"SpeedMax Running Shoes"}]`);
            for (let p of products) {
                if (p.PLU == PLU) {
                    res(p);
                    break;
                }
            }
        });
    },

    getAllProducts: async () => {
        // api_url = "https://pwt6n24ft2.execute-api.us-east-2.amazonaws.com";
        // fetch(api_url+"/products")
        // .then(res_raw => res_raw.json())
        // .then(res => populateProducts(res));
        return new Promise((res)=>res(JSON.parse(`[{"PLU":"910956136334","description":"A smart home thermostat that helps you save energy and customize your home's temperature from your phone.","price":19999,"name":"EcoSmart Thermostat"},{"PLU":"961947050502","description":"A sleek and powerful laptop with a high-resolution display, fast processor, and all-day battery life.","price":119999,"name":"TechPro UltraBook X1"},{"PLU":"982038352481","description":"Enjoy the rich and aromatic flavors of our ethically sourced, 100% organic coffee beans.","price":1499,"name":"Premium Organic Coffee Beans"},{"PLU":"921363448554","description":"A professional-grade DSLR camera with a high-resolution sensor, 4K video recording, and advanced shooting modes.","price":149999,"name":"CapturePro DSLR Camera"},{"PLU":"931061209310","description":"Lightweight and breathable running shoes designed for maximum speed and comfort during your workouts.","price":8999,"name":"SpeedMax Running Shoes"}]`)));
    }
}