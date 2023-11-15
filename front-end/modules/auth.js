const client_id = "4ptvlocege0j3ireukoe83jm1u";
const cognito_base_uri = "cs4389.auth.us-east-2.amazoncognito.com";

export const auth = {
    isAuthenticated: () => {
        if (sessionStorage.getItem("id_token") || localStorage.getItem("refresh_token")) {
            return true;
        } else {
            return false;
        }
    },

    isAuthenticationValid: () => {
        if (!sessionStorage.getItem("id_token")) {
            return false;
        }
        let token = JSON.parse(atob(sessionStorage.getItem("id_token").split(".")[1]));
        if (token.exp <= new Date()) {
            return false;
        }
        return true;
    },

    login: (redirect) => {
        if (!redirect) {
            redirect = window.location.origin;
        }
        sessionStorage.setItem("auth_redirect", redirect);
        let cognito_redirect_uri = window.location.origin + "/auth.html";
        if (window.location.origin === "http://127.0.0.1:8080") {
            cognito_redirect_uri = "http://localhost:8080/auth.html";
        }
        window.location = `https://cs4389.auth.us-east-2.amazoncognito.com/login?response_type=code&client_id=4ptvlocege0j3ireukoe83jm1u&redirect_uri=${encodeURIComponent(cognito_redirect_uri)}`;
    },

    getToken: async () => {
        let code = new URLSearchParams(window.location.search).get("code");
        let grant_type = "authorization_code";
        let redirect_uri = window.location.origin + "/auth.html";
        if (window.location.origin === "http://127.0.0.1:8080") {
            redirect_uri = "http://localhost:8080/auth.html";
        }

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
        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("id_token", res.id_token);
        localStorage.setItem("refresh_token", res.refresh_token);
    },

    refreshTokens: async () => {
        let refresh_token = localStorage.getItem("refresh_token");
        let grant_type = "refresh_token";
        let redirect_uri = window.location.origin + "/auth.html";
        if (window.location.origin === "http://127.0.0.1:8080") {
            redirect_uri = "http://localhost:8080/auth.html";
        }

        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        }

        let body = {
            grant_type, refresh_token, client_id, redirect_uri
        }

        let res_raw = await fetch(`https://${cognito_base_uri}/oauth2/token`, {
            method: "POST",
            headers,
            body: new URLSearchParams(Object.entries(body)).toString()
        })
        let res = await res_raw.json();
        sessionStorage.setItem("access_token", res.access_token);
        sessionStorage.setItem("id_token", res.id_token);
    }

}
