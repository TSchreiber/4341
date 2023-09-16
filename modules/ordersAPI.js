export const Orders = {
    get: async OrderId => {
        let res = await fetch("https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod/orders/" + OrderId, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
                "Content-Type": "application/json"
            },
        })
        return await res.json()
    },

    post: async (order) => {
        let res = await fetch("https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod/orders", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        return await res.json()
    }
}