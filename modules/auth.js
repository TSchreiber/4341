export const auth = {
    isAuthenticated: () => {
        if (sessionStorage.getItem("id_token")) {
            return true;
        } else {
            return false;
        }
    },

    login: (redirect) => {
        if (!redirect) {
            redirect = window.location.origin;
        }
        sessionStorage.setItem("auth_redirect", redirect);
        window.location = "https://cs4389.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=4ptvlocege0j3ireukoe83jm1u&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fauth.html";
    },

    getToken: async () => {
        let client_id = "4ptvlocege0j3ireukoe83jm1u";
        let cognito_base_uri = "cs4389.auth.us-east-2.amazoncognito.com";
        let code = new URLSearchParams(window.location.search).get("code");
        let grant_type = "authorization_code";
        let redirect_uri = "http://localhost:8080/auth.html";
    
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    
        let body = {
            grant_type, code, client_id, redirect_uri
        }
    
        let res_raw = await fetch(`https://${cognito_base_uri}/oauth2/token`, {
            method: "POST",
            headers,
            body: new URLSearchParams(Object.entries(body)).toString()
        })
        let res = await res_raw.json();
        console.log(res);
        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("id_token", res.id_token);
    }
    
}