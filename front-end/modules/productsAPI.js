export const Products = {
    getByPLU: async PLU => {
        let api_url = "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com";
        let res_raw = await fetch(api_url+"/Prod/products/"+PLU);
        return await res_raw.json();
    },

    getAllProducts: async () => {
        let api_url = "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com";
        let res = await fetch(api_url+"/Prod/products");
        return await res.json();
    }
}