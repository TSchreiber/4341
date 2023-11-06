describe('template spec', () => {
    it('passes', () => {
        cy.fixture("Get.products.json").then(products => {
            cy.intercept("GET", 
                "https://jdq3pe0p88.execute-api.us-east-2.amazonaws.com/Prod/products", 
                products).as("getProductsRequest");
        });
        cy.visit("/");
        cy.wait("@getProductsRequest");
        cy.get("product-card")
            .shadow()
            .find("button")
            .first()
            .click();
    })
})
