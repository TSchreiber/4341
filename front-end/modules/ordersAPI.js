let urlBase;
if (window.location.host == "localhost:8080") {
    urlBase = "http://localhost:8080";
} else {
    urlBase = "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod";
}

export const Orders = {
    get: async OrderId => {
        let url;
        let res = await fetch(`${urlBase}/orders/${OrderId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
                "Content-Type": "application/json"
            },
        })
        return await res.json()
    },

    post: async (order) => {
        let res = await fetch(`${urlBase}/orders/`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("id_token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
        })
        return JSON.parse(await res.text());
    }
}
