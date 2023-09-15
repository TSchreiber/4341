function getToken() {
    let client_id = "4ptvlocege0j3ireukoe83jm1u";
    let cognito_base_uri = "cs4389.auth.us-east-2.amazoncognito.com";
    let code = new URLSearchParams(window.location.search).get("code");
    let grant_type = "authorization_code";
    let redirect_uri = "https://main.d31qydfudkb5q9.amplifyapp.com";

    let headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    let body = {
        grant_type, code, client_id, redirect_uri
    }

    fetch(`https://${cognito_base_uri}/oauth2/token`, {
        method: "POST",
        headers,
        body: new URLSearchParams(Object.entries(body)).toString()
    })
    .then(res_raw => res_raw.json())
    .then(res => {
        sessionStorage.setItem("access_token", res.access_token)
        sessionStorage.setItem("id_token", res.id_token)
        document.body.setAttribute("data-authenticated", "true");
        userIsAuthenticated = true;
    });

    window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function isAuthenticated() {
    if (sessionStorage.getItem("id_token")) {
        return true;
    } else {
        return false;
    }
}

var userIsAuthenticated = isAuthenticated();
if (!userIsAuthenticated) {
    if (new URLSearchParams(window.location.search).has("code")) {
        getToken();
    }
}