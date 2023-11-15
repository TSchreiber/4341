describe('Authenctication Token Management System', () => {
    it.skip('Has tokens in local and session storage after authentication', () => {
        cy.visit("/");
        cy.get("#login-button")
            .click();
        cy.origin('https://cs4389.auth.us-east-2.amazoncognito.com', () => {
            cy.get("#signInFormUsername")
                .type(Cypress.env("test_user_email"), {force: true});
            cy.get("#signInFormPassword")
                .type(Cypress.env("test_user_password"), {force: true});
            cy.get("input[name=signInSubmitButton]")
                .click({force: true, multiple: true});
        });
        cy.window()
            .its("sessionStorage")
            .invoke("getItem", "id_token")
            .should("exist");
        cy.window()
            .its("sessionStorage")
            .invoke("getItem", "access_token")
            .should("exist");
        cy.window()
            .its("localStorage")
            .invoke("getItem", "refresh_token")
            .should("exist");
    })

    it("Refreshes id and access tokens if they are invalid", () => {
        cy.visit("/");
        // Authenticate
        cy.get("#login-button")
            .click();
        cy.origin('https://cs4389.auth.us-east-2.amazoncognito.com', () => {
            cy.get("#signInFormUsername")
                .type(Cypress.env("test_user_email"), {force: true});
            cy.get("#signInFormPassword")
                .type(Cypress.env("test_user_password"), {force: true});
            cy.get("input[name=signInSubmitButton]")
                .click({force: true, multiple: true});
        });
        // Remove access and id tokens
        cy.window()
            .its("sessionStorage")
            .invoke("clear");
        // Try to get orders which is an authenticated function
        cy.window()
            .then(window => {
                const script = window.document.createElement("script");
                script.type = "module";
                script.innerText = `
                    import {auth} from "/modules/auth.js";
                    auth.refreshTokens()
                    .then(() => {
                        if (!window.sessionStorage.getItem("id_token")
                            || !window.sessionStorage.getItem("access_token")) {
                            throw new Error("Tokens not are set in session storage");
                        }
                    });
                `;
                window.document.body.appendChild(script);
            });

    })
})
